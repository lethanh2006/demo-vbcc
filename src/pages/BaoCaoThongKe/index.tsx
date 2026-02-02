import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { TabViewPage } from '@/components/TabViewPage';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { ApartmentOutlined, DeploymentUnitOutlined, ReadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import ViewThongKePhuLuc from './View';

const mapThongKeTheoNam = (
	data: PhuLucVanBang.IThongKePhuLucTheoNam[],
	key: 'thongKeTrinhDoDaoTao' | 'thongKeHinhThucDaoTao' | 'thongKeNganhDaoTao',
) => {
	return (data ?? [])
		.filter((item) => item[key]?.length)
		.map((item) => ({
			nam: item.nam,
			data: item[key],
		}));
};

const BaoCaoThongKePage = () => {
	const { thongKePhuLucTheoNamModel, dataThongKe } = useModel('vbcc.phulucvanbang');

	const [dateRange, setDateRange] = useState<string[]>([
		dayjs().subtract(3, 'year').startOf('date').toISOString(),
		dayjs().endOf('date').toISOString(),
	]);

	const getData = () => {
		if (!dateRange?.length) return;

		thongKePhuLucTheoNamModel(undefined, [
			{
				active: true,
				field: 'ngayCapPhuLuc',
				values: [dayjs(dateRange[0]).startOf('date').toISOString(), dayjs(dateRange[1]).endOf('date').toISOString()],
				operator: EOperatorType.BETWEEN,
			},
		]);
	};

	useEffect(() => {
		getData();
	}, [dateRange]);

	const thongKeTrinhDo = useMemo(() => mapThongKeTheoNam(dataThongKe, 'thongKeTrinhDoDaoTao'), [dataThongKe]);

	const thongKeHinhThuc = useMemo(() => mapThongKeTheoNam(dataThongKe, 'thongKeHinhThucDaoTao'), [dataThongKe]);

	const thongKeNganh = useMemo(() => mapThongKeTheoNam(dataThongKe, 'thongKeNganhDaoTao'), [dataThongKe]);

	return (
		<Card title='Thống kê cấp phát văn bằng'>
			<Space wrap style={{ marginBottom: 12 }}>
				<MyDateRangePicker
					value={dateRange?.length ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
					onChange={(val: any) => setDateRange(val ?? [])}
					ranges={{
						'3 năm gần nhất': [dayjs().subtract(3, 'year').startOf('date'), dayjs().endOf('date')],
						'5 năm gần nhất': [dayjs().subtract(5, 'year').startOf('date'), dayjs().endOf('date')],
						'7 năm gần nhất': [dayjs().subtract(7, 'year').startOf('date'), dayjs().endOf('date')],
						'10 năm gần nhất': [dayjs().subtract(10, 'year').startOf('date'), dayjs().endOf('date')],
					}}
				/>

				<ButtonExtend icon={<ReloadOutlined />} onClick={getData}>
					Tải lại
				</ButtonExtend>
			</Space>

			<TabViewPage
				hideCard
				menu={[
					{
						title: 'Trình độ đào tạo',
						menuKey: 'trinh-do-dao-tao',
						icon: <ReadOutlined />,
						content: <ViewThongKePhuLuc dataThongKe={thongKeTrinhDo} />,
					},
					{
						title: 'Hình thức đào tạo',
						menuKey: 'hinh-thuc-dao-tao',
						icon: <ApartmentOutlined />,
						content: <ViewThongKePhuLuc dataThongKe={thongKeHinhThuc} />,
					},
					{
						title: 'Ngành đào tạo',
						menuKey: 'nganh-dao-tao',
						icon: <DeploymentUnitOutlined />,
						content: <ViewThongKePhuLuc dataThongKe={thongKeNganh} />,
					},
				]}
			/>
		</Card>
	);
};

export default BaoCaoThongKePage;
