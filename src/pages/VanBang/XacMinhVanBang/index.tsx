import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import { ESettingKey } from '@/services/base/constant';
import { exportXacMinhVanBang } from '@/services/VanBang/XacMinhVanBang';
import dayjs from '@/utils/dayjs';
import { getNameFile } from '@/utils/utils';
import {
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	FileDoneOutlined,
	MenuOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { Checkbox, message, Popconfirm, Popover, Space, Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { Link, useModel } from 'umi';
import ViewPhuLucVanBang from '../PhuLuc/components/ViewRender';
import FormXacMinh from './components/FormXacMinh';
import ModalCaiDatXacMinh from './components/ModalCaiDat';

const XacMinhVanBangPage = () => {
	const { page, limit, deleteModel, handleEdit } = useModel('vbcc.xacminhvanbang');
	const { getByIdModel, visibleForm, setVisibleForm, loading } = useModel('vbcc.phulucvanbang');
	const { getByKeyModel } = useModel('tienich.caidat');
	const [isFormBieuMauVisible, setIsFormBieuMauVisible] = useState(false);

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

	const columns: IColumn<XacMinhVanBang.IRecord>[] = [
		{
			title: 'Người yêu cầu',
			dataIndex: 'nguoiYeuCau',
			filterType: 'string',
			width: 160,
		},
		{
			title: 'Đơn vị',
			dataIndex: 'tenDonVi',
			filterType: 'string',
			width: 180,
			align: 'center',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			filterType: 'string',
			width: 120,
			align: 'center',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			filterType: 'string',
			width: 180,
			align: 'center',
		},
		{
			title: 'Ngày gửi',
			dataIndex: 'ngayGuiYeuCau',
			filterType: 'date',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			width: 120,
			align: 'center',
		},
		{
			title: 'Mục đích xác minh',
			dataIndex: 'mucDichXacMinh',
			filterType: 'string',
			width: 200,
		},
		{
			title: 'Phản hồi',
			dataIndex: 'daPhanHoi',
			filterType: 'select',
			render: (value) => <Checkbox checked={value} />,
			width: 80,
			align: 'center',
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
				},
				{
					title: 'Họ tên sinh viên',
					dataIndex: 'hoTen',
					filterType: 'string',
					width: 150,
					align: 'center',
				},
				{
					title: 'Số hiệu văn bằng',
					dataIndex: 'soHieuVanBang',
					filterType: 'string',
					width: 120,
					align: 'center',
				},
				{
					title: 'Số vào sổ',
					dataIndex: 'soVaoSo',
					filterType: 'string',
					width: 120,
					align: 'center',
				},
			],
		},
		{
			title: 'Thao tác',
			width: 120,
			fixed: 'right',
			align: 'center',
			render: (_, record) => (
				<>
					<Popover
						placement='left'
						content={
							<Space>
								<ButtonExtend
									size='middle'
									type='link'
									tooltip='Văn bản phản hồi'
									icon={<ExportOutlined />}
									disabled={!record.coThongTin}
									onClick={() => handleExportFile(record)}
								/>
								<ButtonExtend
									size='middle'
									type='link'
									tooltip='Ký số'
									icon={<FileDoneOutlined />}
									//onClick={() => handleSignDocument(record)}
								/>
							</Space>
						}
						trigger='click'
					>
						<ButtonExtend type='link' tooltip='Thêm' icon={<MenuOutlined />} />
					</Popover>

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
				Form={FormXacMinh}
				widthDrawer={800}
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
			/>

			<ModalExpandable
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				title='Xem chi tiết phụ lục văn bằng'
				width={1000}
				footer={null}
			>
				<Spin spinning={loading}>
					<ViewPhuLucVanBang hasPrint={false} />
				</Spin>
			</ModalExpandable>

			<ModalCaiDatXacMinh visible={isFormBieuMauVisible} onClose={() => setIsFormBieuMauVisible(false)} />
		</>
	);
};

export default XacMinhVanBangPage;
