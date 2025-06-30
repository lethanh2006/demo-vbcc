import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import moment from 'moment';

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
				ngayBatDau: record.ngayBatDau ? moment(record.ngayBatDau) : undefined,
				ngayKetThuc: record.ngayKetThuc ? moment(record.ngayKetThuc) : undefined,
			};
			form.setFieldsValue(formData);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const submitData = {
			...values,
			// Convert moment objects to proper format
			nam: values.nam?.format('YYYY'),
			ngayBatDau: values.ngayBatDau?.format('YYYY-MM-DD'),
			ngayKetThuc: values.ngayKetThuc?.format('YYYY-MM-DD'),
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
						<DatePicker.YearPicker style={{ width: '100%' }} placeholder='Chọn năm' format='YYYY' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='ngayBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
						<DatePicker style={{ width: '100%' }} placeholder='Chọn thời gian bắt đầu' format='DD/MM/YYYY' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='ngayKetThuc' label='Thời gian kết thúc' rules={[...rules.required]}>
						<DatePicker style={{ width: '100%' }} placeholder='Chọn thời gian kết thúc' format='DD/MM/YYYY' />
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
