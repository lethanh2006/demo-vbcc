import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const TrinhDoDaoTao = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.trinhdodaotao');

	const columns: IColumn<TrinhDoDaoTao.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'trinhdo.column.matrinhdo' }),
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'trinhdo.column.tentrinhdo' }),
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'trinhdo.column.thaotac' }),
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
						title={intl.formatMessage({ id: 'trinhdo.column.confirm.xoa' })}
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
			modelName='danhmuc.trinhdodaotao'
			title={intl.formatMessage({ id: 'trinhdo.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default TrinhDoDaoTao;
