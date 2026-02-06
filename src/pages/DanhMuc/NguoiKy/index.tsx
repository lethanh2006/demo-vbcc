import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { colorLoaiChuKy, ELoaiChuKy } from '@/services/VanBang/constant';
import { NguoiKyVanBang } from '@/services/VanBang/NguoiKy/typing';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Popover, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const NguoiKyVanBangPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('vbcc.nguoiky');

	const columns: IColumn<NguoiKyVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'nguoiky.column.hoten' }),
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'nguoiky.column.chucvu' }),
			dataIndex: 'chucVu',
			width: 160,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'nguoiky.column.loai' }),
			dataIndex: 'loaiChuKy',
			align: 'center',
			width: 140,
			filterType: 'select',
			filterData: Object.values(ELoaiChuKy),
			render: (val: ELoaiChuKy) => val && <Tag color={colorLoaiChuKy[val]}>{val}</Tag>,
		},
		{
			title: intl.formatMessage({ id: 'nguoiky.column.email' }),
			dataIndex: 'email',
			width: 140,
		},
		{
			title: intl.formatMessage({ id: 'nguoiky.column.sdt' }),
			dataIndex: 'soDienThoai',
			width: 120,
			render: (val) => val && formatPhoneNumber(val),
		},
		{
			title: intl.formatMessage({ id: 'nguoiky.column.thaotac' }),
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
						title={intl.formatMessage({ id: 'nguoiky.confirm.xoa' })}
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
			modelName='vbcc.nguoiky'
			title={
				<>
					{intl.formatMessage({ id: 'nguoiky.title' })}{' '}
					<Popover
						content={
							<>
								{intl.formatMessage({ id: 'nguoiky.info' })}
								<br />
								{intl.formatMessage({ id: 'nguoiky.info1' })}
							</>
						}
					>
						<QuestionCircleOutlined />
					</Popover>
				</>
			}
			Form={Form}
			widthDrawer={800}
		/>
	);
};

export default NguoiKyVanBangPage;
