import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ChiTietSinhVienXacMinh from './ChiTiet';

const ModalPhucDap = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	getData?: () => void;
	isKetQua?: boolean;
}) => {
	const { visible, setVisible, getData, isKetQua } = props;
	const [form] = Form.useForm();
	const { record, putModel, formSubmiting, setFormSubmiting } = useModel('vbcc.sinhvienxacminh');

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [visible, record?._id]);

	const onFinish = async (values: XacMinhVanBang.ISinhVienXacMinh) => {
		if (isKetQua) {
			setFormSubmiting(true);
			const urlPhanHoi = await buildUpLoadFile(values, 'urlPhanHoi');
			values.urlPhanHoi = urlPhanHoi;
			setFormSubmiting(false);
		}
		putModel(record?._id ?? '', { ...record, ...values }, getData)
			.then(() => setVisible(false))
			.catch((err) => console.log(err));
	};

	return (
		<Modal title='Nội dung phúc đáp' open={visible} onCancel={() => setVisible(false)} footer={null}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<ChiTietSinhVienXacMinh />
					</Col>
					{isKetQua ? (
						<Col span={24}>
							<Form.Item name='urlPhanHoi' label='File phúc đáp' rules={[...rules.required]}>
								<UploadFile />
							</Form.Item>
						</Col>
					) : null}
					<Col span={24}>
						<Form.Item
							name='ghiChuKetQuaPhucDap'
							label='Nội dung phúc đáp'
							rules={isKetQua ? [] : [...rules.required, ...rules.text]}
						>
							<Input.TextArea rows={3} placeholder='Nhập nội dung phúc đáp' disabled={isKetQua} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>

					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalPhucDap;
