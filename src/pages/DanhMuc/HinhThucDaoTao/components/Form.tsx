import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormHinhThucDaoTao = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.hinhthucdaotao');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: HinhThucDaoTao.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} hình thức đào tạo`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						<Form.Item name='ma' label='Mã hình thức đào tạo' rules={[...rules.required]}>
							<Input placeholder='Nhập mã hình thức đào tạo' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='ten' label='Tên hình thức đào tạo' rules={[...rules.required]}>
							<Input placeholder='Nhập tên hình thức đào tạo' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
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

export default FormHinhThucDaoTao;
