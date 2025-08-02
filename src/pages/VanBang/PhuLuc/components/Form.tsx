import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormPhuLucVanBang = (props: { getData?: () => void; title?: string; [key: string]: any }) => {
	const { record, edit, setVisibleForm, formSubmiting, visibleForm, putModel, postModel, setFormSubmiting } =
		useModel('vbcc.phulucvanbang');
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { record: recBieuMau, getBieuMauDetailModel } = useModel('vbcc.bieumauphuluc');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData, title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else
			getBieuMauDetailModel(recQuyetDinh?.maBieuMau ?? '').then((bm) => {
				if (record?._id) {
					const templateData = record.templateData;
					if (bm)
						record.templateData = bm?.elements?.map((elm) => ({
							...elm,
							value: templateData?.find((i) => i.headerName === elm.headerName)?.value,
						}));
					form.setFieldsValue(record);
				}
			});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: PhuLucVanBang.IRecord) => {
		setFormSubmiting(true);
		const urlIpfs = await buildUpLoadFile(values, 'urlIpfs');
		values.urlIpfs = urlIpfs;
		setFormSubmiting(false);

		// Gán value vào templateData đã chọn
		const temp = recBieuMau?.elements?.map((elment, index) => ({
			...elment,
			value:
				elment.type === ELoaiDuLieuBieuMau.Date && values.templateData?.[index].value
					? moment(values.templateData[index].value).startOf('day').toISOString()
					: values.templateData?.[index].value,
		}));
		values.templateData = temp;
		if (values.ngaySinh) values.ngaySinh = moment(values.ngaySinh).startOf('day').toISOString();
		if (edit)
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		else {
			await postModel({ ...values, idQuyetDinh: recQuyetDinh?._id }, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label='Quyết định tốt nghiệp'>
							<Input
								value={
									recQuyetDinh?.soQuyetDinh ??
									`${record?.quyetDinh?.soQuyetDinh ?? ''}, 
					${record?.quyetDinh?.ngayBanHanh ? moment(record.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : ''}`
								}
								disabled
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							label='Số vào sổ'
							name='soVaoSoBang'
							rules={[...rules.required, ...rules.text, ...rules.length(100)]}
						>
							<Input placeholder='Nhập số vào sổ' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							label='Số hiệu văn bằng'
							name='soHieuVanBang'
							rules={[...rules.required, ...rules.text, ...rules.length(100)]}
						>
							<Input placeholder='Nhập số hiệu văn bằng' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							label='Họ tên sinh viên'
							name='hoTen'
							rules={[...rules.required, ...rules.text, ...rules.length(100)]}
						>
							<Input placeholder='Nhập họ tên sinh viên' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Ngày sinh' name='ngaySinh'>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							label='Mã sinh viên'
							name='maSinhVien'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder='Nhập mã sinh viên' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Tập tin văn bằng (file scan)' name='urlIpfs'>
							<UploadFile maxCount={1} otherProps={{ accept: '.pdf' }} />
						</Form.Item>
					</Col>

					{recBieuMau?._id ? (
						<>
							<Col span={24}>
								Theo biểu mẫu phụ lục: <b>{recBieuMau.ten}</b>
							</Col>
							{recBieuMau.elements.map((element, index) => (
								<Col span={24} md={12} key={element.headerName}>
									<Form.Item
										label={element.headerName}
										name={['templateData', index, 'value']}
										rules={element.type === ELoaiDuLieuBieuMau.Text ? [...rules.text, ...rules.length(300)] : []}
									>
										{element.type === ELoaiDuLieuBieuMau.Number ? (
											<InputNumber
												style={{ width: '100%' }}
												placeholder={`Nhập ${element.headerName?.toLocaleLowerCase()}`}
											/>
										) : element.type === ELoaiDuLieuBieuMau.Date ? (
											<MyDatePicker />
										) : (
											<Input placeholder={`Nhập ${element.headerName?.toLocaleLowerCase()}`} />
										)}
									</Form.Item>
								</Col>
							))}
						</>
					) : null}
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
		</Card>
	);
};

export default FormPhuLucVanBang;
