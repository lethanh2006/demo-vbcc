import MyDatePicker from '@/components/MyDatePicker';
import type { DotCapBangTotNghiep } from '@/services/VanBang/DotCapBangTotNghiep/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const DotCapBangTotNghiepForm = (props: { afterAddNew?: (rec: DotCapBangTotNghiep.IRecord) => void }) => {
	const { afterAddNew } = props;
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, setRecord, setEdit } =
		useModel('vbcc.dotcapbangtotnghiep');
	const intl = useIntl();
	const [form] = Form.useForm();
	const ngayBatDau = Form.useWatch('ngayBatDau', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotCapBangTotNghiep.IRecord) => {
		const diffMinutes = dayjs(values.ngayKetThuc).diff(dayjs(values.ngayBatDau), 'minutes');
		if (diffMinutes <= 0) {
			return message.info('Thời gian kết thúc phải sau thời gian bắt đầu!');
		}

		const data = {
			...values,
			nam: dayjs(values.nam).format('YYYY'),
		};

		if (edit) {
			putModel(record?._id ?? '', data)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(data)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item
						name='ten'
						label='Tên đợt cấp bằng'
						rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					>
						<Input placeholder='Nhập tên đợt cấp bằng' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='ngayBatDau' label='Thời gian bắt đầu cấp bằng từ' rules={[...rules.required]}>
						<MyDatePicker placeholder='Chọn thời gian bắt đầu' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='ngayKetThuc' label='Thời gian kết thúc' rules={[...rules.required]}>
						<MyDatePicker
							placeholder='Chọn thời gian kết thúc'
							disabledDate={(cur) => (ngayBatDau ? dayjs(cur).isBefore(ngayBatDau) : false)}
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='ghiChu' label='Ghi chú'>
						<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
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
