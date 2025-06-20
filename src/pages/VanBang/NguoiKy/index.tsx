import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { NguoiKyVanBang } from '@/services/VanBang/NguoiKy/typing';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Popover } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const NguoiKyVanBangPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('vbcc.nguoiky');

	const columns: IColumn<NguoiKyVanBang.IRecord>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Chức vụ',
			dataIndex: 'chucVu',
			width: 160,
			filterType: 'string',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 140,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 120,
			render: (val) => val && formatPhoneNumber(val),
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
						title='Bạn có chắc chắn muốn xóa người ký này?'
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
			modelName='vbcc.nguoiky'
			title={
				<>
					{intl.formatMessage({ id: 'totnghiep.nguoiky.title' })}{' '}
					<Popover
						content={
							<>
								Khai báo thông tin người ký hợp lệ cho toàn hệ thống.
								<br />
								Chỉ chấp nhận những thông tin được ký số từ người có trong danh sách.
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
