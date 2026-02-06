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
						{intl.formatMessage({ id: 'xacminhvanbang.formxacminh.divider.thongtin' })}
					</Divider>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.label.nguoiyeucau' })}
						name='nguoiYeuCau'
						rules={[...rules.required, ...rules.text, ...rules.length(100)]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.placeholder.nguoiyeucau' })}
							disabled={isHoanThanh}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.label.donvi' })} name='tenDonVi'>
						<Input
							placeholder={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.placeholder.donvi' })}
							disabled={isHoanThanh}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.label.sodienthoai' })}
						name='soDienThoai'
						rules={[...rules.text, ...rules.length(20)]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.placeholder.sodienthoai' })}
							disabled={isHoanThanh}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.label.email' })} name='email'>
						<Input
							placeholder={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.placeholder.email' })}
							disabled={isHoanThanh}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.label.ngayguiyeucau' })}
						name='ngayGuiYeuCau'
					>
						<MyDatePicker disabled={isHoanThanh} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.label.mucdich' })}
						name='mucDichXacMinh'
					>
						<Input
							placeholder={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.placeholder.mucdich' })}
							disabled={isHoanThanh}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='soCongVan'
						label={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.label.socongvan' })}
						rules={[...rules.required]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.placeholder.socongvan' })}
							disabled={isHoanThanh}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='loaiPhucDap'
						label={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.label.loaiphucdap' })}
						rules={[...rules.required]}
					>
						<Select
							placeholder={intl.formatMessage({ id: 'xacminhvanbang.formxacminh.placeholder.loaiphucdap' })}
							options={Object.values(ELoaiPhucDap).map((item) => ({
								key: item,
								value: item,
								label: item,
							}))}
							disabled
							// ={isHoanThanh}
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
					{!edit
						? intl.formatMessage({ id: 'xacminhvanbang.formxacminh.button.themmoi' })
						: intl.formatMessage({ id: 'xacminhvanbang.formxacminh.button.luulai' })}
				</Button>

				<Button
					disabled={!record?._id}
					onClick={() => {
						if (afterAddNew) afterAddNew(1);
					}}
					icon={<ArrowRightOutlined />}
				>
					{intl.formatMessage({ id: 'xacminhvanbang.formxacminh.button.tieptuc' })}
				</Button>

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormXacMinhVanBang;
