import MyDatePicker from '@/components/MyDatePicker';
import { ELoaiPhucDap, EPhaseXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowRightOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormXacMinhVanBang = (props: { afterAddNew?: (val: number) => void }) => {
	const { afterAddNew } = props;
	const { edit, record, visibleForm, setVisibleForm, putModel, postModel, formSubmiting, setRecord, setEdit } =
		useModel('vbcc.xacminhvanbang');
	const intl = useIntl();
	const [form] = Form.useForm();

	const isHoanThanh = record?.phaseXuLy === EPhaseXacMinh.HOAN_THANH;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				loaiPhucDap: ELoaiPhucDap.VAN_BAN_GIAY,
				ngayGuiYeuCau: dayjs(),
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = (values: XacMinhVanBang.IRecord) => {
		if (record?._id) {
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then((rec) => {
					setRecord({ ...record, ...rec });
				})
				.catch((err) => console.log(err));
		} else {
			postModel(values, undefined, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
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
						<Input placeholder='Nhập họ tên người yêu cầu' disabled={isHoanThanh} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Tên đơn vị' name='tenDonVi'>
						<Input placeholder='Nhập tên đơn vị' disabled={isHoanThanh} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Số điện thoại' name='soDienThoai' rules={[...rules.text, ...rules.length(20)]}>
						<Input placeholder='Nhập số điện thoại' disabled={isHoanThanh} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Email' name='email'>
						<Input placeholder='Nhập email' disabled={isHoanThanh} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Ngày gửi yêu cầu' name='ngayGuiYeuCau'>
						<MyDatePicker disabled={isHoanThanh} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Mục đích xác minh' name='mucDichXacMinh'>
						<Input placeholder='Nhập mục đích xác minh' disabled={isHoanThanh} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='soCongVan' label='Số công văn' rules={[...rules.required]}>
						<Input placeholder='Nhập số công văn' disabled={isHoanThanh} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='loaiPhucDap' label='Loại phúc đáp' rules={[...rules.required]}>
						<Select
							placeholder='Chọn loại phúc đáp'
							options={Object.values(ELoaiPhucDap).map((item) => ({
								key: item,
								value: item,
								label: item,
							}))}
							disabled={isHoanThanh}
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button
					loading={formSubmiting}
					htmlType='submit'
					type='primary'
					icon={!edit ? <PlusCircleOutlined /> : <SaveOutlined />}
					disabled={isHoanThanh}
				>
					{!edit ? 'Thêm mới xác minh' : 'Lưu lại xác minh'}
				</Button>

				<Button
					disabled={!record?._id}
					onClick={() => {
						if (afterAddNew) afterAddNew(1);
					}}
					icon={<ArrowRightOutlined />}
				>
					Tiếp theo
				</Button>

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormXacMinhVanBang;
