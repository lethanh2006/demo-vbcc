import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import ChiTietBieuMauPhuLuc from './components/ChiTiet';
import Form from './components/Form';

const BieuMauPhuLucPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel, isView, handleView } = useModel('vbcc.bieumauphuluc');

	const onCell = (rec: BieuMauPhuLuc.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<BieuMauPhuLuc.IRecord>[] = [
		{
			title: 'Mã biểu mẫu',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên biểu mẫu',
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
			onCell,
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
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
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
			Form={isView ? ChiTietBieuMauPhuLuc : Form}
			widthDrawer={isView ? 1000 : 800}
		/>
	);
};

export default BieuMauPhuLucPage;
