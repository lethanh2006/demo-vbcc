import MyDatePicker from '@/components/MyDatePicker';
import SelectMucDichTraCuuPublic from '@/pages/DanhMuc/MucDichTraCuuPhuLuc/components/SelectPublic';
import { primaryColor } from '@/services/base/constant';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row, Typography } from 'antd';
import { useModel } from 'umi';
import Footer from './Footer';
import Header from './Header';
import KetQuaVanBang from './KetQua';
import './style.less';

const { Title } = Typography;

const TraCuuVanBangPublic = () => {
	const [form] = Form.useForm();
	const { formSubmiting, traCuuPhuLucVanBanPublicModel } = useModel('vbcc.phulucvanbang');

	const onFinish = async (values: any) => {
		const filledFields = Object.values(values).filter((value) => value).length;
		if (filledFields < 2) {
			message.error('Vui lòng nhập ít nhất 2 thông tin để tra cứu');
			return;
		}
		traCuuPhuLucVanBanPublicModel(values);
	};

	return (
		<div className='tra-cuu-wrapper'>
			<Header subTitle='TRA CỨU VĂN BẰNG CHỨNG CHỈ, CHỨNG NHẬN' />
			<div className='tra-cuu-body'>
				<div className='tra-cuu-container'>
					<Card
						title={
							<Title level={3} className='tra-cuu-title' style={{ color: primaryColor }}>
								TRA CỨU THÔNG TIN VĂN BẰNG
							</Title>
						}
						bordered={false}
						headStyle={{ borderBottom: 'none', background: '#f0f6ff' }}
						className='tra-cuu-card'
					>
						<Form onFinish={onFinish} layout='vertical' form={form}>
							<Row gutter={[24, 24]}>
								<Col xs={24} md={8}>
									<Form.Item name='mucDichTraCuuId' label={<strong>Mục đích tra cứu</strong>}>
										<SelectMucDichTraCuuPublic size='large' />
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
									<Form.Item name='hoTen' label={<strong>Họ tên</strong>}>
										<Input placeholder='Nhập họ tên' size='large' />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item name='ngaySinh' label={<strong>Ngày sinh</strong>}>
										<MyDatePicker style={{ width: '100%' }} size='large' />
									</Form.Item>
								</Col>
								<Col span={24} className='tra-cuu-submit'>
									<Button
										icon={<SearchOutlined />}
										type='primary'
										htmlType='submit'
										loading={formSubmiting}
										size='large'
										className='tra-cuu-button'
										onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
										onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
										style={{ background: primaryColor }}
									>
										TRA CỨU
									</Button>
								</Col>
							</Row>
						</Form>
					</Card>

					<div className='tra-cuu-ket-qua'>
						<div className='tra-cuu-ket-qua-header'>
							<Title level={4} className='tra-cuu-ket-qua-title' style={{ color: primaryColor }}>
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
