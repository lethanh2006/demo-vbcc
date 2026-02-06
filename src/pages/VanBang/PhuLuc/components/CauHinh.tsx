import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ESettingKey } from '@/services/base/constant';
import { Button, Checkbox, Col, Form, Modal, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const CauHinhPhuLucVanBang = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { getByKeyModel, updateSettingModel, formSubmiting, loading } = useModel('tienich.caidat');
	const [form] = Form.useForm();

	useEffect(() => {
		getByKeyModel(ESettingKey.INFO_TENANT_VBCC)
			.then((value) => form.setFieldsValue(value))
			.catch((er) => console.log(er));
	}, []);

	const onFinish = (value: PhuLucVanBang.TSetting) => {
		updateSettingModel({ key: ESettingKey.INFO_TENANT_VBCC, value })
			.then(() => setVisible(false))
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'cauhinh.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
		>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name='require_diploma_signature' valuePropName='checked' initialValue={false}>
								<Checkbox>{intl.formatMessage({ id: 'cauhinh.checkbox.allowsignfile' })}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='require_signature' valuePropName='checked' initialValue={false}>
								<Checkbox>{intl.formatMessage({ id: 'cauhinh.checkbox.allowsigninfo' })}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='require_IPFS' valuePropName='checked' initialValue={false}>
								<Checkbox>{intl.formatMessage({ id: 'cauhinh.checkbox.allowipfs' })}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='blockChain' valuePropName='checked' initialValue={false}>
								<Checkbox>{intl.formatMessage({ id: 'cauhinh.checkbox.allowblockchain' })}</Checkbox>
							</Form.Item>
						</Col>
					</Row>

					<div className='form-footer'>
						<Button type='primary' htmlType='submit' loading={formSubmiting}>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			</Spin>
		</Modal>
	);
};

export default CauHinhPhuLucVanBang;
