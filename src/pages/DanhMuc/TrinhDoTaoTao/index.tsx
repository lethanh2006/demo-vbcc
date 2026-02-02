import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDaoTao = () => {
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.trinhdodaotao');

	const columns: IColumn<TrinhDoDaoTao.IRecord>[] = [
		{
			title: 'Mã trình độ',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên trình độ',
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
						title='Bạn có chắc chắn muốn xóa trình độ này?'
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
			modelName='danhmuc.trinhdodaotao'
			title='Trình độ đào tạo'
			Form={Form}
			widthDrawer={800}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default TrinhDoDaoTao;
