import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectHocKy from '@/pages/DaoTao/HocKy/SelectHocKy';
import { ELoaiQuyetDinh } from '@/services/DaoTao/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectBieuMauPhuLuc from '../../BieuMauPhuLuc/components/Select';

const FormQuyetDinhTotNghiep = (props: {
	afterAddNew?: (rec: QuyetDinhTotNghiep.IRecord) => void;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		formSubmiting,
		setRecord,
		setEdit,
		visibleForm,
		setFormSubmiting,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { afterAddNew, getData } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		else
			form.setFieldsValue({
				maHocKy: recHocKy?.ma,
			});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		setFormSubmiting(true);
		const url = await buildUpLoadFile(values, 'url');
		values.url = url;

		setFormSubmiting(false);
		if (edit) {
			putModel(record?._id ?? '', values, getData, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, loai: ELoaiQuyetDinh.TOT_NGHIEP }, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24}>
					<Form.Item name='maHocKy' label='Học kỳ' rules={[...rules.required]}>
						<SelectHocKy selectMa disabled={!!recHocKy?.ma} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='soQuyetDinh' label='Số quyết định' rules={[...rules.required]}>
						<Input placeholder='Nhập số quyết định' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='ngayBanHanh' label='Ngày ký quyết định' rules={[...rules.required]}>
						<MyDatePicker />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='maBieuMau'
						label='Biểu mẫu phụ lục'
						rules={[...rules.required]}
						extra={edit ? 'Nếu đổi biểu mẫu, thông tin mẫu trong phụ lục sẽ bị xóa bỏ' : undefined}
					>
						<SelectBieuMauPhuLuc selectMa />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='url' label='Tập tin đính kèm'>
						<UploadFile />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item name='noiDung' label='Nội dung trích yếu' rules={[...rules.text]}>
						<Input.TextArea rows={3} placeholder='Nhập nội dung' />
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

export default FormQuyetDinhTotNghiep;
