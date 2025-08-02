import PreviewFile from '@/components/PreviewFile';
import { Col, Descriptions, Divider, Empty, Row, Table } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Footer from './Footer';
import Header from './Header';
import './style.less';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';

const ChiTietTraCuuVanBang = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const { getByIdModel, record } = useModel('vbcc.phulucvanbang');

	const getData = () => {
		if (id) getByIdModel(`public/chi-tiet-phu-luc?idVanBang=${id}`);
	};

	useEffect(() => {
		getData();
	}, [id]);

	const normalElements = record?.templateData?.filter((item) => item.type !== ELoaiDuLieuBieuMau.Table) ?? [];
	const tableElements = record?.templateData?.filter((item) => item.type === ELoaiDuLieuBieuMau.Table) ?? [];

	return (
		<>
			<Header subTitle={APP_CONFIG_TITLE_VBCC} />
			<div style={{ maxWidth: 1200, margin: 'auto', paddingTop: 30, paddingBottom: 30 }}>
				<div style={{ textAlign: 'center', fontSize: 22, marginBottom: 36 }}>
					<b>Chi tiết thông tin văn bằng</b>
				</div>

				{record?._id ? (
					<Row gutter={[12, 12]}>
						<Col span={24}>
							<div className='vbcc-verified'>
								<img src='/images/success.svg' alt='' width={32} height={32} />
								<span>Thông tin đã được xác thực!</span>
							</div>
						</Col>
						<Col span={24}>
							<Divider>Thông tin phụ lục</Divider>
							<Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered>
								<Descriptions.Item label='Số vào sổ'>{record?.soVaoSoBang ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Số hiệu văn bằng'>{record?.soHieuVanBang ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Họ tên'>{record?.hoTen ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Ngày sinh'>
									{record?.ngaySinh ? moment(record?.ngaySinh).format('DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Mã sinh viên'>{record?.maSinhVien ?? '--'}</Descriptions.Item>
								{/* <Descriptions.Item label='Tập tin'>
							{record?.urlIpfs ? (
								<a href={record?.urlIpfs} target='_blank' rel='noreferrer'>
									Xem chi tiết
								</a>
							) : (
								<i>(Chưa upload)</i>
							)}
						</Descriptions.Item> */}
							</Descriptions>
						</Col>

						<Col span={24}>
							<Divider>Thông tin quyết định</Divider>
							<Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered>
								<Descriptions.Item label='Số quyết định'>{record?.quyetDinh?.soQuyetDinh ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Ngày ban hành'>
									{record?.quyetDinh?.ngayBanHanh ? moment(record?.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Nội dung trích yếu' span={2}>
									{record?.quyetDinh?.noiDung ?? '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Tập tin đính kèm' span={2}>
									{record?.quyetDinh?.url ? (
										<a href={record.quyetDinh?.url} target='_blank' rel='noreferrer'>
											Xem chi tiết
										</a>
									) : (
										'--'
									)}
								</Descriptions.Item>
							</Descriptions>
						</Col>

						<Col span={24}>
							<Divider>Chi tiết phụ lục</Divider>
							<Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered>
								{normalElements.map((item) => (
									<Descriptions.Item key={item?.headerName} label={item?.headerName}>
										{item?.value
											? item.type === ELoaiDuLieuBieuMau.Date
												? moment(item.value).format('DD/MM/YYYY')
												: item.value
											: null}
									</Descriptions.Item>
								))}
							</Descriptions>

							{tableElements.map((tableElement) => {
								const columns =
									tableElement.cot?.map((cot) => ({
										title: cot.headerName,
										dataIndex: cot.ma,
										key: cot.ma,
									})) ?? [];

								const dataSource = Array.isArray(tableElement.value) ? tableElement.value : [];

								return (
									<div key={tableElement.headerName} style={{ marginTop: 24 }}>
										<Divider>{tableElement.headerName}</Divider>
										<Table
											columns={columns}
											dataSource={dataSource}
											bordered
											pagination={false}
											rowKey={(r, i) => `${r.ma}-${i}`}
										/>
									</div>
								);
							})}
						</Col>

						{record?.signature && (
							<Col span={24}>
								<div className='vbcc-signature'>
									<img src='/images/tick.svg' alt='' width={24} height={24} />
									<span style={{ fontWeight: 600 }}>Thông tin văn bằng đã được ký số:</span>
									<a
										href={`https://jwt.io/#debugger-io?token=${record?.signature}`}
										target='_blank'
										className='text-primary'
										rel='noreferrer'
									>
										Kiểm tra chữ ký số (JWS)
									</a>
								</div>
							</Col>
						)}

						{record?.urlIpfs && (
							<Col span={24}>
								<div className='vbcc-urlIpfs'>
									<h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>File văn bằng</h4>
									<PreviewFile file={record?.urlIpfs} />
								</div>
							</Col>
						)}
					</Row>
				) : (
					<Empty description='Không có thông tin sinh viên' style={{ marginBottom: 32, marginTop: 32 }} />
				)}
			</div>
			<Footer />
		</>
	);
};

export default ChiTietTraCuuVanBang;
