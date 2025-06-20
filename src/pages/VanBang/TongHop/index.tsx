import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { getThongKeTong } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { AuditOutlined, BoldOutlined, CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useModel } from 'umi';
import '../../TrangChu/components/style.less';
import CardQuyetDinhTotNghiep from './CardQuyetDinhTotNghiep';

const TongHopVanBang = () => {
	const [data, setData] = useState<PhuLucVanBang.TTongHop>();
	const { record: recHocKy } = useModel('daotao.hocky');
	const [loading, setLoading] = useState<boolean>(false);

	const fetchData = async () => {
		setLoading(true);
		await getThongKeTong(recHocKy?.ma ?? '')
			.then((response) => setData(response.data?.data))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchData();
	}, [recHocKy?.ma]);

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<FilterHocKy style={{ width: 300 }} allowClear />
				</Col>
				<Col span={24} md={6} className='dashboard-card-with-icon'>
					<Card>
						<AuditOutlined style={{ color: '#bf20df' }} />
						<div>
							<CountUp className='number' end={data?.tongSoQuyetDinh ?? 0} duration={1.5} separator='.' />
							<div className='text'>Quyết định</div>
						</div>
					</Card>
				</Col>

				<Col span={24} md={6} className='dashboard-card-with-icon'>
					<Card>
						<CopyOutlined style={{ color: 'var(--primary-color)' }} />
						<div>
							<CountUp className='number' end={data?.tongSoPhuLuc ?? 0} duration={1.5} separator='.' />
							<div className='text'>Phụ lục văn bằng</div>
						</div>
					</Card>
				</Col>

				<Col span={24} md={6} className='dashboard-card-with-icon'>
					<Card>
						<BoldOutlined style={{ color: '#0e6499' }} />
						<div>
							<CountUp className='number' end={data?.tongSoDaDuaLenBlockchain ?? 0} duration={1.5} separator='.' />
							<div className='text'>Đẩy lên blockchain</div>
						</div>
					</Card>
				</Col>

				<Col span={24} md={6} className='dashboard-card-with-icon'>
					<Card>
						<SearchOutlined style={{ color: '#15c58a' }} />
						<div>
							<CountUp className='number' end={data?.soLuotTraCuu ?? 0} duration={1.5} separator='.' />
							<div className='text'>Tổng lượt tra cứu</div>
						</div>
					</Card>
				</Col>

				<Col span={24}>
					<CardQuyetDinhTotNghiep chartData={data?.soPhuLucTheoDotTN ?? []} />
				</Col>
			</Row>
		</Spin>
	);
};

export default TongHopVanBang;
