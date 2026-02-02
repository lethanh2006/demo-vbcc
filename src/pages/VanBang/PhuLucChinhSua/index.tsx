import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { IColumn } from '@/components/Table/typing';
import {
	colorLoaiYeuCauVangBang,
	colorTrangThaiYeuCauVanBang,
	ELoaiYeuCauVangBang,
	ETrangThaiYeuCauVanBang,
	nameLoaiYeuCauVangBang,
} from '@/services/VanBang/LichSuVanBang/constant';
import { LichSuVanBang } from '@/services/VanBang/LichSuVanBang/typing';
import dayjs from '@/utils/dayjs';
import { CheckOutlined, CloseOutlined, FileTextOutlined, ProfileOutlined } from '@ant-design/icons';
import { Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ModalXuLyPhuLuc from './components/XuLy';

const PhuLucChinhSuaPage = (props: { title: 'Đề xuất chỉnh sửa' | 'Đề xuất cấp lại' | 'Đề xuất thu hồi' }) => {
	const { title } = props;
	const { getModel, page, limit, setRecord, handleView } = useModel('vbcc.lichsuvanbang');
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('1');

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: ETrangThaiYeuCauVanBang;
	}>();

	const getData = () => {
		const filters: any[] = [];

		if (title === 'Đề xuất chỉnh sửa') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.CHINH_SUA],
				operator: EOperatorType.INCLUDE,
			});
		}
		if (title === 'Đề xuất cấp lại') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.CAP_LAI],
				operator: EOperatorType.INCLUDE,
			});
		}
		if (title === 'Đề xuất thu hồi') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.THU_HOI],
				operator: EOperatorType.INCLUDE,
			});
		}

		if (activeKey === '1') {
			filters.push({
				active: true,
				field: 'trangThai',
				values: [ETrangThaiYeuCauVanBang.CHO_XAC_NHAN],
				operator: EOperatorType.INCLUDE,
			});
		}

		if (activeKey === '2') {
			filters.push({
				active: true,
				field: 'trangThai',
				values: [ETrangThaiYeuCauVanBang.DA_DUYET, ETrangThaiYeuCauVanBang.KHONG_DUYET],
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
			onCell: title !== 'Đề xuất thu hồi' ? onCell : undefined,
		},
		{
			title: 'Thời gian yêu cầu',
			dataIndex: 'thoiGianYeuCau',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'datetime',
			sortable: true,
			onCell: title !== 'Đề xuất thu hồi' ? onCell : undefined,
		},
		{
			title: 'Thời gian xử lý',
			dataIndex: 'thoiGianXacNhan',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'datetime',
			sortable: true,
			onCell: title !== 'Đề xuất thu hồi' ? onCell : undefined,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Đề xuất',
			dataIndex: 'loai',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorLoaiYeuCauVangBang[val as ELoaiYeuCauVangBang]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ELoaiYeuCauVangBang),
			onCell: title !== 'Đề xuất thu hồi' ? onCell : undefined,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={colorTrangThaiYeuCauVanBang[val as ETrangThaiYeuCauVanBang]}>
					{nameLoaiYeuCauVangBang[val as ETrangThaiYeuCauVanBang]}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values([ETrangThaiYeuCauVanBang.DA_DUYET, ETrangThaiYeuCauVanBang.KHONG_DUYET]).map(
				(item) => ({
					value: item,
					label: nameLoaiYeuCauVangBang[item],
				}),
			),
			fixed: 'right',
			onCell: title !== 'Đề xuất thu hồi' ? onCell : undefined,
			hide: activeKey === '1',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => {
				const isChoXacNhan = rec?.trangThai === ETrangThaiYeuCauVanBang.CHO_XAC_NHAN;

				return (
					<>
						<ButtonExtend
							disabled={!isChoXacNhan}
							onClick={() => {
								setRecord(rec);
								setTrangThai({ title: 'Chấp nhận đề xuất', trangThai: ETrangThaiYeuCauVanBang.DA_DUYET });
								setVisibleXuLy(true);
							}}
							tooltip='Chấp nhận'
							className='btn-success'
							type='link'
							icon={<CheckOutlined />}
						/>

						<ButtonExtend
							disabled={!isChoXacNhan}
							onClick={() => {
								setRecord(rec);
								setTrangThai({ title: 'Từ chối đề xuất', trangThai: ETrangThaiYeuCauVanBang.KHONG_DUYET });
								setVisibleXuLy(true);
							}}
							tooltip='Từ chối'
							danger
							type='link'
							icon={<CloseOutlined />}
						/>
					</>
				);
			},
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, title, activeKey]}
				modelName='vbcc.lichsuvanbang'
				title={title}
				buttons={{
					create: false,
				}}
				Form={Form}
				formProps={{ getData }}
				widthDrawer={1200}
				modalTitle='Chi tiết thông tin thay đổi'
				showModalTitle
			>
				<Tabs accessKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
					<Tabs.TabPane key={'1'} tab={'Chưa xử lý'} icon={<FileTextOutlined />} />
					<Tabs.TabPane key={'2'} tab={'Lịch sử xử lý'} icon={<ProfileOutlined />} />
				</Tabs>
			</TableBase>

			<ModalXuLyPhuLuc
				visible={visibleXuLy}
				setVisible={setVisibleXuLy}
				title={trangThai?.title ?? ''}
				trangThai={trangThai?.trangThai ?? ETrangThaiYeuCauVanBang.CHO_XAC_NHAN}
				getData={getData}
			/>
		</>
	);
};

export default PhuLucChinhSuaPage;
