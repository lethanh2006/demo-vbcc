import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTrinhDoDaoTao = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.trinhdodaotao');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: TrinhDoDaoTao.IRecord) => {
		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				undefined,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.button.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, undefined, undefined, intl.formatMessage({ id: 'global.button.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit ? intl.formatMessage({ id: 'trinhdo.form.chinhsua' }) : intl.formatMessage({ id: 'trinhdo.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='ma' label={intl.formatMessage({ id: 'trinhdo.form.ma' })} rules={[...rules.required]}>
							<Input placeholder={intl.formatMessage({ id: 'trinhdo.form.ma.place' })} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='ten' label={intl.formatMessage({ id: 'trinhdo.form.ten' })} rules={[...rules.required]}>
							<Input placeholder={intl.formatMessage({ id: 'trinhdo.form.ten.place' })} />
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

export default FormTrinhDoDaoTao;
