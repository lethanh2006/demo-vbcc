import MyDatePicker from '@/components/MyDatePicker';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormXacMinhVanBang = () => {
	const { edit, record, visibleForm, setVisibleForm, putModel, postModel, formSubmiting } =
		useModel('vbcc.xacminhvanbang');
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm, form]);

	const onFinish = (values: XacMinhVanBang.IRecord) => {
		if (record?._id) {
			putModel(record._id, values)
				.then()
				.catch((err) => console.log(err));
		} else {
			postModel(values)
				.then()
				.catch((err) => console.log(err));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Divider style={{ fontSize: 15 }} orientation='left'>
						Thông tin người tra cứu
					</Divider>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label='Họ tên người yêu cầu'
						name='nguoiYeuCau'
						rules={[...rules.required, ...rules.text, ...rules.length(100)]}
					>
						<Input placeholder='Nhập họ tên người yêu cầu' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Tên đơn vị' name='tenDonVi'>
						<Input placeholder='Nhập tên đơn vị' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Số điện thoại' name='soDienThoai' rules={[...rules.text, ...rules.length(20)]}>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Email' name='email'>
						<Input placeholder='Nhập email' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Ngày gửi yêu cầu' name='ngayGuiYeuCau' initialValue={dayjs()}>
						<MyDatePicker />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Mục đích xác minh' name='mucDichXacMinh'>
						<Input placeholder='Nhập mục đích xác minh' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Divider style={{ fontSize: 15 }} orientation='left'>
						Thông tin tra cứu
					</Divider>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Mã sinh viên' name='maSinhVien'>
						<Input placeholder='Nhập mã sinh viên' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Họ tên sinh viên' name='hoTen'>
						<Input placeholder='Nhập họ tên sinh viên' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Số hiệu văn bằng' name='soHieuVanBang'>
						<Input placeholder='Nhập số hiệu văn bằng' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Số vào sổ' name='soVaoSo'>
						<Input placeholder='Nhập số vào sổ' />
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

export default FormXacMinhVanBang;
