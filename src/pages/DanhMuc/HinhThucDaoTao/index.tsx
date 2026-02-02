import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const HinhThucDaoTaoPage = () => {
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.hinhthucdaotao');

	const columns: IColumn<HinhThucDaoTao.IRecord>[] = [
		{
			title: 'Mã hình thức',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên hình thức',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
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
						title='Bạn có chắc chắn muốn xóa hình thức này?'
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
			dependencies={[page, limit]}
			modelName='danhmuc.hinhthucdaotao'
			title='Hình thức đào tạo'
			Form={Form}
			widthDrawer={800}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default HinhThucDaoTaoPage;
