import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ELoaiChuKy } from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ip3 } from '@/utils/ip';
import { SignatureOutlined } from '@ant-design/icons';
import { Alert, Button, Modal, Progress, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useModel } from 'umi';
import { sign_service, type TSignData } from './SignService';

const ModalSignVanBang = (props: { getData?: () => void }) => {
	const { getData } = props;
	const auth = useAuth();
	const { visibleSignVanBang, setVisibleSignVanBang, dataToSignOrPush, setDataToSignOrPush, setSelectedIds } =
		useModel('vbcc.phulucvanbang');
	const { record: recNguoiKy } = useModel('vbcc.nguoiky');

	const [signProgress, setSignProgress] = useState<number>(0);
	const [signing, setSigning] = useState(false);
	const [currentSocket, setCurrentSocket] = useState<WebSocket>();
	const [url, setUrl] = useState<string>('');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const increSignCurrent = () => setSignProgress((current) => current + 1);

	const filteredData = useMemo(() => {
		if (!dataToSignOrPush?.length) return [];

		if (recNguoiKy?.loaiChuKy === ELoaiChuKy.KY_SO) {
			return dataToSignOrPush.filter((item) => !item.daKy);
		}
		if (recNguoiKy?.loaiChuKy === ELoaiChuKy.DONG_DAU_VAN_THU) {
			return dataToSignOrPush.filter((item) => !item.daDongDau);
		}
		return dataToSignOrPush;
	}, [dataToSignOrPush, recNguoiKy]);

	const signStatus = filteredData?.length && signProgress === filteredData.length ? 'active' : 'normal';

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
		if (index < filteredData.length) {
			increSignCurrent();

			const { signature, createdBlockchain, index: i, key, idQuyetDinh, urlIpfs, ...dataToSign } = filteredData[index];

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
		if (filteredData?.length) {
			setSigning(true);
			setSignProgress(0);

			sign_service.init_sign_batch(filteredData.length, callbackSignBatch);
		}
	};

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			dataIndex: 'soVaoSoBang',
			title: 'Số vào sổ',
			width: 120,
		},
		{
			dataIndex: 'soHieuVanBang',
			title: 'Số hiệu văn bằng',
			width: 120,
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
			render: (val) =>
				val && (
					<a
						onClick={() => {
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
			width: 200,
		},
	];

	const noteText = useMemo(() => {
		if (recNguoiKy?.loaiChuKy === ELoaiChuKy.KY_SO) {
			const daKy = dataToSignOrPush?.filter((item) => item.daKy)?.length ?? 0;
			const chuaKy = dataToSignOrPush?.filter((item) => !item.daKy)?.length ?? 0;
			return `Hệ thống đã kiểm tra danh sách: Có ${chuaKy} phụ lục văn bằng Chưa Được Ký Số và ${daKy} phụ lục văn bằng ĐÃ Ký Số. Chỉ các phụ lục chưa được ký số mới hiển thị trong bảng dưới đây.`;
		}
		if (recNguoiKy?.loaiChuKy === ELoaiChuKy.DONG_DAU_VAN_THU) {
			const daDongDau = dataToSignOrPush?.filter((item) => item.daDongDau)?.length ?? 0;
			const chuaDongDau = dataToSignOrPush?.filter((item) => !item.daDongDau)?.length ?? 0;
			return `Hệ thống đã kiểm tra danh sách: Có ${chuaDongDau} phụ lục văn bằng Chưa Được Đóng Dấu và ${daDongDau} phụ lục văn bằng Đã Đóng Dấu. Chỉ các phụ lục chưa được đóng dấu mới hiển thị trong bảng dưới đây.`;
		}
		return '';
	}, [recNguoiKy, dataToSignOrPush]);

	return (
		<Modal open={visibleSignVanBang} title='Ký số tệp tin văn bằng' width={1000} onCancel={onCancel} footer={null}>
			{noteText && <Alert message={noteText} type='info' showIcon style={{ marginBottom: 12 }} />}

			<TableStaticData
				columns={columns}
				size='small'
				data={filteredData}
				addStt
				hasTotal
				otherProps={{ pagination: false, scroll: { y: 560 } }}
			/>

			{signing && (
				<>
					<div style={{ width: '100%' }}>
						<Progress percent={Math.round((signProgress / (filteredData?.length ?? 1)) * 100)} status={signStatus} />
					</div>

					<div className='form-footer' style={{ marginBottom: 24 }}>
						<span>({`${signProgress}/${filteredData?.length ?? 0} bản`}). </span>
						{signStatus !== 'active' ? <>Vui lòng đợi trong ít phút....</> : <>Quá trình đã hoàn tất</>}
					</div>
				</>
			)}

			<ModalExpandable
				title='Chi tiết tệp tin'
				width={1000}
				open={visibleFormFile}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={url ?? ''} />
			</ModalExpandable>

			<div className='form-footer'>
				<Button
					icon={<SignatureOutlined />}
					type='primary'
					disabled={
						!filteredData?.length || filteredData?.filter((item) => item?.uploaded)?.length === filteredData?.length
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
