import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { ColorLoaiLichSuPhoiBang, ELoaiLichSuPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import dayjs from '@/utils/dayjs';
import { Tag } from 'antd';
import { useModel } from 'umi';

const TabLichSu = () => {
	const { record } = useModel('vbcc.bieumauphoibang');
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
		},
		{
			title: 'Ngày nhập',
			dataIndex: 'ngayNhap',
			align: 'center',
			width: 150,
			render: (text: Date) => dayjs(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Loại',
			dataIndex: 'loai',
			align: 'center',
			width: 150,
			render: (text: ELoaiLichSuPhoiBang) => <Tag color={ColorLoaiLichSuPhoiBang[text]}>{text}</Tag>,
		},
	];
	return (
		<TableBase
			buttons={{ create: false }}
			dependencies={[page, limit, record?._id]}
			columns={columns}
			getData={getData}
			modelName='vbcc.lichsuphoibang'
		/>
	);
};

export default TabLichSu;
