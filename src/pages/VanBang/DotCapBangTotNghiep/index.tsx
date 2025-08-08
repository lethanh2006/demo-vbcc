import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiCapBangToiNghiep, ETrangThaiDotCapBangTotNghiep } from '@/services/VanBang/constant';
import type { DotCapBangTotNghiep } from '@/services/VanBang/DotCapBangTotNghiep/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Modal from './components/Modal';

const DotCapBangTotNghiepPage = () => {
	const { page, limit, handleEdit, deleteModel } = useModel('vbcc.dotcapbangtotnghiep');

	const columns: IColumn<DotCapBangTotNghiep.IRecord>[] = [
		{
			title: 'Đợt cấp bằng',
			dataIndex: 'ten',
			width: 180,
			sorter: true,
			filterType: 'string',
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'ngayBatDau',
			width: 110,
			sorter: true,
			filterType: 'date',
			align: 'center',
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'ngayKetThuc',
			width: 110,
			sorter: true,
			filterType: 'date',
			align: 'center',
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={colorTrangThaiCapBangToiNghiep[val as ETrangThaiDotCapBangTotNghiep]}>{val}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDotCapBangTotNghiep),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title='Bạn có chắc chắn muốn xóa đợt cấp bằng này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			modelName={'vbcc.dotcapbangtotnghiep'}
			title='Đợt cấp bằng, chứng chỉ, chứng nhận'
			Form={Modal}
			dependencies={[page, limit]}
			widthDrawer={1200}
		/>
	);
};

export default DotCapBangTotNghiepPage;
