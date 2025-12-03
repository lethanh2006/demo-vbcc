import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSinhVienXacMinh = (props: { getData?: () => void }) => {
	const { getData } = props;
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
						label='Mã sinh viên'
						// rules={[...rules.required, ...rules.text, ...rules.length(50)]}
					>
						<Input placeholder='Nhập mã sinh viên' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='hoTen' label='Họ tên' rules={[...rules.required, ...rules.text, ...rules.length(150)]}>
						<Input placeholder='Nhập họ và tên' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='soHieuVanBang' label='Số hiệu văn bằng' rules={[...rules.text, ...rules.length(100)]}>
						<Input placeholder='Nhập số hiệu văn bằng' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='soVaoSo' label='Số vào sổ' rules={[...rules.text, ...rules.length(100)]}>
						<Input placeholder='Nhập số vào sổ' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit ? 'Thêm mới' : 'Lưu lại'}
				</Button>

				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormSinhVienXacMinh;
