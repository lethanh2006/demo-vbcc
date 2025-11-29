import MyDatePicker from '@/components/MyDatePicker';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowRightOutlined, CloseCircleOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormXacMinhVanBang = (props: { afterAddNew?: (val: number) => void }) => {
	const { afterAddNew } = props;
	const { edit, record, visibleForm, setVisibleForm, putModel, postModel, formSubmiting, setRecord, setEdit } =
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
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then((rec) => {
					setRecord({ ...record, ...rec });
					if (afterAddNew) afterAddNew(1);
				})
				.catch((err) => console.log(err));
		} else {
			postModel(values, undefined, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(1);
				})
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
				<Button
					loading={formSubmiting}
					htmlType='submit'
					type='primary'
					icon={!edit ? <PlusCircleOutlined /> : <SaveOutlined />}
				>
					{!edit ? 'Thêm mới & Tiếp tục' : 'Lưu lại & Tiếp tục'}
				</Button>
				{record?._id && (
					<Button
						onClick={() => {
							if (afterAddNew) afterAddNew(1);
						}}
						icon={<ArrowRightOutlined />}
					>
						Tiếp theo
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)} icon={<CloseCircleOutlined />} danger>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormXacMinhVanBang;
