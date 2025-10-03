import MyDatePicker from '@/components/MyDatePicker';
import SelectMucDichTraCuuPublic from '@/pages/DanhMuc/MucDichTraCuuPhuLuc/components/SelectPublic';
import rules from '@/utils/rules';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import Footer from './Footer';
import Header from './Header';
import KetQuaVanBang from './KetQua';

const { Title } = Typography;

const TraCuuVanBangPublic = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { formSubmiting, traCuuPhuLucVanBanPublicModel } = useModel('vbcc.phulucvanbang');

	useEffect(() => {
		document.title = `${intl.formatMessage({ id: 'menu.TraCuuVanBangPublic' })} - ` + APP_CONFIG_TITLE_VBCC;
	}, []);

	const onFinish = async (values: any) => {
		const filledFields = Object.values(values).filter((value) => value).length;
		if (filledFields < 2) {
			message.error('Vui lòng nhập ít nhất 2 thông tin để tra cứu');
			return;
		}

		traCuuPhuLucVanBanPublicModel(values);
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Header subTitle={APP_CONFIG_TITLE_VBCC} />

			<div
				style={{
					background: 'linear-gradient(135deg, #f5f7fa 0%, #e4f0ff 100%)',
					flex: 1,
					padding: '40px 0',
				}}
			>
				<div
					style={{
						maxWidth: 1200,
						margin: '0 auto',
						padding: '0 10px',
					}}
				>
					<Card
						title={
							<Title
								level={3}
								style={{
									color: '#1a4a8d',
									textAlign: 'center',
									marginBottom: 0,
									letterSpacing: 1,
								}}
							>
								TRA CỨU THÔNG TIN VĂN BẰNG
							</Title>
						}
						bordered={false}
						headStyle={{ borderBottom: 'none', background: '#f0f6ff' }}
						style={{
							boxShadow: '0 6px 24px rgba(26, 74, 141, 0.08)',
							border: '1px solid #e0eaff',
							background: '#fff',
						}}
					>
						<Form onFinish={onFinish} layout={'vertical'} form={form}>
							<Row gutter={[24, 24]}>
								<Col xs={24} md={8}>
									<Form.Item
										name='mucDichTraCuuId'
										label={<strong>Mục đích tra cứu</strong>}
										rules={[...rules.required]}
									>
										<SelectMucDichTraCuuPublic hasDefault size='large' />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item name='soVaoSoBang' label={<strong>Số vào sổ</strong>}>
										<Input placeholder='Nhập số vào sổ' size='large' />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item name='soHieuVanBang' label={<strong>Số hiệu văn bằng</strong>}>
										<Input placeholder='Nhập số hiệu văn bằng' size='large' />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item name='maSinhVien' label={<strong>Mã sinh viên</strong>}>
										<Input placeholder='Nhập mã sinh viên' size='large' />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item name='hoTen' label={<strong>Họ tên</strong>} rules={[...rules.required]}>
										<Input placeholder='Nhập họ tên' size='large' />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item name='ngaySinh' label={<strong>Ngày sinh</strong>} rules={[...rules.required]}>
										<MyDatePicker style={{ width: '100%' }} size='large' />
									</Form.Item>
								</Col>
								<Col span={24} style={{ textAlign: 'center', marginTop: '10px' }}>
									<Button
										icon={<SearchOutlined />}
										type='primary'
										htmlType='submit'
										loading={formSubmiting}
										size='large'
										style={{
											width: '240px',
											height: '50px',
											fontSize: '18px',
											fontWeight: '600',
											background: 'linear-gradient(90deg, #1a4a8d, #2a6fd6)',
											border: 'none',
											boxShadow: '0 4px 12px rgba(26, 74, 141, 0.3)',
											transition: 'all 0.3s',
										}}
										onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
										onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
									>
										TRA CỨU THÔNG TIN
									</Button>
								</Col>
							</Row>
						</Form>
					</Card>

					<div
						style={{
							marginTop: '32px',
							borderRadius: 8,
							background: '#fff',
							boxShadow: '0 10px 30px rgba(26, 74, 141, 0.1)',
							overflow: 'hidden',
							border: '1px solid #e0eaff',
						}}
					>
						<div
							style={{
								background: '#f9fbff',
								padding: '16px 24px',
								borderBottom: '1px solid #e0eaff',
							}}
						>
							<Title
								level={4}
								style={{
									color: '#1a4a8d',
									marginBottom: 0,
									fontWeight: 600,
								}}
							>
								KẾT QUẢ TRA CỨU
							</Title>
						</div>
						<KetQuaVanBang />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default TraCuuVanBangPublic;
