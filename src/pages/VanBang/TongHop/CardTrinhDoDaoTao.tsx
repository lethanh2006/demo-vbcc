import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { Card, Empty } from 'antd';
import Chart from 'react-apexcharts';
import { useIntl } from 'umi';

const CardTrinhDoDaoTao = ({ chartData }: { chartData: PhuLucVanBang.TThongKeTrinhDoDaoTao[] }) => {
	const intl = useIntl();
	const categories = chartData.map((i) => i.ten);

	const series: ApexCharts.ApexOptions['series'] = [
		{
			name: intl.formatMessage({ id: 'trangchu.tonghop.cardttdaotao.vanbangdacap' }),
			type: 'column',
			stack: 'vanbang',
			data: chartData.map((i) => i.soPhuLucDaCapBang ?? 0),
		},
		{
			name: intl.formatMessage({ id: 'trangchu.tonghop.cardttdaotao.vanbangchocap' }),
			type: 'column',
			stack: 'vanbang',
			data: chartData.map((i) => i.soPhuLucChoCapBang ?? 0),
		},
		{
			name: intl.formatMessage({ id: 'trangchu.tonghop.cardttdaotao.tracuutheoquyetdinh' }),
			type: 'line',
			data: chartData.map((i) => i.soLuotTraCuu ?? 0),
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
		<Card
			title={intl.formatMessage({ id: 'trangchu.tonghop.cardttdaotao.thongketheotrinhdodaotao' })}
			variant='borderless'
			styles={{ body: { paddingTop: 12 } }}
		>
			{chartData.length ? (
				<Chart options={options} series={series} type='line' height={420} />
			) : (
				<Empty description={intl.formatMessage({ id: 'trangchu.tonghop.cardttdaotao.khongcodulieu' })} />
			)}
		</Card>
	);
};

export default CardTrinhDoDaoTao;
