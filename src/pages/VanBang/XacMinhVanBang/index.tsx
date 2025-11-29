import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import { ESettingKey } from '@/services/base/constant';
import { colorTrangThaiXacMinh, ETrangThaiXacMinh } from '@/services/VanBang/constant';
import { exportXacMinhVanBang } from '@/services/VanBang/XacMinhVanBang';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import { getNameFile } from '@/utils/utils';
import {
	ArrowLeftOutlined,
	DeleteOutlined,
	EditOutlined,
	InfoCircleOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { Checkbox, message, Popconfirm, Popover, Space, Spin, Tag, theme } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { Link, useModel } from 'umi';
import ViewPhuLucVanBang from '../PhuLuc/components/ViewRender';
import ModalXacMinhVanBang from './components/Modal';
import ModalCaiDatXacMinh from './components/ModalCaiDat';
import StatXacMinhVanBang from './components/Stat';
import ModalPhucDap from './PhucDap/Modal';

const XacMinhVanBangPage = () => {
	const token = theme.useToken();
	const { page, limit, deleteModel, handleEdit, setRecord } = useModel('vbcc.xacminhvanbang');
	const { getByIdModel, visibleForm, setVisibleForm, loading } = useModel('vbcc.phulucvanbang');
	const { getByKeyModel } = useModel('tienich.caidat');
	const [isFormBieuMauVisible, setIsFormBieuMauVisible] = useState(false);
	const [visiblePhucDap, setVisiblePhucDap] = useState<boolean>(false);

	const showPhuLucDetail = (rec: XacMinhVanBang.IRecord) => {
		if (rec && rec.phuLucId) {
			getByIdModel(rec.phuLucId);
			setVisibleForm(true);
		}
	};

	const handleExportFile = async (record: XacMinhVanBang.IRecord) => {
		if (record && record._id) {
			try {
				const res = await getByKeyModel(ESettingKey.XAC_MINH_VAN_BANG);
				console.log(res);
				const bieuMauId = res?.data?.bieuMauId;

				exportXacMinhVanBang(String(record._id), bieuMauId)
					.then((response) => response.data)
					.then((blob) => {
						fileDownload(blob, getNameFile(`xac_minh_van_bang_${record._id}`));
						message.success('Xuất file thành công!');
					});
			} catch (er: any) {
				message.error(er);
			}
		}
	};

	const renderTrangThaiInfo = (rec: XacMinhVanBang.IRecord) => (
		<div style={{ fontSize: 12, minWidth: 200, maxWidth: 300, lineHeight: 1.45 }}>
			<div>
				<b>Người tạo:</b> {rec?.nguoiTao?.hoTen ?? '—'}
				<br />
				{rec?.nguoiTao?.thoiGian && <em>{dayjs(rec?.nguoiTao?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
			</div>
			<br />

			<div>
				<b>Người xử lý:</b> {rec?.nguoiXuLy?.hoTen ?? '—'}
				<br />
				{rec?.nguoiXuLy?.thoiGian && <em>{dayjs(rec?.nguoiXuLy?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
			</div>
			<br />

			<div>
				<b>Loại phúc đáp:</b>
				<div style={{ whiteSpace: 'pre-wrap' }}>{rec?.loaiPhucDap || '—'}</div>
			</div>
			<br />

			<div>
				<b>Nội dung phúc đáp:</b>
				<div style={{ whiteSpace: 'pre-wrap' }}>{rec?.noiDungPhucDap || '—'}</div>
			</div>
			<br />

			<div>
				<b>File phúc đáp:</b>
				<div style={{ whiteSpace: 'pre-wrap' }}>
					{rec?.filePhucDap ? (
						<a href={rec.filePhucDap} target='_blank' rel='noreferrer'>
							Chi tiết
						</a>
					) : (
						'—'
					)}
				</div>
			</div>
		</div>
	);

	const onCell = (rec: XacMinhVanBang.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<XacMinhVanBang.IRecord>[] = [
		{
			title: 'Người yêu cầu',
			dataIndex: 'nguoiYeuCau',
			filterType: 'string',
			width: 160,
			onCell,
		},
		{
			title: 'Đơn vị',
			dataIndex: 'tenDonVi',
			filterType: 'string',
			width: 180,
			align: 'center',
			onCell,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			filterType: 'string',
			width: 120,
			align: 'center',
			onCell,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			filterType: 'string',
			width: 180,
			align: 'center',
			onCell,
		},
		{
			title: 'Ngày gửi',
			dataIndex: 'ngayGuiYeuCau',
			filterType: 'date',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			width: 120,
			align: 'center',
			onCell,
		},
		{
			title: 'Mục đích xác minh',
			dataIndex: 'mucDichXacMinh',
			filterType: 'string',
			width: 200,
			onCell,
		},
		{
			title: 'Phản hồi',
			dataIndex: 'daPhanHoi',
			filterType: 'select',
			render: (value) => <Checkbox checked={value} />,
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: 'Có thông tin trong hệ thống?',
			dataIndex: 'phuLucId',
			width: 140,
			align: 'center',
			render: (val, rec) =>
				val ? (
					<Link
						onClick={(e) => {
							e.preventDefault();
							showPhuLucDetail(rec);
						}}
						to='#'
					>
						Xem chi tiết
					</Link>
				) : (
					<span>Không có</span>
				),
			onCell,
		},
		{
			title: 'Thông tin tra cứu',
			width: 510,
			children: [
				{
					title: 'Mã sinh viên',
					dataIndex: 'maSinhVien',
					filterType: 'string',
					width: 120,
					align: 'center',
					onCell,
				},
				{
					title: 'Họ tên sinh viên',
					dataIndex: 'hoTen',
					filterType: 'string',
					width: 150,
					align: 'center',
					onCell,
				},
				{
					title: 'Số hiệu văn bằng',
					dataIndex: 'soHieuVanBang',
					filterType: 'string',
					width: 120,
					align: 'center',
					onCell,
				},
				{
					title: 'Số vào sổ',
					dataIndex: 'soVaoSo',
					filterType: 'string',
					width: 120,
					align: 'center',
					onCell,
				},
			],
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiXacMinh',
			width: 150,
			align: 'center',
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(ETrangThaiXacMinh),
			onCell,
			render: (val, rec) => (
				<Space size={6}>
					<Tag color={colorTrangThaiXacMinh[val as ETrangThaiXacMinh]} style={{ padding: '2px 8px', fontWeight: 500 }}>
						{val}
					</Tag>

					<Popover placement='left' content={renderTrangThaiInfo(rec)}>
						<InfoCircleOutlined style={{ cursor: 'pointer', color: token.token.colorPrimary }} />
					</Popover>
				</Space>
			),
		},
		{
			title: 'Thao tác',
			width: 120,
			fixed: 'right',
			align: 'center',
			render: (_, record) => (
				<>
					{/* <Popover
						placement='bottomLeft'
						content={
							<Space direction='vertical' size={'small'}>
								<ButtonExtend
									type='link'
									icon={<ArrowLeftOutlined />}
									onClick={() => {
										setRecord(record);
										setVisiblePhucDap(true);
									}}
								>
									Phúc đáp
								</ButtonExtend>
								<ButtonExtend
									type='link'
									icon={<ExportOutlined />}
									disabled={!record.coThongTin}
									onClick={() => handleExportFile(record)}
								>
									Văn bản phản hồi
								</ButtonExtend>
								<ButtonExtend
									type='link'
									icon={<FileDoneOutlined />}
									//onClick={() => handleSignDocument(record)}
								>
									Ký số
								</ButtonExtend>
							</Space>
						}
						trigger='hover'
					>
						<ButtonExtend type='link' tooltip='Thêm' icon={<MenuOutlined />} />
					</Popover> */}
					<ButtonExtend
						tooltip='Phúc đáp'
						type='link'
						icon={<ArrowLeftOutlined />}
						onClick={() => {
							setRecord(record);
							setVisiblePhucDap(true);
						}}
					/>

					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />

					<Popconfirm onConfirm={() => deleteModel(record._id)} title='Bạn có chắc chắn muốn xóa?' placement='topRight'>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				modelName={'vbcc.xacminhvanbang'}
				Form={ModalXacMinhVanBang}
				widthDrawer={1000}
				dependencies={[page, limit]}
				title='Xác minh văn bằng'
				extra={[
					<ButtonExtend
						key='add'
						type='link'
						onClick={() => setIsFormBieuMauVisible(true)}
						icon={<SettingOutlined />}
						tooltip='Biểu mẫu'
					/>,
				]}
				showModalTitle
			>
				<StatXacMinhVanBang />
			</TableBase>

			<ModalExpandable
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				title='Xem chi tiết thông tin văn bằng'
				width={1000}
				footer={null}
			>
				<Spin spinning={loading}>
					<ViewPhuLucVanBang hasPrint={false} />
				</Spin>
			</ModalExpandable>

			<ModalCaiDatXacMinh visible={isFormBieuMauVisible} onClose={() => setIsFormBieuMauVisible(false)} />

			<ModalPhucDap visible={visiblePhucDap} setVisible={setVisiblePhucDap} />
		</>
	);
};

export default XacMinhVanBangPage;
