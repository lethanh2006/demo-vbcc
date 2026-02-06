import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import dayjs from '@/utils/dayjs';
import { QuestionCircleOutlined, SaveOutlined, SignatureOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Popover, Progress, Typography, message } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { sign_service, type TSignData } from './SignService';

const ModalSign = (props: { getData?: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const { updateSignatureModel, visibleSign, setVisibleSign, dataToSignOrPush, setDataToSignOrPush, formSubmiting } =
		useModel('vbcc.phulucvanbang');
	const [signProgress, setSignProgress] = useState<number>(0);
	const signStatus = dataToSignOrPush?.length && signProgress === dataToSignOrPush.length ? 'active' : 'normal';
	const [signing, setSigning] = useState(false);
	const [currentSocket, setCurrentSocket] = useState<WebSocket>();

	const increSignCurrent = () => setSignProgress((current) => current + 1);

	const onCancel = () => {
		if (currentSocket) sign_service.sign_batch_stop(currentSocket);
		setVisibleSign(false);
	};

	const columnsSign: IColumn<PhuLucVanBang.TUpdateSignature>[] = [
		{
			title: intl.formatMessage({ id: 'modalsign.column.idvanbang' }),
			dataIndex: 'key',
			width: 250,
		},
		{
			title: intl.formatMessage({ id: 'modalsign.column.trangthai' }),
			dataIndex: 'message',
			width: 200,
		},
	];

	const onOk = async () => {
		const dataSignature: PhuLucVanBang.TUpdateSignature[] = dataToSignOrPush
			.filter((item) => item.signature)
			.map((item) => ({ key: item.idVanBang ?? '', signature: item.signature ?? '' }));

		if (dataSignature.length === 0) {
			message.error(intl.formatMessage({ id: 'modalsign.error.nosignature' }));
			return;
		}

		await updateSignatureModel(dataSignature)
			.then((data) => {
				Modal.info({
					title: intl.formatMessage({ id: 'modalsign.modal.result' }),
					width: 800,
					icon: null,
					content: <TableStaticData data={data} size='small' columns={columnsSign} />,
				});
				onCancel();
				if (getData) getData();
			})
			.catch((er) => console.log(er));
	};

	const callbackDone1Document = (response: any) => {
		const { status, message: msg } = response;
		if (status === 'success') {
			const { id, signature } = response.data;
			setDataToSignOrPush((data) =>
				data.map((item) => (item._id === id ? { ...item, signature, message: msg } : item)),
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
				templateData,
				urlIpfs,
				...dataToSign
			} = dataToSignOrPush[index];
			dataToSign.ngaySinh = dataToSign.ngaySinh ? dayjs(dataToSign.ngaySinh).format('DD/MM/YYYY') : '';
			dataToSign.createdAt = dayjs(dataToSign.createdAt).format('HH:mm:ss DD/MM/YYYY');
			dataToSign.updatedAt = dayjs(dataToSign.updatedAt).format('HH:mm:ss DD/MM/YYYY');
			Object.assign(dataToSign, { quyetDinhTotNghiep: dataToSignOrPush[index].quyetDinh?.soQuyetDinh });
			templateData?.map((element) => {
				Object.assign(dataToSign, {
					[element.headerName]:
						element.type === ELoaiDuLieuBieuMau.Date && element.value
							? dayjs(element.value).format('DD/MM/YYYY')
							: element.value || '',
				});
			});

			sign_service.sign_batch_next(dataToSign?._id, dataToSign, socket, (res) => {
				callbackDone1Document(res);
				// Sign next document
				startSignDocument(socket, index + 1);
			});
		} else {
			sign_service.sign_batch_finish(socket);
			setSigning(false);
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
		// {
		// 	dataIndex: 'idVanBang',
		// 	title: 'ID Văn bằng',
		// 	width: 150,
		// },
		{
			dataIndex: 'soVaoSoBang',
			title: intl.formatMessage({ id: 'modalsign.column.sovaoso' }),
			width: 120,
		},
		{
			dataIndex: 'soHieuVanBang',
			title: intl.formatMessage({ id: 'modalsign.column.sohieuvanbang' }),
			width: 120,
		},
		{
			dataIndex: 'hoTen',
			title: intl.formatMessage({ id: 'modalsign.column.hoten' }),
			width: 150,
		},
		{
			dataIndex: 'signature',
			title: intl.formatMessage({ id: 'modalsign.column.chuky' }),
			width: 120,
			align: 'center',
			render: (text) =>
				text ? (
					<Typography.Paragraph copyable={{ text }}>
						{intl.formatMessage({ id: 'modalsign.signature.signed' })}
					</Typography.Paragraph>
				) : (
					''
				),
		},
		{
			dataIndex: 'message' as any,
			title: intl.formatMessage({ id: 'modalsign.column.trangthai' }),
			width: 180,
		},
	];

	return (
		<Modal
			open={visibleSign}
			title={
				<>
					{intl.formatMessage({ id: 'modalsign.title' })}{' '}
					<Popover
						content={
							<span
								dangerouslySetInnerHTML={{
									__html: intl.formatMessage({ id: 'modalsign.popover.content' }),
								}}
							/>
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
						<span>
							(
							{`${signProgress}/${dataToSignOrPush?.length ?? 0} ${intl.formatMessage({ id: 'modalsign.progress.records' })}`}
							).{' '}
						</span>
						{signStatus !== 'active' ? (
							<>{intl.formatMessage({ id: 'modalsign.progress.wait' })}</>
						) : (
							<>{intl.formatMessage({ id: 'modalsign.progress.complete' })}</>
						)}
					</div>
				</>
			)}

			<div className='form-footer'>
				<Button
					icon={<SignatureOutlined />}
					type='primary'
					disabled={!dataToSignOrPush?.length}
					onClick={execSignBatch}
					loading={signing}
					className='btn-success'
				>
					{intl.formatMessage({ id: 'modalsign.button.signwithtool' })}
				</Button>
				<Popconfirm
					title={intl.formatMessage({ id: 'modalsign.popconfirm.save' })}
					onConfirm={onOk}
					disabled={!dataToSignOrPush?.length || signing || formSubmiting}
				>
					<Button
						type='primary'
						icon={<SaveOutlined />}
						loading={formSubmiting}
						disabled={!dataToSignOrPush?.length || signing || formSubmiting}
					>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				</Popconfirm>
				<Button onClick={onCancel}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalSign;
