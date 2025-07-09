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
import SelectSoVanBang from '../SoVanBang/components/Select';
import ModalTongLuotTraCuu from './ModalTongTraCuu';

const TongHopVanBang = () => {
	const [data, setData] = useState<PhuLucVanBang.TTongHop>();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record: recSoVanBang } = useModel('vbcc.sovanbang');
	const { visibleForm, setVisibleForm } = useModel('vbcc.phulucvanbang');
	const [loading, setLoading] = useState<boolean>(false);

	const fetchData = async () => {
		setLoading(true);
		await getThongKeTong(recHocKy?.ma ?? '', recSoVanBang?._id ?? '')
			.then((response) => setData(response.data?.data))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchData();
	}, [recHocKy?.ma, recSoVanBang?._id]);

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={6} md={6}>
					<FilterHocKy style={{ width: '100%' }} allowClear />
				</Col>
				<Col xs={24} sm={18} md={18}>
					<SelectSoVanBang style={{ width: 280 }} allowClear value={recSoVanBang?._id} />
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
					<Card onClick={() => setVisibleForm(true)} style={{ cursor: 'pointer' }}>
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
			<ModalTongLuotTraCuu maHocKy={recHocKy?.ma} idSoVanBang={recSoVanBang?._id} ten={recSoVanBang} />
		</Spin>
	);
};

export default TongHopVanBang;
