import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { MucDichTraCuuPhuLuc } from '@/services/VanBang/MucDichTraCuuPhuLuc/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormMucDichTraCuuPhuLuc from './components/Form';

const MucDichTraCuuPhuLucPage = () => {
	const {
		getAllModel,
		loading,
		danhSach,
		handleEdit,
		deleteModel,
		putModel,
		visibleForm,
		setVisibleForm,
		setEdit,
		setIsView,
		setRecord,
		updatethuTuModel,
	} = useModel('vbcc.mucdichtracuuphuluc');

	const getData = () => {
		getAllModel();
	};

	useEffect(() => {
		getData();
	}, []);

	const onSortEnd = (record: MucDichTraCuuPhuLuc.IRecord, newIndex: number): void => {
		updatethuTuModel(record, newIndex, getData);
	};

	const columns: IColumn<MucDichTraCuuPhuLuc.IRecord>[] = [
		{
			title: 'Hiển thị',
			dataIndex: 'soThuTu',
			width: 60,
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
		<Card title='Danh sách mục đích tra cứu phụ lục'>
			<TableStaticData
				loading={loading}
				columns={columns}
				data={danhSach}
				hasTotal
				onReload={getData}
				Form={FormMucDichTraCuuPhuLuc}
				formProps={{ getData, title: 'Mục đích tra cứu phụ lục' }}
				hasCreate
				widthDrawer={600}
				showEdit={visibleForm}
				setShowEdit={(vis: boolean) => {
					setRecord(undefined);
					setEdit(false);
					setIsView(false);
					setVisibleForm(vis);
				}}
				rowSortable
				onSortEnd={onSortEnd}
			/>
		</Card>
	);
};

export default MucDichTraCuuPhuLucPage;
