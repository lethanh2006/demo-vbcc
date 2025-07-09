import { Popconfirm } from 'antd';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Modal from './components/Modal';
import moment from 'moment';

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
			title: 'Năm',
			dataIndex: 'nam',
			width: 150,
			sorter: true,
			filterType: 'string',
			align: 'center',
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
		<div>
			<TableBase
				columns={columns}
				modelName={'vbcc.dotcapbangtotnghiep'}
				title='Đợt cấp bằng tốt nghiệp'
				Form={Modal}
				dependencies={[page, limit]}
				widthDrawer={1000}
			/>
		</div>
	);
};

export default DotCapBangTotNghiepPage;
