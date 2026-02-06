import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { Empty } from 'antd';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useIntl } from 'umi';

interface Props {
	dataThongKe?: {
		nam?: number;
		data?: PhuLucVanBang.IThongKePhuLucTheoNamItem[];
	}[];
}

const ViewThongKePhuLuc = ({ dataThongKe = [] }: Props) => {
	const intl = useIntl();
	const safeData = dataThongKe ?? [];

	const categories = useMemo(() => safeData.map((item) => item?.nam?.toString() ?? ''), [safeData]);

	const allLevels = useMemo(() => {
		const set = new Set<string>();
		safeData.forEach((year) => {
			year?.data?.forEach((item) => {
				if (item?.ten) set.add(item.ten);
			});
		});
		return Array.from(set);
	}, [safeData]);

	const series = useMemo(() => {
		return allLevels.map((level) => ({
			name: level,
			data: safeData.map((year) => {
				const found = year?.data?.find((d) => d?.ten === level);
				return found?.soLuong ?? 0;
			}),
		}));
	}, [allLevels, safeData]);

	const options: ApexCharts.ApexOptions = {
		chart: {
			type: 'bar',
			stacked: true,
			toolbar: { show: false },
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '40%',
			},
		},
		dataLabels: { enabled: false },
		xaxis: {
			categories,
			title: { text: intl.formatMessage({ id: 'thongke.chart.xaxis.nam' }) },
		},
		yaxis: {
			title: { text: intl.formatMessage({ id: 'thongke.chart.yaxis.soluong' }) },
		},
		legend: { position: 'top' },
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (val) => (typeof val === 'number' ? val.toLocaleString() : '0'),
			},
		},
	};

	if (!safeData.length)
		return (
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={intl.formatMessage({ id: 'thongke.chart.empty' })} />
		);

	return <Chart options={options} series={series} type='bar' height={400} />;
};

export default ViewThongKePhuLuc;
