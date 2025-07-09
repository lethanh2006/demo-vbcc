import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import moment from 'moment';
import MyDatePicker from '@/components/MyDatePicker';

const DotCapBangTotNghiepForm = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('vbcc.dotcapbangtotnghiep');
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			// Convert string dates to moment objects
			const formData = {
				...record,
				nam: record.nam ? moment(record.nam) : undefined,
			};
			form.setFieldsValue(formData);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const submitData = {
			...values,
			// Convert moment objects to proper format
			nam: values.nam?.format('YYYY'),
		};

		if (edit) {
			putModel(record?._id ?? '', submitData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(submitData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={12}>
					<Form.Item
						name='ten'
						label='Tên đợt cấp bằng'
						rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					>
						<Input placeholder='Nhập tên đợt cấp bằng' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='nam' label='Năm hành chính' rules={[...rules.required]}>
						<MyDatePicker placeholder='Chọn năm' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='ngayBatDau' label='Thời gian bắt đầu cấp bằng từ' rules={[...rules.required]}>
						<MyDatePicker placeholder='Chọn thời gian bắt đầu' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='ngayKetThuc' label='Thời gian kết thúc' rules={[...rules.required]}>
						<MyDatePicker placeholder='Chọn thời gian kết thúc' />
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
	);
};

export default DotCapBangTotNghiepForm;
