import { ShowAllVanBang } from '@/hooks/useCheckAccess';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { getThongKeTong } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { AuditOutlined, BoldOutlined, CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useModel } from 'umi';
import '../../TrangChu/components/style.less';
import SelectSoVanBang from '../SoVanBang/components/Select';
import CardQuyetDinhTotNghiep from './CardQuyetDinhTotNghiep';
import ModalTongLuotTraCuu from './ModalTongTraCuu';

const TongHopVanBang = () => {
	const [data, setData] = useState<PhuLucVanBang.TTongHop>();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record: recSoVanBang, danhSach: danhSachSo, setRecord: setSoVanBang } = useModel('vbcc.sovanbang');
	const { setVisibleForm } = useModel('vbcc.phulucvanbang');
	const [loading, setLoading] = useState<boolean>(false);
	const showAllVanBang = ShowAllVanBang();

	const fetchData = async () => {
		setLoading(true);
		await getThongKeTong(recHocKy?.ma ?? '', recSoVanBang?._id ?? '', !showAllVanBang)
			.then((response) => {
				setData(response.data?.data);
			})
			.catch(console.log)
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchData();
	}, [recHocKy?.ma, recSoVanBang?._id]);

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<FilterHocKy style={{ width: '100%' }} allowClear>
						<SelectSoVanBang
							style={{ width: 250 }}
							allowClear
							value={recSoVanBang?._id}
							onChange={(val) => setSoVanBang(danhSachSo.find((i) => i._id === val))}
						/>
					</FilterHocKy>
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

			<ModalTongLuotTraCuu />
		</Spin>
	);
};

export default TongHopVanBang;
