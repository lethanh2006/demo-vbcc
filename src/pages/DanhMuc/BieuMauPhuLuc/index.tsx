import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import ChiTietBieuMauPhuLuc from './components/ChiTiet';
import FormPhuluc from './components/Form';

const BieuMauPhuLucPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel, isView, handleView } = useModel('vbcc.bieumauphuluc');

	const onCell = (rec: BieuMauPhuLuc.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<BieuMauPhuLuc.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'bieumau.column.ma' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'bieumau.column.ten' }),
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
			title: intl.formatMessage({ id: 'bieumau.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chitiet' })}
						onClick={() => handleView(rec)}
						type='link'
						icon={<EyeOutlined />}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() =>
							deleteModel(rec._id, undefined, { messageText: intl.formatMessage({ id: 'global.button.xoathanhcong' }) })
						}
						title={intl.formatMessage({ id: 'bieumau.confirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
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
			title={intl.formatMessage({ id: 'bieumau.title' })}
			Form={isView ? ChiTietBieuMauPhuLuc : FormPhuluc}
			widthDrawer={isView ? 1000 : 800}
			showModalTitle
		/>
	);
};

export default BieuMauPhuLucPage;
