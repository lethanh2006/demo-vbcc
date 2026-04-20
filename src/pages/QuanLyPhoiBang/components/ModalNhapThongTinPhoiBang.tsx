import MyDatePicker from '@/components/MyDatePicker';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Button, Col, Form, InputNumber, Modal, Row, Input, Select } from 'antd';
import { ETrangThaiPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { useEffect } from 'react';
import { useIntl } from 'umi';
import rules from '@/utils/rules';

interface ModalNhapThongTinPhoiBangProps {
	visible: boolean;
	onCancel: () => void;
	onOk: (values: any) => void;
	title: string;
	submiting?: boolean;
	type?: 'CAP_MOI' | 'HUY';
}

const ModalNhapThongTinPhoiBang = (props: ModalNhapThongTinPhoiBangProps) => {
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!props.visible) resetFieldsForm(form, { ngayNhap: dayjs() });
	}, [props.visible]);

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
							rules={[{ required: true, message: intl.formatMessage({ id: 'phoibang.validate.sobatdau' }) }]}
						>
							<InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'phoibang.placeholder.vd1' })} min={0} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'phoibang.form.soketthuc' })}
							name='endNumber'
							dependencies={['startNumber']}
							rules={[
								{ required: true, message: intl.formatMessage({ id: 'phoibang.validate.soketthuc' }) },
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
										return Promise.reject(new Error(intl.formatMessage({ id: 'phoibang.validate.soketthuclonhon' })));
									},
								}),
							]}
						>
							<InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'phoibang.placeholder.vd100' })} min={0} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'phoibang.form.ngaynhap' })} rules={[{ required: true }]} name='ngayNhap'>
							<MyDatePicker defaultValue={dayjs()} />
						</Form.Item>
					</Col>
					{props.type === 'HUY' && (
						<Col span={24}>
							<Form.Item
								label={intl.formatMessage({ id: 'phoibang.column.trangthai' })}
								name='loai'
								rules={[...rules.required]}
							>
								<Select placeholder={intl.formatMessage({ id: 'phoibang.placeholder.trangthai' })}>
									<Select.Option value={ETrangThaiPhoiBang.HUY}>{ETrangThaiPhoiBang.HUY}</Select.Option>
									<Select.Option value={ETrangThaiPhoiBang.THAT_LAC}>{ETrangThaiPhoiBang.THAT_LAC}</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					)}
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
