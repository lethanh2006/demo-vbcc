import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { IColumn } from '@/components/Table/typing';
import ViewPhuLucVanBang from '@/pages/VanBang/PhuLuc/components/ViewRender';
import { ETagColor } from '@/services/base/constant';
import {
	colorTrangThaiTotNghiep,
	ETrangThaiCapBang,
	ETrangThaiQuyetDinhTotNghiep,
	nameTrangThaiTotNghiep,
} from '@/services/VanBang/constant';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Modal, Popconfirm, Popover, Row, Space, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietSinhVienXacMinh from './ChiTiet';

const ModalTraCuuThuCong = (props: { visible: boolean; setVisible: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const { visible, setVisible, getData } = props;
	const { record, putModel } = useModel('vbcc.sinhvienxacminh');
	const { getModel, page, limit, handleEdit } = useModel('vbcc.phulucvanbang');
	const { settings } = useModel('tienich.caidat');
	const { INFO_TENANT: settingVbcc } = settings;

	const [visibleForm, setVisibleForm] = useState<boolean>(false);

	const getPhuPuc = () => {
		getModel(undefined, [
			{
				active: true,
				field: ['quyetDinh', 'trangThai'],
				operator: EOperatorType.INCLUDE,
				values: [ETrangThaiQuyetDinhTotNghiep.HOAN_THANH],
			},
			{
				active: true,
				field: 'soVaoSoBang',
				operator: EOperatorType.NOT_NULL,
			},
		]);
	};

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.sovaoso' }),
			dataIndex: 'soVaoSoBang',
			filterType: 'string',
			width: 120,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.sohieuvb' }),
			dataIndex: 'soHieuVanBang',
			filterType: 'string',
			width: 120,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.hoten' }),
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.ngaysinh' }),
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.manguoihoc' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.quyetdinh' }),
			dataIndex: 'idQuyetDinh',
			width: 140,
			render: (val, rec) => (
				<>
					{rec.quyetDinh?.soQuyetDinh ?? ''},{' '}
					{rec.quyetDinh?.ngayBanHanh ? dayjs(rec.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : ''}
				</>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.taptin' }),
			dataIndex: 'urlIpfs',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a href={val} target='_blank' rel='noreferrer'>
						{intl.formatMessage({ id: 'xacminhvanbang.tracuu.link.viewdetail' })}
					</a>
				) : (
					<i>({intl.formatMessage({ id: 'xacminhvanbang.tracuu.tag.chuaupload' })})</i>
				),
			hide: !settingVbcc?.require_IPFS,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.vanbang' }),
			width: 120,
			children: [
				{
					title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.vanbang.taptin' }),
					dataIndex: 'fileVanBang',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						!val ? (
							<Tag color='red'>{intl.formatMessage({ id: 'xacminhvanbang.tracuu.tag.chuatrinhky' })}</Tag>
						) : (
							<a href={val} target='_blank' rel='noreferrer'>
								{intl.formatMessage({ id: 'xacminhvanbang.tracuu.link.viewdetail' })}
							</a>
						),
				},
				{
					title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.vanbang.kyso' }),
					dataIndex: 'daKy',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>{intl.formatMessage({ id: 'xacminhvanbang.tracuu.tag.daky' })}</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label={intl.formatMessage({ id: 'xacminhvanbang.tracuu.popover.nguoiky' })}>
													{rec?.nguoiKy?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item
													label={intl.formatMessage({ id: 'xacminhvanbang.tracuu.popover.thoigianky' })}
												>
													{rec?.thoiGianKy ? dayjs(rec?.thoiGianKy).format('HH:mm DD/MM/YYYY') : '--'}
												</Descriptions.Item>
											</Descriptions>
										</div>
									}
								>
									<InfoCircleOutlined />
								</Popover>
							</Space>
						) : (
							<Tag color='orange'>{intl.formatMessage({ id: 'xacminhvanbang.tracuu.tag.chuaky' })}</Tag>
						),
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.vanbang.dongdau' }),
					dataIndex: 'daDongDau',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>{intl.formatMessage({ id: 'xacminhvanbang.tracuu.tag.dadongdau' })}</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item
													label={intl.formatMessage({ id: 'xacminhvanbang.tracuu.popover.nguoidongdau' })}
												>
													{rec?.nguoiDongGiau?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item
													label={intl.formatMessage({ id: 'xacminhvanbang.tracuu.popover.thoigiandongdau' })}
												>
													{rec?.thoiGianDongGiau ? dayjs(rec?.thoiGianDongGiau).format('HH:mm DD/MM/YYYY') : '--'}
												</Descriptions.Item>
											</Descriptions>
										</div>
									}
								>
									<InfoCircleOutlined />
								</Popover>
							</Space>
						) : (
							<Tag color='orange'>{intl.formatMessage({ id: 'xacminhvanbang.tracuu.tag.chuadongdau' })}</Tag>
						),
					onCell,
				},
			],
			hide: !settingVbcc?.require_diploma_signature,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.trangthaiphatbang' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (_: any, record: PhuLucVanBang.IRecord) => {
				const trangThai = (
					<Tag color={colorTrangThaiTotNghiep[_ as ETrangThaiCapBang]}>
						{nameTrangThaiTotNghiep[_ as ETrangThaiCapBang]}
					</Tag>
				);

				const ngayCap = record?.ngayCapPhuLuc ? `${dayjs(record.ngayCapPhuLuc).format('DD/MM/YYYY')}` : null;

				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<div>{trangThai}</div>
						{record?.trangThai === ETrangThaiCapBang.DA_CAP_BANG && ngayCap && (
							<div style={{ fontSize: 12 }}>{ngayCap}</div>
						)}
					</div>
				);
			},
			filterData: Object.values(ETrangThaiCapBang).map((item) => ({
				value: item,
				label: nameTrangThaiTotNghiep[item as ETrangThaiCapBang],
			})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.kysothongtin' }),
			dataIndex: 'signature',
			align: 'center',
			width: 80,
			render: (val) => (
				<Tag color={!!val ? ETagColor.GREEN : ETagColor.RED}>
					{!!val
						? intl.formatMessage({ id: 'xacminhvanbang.tracuu.tag.daky' })
						: intl.formatMessage({ id: 'xacminhvanbang.tracuu.tag.chuaky' })}
				</Tag>
			),
			hide: !settingVbcc?.require_signature,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.tracuu.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popconfirm
					onConfirm={() =>
						putModel(record?._id ?? '', { ...record, phuLucId: rec?._id, coThongTin: true }, getData).then(() =>
							setVisible(false),
						)
					}
					title={intl.formatMessage({ id: 'xacminhvanbang.tracuu.confirm.coketqua' })}
					placement='topRight'
				>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'xacminhvanbang.tracuu.action.xacnhan' })}
						type='link'
						icon={<CheckOutlined />}
						onClick={() => {}}
						className='btn-success'
					/>
				</Popconfirm>
			),
		},
	];

	return (
		<>
			<Modal
				width={1000}
				title={intl.formatMessage({ id: 'xacminhvanbang.tracuu.title' })}
				open={visible}
				onCancel={() => setVisible(false)}
				footer={null}
			>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<ChiTietSinhVienXacMinh />
					</Col>
					<Col span={24}>
						<TableBase
							getData={getPhuPuc}
							columns={columns}
							dependencies={[page, limit, visible]}
							modelName='vbcc.phulucvanbang'
							buttons={{ create: false }}
							hideCard
						/>
					</Col>
				</Row>
				<div className='form-footer'>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Modal>

			<ModalExpandable
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				title={intl.formatMessage({ id: 'xacminhvanbang.sinhvien.modal.chitietvanbang' })}
				width={1000}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleForm(false)}>
							{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
						</Button>
					</div>
				}
			>
				<ViewPhuLucVanBang hasPrint={false} hideFooter />
			</ModalExpandable>
		</>
	);
};

export default ModalTraCuuThuCong;
