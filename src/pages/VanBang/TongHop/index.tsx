import MyDatePicker from '@/components/MyDatePicker';
import SelectHinhThucDaoTao from '@/pages/DanhMuc/HinhThucDaoTao/components/Select';
import SelectNganhDaoTao from '@/pages/DanhMuc/NganhDaoTao/components/Select';
import SelectTrinhDoDaoTao from '@/pages/DanhMuc/TrinhDoTaoTao/components/Select';
import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { getThongKeCapPhatVangBang, getThongKeTong, getThongKeXacMinhVanBang } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import { Card, Col, Image, Row, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useIntl, useModel } from 'umi';
import SelectSoVanBang from '../SoVanBang/components/Select';
import CardThongKeCapPhatVanBang from './CardCapPhatVanBang';
import CardTrinhDoDaoTao from './CardTrinhDoDaoTao';
import CardThongKeXacMinhVanBang from './CardXacMinh';
import './style.less';

const TongHopVanBang = () => {
	const intl = useIntl();
	const { record: recSoVanBang, danhSach: danhSachSo, setRecord: setSoVanBang } = useModel('vbcc.sovanbang');
	const { record: recHinhThuc, danhSach: dsHinhThuc, setRecord: setRecHinhThuc } = useModel('danhmuc.hinhthucdaotao');
	const { record: recTrinhDo, danhSach: dsTrinhDo, setRecord: setRecTrinhDo } = useModel('danhmuc.trinhdodaotao');
	const { record: recNganh, danhSach: dsNganh, setRecord: setRecNganh } = useModel('danhmuc.nganhdaotao');

	const [yearSelect, setYearSelect] = useState<any>(dayjs());
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingNam, setLoadingNam] = useState<boolean>(false);
	const [loadingXacMinh, setLoadingXacMinh] = useState<boolean>(false);
	const [data, setData] = useState<PhuLucVanBang.TTongHop>();
	const [dataNam, setDataNam] = useState<PhuLucVanBang.TTongHopNam[]>();
	const [dataXacMinh, setDataXacMinh] = useState<XacMinhVanBang.IThongKeXacMinhVanBangNam[]>();

	const getThongKeTongModel = async () => {
		setLoading(true);
		await getThongKeTong(dayjs(yearSelect).format('YYYY'), {
			idSoVanBang: recSoVanBang?._id,
			trinhDoDaoTao: recTrinhDo?.ten,
			hinhThucDaoTao: recHinhThuc?.ten,
			nganhDaoTao: recNganh?.ma,
		})
			.then((response) => {
				setData(response.data?.data);
			})
			.catch(console.log)
			.finally(() => setLoading(false));
	};

	const getThongKeCapPhatVangBangModel = async () => {
		setLoadingNam(true);
		await getThongKeCapPhatVangBang(dayjs(yearSelect).format('YYYY'), {
			idSoVanBang: recSoVanBang?._id,
		})
			.then((response) => {
				setDataNam(response.data?.data);
			})
			.catch(console.log)
			.finally(() => setLoadingNam(false));
	};

	const getThongKeXacMinhModel = async () => {
		setLoadingXacMinh(true);
		await getThongKeXacMinhVanBang(dayjs(yearSelect).format('YYYY'), {
			idSoVanBang: recSoVanBang?._id,
		})
			.then((response) => {
				setDataXacMinh(response.data?.data);
			})
			.catch(console.log)
			.finally(() => setLoadingXacMinh(false));
	};

	useEffect(() => {
		if (yearSelect) {
			getThongKeTongModel();
		}
	}, [yearSelect, recSoVanBang?._id, recHinhThuc, recTrinhDo, recNganh]);

	useEffect(() => {
		if (yearSelect) {
			getThongKeCapPhatVangBangModel();
			getThongKeXacMinhModel();
		}
	}, [yearSelect, recSoVanBang?._id]);

	const getSoLuong = (phase: string) => dataXacMinh?.find((i) => i?.phaseXuLy === phase)?.soLuong ?? 0;

	const yeuCauXacMinh = getSoLuong(EPhaseXacMinh.YEU_CAU);
	const xacMinhVanBang = getSoLuong(EPhaseXacMinh.XAC_MINH);
	const congVanPhucDap = getSoLuong(EPhaseXacMinh.PHUC_DAP);
	const traKetQua = getSoLuong(EPhaseXacMinh.KET_QUA);
	const hoanThanh = getSoLuong(EPhaseXacMinh.HOAN_THANH);

	const totalTiepNhan = yeuCauXacMinh + xacMinhVanBang + congVanPhucDap + traKetQua + hoanThanh;

	return (
		<Spin spinning={loading || loadingNam || loadingXacMinh}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Space wrap>
						<MyDatePicker
							style={{ width: 150 }}
							value={yearSelect}
							pickerStyle='year'
							placeholder={intl.formatMessage({ id: 'trangchu.tonghop.chonnamhanhchinh' })}
							format='YYYY'
							onChange={(val) => {
								if (val) {
									setYearSelect(dayjs(val));
								} else {
									setYearSelect(null);
								}
							}}
						/>
						<SelectSoVanBang
							style={{ width: 200 }}
							allowClear
							value={recSoVanBang?._id}
							onChange={(val) => setSoVanBang(danhSachSo.find((i) => i._id === val))}
						/>
						<SelectTrinhDoDaoTao
							style={{ width: 200 }}
							allowClear
							value={recTrinhDo?.ma}
							onChange={(val) => setRecTrinhDo(dsTrinhDo.find((item) => item?.ma === val))}
							selectMa
						/>
						<SelectHinhThucDaoTao
							style={{ width: 200 }}
							allowClear
							value={recHinhThuc?.ma}
							onChange={(val) => setRecHinhThuc(dsHinhThuc.find((item) => item?.ma === val))}
							selectMa
						/>
						<SelectNganhDaoTao
							style={{ width: 200 }}
							value={recNganh?.ma}
							onChange={(val) => setRecNganh(dsNganh.find((item) => item?.ma === val))}
							allowClear
							selectMa
						/>
					</Space>
				</Col>

				<Col span={24} md={6} className='dashboard-training-card'>
					<Card variant='borderless' style={{ background: '#FFF6E5' }}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={16}>
								<div className='big-number'>
									<Image src={'/images/thongKe/icon_quyetdinh.png'} />
								</div>
								<div className='title'>{intl.formatMessage({ id: 'trangchu.tonghop.quyetdinh' })}</div>
							</Col>
							<Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
								<div className='right number-count' style={{ color: '#FFAF0B' }}>
									<CountUp
										className='number'
										end={data?.tongSoQuyetDinh ?? 0}
										duration={1.5}
										separator='.'
										formattingFn={(value) => {
											return value < 10 ? `0${value}` : value.toString();
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24} md={6} className='dashboard-training-card'>
					<Card variant='borderless' style={{ background: '#DDFFFD' }}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={16}>
								<div className='big-number'>
									<Image src={'/images/thongKe/icon_phuluc.png'} />
								</div>
								<div className='title'>{intl.formatMessage({ id: 'trangchu.tonghop.vanbang' })}</div>
							</Col>
							<Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
								<div className='right number-count' style={{ color: '#15AEB4' }}>
									<CountUp
										className='number'
										end={data?.tongSoPhuLuc ?? 0}
										duration={1.5}
										separator='.'
										formattingFn={(value) => {
											return value < 10 ? `0${value}` : value.toString();
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24} md={6} className='dashboard-training-card'>
					<Card variant='borderless' style={{ background: '#FFF2F0' }}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={16}>
								<div className='big-number'>
									<Image src={'/images/thongKe/icon_tracuu.png'} />
								</div>
								<div className='title'>{intl.formatMessage({ id: 'trangchu.tonghop.tongluottracuu' })}</div>
							</Col>
							<Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
								<div className='right number-count' style={{ color: '#DA2128' }}>
									<CountUp
										className='number'
										end={data?.soLuotTraCuu ?? 0}
										duration={1.5}
										separator='.'
										formattingFn={(value) => {
											return value < 10 ? `0${value}` : value.toString();
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24} md={6} className='dashboard-training-card'>
					<Card variant='borderless' style={{ background: '#F8EEFF' }}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={16}>
								<div className='big-number'>
									<Image src={'/images/thongKe/icon_phatbang.png'} />
								</div>
								<div className='title'>{intl.formatMessage({ id: 'trangchu.tonghop.sovanbangdaphat' })}</div>
							</Col>
							<Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
								<div className='right number-count' style={{ color: '#9B29FF' }}>
									<CountUp
										className='number'
										end={data?.daCapBang ?? 0}
										duration={1.5}
										separator='.'
										formattingFn={(value) => {
											return value < 10 ? `0${value}` : value.toString();
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24} md={6} className='dashboard-training-card'>
					<Card variant='borderless' style={{ background: '#FFF6E5' }}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={16}>
								<div className='big-number'>
									<Image src={'/images/thongKe/icon_xacminh.png'} />
								</div>
								<div className='title'>{intl.formatMessage({ id: 'trangchu.tonghop.yeucauxacminh' })}</div>
							</Col>
							<Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
								<div className='right number-count' style={{ color: '#FFAF0B' }}>
									<CountUp
										className='number'
										end={totalTiepNhan}
										duration={1.5}
										separator='.'
										formattingFn={(value) => {
											return value < 10 ? `0${value}` : value.toString();
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24} md={6} className='dashboard-training-card'>
					<Card variant='borderless' style={{ background: '#FFF2F0' }}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={16}>
								<div className='big-number'>
									<Image src={'/images/thongKe/icon_thuhoi.png'} />
								</div>
								<div className='title'>{intl.formatMessage({ id: 'trangchu.tonghop.dexuatthuhoi' })}</div>
							</Col>
							<Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
								<div className='right number-count' style={{ color: '#DA2128' }}>
									<CountUp
										className='number'
										end={data?.soLuongThuHoi ?? 0}
										duration={1.5}
										separator='.'
										formattingFn={(value) => {
											return value < 10 ? `0${value}` : value.toString();
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24} md={6} className='dashboard-training-card'>
					<Card variant='borderless' style={{ background: '#E6F4FF' }}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={16}>
								<div className='big-number'>
									<Image src={'/images/thongKe/icon_chinhsua.png'} />
								</div>
								<div className='title'>{intl.formatMessage({ id: 'trangchu.tonghop.dexuatchinhsua' })}</div>
							</Col>
							<Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
								<div className='right number-count' style={{ color: '#0047FF' }}>
									<CountUp
										className='number'
										end={data?.soLuongCapNhat ?? 0}
										duration={1.5}
										separator='.'
										formattingFn={(value) => {
											return value < 10 ? `0${value}` : value.toString();
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24} md={6} className='dashboard-training-card'>
					<Card variant='borderless' style={{ background: '#F3F6F9' }}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={16}>
								<div className='big-number'>
									<Image src={'/images/thongKe/icon_caplai.png'} />
								</div>
								<div className='title'>{intl.formatMessage({ id: 'trangchu.tonghop.dexuatcaplai' })}</div>
							</Col>
							<Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
								<div className='right number-count' style={{ color: '#343C61' }}>
									<CountUp
										className='number'
										end={data?.soLuongCapLai ?? 0}
										duration={1.5}
										separator='.'
										formattingFn={(value) => {
											return value < 10 ? `0${value}` : value.toString();
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24}>
					<Row gutter={[12, 12]}>
						<Col span={24} md={18}>
							<CardTrinhDoDaoTao chartData={data?.soPhuLucTheoTrinhDo ?? []} />
						</Col>
						<Col span={24} md={6}>
							<CardThongKeXacMinhVanBang chartData={dataXacMinh} />
						</Col>
					</Row>
				</Col>

				<Col span={24}>
					<CardThongKeCapPhatVanBang data={dataNam ?? []} />
				</Col>
			</Row>
		</Spin>
	);
};

export default TongHopVanBang;
