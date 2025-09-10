import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, InputNumber, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectSoVanBang from '../../SoVanBang/components/Select';

const ModalSinhSoVaoSo = (props: { visible: boolean; setVisibe: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visible, setVisibe, getData } = props;
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { sinhSoVaoSoModel, formSubmiting } = useModel('vbcc.phulucvanbang');
	const { danhSach: dsSoVanBang } = useModel('vbcc.sovanbang');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				soVaoSoHienTai: recQuyetDinh?.soVanBang?.soVaoSoHienTai,
				idSoVanBang: recQuyetDinh?.soVanBang?._id,
				sinhLaiToanBo: false,
				sortTheoHoTen: false,
				sortTheoMaSinhVien: false,
			});
		}
	}, [visible]);

	const onFinish = async (values: any) => {
		if (recQuyetDinh?._id) {
			sinhSoVaoSoModel(recQuyetDinh?._id, values, getData)
				.then(() => setVisibe(false))
				.catch((err) => console.log(err));
		}
	};

	return (
		<Modal title='Sinh số vào sổ quyết định' open={visible} onCancel={() => setVisibe(false)} footer={null} width={800}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item label='Sổ văn bằng' name='idSoVanBang'>
							<SelectSoVanBang
								onChange={(val) => {
									const index = dsSoVanBang?.find((item) => item?._id === val);
									form.setFieldsValue({
										soVaoSoHienTai: index?.soVaoSoHienTai,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Số vào sổ hiện tại' name='soVaoSoHienTai'>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập số vào sổ' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='sinhLaiToanBo'
							valuePropName='checked'
							extra='Nếu chọn, toàn bộ số vào sổ sẽ được sinh lại từ đầu, có thể thay đổi các số đã cấp trước đó.'
						>
							<Checkbox>Sinh lại toàn bộ</Checkbox>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='sortTheoHoTen' valuePropName='checked'>
							<Checkbox>Sắp xếp theo họ tên</Checkbox>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='sortTheoMaSinhVien' valuePropName='checked'>
							<Checkbox>Sắp xếp theo mã sinh viên</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisibe(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalSinhSoVaoSo;
