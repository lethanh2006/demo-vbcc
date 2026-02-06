import type { MucDichTraCuuPhuLuc } from '@/services/VanBang/MucDichTraCuuPhuLuc/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormMucDichTraCuuPhuLuc = (props: any) => {
	const { getData } = props;
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
			putModel(
				record?._id ?? '',
				values,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.button.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values, getData, undefined, intl.formatMessage({ id: 'global.button.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'mucdich.column.form.chinhsua' })
					: intl.formatMessage({ id: 'mucdich.column.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='ma'
							label={intl.formatMessage({ id: 'mucdich.column.form.mamucdich' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'mucdich.column.form.mamucdich.place' })} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='ten'
							label={intl.formatMessage({ id: 'mucdich.column.form.mucdichtracuu' })}
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'mucdich.column.form.mucdichtracuu.place' })} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='soThuTu'
							label={intl.formatMessage({ id: 'mucdich.column.form.tthienthi' })}
							rules={[...rules.required]}
						>
							<InputNumber
								placeholder={intl.formatMessage({ id: 'mucdich.column.form.tthienthi.place' })}
								style={{ width: '100%' }}
							/>
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
