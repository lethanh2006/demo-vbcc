import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { MucDichTraCuuPhuLuc } from '@/services/VanBang/MucDichTraCuuPhuLuc/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Switch } from 'antd';
import { useModel } from 'umi';
import FormMucDichTraCuuPhuLuc from './components/Form';

const MucDichTraCuuPhuLucPage = () => {
	const { page, limit, handleEdit, deleteModel, putModel } = useModel('vbcc.mucdichtracuuphuluc');

	const columns: IColumn<MucDichTraCuuPhuLuc.IRecord>[] = [
		{
			title: 'Hiển thị',
			dataIndex: 'soThuTu',
			width: 60,
			sorter: true,
			defaultSortOrder: 'ascend',
			filterType: 'number',
		},
		{
			title: 'Mã mục đích',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Mục đích Tra cứu',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'active',
			align: 'center',
			width: 80,
			render: (val, rec) => (
				<Switch size='small' checked={val} onChange={(checked) => putModel(rec._id, { ...rec, active: checked })} />
			),
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
		<TableBase
			columns={columns}
			modelName={'vbcc.mucdichtracuuphuluc'}
			title='Mục đích tra cứu phụ lục'
			Form={FormMucDichTraCuuPhuLuc}
			dependencies={[page, limit]}
		/>
	);
};

export default MucDichTraCuuPhuLucPage;
