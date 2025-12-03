import { ETrangThaiYeuCauVanBang } from '@/services/VanBang/LichSuVanBang/constant';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useModel } from 'umi';

const ModalXuLyPhuLuc = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	title: string;
	trangThai: ETrangThaiYeuCauVanBang;
	getData?: () => void;
}) => {
	const { visible, setVisible, title, trangThai, getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, xuLyYauCauVanBangModel } = useModel('vbcc.lichsuvanbang');

	const onFinish = async (values: any) => {
		xuLyYauCauVanBangModel(
			record?._id ?? '',
			{
				trangThai: trangThai,
				thoiGianXacNhan: dayjs(),
				ghiChu: values.ghiChu,
			},
			getData,
		);
	};

	return (
		<Modal open={visible} onCancel={() => setVisible(false)} title={title} footer={null} width={600}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div
					style={{ fontSize: 48 }}
					className={trangThai === ETrangThaiYeuCauVanBang.DA_DUYET ? 'text-success' : 'text-warning'}
				>
					{trangThai === ETrangThaiYeuCauVanBang.DA_DUYET ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
				</div>
				<div>Xác nhận {trangThai} xử lý thông tin văn bằng?</div>
			</div>

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='ghiChu' label='Ghi chú'>
							<Input placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXuLyPhuLuc;
