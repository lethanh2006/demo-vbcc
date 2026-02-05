import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const NganhDaoTaoPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.nganhdaotao');

	const columns: IColumn<NganhDaoTao.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'nganh.column.manganh' }),
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'nganh.column.tennganh' }),
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'nganh.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
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
						title={intl.formatMessage({ id: 'nganh.column.confirm.xoa' })}
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
			modelName='danhmuc.nganhdaotao'
			title={intl.formatMessage({ id: 'nganh.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default NganhDaoTaoPage;
