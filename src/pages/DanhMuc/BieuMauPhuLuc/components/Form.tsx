import UploadFile from '@/components/Upload/UploadFile';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import { defaultElementBieuMau } from '@/services/VanBang/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import ElementBieuMauFormItem from './Element';

const FormNguoiKyVanBang = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('vbcc.bieumauphuluc');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: BieuMauPhuLuc.IRecord) => {
		const idFileMau = values.idFileMau?.fileList?.[0];
		if (idFileMau?.originFileObj) {
			try {
				setFormSubmiting(true);
				const res = await uploadFile({
					file: idFileMau.originFileObj,
					scope: EFileScope.PUBLIC,
				});
				values.idFileMau = res?.data?.data?.file?._id;
			} catch (error) {
				return Promise.reject(error);
			} finally {
				setFormSubmiting(false);
			}
		} else {
			values.idFileMau = idFileMau?.url ?? null;
		}

		if (values.elements?.length) {
			const elementNames = values.elements.map((item) => item.headerName);
			const uniqElements = _.uniq(elementNames);
			const duplicateDefault = defaultElementBieuMau.find((item) => uniqElements.includes(item.headerName));
			if (uniqElements.length !== elementNames.length || duplicateDefault) {
				form.setFields([{ name: 'elements', errors: ['Các phần tử không được trùng nhau'] }]);
				return;
			} else form.setFields([{ name: 'elements', errors: undefined }]);
		} else {
			values.elements = [];
		}
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={8}>
						<Form.Item label='Mã biểu mẫu' name='ma' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập mã biểu mẫu' disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={24} md={16}>
						<Form.Item label='Tên biểu mẫu' name='ten' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên biểu mẫu' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label='Biểu mẫu xuất phụ lục (mặc định)' name='idFileMau' rules={[...rules.required]}>
							<UploadFile hasPreviewFile previewFileProps={{ isFileId: true }} />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item label='Cấu hình biểu mẫu' name='elements'>
					<ElementBieuMauFormItem />
				</Form.Item>

				<div className='form-footer' style={{ marginTop: 24 }}>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormNguoiKyVanBang;
