import UploadFile from '@/components/Upload/UploadFile';
import { ESettingKey } from '@/services/base/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Col, Form, Modal, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

interface Props {
	visible: boolean;
	onClose: () => void;
	title?: string;
}

const ModalCaiDatXacMinh: React.FC<Props> = ({ visible, onClose, title }) => {
	const { getByKeyModel, updateSettingModel, formSubmiting, loading, setFormSubmiting } = useModel('tienich.caidat');
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.resetFields();
			getByKeyModel(ESettingKey.XAC_MINH_VAN_BANG)
				.then((value) => form.setFieldsValue(value))
				.catch((er) => console.log(er));
		}
	}, [visible]);

	const onFinish = async (value: XacMinhVanBang.ISetting) => {
		if (!!value.bieuMauId && typeof value.bieuMauId !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(value, 'bieuMauId')
				.then((bieuMauId) => (value.bieuMauId = bieuMauId))
				.catch(() => (value.bieuMauId = null))
				.finally(() => setFormSubmiting(false));
		}
		await updateSettingModel({ key: ESettingKey.XAC_MINH_VAN_BANG, value }).catch((er) => console.log(er));
		onClose();
	};

	return (
		<Modal title={title || 'Thêm biểu mẫu'} open={visible} onCancel={onClose} footer={null} destroyOnClose>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item
								name='bieuMauId'
								label='Tập tin biểu mẫu kết quả xác minh'
								rules={[...rules.required, ...rules.fileRequired]}
							>
								<UploadFile hasPreviewFile accept='.docx' />
							</Form.Item>
						</Col>
					</Row>

					<div className='form-footer' style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
						<Button type='primary' htmlType='submit' loading={formSubmiting}>
							Lưu lại
						</Button>
						<Button onClick={onClose}>Hủy</Button>
					</div>
				</Form>
			</Spin>
		</Modal>
	);
};

export default ModalCaiDatXacMinh;
