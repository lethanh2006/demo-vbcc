import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const BieuMauPhuLucPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('vbcc.bieumauphuluc');

	const columns: IColumn<BieuMauPhuLuc.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên biểu mẫu',
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
		},
		// {
		// 	title: 'Tệp tin',
		// 	render: (val, rec) => (
		// 		<Button type='link' onClick={() => getDetailModel(record, handleDownload)} icon={<DownloadOutlined />}>
		// 			Tải biểu mẫu
		// 		</Button>
		// 	),
		// 	align: 'center',
		// 	width: 100,
		// },
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
						title='Bạn có chắc chắn muốn xóa biểu mẫu này?'
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
			modelName='vbcc.bieumauphuluc'
			title={intl.formatMessage({ id: 'vanbang.bieumauphuluc.title' })}
			Form={Form}
			widthDrawer={800}
		/>
	);
};

export default BieuMauPhuLucPage;
