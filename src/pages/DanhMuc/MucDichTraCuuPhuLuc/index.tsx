import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { MucDichTraCuuPhuLuc } from '@/services/VanBang/MucDichTraCuuPhuLuc/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormMucDichTraCuuPhuLuc from './components/Form';

const MucDichTraCuuPhuLucPage = () => {
	const intl = useIntl();
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
			title: intl.formatMessage({ id: 'mucdich.column.hienthi' }),
			dataIndex: 'soThuTu',
			width: 60,
			filterType: 'number',
		},
		{
			title: intl.formatMessage({ id: 'mucdich.column.mucdich' }),
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'mucdich.column.mucdichtracuu' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'mucdich.column.trangthai' }),
			dataIndex: 'active',
			align: 'center',
			width: 80,
			render: (val, rec) => (
				<Switch size='small' checked={val} onChange={(checked) => putModel(rec._id, { ...rec, active: checked })} />
			),
		},
		{
			title: intl.formatMessage({ id: 'mucdich.column.thaotac' }),
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
						title={intl.formatMessage({ id: 'mucdich.column.confirm.xoa' })}
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
		<Card title={intl.formatMessage({ id: 'mucdich.danhsach' })}>
			<TableStaticData
				loading={loading}
				columns={columns}
				data={danhSach}
				hasTotal
				onReload={getData}
				Form={FormMucDichTraCuuPhuLuc}
				formProps={{ getData, title: intl.formatMessage({ id: 'mucdich.title' }) }}
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
