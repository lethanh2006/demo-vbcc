import MyDatePicker from '@/components/MyDatePicker';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Col, Form, InputNumber, Modal, Row } from 'antd';
import { useEffect } from 'react';

interface ModalNhapThongTinPhoiBangProps {
	visible: boolean;
	onCancel: () => void;
	onOk: (values: any) => void;
	title: string;
	submiting?: boolean;
}

const ModalNhapThongTinPhoiBang = (props: ModalNhapThongTinPhoiBangProps) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (!props.visible) {
			resetFieldsForm(form);
		}
	}, [props.visible, form]);

	return (
		<Modal
			title={props.title}
			open={props.visible}
			onCancel={props.onCancel}
			onOk={() => form.submit()}
			confirmLoading={props.submiting}
			destroyOnClose
		>
			<Form	
				form={form}
				layout='vertical'
				onFinish={props.onOk}
				initialValues={{ ngayNhap: dayjs() }}
			>
				<Row gutter={[12, 0]}>
					<Col span={12}>
						<Form.Item
							label='Số bắt đầu'
							name='startNumber'
							rules={[{ required: true, message: 'Vui lòng nhập số bắt đầu' }]}
						>
							<InputNumber style={{ width: '100%' }} placeholder='VD: 1' min={0} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Số kết thúc'
							name='endNumber'
							dependencies={['startNumber']}
							rules={[
								{ required: true, message: 'Vui lòng nhập số kết thúc' },
								({ getFieldValue }: { getFieldValue: FormInstance['getFieldValue'] }) => ({
									validator(_: any, value: any) {
										const startNum = getFieldValue('startNumber');
										if (
											value === undefined ||
											value === null ||
											startNum === undefined ||
											startNum === null ||
											value >= startNum
										) {
											return Promise.resolve();
										}
										return Promise.reject(new Error('Số kết thúc phải lớn hơn hoặc bằng số bắt đầu'));
									},
								}),
							]}
						>
							<InputNumber style={{ width: '100%' }} placeholder='VD: 100' min={0} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Ngày nhập' rules={[{ required: true }]} name='ngayNhap'>
							<MyDatePicker defaultValue={dayjs()} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default ModalNhapThongTinPhoiBang;
