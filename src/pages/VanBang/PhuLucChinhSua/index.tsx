import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { IColumn } from '@/components/Table/typing';
import {
	colorLoaiYeuCauVangBang,
	colorTrangThaiYeuCauVanBang,
	ELoaiYeuCauVangBang,
	ETrangThaiYeuCauVanBang,
} from '@/services/VanBang/LichSuVanBang/constant';
import { LichSuVanBang } from '@/services/VanBang/LichSuVanBang/typing';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const PhuLucChinhSuaPage = (props: { title: 'Yêu cầu chỉnh sửa' | 'Yêu cầu cấp lại' | 'Yêu cầu thu hồi' }) => {
	const { title } = props;
	const { getModel, page, limit, handleView, xuLyYauCauVanBangModel } = useModel('vbcc.lichsuvanbang');

	const getData = () => {
		const filters: any[] = [];

		if (title === 'Yêu cầu chỉnh sửa') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.CHINH_SUA],
				operator: EOperatorType.INCLUDE,
			});
		}
		if (title === 'Yêu cầu cấp lại') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.CAP_LAI],
				operator: EOperatorType.INCLUDE,
			});
		}
		if (title === 'Yêu cầu thu hồi') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.THU_HOI],
				operator: EOperatorType.INCLUDE,
			});
		}

		getModel(undefined, filters);
	};

	const onCell = (rec: LichSuVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LichSuVanBang.IRecord>[] = [
		{
			title: 'Phụ lục gốc',
			dataIndex: 'phuLucVanBangId',
			width: 250,
			render: (val, rec) =>
				[
					rec?.phuLucVanBang?.soVaoSoBang,
					rec?.phuLucVanBang?.soHieuVanBang,
					rec?.phuLucVanBang?.hoTen,
					rec?.phuLucVanBang?.ngaySinh,
					rec?.phuLucVanBang?.maSinhVien,
				]
					.filter(Boolean)
					.join(' | '),
			onCell: title !== 'Yêu cầu thu hồi' ? onCell : undefined,
		},
		{
			title: 'Thời gian yêu cầu',
			dataIndex: 'thoiGianYeuCau',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'datetime',
			sortable: true,
			onCell: title !== 'Yêu cầu thu hồi' ? onCell : undefined,
		},
		{
			title: 'Thời gian xử lý',
			dataIndex: 'thoiGianXacNhan',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'datetime',
			sortable: true,
			onCell: title !== 'Yêu cầu thu hồi' ? onCell : undefined,
		},
		{
			title: 'Yêu cầu',
			dataIndex: 'loai',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorLoaiYeuCauVangBang[val as ELoaiYeuCauVangBang]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ELoaiYeuCauVangBang),
			onCell: title !== 'Yêu cầu thu hồi' ? onCell : undefined,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorTrangThaiYeuCauVanBang[val as ETrangThaiYeuCauVanBang]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiYeuCauVanBang),
			onCell: title !== 'Yêu cầu thu hồi' ? onCell : undefined,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => {
				const isChoXacNhan = rec?.trangThai === ETrangThaiYeuCauVanBang.CHO_XAC_NHAN;

				return (
					<>
						<Popconfirm
							onConfirm={() =>
								xuLyYauCauVanBangModel(
									rec?._id,
									{
										trangThai: ETrangThaiYeuCauVanBang.DA_DUYET,
										thoiGianXacNhan: dayjs(),
									},
									getData,
								)
							}
							title='Bạn có chắc chắn muốn chấp nhận yêu cầu này?'
							placement='topRight'
						>
							<ButtonExtend
								disabled={!isChoXacNhan}
								tooltip='Cấp nhận'
								className='btn-success'
								type='link'
								icon={<CheckCircleOutlined />}
							/>
						</Popconfirm>
						<Popconfirm
							onConfirm={() =>
								xuLyYauCauVanBangModel(
									rec?._id,
									{
										trangThai: ETrangThaiYeuCauVanBang.KHONG_DUYET,
										thoiGianXacNhan: dayjs(),
									},
									getData,
								)
							}
							title='Bạn có chắc chắn muốn từ chối yêu cầu này?'
							placement='topRight'
						>
							<ButtonExtend
								disabled={!isChoXacNhan}
								tooltip='Từ chối'
								danger
								type='link'
								icon={<CloseCircleOutlined />}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, title]}
			modelName='vbcc.lichsuvanbang'
			title={title}
			buttons={{
				create: false,
			}}
			Form={Form}
			widthDrawer={1200}
			modalTitle='Chi tiết thông tin thay đổi'
			showModalTitle
		/>
	);
};

export default PhuLucChinhSuaPage;
