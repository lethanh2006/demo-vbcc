import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { inputFormat } from '@/utils/utils';
import { Col, Row, Spin, Typography } from 'antd';
import { useIntl, useModel } from 'umi';

const { Title } = Typography;

const StatQuyetDinhTotNghiep = () => {
	const intl = useIntl();
	const { loadingThongKe, dataThongKe } = useModel('vbcc.quyetdinhtotnghiep');

	const mapColor: Record<string, string> = {
		'Hoàn thành': '#52c41a',
		'Chính thức': '#1890ff',
		'Trình dự thảo': '#faad14',
		'Dự thảo': '#ff4d4f',
	};

	const statisticsData: StatisticsItem[] =
		dataThongKe?.map((item) => {
			const color = mapColor[item.trangThai] || '#1890ff';

			return {
				title: item.trangThai,
				value: inputFormat(Number(item?.soLuongQuyetDinh ?? 0)),
				valueColor: color,
				borderColor: color,
			};
		}) || [];

	const statisticsDataSLVB: StatisticsItem[] =
		dataThongKe?.map((item) => {
			const color = mapColor[item.trangThai] || '#1890ff';

			return {
				title: item.trangThai,
				value: inputFormat(Number(item?.soLuongVanBang ?? 0)),
				valueColor: color,
				borderColor: color,
			};
		}) || [];

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]}>
				<Col span={24} md={12}>
					<Title level={5}>{intl.formatMessage({ id: 'qdtotnghiep.stat.quyetdinh' })}</Title>
					<StatisticsCard data={statisticsData} colSpan={{ xs: 24, sm: 12, md: 12 }} rowGutter={8} hideCard title='' />
				</Col>
				<Col span={24} md={12}>
					<Title level={5}>{intl.formatMessage({ id: 'qdtotnghiep.stat.soluongvanbang' })}</Title>
					<StatisticsCard
						data={statisticsDataSLVB}
						colSpan={{ xs: 24, sm: 12, md: 12 }}
						rowGutter={8}
						hideCard
						title=''
					/>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatQuyetDinhTotNghiep;
