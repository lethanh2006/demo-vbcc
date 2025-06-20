import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { inputFormat } from '@/utils/utils';
import { Card } from 'antd';
import Chart from 'react-apexcharts';

const CardQuyetDinhTotNghiep = (payload: { chartData: PhuLucVanBang.TThongKeTraCuu[] }) => {
	const { chartData } = payload;

	const options = {
		plotOptions: {
			bar: {
				borderRadius: 6,
				columnWidth: '20%',
			},
		},
		chart: {
			type: 'line' as 'line',
			stacked: false,
			fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
		},
		legend: {
			position: 'bottom' as 'bottom',
		},
		stroke: {
			width: [0, 4],
			curve: 'smooth' as 'smooth',
		},
		xaxis: {
			categories: chartData.map((item) => item.ten),
		},
		yaxis: [
			{
				labels: {
					formatter: (val: any) => inputFormat(Math.round(val)),
				},
				min: 0,
			},
			{
				opposite: true,
			},
		],
		tooltip: {
			y: {
				formatter: (val: any) => inputFormat(Math.round(val)),
			},
		},
	};

	const series = [
		{
			name: 'Số lượng phụ lục',
			type: 'column',
			data: chartData.map((item) => item.soLuongPhuLuc ?? 0),
			color: 'var(--primary-color)',
		},
		{
			name: 'Số lượng tra cứu',
			type: 'line',
			data: chartData.map((item) => item?.soLuotTraCuuThanhCong ?? 0),
			color: '#15c58a',
		},
	];

	return (
		<Card title='Thống kê Quyết định'>
			<Chart options={options} series={series} height={450} />
		</Card>
	);
};

export default CardQuyetDinhTotNghiep;
