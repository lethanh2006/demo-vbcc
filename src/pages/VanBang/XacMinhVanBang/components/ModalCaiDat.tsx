import UploadFile from '@/components/Upload/UploadFile';
import { ESettingKey } from '@/services/base/constant';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
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
		const bieuMauId = value.bieuMauId?.fileList?.[0];
		if (bieuMauId?.originFileObj) {
			try {
				setFormSubmiting(true);
				const res = await uploadFile({
					file: bieuMauId.originFileObj,
					scope: EFileScope.PUBLIC,
				});
				value.bieuMauId = res?.data?.data?.file?._id;
			} catch (error) {
				return Promise.reject(error);
			} finally {
				setFormSubmiting(false);
			}
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
								<UploadFile accept='.docx' drag />
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
