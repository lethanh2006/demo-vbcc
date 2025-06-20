import MyDatePicker from '@/components/MyDatePicker';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import { useModel } from 'umi';
import Header from './Header';
import KetQuaVanBang from './KetQua';

const TraCuuVanBangPublic = () => {
	const [form] = Form.useForm();
	const { formSubmiting, traCuuPhuLucVanBanModel } = useModel('vbcc.phulucvanbang');

	const onFinish = async (values: any) => {
		const filledFields = Object.values(values).filter((value) => value).length;
		if (filledFields < 2) {
			message.error('Vui lòng chọn ít nhất 2 trường');
			return;
		}

		traCuuPhuLucVanBanModel(values);
	};

	return (
		<>
			<Header subTitle='Cổng xác thực thông tin văn bằng' />
			<div style={{ maxWidth: 1200, margin: 'auto', paddingTop: 30, paddingBottom: 30 }}>
				<div style={{ textAlign: 'center', fontSize: 22, marginBottom: 12 }}>
					<b>Tra cứu thông tin văn bằng</b>
				</div>

				<Card title='Thông tin tra cứu'>
					<Form onFinish={onFinish} layout={'vertical'} form={form}>
						<Row gutter={[12, 12]}>
							<Col span={24} md={12}>
								<Form.Item name='soVaoSoBang' label='Số vào sổ'>
									<Input placeholder='Nhập mã sinh viên' />
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name='soHieuVanBang' label='Số hiệu văn bằng'>
									<Input placeholder='Nhập mã sinh viên' />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='maSinhVien' label='Mã sinh viên'>
									<Input placeholder='Nhập mã sinh viên' />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='hoTen' label='Họ tên'>
									<Input placeholder='Nhập họ tên' />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='ngaySinh' label='Ngày sinh'>
									<MyDatePicker />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Button icon={<SearchOutlined />} type='primary' htmlType='submit' loading={formSubmiting}>
									Tra cứu
								</Button>
							</Col>
						</Row>
					</Form>
				</Card>

				<div style={{ marginTop: 12 }}>
					<KetQuaVanBang />
				</div>
			</div>
		</>
	);
};

export default TraCuuVanBangPublic;
