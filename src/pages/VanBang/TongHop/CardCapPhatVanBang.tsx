import ColumnChart from '@/components/Chart/ColumnChart';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { Card, Empty } from 'antd';
import { useIntl } from 'umi';

const CardThongKeCapPhatVanBang = (props: { data: PhuLucVanBang.TTongHopNam[] }) => {
	const { data } = props;
	const intl = useIntl();

	const yLabel = [
		intl.formatMessage({ id: 'trangchu.tonghop.cardcapphat.sovbccduoccapphat' }),
		intl.formatMessage({ id: 'trangchu.tonghop.cardcapphat.sovbcccapmoi' }),
	];
	const yAxis = [data.map((item) => item.soLuongDuocPhat ?? 0), data.map((item) => item.soLuongCapMoiVanBang ?? 0)];

	return (
		<Card title={intl.formatMessage({ id: 'trangchu.tonghop.cardcapphat.thongketinhtrang' })} variant='borderless'>
			{data.length ? (
				<ColumnChart
					xAxis={data.map((item) =>
						intl.formatMessage({ id: 'trangchu.tonghop.cardcapphat.thang' }, { thang: item.thang }),
					)}
					yAxis={yAxis}
					yLabel={yLabel}
					type='bar'
					colors={['#A58BEB', '#FFC557']}
					otherOptions={{
						legend: {
							position: 'bottom',
							fontSize: '14px',
							labels: {
								colors: '#444',
							},
						},
						plotOptions: {
							bar: {
								columnWidth: '45%',
								borderRadius: 6,
							},
						},
						tooltip: {
							shared: true,
							intersect: false,
							style: { fontSize: '14px' },
							y: {
								formatter: (value) => `${value.toLocaleString('vi-VN')}`,
							},
						},
						dataLabels: {
							enabled: false,
						},
						xaxis: {
							categories: data.map((item) =>
								intl.formatMessage({ id: 'trangchu.tonghop.cardcapphat.thang' }, { thang: item.thang }),
							),
							labels: {
								style: { fontSize: '14px', fontWeight: 500 },
							},
						},
						yaxis: [
							{
								title: { text: '' },
								labels: {
									style: { fontSize: '13px' },
									formatter: (value) => `${value}`,
								},
							},
						],
						grid: {
							strokeDashArray: 4,
							borderColor: '#ececec',
						},
					}}
					height={450}
				/>
			) : (
				<Empty description={intl.formatMessage({ id: 'trangchu.tonghop.cardcapphat.khongcodulieu' })} />
			)}
		</Card>
	);
};

export default CardThongKeCapPhatVanBang;
