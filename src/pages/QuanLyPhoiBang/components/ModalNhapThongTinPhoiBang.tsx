import MyDatePicker from '@/components/MyDatePicker';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Button, Col, Form, InputNumber, Modal, Row, Input } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

interface ModalNhapThongTinPhoiBangProps {
	visible: boolean;
	onCancel: () => void;
	onOk: (values: any) => void;
	title: string;
	submiting?: boolean;
	type?: 'CAP_MOI' | 'HUY';
}

const ModalNhapThongTinPhoiBang = (props: ModalNhapThongTinPhoiBangProps) => {
	const { record, visibleForm } = useModel('vbcc.bieumauphoibang');
	const intl = useIntl();
	const [form] = Form.useForm();

	const renderFooter = () => {
		return [
			<Button key="submit" type="primary" loading={props.submiting} onClick={() => form.submit()}>
				{intl.formatMessage({ id: 'global.button.xacnhan' })}
			</Button>,
			<Button key="back" onClick={props.onCancel}>
				{intl.formatMessage({ id: 'global.button.huy' })}
			</Button>,
		];
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		else form.setFieldsValue({ ngayNhap: dayjs() });
	}, [record?._id, visibleForm, form]);

	return (
		<Modal
			title={props.title}
			open={props.visible}
			onCancel={props.onCancel}
			onOk={() => form.submit()}
			confirmLoading={props.submiting}
			destroyOnClose
			footer={renderFooter()}
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
							label={intl.formatMessage({ id: 'phoibang.form.sobatdau' })}
							name='startNumber'
							rules={[{ required: true, message: 'Vui lòng nhập số bắt đầu' }]}
						>
							<InputNumber style={{ width: '100%' }} placeholder='VD: 1' min={0} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'phoibang.form.soketthuc' })}
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
						<Form.Item label={intl.formatMessage({ id: 'phoibang.form.ngaynhap' })} rules={[{ required: true }]} name='ngayNhap'>
							<MyDatePicker defaultValue={dayjs()} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'phoibang.column.ghichu' })} name='ghiChu'>
							<Input.TextArea rows={2} placeholder={intl.formatMessage({ id: 'phoibang.placeholder.ghichu' })} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default ModalNhapThongTinPhoiBang;
