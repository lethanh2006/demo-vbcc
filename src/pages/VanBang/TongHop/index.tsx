import MyDatePicker from '@/components/MyDatePicker';
import { getThongKeTong } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { AuditOutlined, BoldOutlined, CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useModel } from 'umi';
import '../../TrangChu/components/style.less';
import SelectSoVanBang from '../SoVanBang/components/Select';
import CardQuyetDinhTotNghiep from './CardQuyetDinhTotNghiep';
import ModalTongLuotTraCuu from './ModalTongTraCuu';

const TongHopVanBang = () => {
	const [data, setData] = useState<PhuLucVanBang.TTongHop>();
	const { setVisibleForm } = useModel('vbcc.phulucvanbang');
	const { record: recSoVanBang, danhSach: danhSachSo, setRecord: setSoVanBang } = useModel('vbcc.sovanbang');
	const [yearSelect, setYearSelect] = useState<any>(dayjs());
	const [loading, setLoading] = useState<boolean>(false);

	// const quanTri = !useCheckAccess('van-bang-chung-chi|quan-tri-vien');

	const fetchData = async () => {
		setLoading(true);
		await getThongKeTong(yearSelect ? dayjs(yearSelect).format('YYYY') : '', recSoVanBang?._id ?? '', false)
			.then((response) => {
				setData(response.data?.data);
			})
			.catch(console.log)
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchData();
	}, [yearSelect, recSoVanBang?._id]);

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Space>
						<MyDatePicker
							style={{ width: 150 }}
							value={yearSelect}
							pickerStyle='year'
							placeholder='Chọn năm hành chính'
							format='YYYY'
							onChange={(val) => {
								if (val) {
									setYearSelect(dayjs(val));
								} else {
									setYearSelect(null);
								}
							}}
							allowClear
						/>

						<SelectSoVanBang
							style={{ width: 250 }}
							allowClear
							value={recSoVanBang?._id}
							onChange={(val) => setSoVanBang(danhSachSo.find((i) => i._id === val))}
						/>
					</Space>
				</Col>

				<Col span={24} md={6} className='dashboard-card-with-icon'>
					<Card variant='borderless'>
						<AuditOutlined style={{ color: '#bf20df' }} />
						<div>
							<CountUp className='number' end={data?.tongSoQuyetDinh ?? 0} duration={1.5} separator='.' />
							<div className='text'>Quyết định</div>
						</div>
					</Card>
				</Col>

				<Col span={24} md={6} className='dashboard-card-with-icon'>
					<Card variant='borderless'>
						<CopyOutlined style={{ color: 'var(--color-primary)' }} />
						<div>
							<CountUp className='number' end={data?.tongSoPhuLuc ?? 0} duration={1.5} separator='.' />
							<div className='text'>Phụ lục văn bằng</div>
						</div>
					</Card>
				</Col>

				<Col span={24} md={6} className='dashboard-card-with-icon'>
					<Card variant='borderless'>
						<BoldOutlined style={{ color: '#0e6499' }} />
						<div>
							<CountUp className='number' end={data?.tongSoDaDuaLenBlockchain ?? 0} duration={1.5} separator='.' />
							<div className='text'>Đẩy lên blockchain</div>
						</div>
					</Card>
				</Col>

				<Col span={24} md={6} className='dashboard-card-with-icon'>
					<Card onClick={() => setVisibleForm(true)} style={{ cursor: 'pointer' }} variant='borderless'>
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
