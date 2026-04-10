import TableBase from '@/components/Table';
import { IColumn, TDataOption } from '@/components/Table/typing';
import { ColorLoaiLichSuPhoiBang, ELoaiLichSuPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import dayjs from '@/utils/dayjs';
import { Button, Tag } from 'antd';
import { useModel } from 'umi';

const mapEnumToFilters = <T extends Record<string, string | number>>(enumObj: T): TDataOption[] => {
  return Object.values(enumObj).map((value) => ({
    label: value.toString(),
    value: value,
  }));
};

const sortSoBatDau = (a: PhoiBang.ILichSuPhoiBang, b: PhoiBang.ILichSuPhoiBang) => {
	return (a.soBatDau || 0) - (b.soBatDau || 0);
};

const sortSoKetThuc = (a: PhoiBang.ILichSuPhoiBang, b: PhoiBang.ILichSuPhoiBang) => {
	return (a.soKetThuc || 0) - (b.soKetThuc || 0);
};

const sortThoiGian = (a: PhoiBang.ILichSuPhoiBang, b: PhoiBang.ILichSuPhoiBang) => {
	const timeA = a.ngayNhap ? dayjs(a.ngayNhap).valueOf() : 0;
	const timeB = b.ngayNhap ? dayjs(b.ngayNhap).valueOf() : 0;
	return timeA - timeB;
};

const TabLichSu = () => {
	const { record, setVisibleForm } = useModel('vbcc.bieumauphoibang');
	const { getModel, page, limit } = useModel('vbcc.lichsuphoibang');

	const getData = () => {
		getModel(
			{
				bieuMauPhoiBangId: record?._id,
			},
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			{
				populate: [
					{
						path: 'bieu-mau-phoi-bang',
					},
				],
			},
		);
	};

	const columns: IColumn<PhoiBang.ILichSuPhoiBang>[] = [
		{
			title: 'Số hiệu phôi',
			dataIndex: ['bieuMauPhoiBang', 'dinhDangSoHieu'],
			align: 'center',
			width: 150,
			hide: true,
		},
		{
			title: 'Phân loại',
			dataIndex: 'loai',
			align: 'center',
			width: 150,
			filterType: 'select',
			filterData: mapEnumToFilters(ELoaiLichSuPhoiBang),
			render: (text: ELoaiLichSuPhoiBang) => <Tag color={ColorLoaiLichSuPhoiBang[text]}>{text}</Tag>,	
		},
		{
			title: 'Số bắt đầu',
			dataIndex: 'soBatDau',
			align: 'center',
			width: 80,
			sorter: sortSoBatDau,
		},
		{
			title: 'Số kết thúc',
			dataIndex: 'soKetThuc',
			align: 'center',
			width: 80,
			sorter: sortSoKetThuc,
		},
		{
			title: 'Thời gian',
			dataIndex: 'ngayNhap',
			align: 'center',
			width: 150,
			render: (text: Date) => dayjs(text).format('DD/MM/YYYY'),
			sorter: sortThoiGian,
		},
	];
	return (
		<div>
			<TableBase
				hideCard
				buttons={{ create: false }}
				dependencies={[page, limit, record?._id]}
				columns={columns}
				getData={getData}
				modelName='vbcc.lichsuphoibang'
			/>
			<div className='form-footer' style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
				<Button onClick={() => setVisibleForm(false)}>
					Đóng
				</Button>
			</div>

		</div>
	);
};

export default TabLichSu;
