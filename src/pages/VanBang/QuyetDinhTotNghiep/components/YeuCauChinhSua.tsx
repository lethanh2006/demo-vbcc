import { ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalYeuCauChinhSua = (props: { visible: boolean; setVisible: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visible, setVisible, getData } = props;
	const { record, xuLyDuThaoModel, formSubmiting } = useModel('vbcc.quyetdinhtotnghiep');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue(record);
		}
	}, [visible]);

	const onFinish = async (values: QuyetDinhTotNghiep.IRecord) => {
		xuLyDuThaoModel(
			record?._id ?? '',
			{
				trangThai: ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA,
				ghiChuChinhSua: values.ghiChuChinhSua,
			},
			getData,
		).then(() => setVisible(false));
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'qdtotnghiep.ycchinhsua.xacnhanyc.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='ghiChuChinhSua'
							label={intl.formatMessage({ id: 'qdtotnghiep.ycchinhsua.xacnhanyc.ghichu' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input.TextArea
								rows={3}
								placeholder={intl.formatMessage({ id: 'qdtotnghiep.ycchinhsua.xacnhanyc.ghichu.placeholder' })}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalYeuCauChinhSua;
