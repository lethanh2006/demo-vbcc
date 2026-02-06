import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { DotCapBangTotNghiep } from '@/services/VanBang/DotCapBangTotNghiep/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Modal from './components/Modal';

const DotCapBangTotNghiepPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('vbcc.dotcapbangtotnghiep');

	const columns: IColumn<DotCapBangTotNghiep.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'dotcapbang.column.dotcapbang' }),
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dotcapbang.column.ngaybatdau' }),
			dataIndex: 'ngayBatDau',
			width: 100,
			sorter: true,
			filterType: 'date',
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'dotcapbang.column.ngayketthuc' }),
			dataIndex: 'ngayKetThuc',
			width: 100,
			sorter: true,
			filterType: 'date',
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'dotcapbang.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 140,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dotcapbang.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'dotcapbang.action.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title={intl.formatMessage({ id: 'dotcapbang.confirm.delete' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'dotcapbang.action.xoa' })}
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
			modelName={'vbcc.dotcapbangtotnghiep'}
			title={intl.formatMessage({ id: 'dotcapbang.title' })}
			Form={Modal}
			dependencies={[page, limit]}
			widthDrawer={1200}
			showModalTitle
		/>
	);
};

export default DotCapBangTotNghiepPage;
