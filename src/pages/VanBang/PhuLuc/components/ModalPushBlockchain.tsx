import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ETrangThaiBlockchain, colorTrangThaiBlc } from '@/services/VanBang/constant';
import { ESettingKey } from '@/services/base/constant';
import socket, { ESocketType } from '@/utils/socket';
import { BoldOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Popover, Progress, Tabs, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useModel } from 'umi';

const ModalPushBlockchain = (props: { getData?: () => void }) => {
	const { getData } = props;
	const { visiblePush, setVisiblePush, dataToSignOrPush, pushBlockchainModel } = useModel('vbcc.phulucvanbang');
	const { initialState } = useModel('@@initialState');
	const { settings } = useModel('tienich.caidat');
	const [dataKhongHopLe, setDataKhongHopLe] = useState<PhuLucVanBang.IRecord[]>();
	const [dataHopLe, setDataHopLe] = useState<PhuLucVanBang.IRecord[]>([]);
	const [dataDaDay, setDataDaDay] = useState<PhuLucVanBang.IRecord[]>([]);
	const [pushProgress, setPushProgress] = useState<number>(0);
	const pushStatus = dataToSignOrPush.length && dataToSignOrPush.length === pushProgress ? 'active' : 'normal';
	const [pushing, setPushsing] = useState(false);
	const auth = useAuth();
	const settingVbcc = settings[ESettingKey.INFO_TENANT_VBCC];

	const incPushCurrent = () => setPushProgress((current) => current + 1);

	const onCancel = () => setVisiblePush(false);

	useEffect(() => {
		if (visiblePush) {
			setDataHopLe(
				dataToSignOrPush.filter(
					(item) =>
						(!settingVbcc?.require_signature || item.signature) &&
						item.createdBlockchain !== ETrangThaiBlockchain.DA_LUU,
				),
			);
			setDataDaDay(
				dataToSignOrPush.filter(
					(item) =>
						(!settingVbcc?.require_signature || item.signature) &&
						item.createdBlockchain === ETrangThaiBlockchain.DA_LUU,
				),
			);

			setDataKhongHopLe(dataToSignOrPush.filter((item) => settingVbcc?.require_signature && !item.signature));
			setPushProgress(0);
		}
	}, [visiblePush]);

	useEffect(() => {
		socket.emit('join', { userId: initialState?.currentUser?.ssoId, access_token: auth.user?.access_token });
		socket.on(ESocketType.BLOCKCHAIN_PUSHED, () => incPushCurrent());

		return () => {
			socket.removeAllListeners();
		};
	}, []);

	const columnsResult: IColumn<PhuLucVanBang.TUpdateSignature>[] = [
		{
			title: 'ID Văn bằng',
			dataIndex: 'key',
			width: 250,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'message',
			width: 150,
		},
	];

	const onOk = async () => {
		if (pushing) return;
		setPushsing(true);

		pushBlockchainModel(dataHopLe)
			.then((data: any) => {
				Modal.info({
					title: 'Kết quả',
					width: 800,
					icon: null,
					content: <TableStaticData data={data} size='small' columns={columnsResult} />,
				});
				onCancel();
				if (getData) getData();
			})
			.catch((er) => console.log(er))
			.finally(() => setPushsing(false));
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
			width: 160,
		},
		{
			dataIndex: 'signature',
			title: 'Chữ ký',
			width: 100,
			align: 'center',
			render: (text) =>
				text ? <Typography.Paragraph copyable={{ text }}>(đã ký)</Typography.Paragraph> : <i>Chưa có chữ ký</i>,
			hide: !settingVbcc?.require_signature,
		},
		{
			title: 'Blockchain',
			dataIndex: 'createdBlockchain',
			align: 'center',
			width: 150,
			render: (val: ETrangThaiBlockchain) => val && <Tag color={colorTrangThaiBlc[val]}>{val}</Tag>,
		},
	];

	return (
		<ModalExpandable
			visible={visiblePush}
			title={
				<>
					Dữ liệu blockchain{' '}
					<Popover
						content={
							<>
								Đẩy toàn bộ thông tin phụ lục (đã được ký số) lên blockchain, <br />
								để đảm bảo tính toàn vẹn dữ liệu của phụ lục.
							</>
						}
					>
						<QuestionCircleOutlined />
					</Popover>
				</>
			}
			width={1000}
			bodyStyle={{ paddingTop: 0 }}
			onCancel={onCancel}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
		>
			<Tabs defaultActiveKey='1'>
				<Tabs.TabPane tab={`Dữ liệu hợp lệ (${dataHopLe?.length ?? 0})`} key='1'>
					<TableStaticData columns={columns} size='small' data={dataHopLe} addStt />

					{pushing && (
						<>
							<div style={{ width: '100%' }}>
								<Progress
									percent={Math.round((pushProgress / (dataToSignOrPush.length ?? 1)) * 100)}
									status={pushStatus}
								/>
							</div>

							<div className='form-footer' style={{ marginBottom: 24 }}>
								<span>({`${pushProgress}/${dataToSignOrPush.length} bản`}). </span>
								{pushStatus === 'active' ? <>Vui lòng đợi trong ít phút....</> : <>Quá trình đã hoàn tất</>}
							</div>
						</>
					)}

					<div className='form-footer'>
						<Popconfirm
							title='Xác nhận đẩy dữ liệu hợp lệ lên blockchain?'
							onConfirm={onOk}
							disabled={!dataHopLe?.length}
						>
							<Button type='primary' icon={<BoldOutlined />} disabled={!dataHopLe?.length} loading={pushing}>
								Đẩy lên blockchain
							</Button>
						</Popconfirm>
					</div>
				</Tabs.TabPane>

				{settingVbcc?.require_signature && (
					<Tabs.TabPane tab={`Dữ liệu không hợp lệ (${dataKhongHopLe?.length ?? 0})`} key='2'>
						<TableStaticData columns={columns} addStt size='small' data={dataKhongHopLe ?? []} />
					</Tabs.TabPane>
				)}

				<Tabs.TabPane tab={`Đã đẩy lên blockchain (${dataDaDay?.length ?? 0})`} key='3'>
					<TableStaticData columns={columns} addStt size='small' data={dataDaDay} />
				</Tabs.TabPane>
			</Tabs>
		</ModalExpandable>
	);
};

export default ModalPushBlockchain;
