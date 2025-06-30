import { Popconfirm } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import FormMucDichTraCuuPhuLuc from './components/Form';

const MucDichTraCuuPhuLucPage = () => {
	const { page, limit, handleEdit, deleteModel } = useModel('vbcc.mucdichtracuuphuluc');

	const columns: IColumn<MucDichTraCuuPhuLuc.IRecord>[] = [
		{
			title: 'Mục đích Tra cứu',
			dataIndex: 'ten',
			width: 150,
			sorter: true,
			filterType: 'string',
		},
		{
			title: 'Thứ tự hiển thị',
			dataIndex: 'soThuTu',
			width: 60,
			sorter: true,
			defaultSortOrder: 'ascend',
			filterType: 'number',
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
						title='Bạn có chắc chắn muốn xóa mục đích tra cứu phụ lục này?'
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
				modelName={'vbcc.mucdichtracuuphuluc'}
				title='Mục đích tra cứu phụ lục'
				Form={FormMucDichTraCuuPhuLuc}
				dependencies={[page, limit]}
			/>
		</div>
	);
};

export default MucDichTraCuuPhuLucPage;
