import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { colorTrangThaiXacMinh, ETrangThaiXacMinh, fieldTrangThaiXacMinh } from '@/services/VanBang/constant';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatXacMinhVanBang = () => {
	const { thongKeXacMinhVanBangModel, loading, thongKe } = useModel('vbcc.xacminhvanbang');

	useEffect(() => {
		thongKeXacMinhVanBangModel();
	}, []);

	const statisticsData: StatisticsItem[] = [
		...Object.values(ETrangThaiXacMinh).map((item) => ({
			title: `${item}`,
			value: thongKe?.[fieldTrangThaiXacMinh[item]] ?? '--',
			valueColor: colorTrangThaiXacMinh[item],
		})),
	];

	return (
		<Spin spinning={loading}>
			<StatisticsCard
				data={statisticsData}
				hideCard={true}
				colSpan={{ xs: 12, md: 8 }}
				rowGutter={8}
				containerStyle={{ marginBottom: 12 }}
				title=''
			/>
		</Spin>
	);
};

export default StatXacMinhVanBang;
