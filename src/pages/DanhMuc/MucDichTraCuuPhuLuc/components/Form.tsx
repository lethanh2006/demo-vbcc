import type { MucDichTraCuuPhuLuc } from '@/services/VanBang/MucDichTraCuuPhuLuc/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormMucDichTraCuuPhuLuc = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('vbcc.mucdichtracuuphuluc');
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MucDichTraCuuPhuLuc.IRecord) => {
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
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} mục đích tra cứu phụ lục`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='ma' label='Mã mục đích' rules={[...rules.required]}>
							<Input placeholder='Nhập mã mục đích' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='ten'
							label='Mục đích tra cứu'
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Nhập tên mục đích tra cứu phụ lục' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='soThuTu' label='Thứ tự hiển thị' rules={[...rules.required, ...rules.number()]}>
							<InputNumber placeholder='Nhập thứ tự hiển thị' style={{ width: '100%' }} />
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

export default FormMucDichTraCuuPhuLuc;
