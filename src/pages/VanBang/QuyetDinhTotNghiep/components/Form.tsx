import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiQuyetDinh } from '@/services/DaoTao/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { EQuyetDinhStep, ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowRightOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectBieuMauPhuLuc from '../../../DanhMuc/BieuMauPhuLuc/components/Select';
import SelectSoVanBang from '../../SoVanBang/components/Select';

const FormQuyetDinhTotNghiep = (props: {
	afterAddNew?: (val: EQuyetDinhStep) => void;
	getData?: () => void;
	yearSelect?: any;
	themMoiHoanThanh?: boolean;
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
	const { afterAddNew, getData, yearSelect, themMoiHoanThanh } = props;
	const nam = Form.useWatch('nam', form);
	const disable =
		!!record?._id &&
		(record?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO ||
			record?.trangThai === ETrangThaiQuyetDinhTotNghiep.CHINH_THUC ||
			record?.trangThai === ETrangThaiQuyetDinhTotNghiep.HOAN_THANH);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				nam: dayjs(record.nam).format('YYYY'),
			});
		}

		if (!record?._id) {
			form.setFieldsValue({
				nam: yearSelect ? dayjs(yearSelect).format('YYYY') : dayjs(),
				ngayBanHanh: dayjs(),
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: QuyetDinhTotNghiep.IRecord) => {
		setFormSubmiting(true);
		const url = await buildUpLoadFile(values, 'url');
		values.url = url;
		values.nam = dayjs(values.nam).format('YYYY');
		values.ngayBanHanh = dayjs(values.ngayBanHanh).startOf('d').toISOString();
		setFormSubmiting(false);

		if (record?._id) {
			putModel(record?._id ?? '', values, getData, undefined, false)
				.then((rec) => {
					setRecord({ ...record, ...rec });
					if (afterAddNew) afterAddNew(EQuyetDinhStep.DANH_SACH_SV);
				})
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, loai: ELoaiQuyetDinh.TOT_NGHIEP }, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(themMoiHoanThanh ? EQuyetDinhStep.PHU_LUC : EQuyetDinhStep.DANH_SACH_SV);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={12}>
					<Form.Item
						name='nam'
						label={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.namhanhchinh' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							pickerStyle='year'
							placeholder={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.placeholder.nam' })}
							format='YYYY'
							disabled={disable}
							onChange={() => {
								form.setFieldsValue({
									idSoVanBang: null,
								});
							}}
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='idSoVanBang'
						label={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.sovanbang' })}
						rules={[...rules.required]}
					>
						<SelectSoVanBang condition={{ namHanhChinh: String(dayjs(nam).format('YYYY')) }} disabled={disable} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='soQuyetDinh'
						label={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.soquyetdinh' })}
						rules={[...rules.required]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.placeholder.soquyetdinh' })}
							disabled={disable}
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='ngayBanHanh'
						label={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.ngaykyquyetdinh' })}
						rules={[...rules.required]}
					>
						<MyDatePicker disabled={disable} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='maBieuMau'
						label={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.bieumaubanbang' })}
						rules={[...rules.required]}
						extra={edit ? intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.warning.doibieumau' }) : undefined}
					>
						<SelectBieuMauPhuLuc selectMa disabled={disable} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='url' label={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.filedinhkem' })}>
						<UploadFile disabled={disable} />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item
						name='noiDung'
						label={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.noidungtrichyeu' })}
						rules={[...rules.text]}
					>
						<Input.TextArea
							rows={3}
							placeholder={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.placeholder.noidung' })}
							disabled={disable}
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button
					loading={formSubmiting}
					htmlType='submit'
					type='primary'
					disabled={disable}
					icon={!edit ? <PlusCircleOutlined /> : <SaveOutlined />}
				>
					{intl.formatMessage({
						id: !edit
							? 'vanbang.quyetdinhtotnghiep.button.themmaovatieptuc'
							: 'vanbang.quyetdinhtotnghiep.button.luuvatieptuc',
					})}
				</Button>
				{record?._id && (
					<Button
						onClick={() => {
							if (afterAddNew) afterAddNew(themMoiHoanThanh ? EQuyetDinhStep.PHU_LUC : EQuyetDinhStep.DANH_SACH_SV);
						}}
						icon={<ArrowRightOutlined />}
					>
						{intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.button.tieptuc' })}
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormQuyetDinhTotNghiep;
