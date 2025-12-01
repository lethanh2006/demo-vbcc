import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiXacMinh, ELoaiPhucDap, EPhaseXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Checkbox, Popconfirm, Spin, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewPhuLucVanBang from '../PhuLuc/components/ViewRender';
import ModalXacMinhVanBang from './components/Modal';
import ModalCaiDatXacMinh from './components/ModalCaiDat';

const XacMinhVanBangPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('vbcc.xacminhvanbang');
	const { visibleForm, setVisibleForm, loading } = useModel('vbcc.phulucvanbang');
	const [isFormBieuMauVisible, setIsFormBieuMauVisible] = useState(false);

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
			title: 'Loại phúc đáp',
			dataIndex: 'loaiPhucDap',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiPhucDap),
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
			render: (val: Date) => val && dayjs(val).format('DD/MM/YYYY'),
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
			render: (value: boolean) => <Checkbox checked={value} />,
			width: 80,
			align: 'center',
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Xử lý',
			dataIndex: 'phaseXuLy',
			width: 150,
			align: 'center',
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(EPhaseXacMinh),
			onCell,
			render: (val: EPhaseXacMinh) => <Tag color={colorTrangThaiXacMinh[val]}>{val}</Tag>,
		},
		{
			title: 'Thao tác',
			width: 90,
			fixed: 'right',
			align: 'center',
			render: (_, record) => {
				const isHoanThanh = record?.phaseXuLy === EPhaseXacMinh.HOAN_THANH;
				return (
					<>
						<ButtonExtend
							disabled={isHoanThanh}
							tooltip='Chỉnh sửa'
							onClick={() => handleEdit(record)}
							type='link'
							icon={<EditOutlined />}
						/>

						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topRight'
						>
							<ButtonExtend disabled={isHoanThanh} tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				modelName={'vbcc.xacminhvanbang'}
				Form={ModalXacMinhVanBang}
				widthDrawer={1200}
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
				formProps={{ getData: getModel }}
			>
				{/* <StatXacMinhVanBang /> */}
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
		</>
	);
};

export default XacMinhVanBangPage;
