import MyDatePicker from '@/components/MyDatePicker';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormSinhVienXacMinh = (props: { getData?: () => void }) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recXacMinh } = useModel('vbcc.xacminhvanbang');
	const { setVisibleForm, visibleForm, record, edit, putModel, postModel, formSubmiting } =
		useModel('vbcc.sinhvienxacminh');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [visibleForm, record?._id]);

	const onFinish = async (values: XacMinhVanBang.ISinhVienXacMinh) => {
		values.yeuCauXacMinhVanBangId = recXacMinh?._id ?? '';
		if (record?._id) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((err) => console.log(err));
		} else {
			postModel(values, getData)
				.then()
				.catch((err) => console.log(err));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item
						name='maSinhVien'
						label={intl.formatMessage({ id: 'xacminhvanbang.form.label.manguoihoc' })}
						// rules={[...rules.required, ...rules.text, ...rules.length(50)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'xacminhvanbang.form.placeholder.manguoihoc' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='hoTen'
						label={intl.formatMessage({ id: 'xacminhvanbang.form.label.hoten' })}
						rules={[...rules.required, ...rules.text, ...rules.length(150)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'xacminhvanbang.form.placeholder.hoten' })} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='ngaySinh' label={intl.formatMessage({ id: 'xacminhvanbang.form.label.ngaysinh' })}>
						<MyDatePicker />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='xepLoai' label={intl.formatMessage({ id: 'xacminhvanbang.form.label.xeploai' })}>
						<Input placeholder={intl.formatMessage({ id: 'xacminhvanbang.form.placeholder.xeploai' })} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name='soHieuVanBang'
						label={intl.formatMessage({ id: 'xacminhvanbang.form.label.sohieuvanbang' })}
						rules={[...rules.text, ...rules.length(100)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'xacminhvanbang.form.placeholder.sohieuvanbang' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='soVaoSo'
						label={intl.formatMessage({ id: 'xacminhvanbang.form.label.sovaoso' })}
						rules={[...rules.text, ...rules.length(100)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'xacminhvanbang.form.placeholder.sovaoso' })} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormSinhVienXacMinh;
