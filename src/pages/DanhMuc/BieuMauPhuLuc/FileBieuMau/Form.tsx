import UploadFile from '@/components/Upload/UploadFile';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormFileBieuMau = (props: { onOk: (val: BieuMauPhuLuc.TFileBieuMau) => void }) => {
	const [form] = Form.useForm();
	const { onOk } = props;
	const { setVisibleForm, visibleForm, record, edit, setFormSubmiting, formSubmiting, isView } =
		useModel('vbcc.filebieumau');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?.index) form.setFieldsValue(record);
	}, [visibleForm, record?.index]);

	const onFinish = async (values: BieuMauPhuLuc.TFileBieuMau) => {
		setFormSubmiting(true);
		const idFile = values.idFile?.fileList?.[0];
		if (idFile?.originFileObj) {
			const res = await uploadFile({ file: idFile?.originFileObj, scope: EFileScope.PUBLIC });
			values.idFile = res?.data?.data?.file?._id;
		} else values.idFile = idFile.url;
		setFormSubmiting(false);

		onOk({ ...record, ...values });
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='ten' label='Tên file' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
						<Input placeholder='Nhập tên file' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='idFile' label='File biểu mẫu' rules={[...rules.fileRequired]}>
						<UploadFile hasPreviewFile previewFileProps={{ isFileId: true }} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView ? (
					<Button htmlType='submit' type='primary' loading={formSubmiting}>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
				) : null}
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormFileBieuMau;
