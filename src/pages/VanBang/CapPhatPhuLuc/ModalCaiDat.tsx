import UploadFile from '@/components/Upload/UploadFile';
import { ESettingKey } from '@/services/base/constant';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import rules from '@/utils/rules';
import { Button, Col, Form, Modal, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

interface Props {
	visible: boolean;
	onClose: () => void;
}

const ModalCaiDatCapPhatPhuLuc: React.FC<Props> = ({ visible, onClose }) => {
	const intl = useIntl();
	const { getByKeyModel, updateSettingModel, formSubmiting, loading, setFormSubmiting } = useModel('tienich.caidat');
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.resetFields();
			getByKeyModel(ESettingKey.XAC_NHAN_CAP_BANG_TOT_NGHIEP)
				.then((value) => form.setFieldsValue(value))
				.catch((er) => console.log(er));
		}
	}, [visible]);

	const onFinish = async (values: PhuLucVanBang.TSettingXacNhanCapBangTotNghiep) => {
		setFormSubmiting(true);
		const bieuMauXacNhan = values.bieuMauXacNhanId?.fileList?.[0];

		if (bieuMauXacNhan?.originFileObj) {
			const res = await uploadFile({ file: bieuMauXacNhan.originFileObj, scope: EFileScope.PUBLIC });
			values.bieuMauXacNhanId = res?.data?.data?.file?._id;
		} else {
			values.bieuMauXacNhanId = bieuMauXacNhan?.url ?? values.bieuMauXacNhanId;
		}

		setFormSubmiting(false);
		await updateSettingModel({ key: ESettingKey.XAC_NHAN_CAP_BANG_TOT_NGHIEP, value: values }).catch((er) =>
			console.log(er),
		);
		onClose();
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'capphatvanbang.caidat.title' })}
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
								name='bieuMauXacNhanId'
								label={intl.formatMessage({ id: 'capphatvanbang.caidat.label.bieumauxacnhan' })}
								rules={[...rules.required, ...rules.fileRequired]}
							>
								<UploadFile drag hasPreviewFile previewFileProps={{ isFileId: true }} />
							</Form.Item>
						</Col>
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

export default ModalCaiDatCapPhatPhuLuc;
