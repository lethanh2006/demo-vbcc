import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { colorLoaiChuKy, ELoaiChuKy } from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ip3 } from '@/utils/ip';
import { SignatureOutlined } from '@ant-design/icons';
import { Button, Descriptions, message, Modal, Progress, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useIntl, useModel } from 'umi';
import { sign_service, type TSignData } from './SignService';

const ModalSignVanBang = (props: { getData?: () => void }) => {
	const intl = useIntl();
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
			return dataToSignOrPush.filter((item) => !!item?.fileVanBang && !item.daKy);
		}
		if (recNguoiKy?.loaiChuKy === ELoaiChuKy.DONG_DAU_VAN_THU) {
			return dataToSignOrPush.filter((item) => !!item?.daKy && !item.daDongDau);
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
		if (response?.data?.id) {
			const { id, signature, uploaded } = response.data;
			setDataToSignOrPush((data) =>
				data.map((item) => (item._id === id ? { ...item, signature, message: msg, uploaded, status } : item)),
			);
		} else if (status === 'success') {
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
			title: intl.formatMessage({ id: 'kysovanbang.column.sovaoso' }),
			width: 120,
		},
		{
			dataIndex: 'soHieuVanBang',
			title: intl.formatMessage({ id: 'kysovanbang.column.sohieuvanbang' }),
			width: 120,
		},
		{
			dataIndex: 'hoTen',
			title: intl.formatMessage({ id: 'kysovanbang.column.hoten' }),
			width: 150,
		},
		{
			dataIndex: 'fileVanBang',
			title: intl.formatMessage({ id: 'kysovanbang.column.taptinvanbang' }),
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
						{intl.formatMessage({ id: 'kysovanbang.link.viewdetail' })}
					</a>
				),
		},
		{
			dataIndex: 'message',
			title: intl.formatMessage({ id: 'kysovanbang.column.trangthai' }),
			width: 200,
			render: (val, rec) => <span style={{ color: rec?.status === 'success' ? 'green' : 'red' }}>{val}</span>,
		},
	];

	return (
		<Modal
			open={visibleSignVanBang}
			title={intl.formatMessage({ id: 'kysovanbang.modaltitle' })}
			width={1000}
			onCancel={onCancel}
			footer={null}
		>
			<Descriptions column={1} style={{ marginBottom: 8 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'kysovanbang.label.vaitrokyso' })}>
					{recNguoiKy?.loaiChuKy ? (
						<Tag color={colorLoaiChuKy[recNguoiKy?.loaiChuKy as ELoaiChuKy]}>{recNguoiKy?.loaiChuKy}</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
			</Descriptions>

			{recNguoiKy?.loaiChuKy === ELoaiChuKy.KY_SO ? (
				<i
					style={{ color: 'red' }}
					dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: 'kysovanbang.note.kyso' }) }}
				/>
			) : recNguoiKy?.loaiChuKy === ELoaiChuKy.DONG_DAU_VAN_THU ? (
				<i
					style={{ color: 'red' }}
					dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: 'kysovanbang.note.dongdau' }) }}
				/>
			) : null}

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
						<span>
							(
							{`${signProgress}/${filteredData?.length ?? 0} ${intl.formatMessage({ id: 'kysovanbang.progress.records' })}`}
							).{' '}
						</span>
						{signStatus !== 'active' ? (
							<>{intl.formatMessage({ id: 'kysovanbang.progress.wait' })}</>
						) : (
							<>{intl.formatMessage({ id: 'kysovanbang.progress.complete' })}</>
						)}
					</div>
				</>
			)}

			<ModalExpandable
				title={intl.formatMessage({ id: 'kysovanbang.modal.chitiet' })}
				width={1000}
				open={visibleFormFile}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={url ?? ''} />
			</ModalExpandable>

			<div className='form-footer' style={{ marginTop: 24 }}>
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
					{intl.formatMessage({ id: 'kysovanbang.button.signwithtool' })}
				</Button>

				<Button onClick={onCancel}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalSignVanBang;
