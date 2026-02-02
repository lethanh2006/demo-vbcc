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
			title: 'Số vào sổ',
			dataIndex: 'soVaoSoBang',
			filterType: 'string',
			width: 120,
			sortable: true,
			onCell,
		},
		{
			title: 'Số hiệu VB',
			dataIndex: 'soHieuVanBang',
			filterType: 'string',
			width: 120,
			sortable: true,
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Mã người học',
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Quyết định',
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
			title: 'Tập tin',
			dataIndex: 'urlIpfs',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem chi tiết
					</a>
				) : (
					<i>(Chưa upload)</i>
				),
			hide: !settingVbcc?.require_IPFS,
		},
		{
			title: 'Văn bằng',
			width: 120,
			children: [
				{
					title: 'Tập tin',
					dataIndex: 'fileVanBang',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						!val ? (
							<Tag color='red'>Chưa trình ký</Tag>
						) : (
							<a href={val} target='_blank' rel='noreferrer'>
								Xem chi tiết
							</a>
						),
				},
				{
					title: 'Ký số',
					dataIndex: 'daKy',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>Đã ký</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Người ký'>{rec?.nguoiKy?.hoTen ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Thời gian ký'>
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
							<Tag color='orange'>Chưa ký</Tag>
						),
					onCell,
				},
				{
					title: 'Đóng dấu',
					dataIndex: 'daDongDau',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>Đã đóng dấu</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Người đóng dấu'>
													{rec?.nguoiDongGiau?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Thời gian đóng dấu'>
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
							<Tag color='orange'>Chưa đóng dấu</Tag>
						),
					onCell,
				},
			],
			hide: !settingVbcc?.require_diploma_signature,
		},
		{
			title: 'Trạng thái phát bằng',
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
			title: 'Ký số thông tin',
			dataIndex: 'signature',
			align: 'center',
			width: 80,
			render: (val) => <Tag color={!!val ? ETagColor.GREEN : ETagColor.RED}>{!!val ? 'Đã ký' : 'Chưa ký'}</Tag>,
			hide: !settingVbcc?.require_signature,
			onCell,
		},
		{
			title: 'Thao tác',
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
					title='Xác nhận có kết quả?'
					placement='topRight'
				>
					<ButtonExtend
						tooltip='Xác nhận thông tin'
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
				title='Thông tin tra cứu thủ công'
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
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Modal>

			<ModalExpandable
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				title='Chi tiết thông tin văn bằng'
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
