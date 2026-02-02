import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { Card, Empty } from 'antd';
import Chart from 'react-apexcharts';

const CardQuyetDinhTotNghiep = ({ chartData }: { chartData: PhuLucVanBang.TThongKeTraCuu[] }) => {
	const categories = chartData.map((i) => i.ten);

	const series: ApexCharts.ApexOptions['series'] = [
		{
			name: 'Văn bằng đã cấp',
			type: 'column',
			stack: 'vanbang',
			data: chartData.map((i) => i.daCapBang ?? 0),
		},
		{
			name: 'Văn bằng chưa cấp',
			type: 'column',
			stack: 'vanbang',
			data: chartData.map((i) => i.choCapBang ?? 0),
		},
		{
			name: 'Tra cứu theo quyết định',
			type: 'line',
			data: chartData.map((i) => i.soLuotTraCuuThanhCong ?? 0),
		},
	] as any;

	const options: ApexCharts.ApexOptions = {
		chart: {
			stacked: true,
			toolbar: { show: false },
			animations: {
				enabled: true,
				speed: 800,
			},
			fontFamily: 'Inter, system-ui, -apple-system',
		},

		plotOptions: {
			bar: {
				columnWidth: '30%',
				borderRadius: 4,
				borderRadiusApplication: 'end',
				dataLabels: {
					position: 'top',
				},
			},
		},

		stroke: {
			width: [0, 0, 3],
			curve: 'smooth',
			dashArray: [0, 0, 0],
		},

		colors: ['#34D399', '#FB7185', '#2563EB'],

		xaxis: {
			categories,
			labels: {
				rotate: -35,
				trim: true,
				style: {
					fontSize: '12px',
					fontWeight: 500,
					colors: '#6B7280',
				},
			},
			axisBorder: { show: false },
			axisTicks: { show: false },
		},

		yaxis: [
			{
				title: {
					style: {
						fontSize: '14px',
						fontWeight: 500,
						color: '#4B5563',
						fontFamily: 'Inter, sans-serif',
					},
				},
				labels: {
					style: {
						fontSize: '13px',
						colors: '#6B7280',
						fontFamily: 'Inter, sans-serif',
					},
					formatter: (value) => {
						return value.toLocaleString('vi-VN');
					},
				},
				axisBorder: {
					show: true,
					color: '#E5E7EB',
				},
			},
		],

		grid: {
			borderColor: '#E5E7EB',
			strokeDashArray: 4,
			padding: {
				left: 10,
				right: 20,
			},
		},

		legend: {
			position: 'bottom',
			horizontalAlign: 'center',
			fontSize: '13px',
			fontWeight: 500,

			itemMargin: {
				horizontal: 16,
				vertical: 8,
			},
			labels: {
				colors: '#374151',
			},
		},

		dataLabels: { enabled: false },

		fill: {
			opacity: [0.9, 0.9, 1],
		},

		tooltip: {
			shared: true,
			intersect: false,
			theme: 'light',
			x: {
				show: true,
			},
			y: {
				formatter: (val) => `${val.toLocaleString('vi-VN')}`,
			},
			style: {
				fontSize: '13px',
			},
		},
	};

	return (
		<Card title='Thống kê theo Quyết định' variant='borderless' styles={{ body: { paddingTop: 12 } }}>
			{chartData.length ? (
				<Chart options={options} series={series} type='line' height={420} />
			) : (
				<Empty description='Không có dữ liệu' />
			)}
		</Card>
	);
};

export default CardQuyetDinhTotNghiep;
