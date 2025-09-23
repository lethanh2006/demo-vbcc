import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ip3 } from '@/utils/ip';
import { FormOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popover, Progress, message } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useModel } from 'umi';
import { sign_service, type TSignData } from './SignService';

const ModalSignVanBang = (props: { getData?: () => void }) => {
	const { getData } = props;
	const auth = useAuth();
	const { visibleSignVanBang, setVisibleSignVanBang, dataToSignOrPush, setDataToSignOrPush, setSelectedIds } =
		useModel('vbcc.phulucvanbang');
	const [signProgress, setSignProgress] = useState<number>(0);
	const signStatus = dataToSignOrPush?.length && signProgress === dataToSignOrPush.length ? 'active' : 'normal';
	const [signing, setSigning] = useState(false);
	const [currentSocket, setCurrentSocket] = useState<WebSocket>();
	const [url, setUrl] = useState<string>('');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const increSignCurrent = () => setSignProgress((current) => current + 1);

	useEffect(() => {
		if (!visibleSignVanBang) {
			setSelectedIds([]);
		}
	}, [visibleSignVanBang]);

	const onCancel = () => {
		if (currentSocket) sign_service.sign_batch_stop(currentSocket);
		setVisibleSignVanBang(false);
	};

	const callbackDone1Document = (response: any) => {
		const { status, message: msg } = response;
		if (status === 'success') {
			const { id, signature, uploaded } = response.data;
			setDataToSignOrPush((data) =>
				data.map((item) => (item._id === id ? { ...item, signature, message: msg, uploaded } : item)),
			);
		} else message.error(msg);
	};

	const startSignDocument = (socket: WebSocket, index: number) => {
		if (index < dataToSignOrPush.length) {
			increSignCurrent();

			const {
				signature,
				createdBlockchain,
				index: i,
				key,
				idQuyetDinh,
				urlIpfs,
				...dataToSign
			} = dataToSignOrPush[index];

			dataToSign.token = auth?.user?.access_token;
			dataToSign.url = dataToSign.fileVanBang;
			dataToSign.uploadUrl = `${ip3}/phu-luc-van-bang/ky-so/callback/${dataToSign.idFileVanBang}`;

			sign_service.sign_batch_next(dataToSign?._id, dataToSign, socket, (res: any) => {
				callbackDone1Document(res);

				// Sign next document
				startSignDocument(socket, index + 1);
			});
		} else {
			sign_service.sign_batch_finish(socket);
			setSigning(false);

			if (getData) getData();
		}
	};

	const callbackSignBatch = (data: TSignData) => {
		if (data.status === 'ready' && data.socket) {
			setCurrentSocket(data.socket);
			startSignDocument(data.socket, 0);
		} else {
			message.error(data.message);
			setSigning(false);
		}
	};

	const execSignBatch = () => {
		if (dataToSignOrPush?.length) {
			setSigning(true);
			setSignProgress(0);

			sign_service.init_sign_batch(dataToSignOrPush.length, callbackSignBatch);
		}
	};

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			dataIndex: 'soVaoSoBang',
			title: 'Số vào sổ',
			width: 100,
		},
		{
			dataIndex: 'soHieuVanBang',
			title: 'Số hiệu văn bằng',
			width: 100,
		},
		{
			dataIndex: 'hoTen',
			title: 'Họ tên sinh viên',
			width: 150,
		},
		{
			dataIndex: 'fileVanBang',
			title: 'Tập tin văn bằng',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val && (
					<a
						onClick={(e) => {
							setUrl(val);
							setVisibleFormFile(true);
						}}
					>
						Xem chi tiết
					</a>
				),
		},
		{
			dataIndex: 'message' as any,
			title: 'Trạng thái',
			width: 180,
		},
	];

	return (
		<Modal
			open={visibleSignVanBang}
			title={
				<>
					Ký số tệp tin văn bằng{' '}
					<Popover
						content={
							<>
								Ký số các thông tin của từng phụ lục, đảm bảo tính toàn vẹn dữ liệu trong mỗi phụ lục.
								<br />
								Mỗi khi thông tin phụ lục thay đổi, chữ ký số sẽ bị loại bỏ.
							</>
						}
					>
						<QuestionCircleOutlined />
					</Popover>
				</>
			}
			width={1000}
			onCancel={onCancel}
			footer={null}
		>
			<TableStaticData columns={columns} size='small' data={dataToSignOrPush} addStt hasTotal />

			{signing && (
				<>
					<div style={{ width: '100%' }}>
						<Progress
							percent={Math.round((signProgress / (dataToSignOrPush?.length ?? 1)) * 100)}
							status={signStatus}
						/>
					</div>

					<div className='form-footer' style={{ marginBottom: 24 }}>
						<span>({`${signProgress}/${dataToSignOrPush?.length ?? 0} bản`}). </span>
						{signStatus !== 'active' ? <>Vui lòng đợi trong ít phút....</> : <>Quá trình đã hoàn tất</>}
					</div>
				</>
			)}

			<ModalExpandable
				title='Chi tiết tệp tin'
				width={1000}
				open={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={url ?? ''} />
			</ModalExpandable>

			<div className='form-footer'>
				<Button
					icon={<FormOutlined />}
					type='primary'
					disabled={
						!dataToSignOrPush?.length ||
						dataToSignOrPush?.filter((item) => item?.uploaded)?.length === dataToSignOrPush?.length
					}
					onClick={execSignBatch}
					loading={signing}
					className='btn-success'
				>
					Ký số bằng tool tự động
				</Button>

				<Button onClick={onCancel}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ModalSignVanBang;
