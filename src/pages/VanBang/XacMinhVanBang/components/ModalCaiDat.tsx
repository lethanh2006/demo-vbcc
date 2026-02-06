import UploadFile from '@/components/Upload/UploadFile';
import { ESettingKey } from '@/services/base/constant';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import rules from '@/utils/rules';
import { Button, Col, Form, Modal, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

interface Props {
	visible: boolean;
	onClose: () => void;
	title?: string;
}

const ModalCaiDatXacMinh: React.FC<Props> = ({ visible, onClose, title }) => {
	const intl = useIntl();
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

	const onFinish = async (values: XacMinhVanBang.ISetting) => {
		setFormSubmiting(true);
		const bieuMauId = values.bieuMauId?.fileList?.[0];
		if (bieuMauId?.originFileObj) {
			const res = await uploadFile({ file: bieuMauId?.originFileObj, scope: EFileScope.PUBLIC });
			values.bieuMauId = res?.data?.data?.file?._id;
		} else values.bieuMauId = bieuMauId.url;
		setFormSubmiting(false);

		await updateSettingModel({ key: ESettingKey.XAC_MINH_VAN_BANG, value: values }).catch((er) => console.log(er));
		onClose();
	};

	return (
		<Modal
			title={title || intl.formatMessage({ id: 'xacminhvanbang.caidat.title.default' })}
			open={visible}
			onCancel={onClose}
			footer={null}
			destroyOnClose
		>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item
								name='bieuMauId'
								label={intl.formatMessage({ id: 'xacminhvanbang.caidat.label.bieumau' })}
								rules={[...rules.required, ...rules.fileRequired]}
							>
								<UploadFile accept='.docx' drag hasPreviewFile previewFileProps={{ isFileId: true }} />
							</Form.Item>
						</Col>
						{/* <Col span={24} style={{ color: '#259efa' }}>
							<i>
								{`Có thể sử dụng các biến động như {{hoTen}}, {{maSV}}, {{ngaySinh}} để tự động điền vào nội dung khi gửi cho người học. Ví dụ: '{{hoTen}} đã được chấp nhận phúc đáp'.`}
							</i>
						</Col>
						<Col span={24}>
							<Form.Item
								name='mauNoiDungPhucDapChapNhan'
								label='Nội dung phúc đáp khi có kết quả'
								rules={[...rules.required]}
							>
								<Input.TextArea rows={2} placeholder='Nhập nội dung' />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name='mauNoiDungPhucDapTuChoi'
								label='Nội dung phúc đáp khi không có kết quả'
								rules={[...rules.required]}
							>
								<Input.TextArea rows={2} placeholder='Nhập nội dung' />
							</Form.Item>
						</Col> */}
					</Row>

					<div className='form-footer' style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
						<Button type='primary' htmlType='submit' loading={formSubmiting}>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button onClick={onClose}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			</Spin>
		</Modal>
	);
};

export default ModalCaiDatXacMinh;
