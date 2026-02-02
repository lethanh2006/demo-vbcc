import MyDatePicker from '@/components/MyDatePicker';
import SelectTrinhDoDaoTao from '@/pages/DanhMuc/TrinhDoTaoTao/components/Select';
import type { SoVanBang } from '@/services/VanBang/SoVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const TRINH_DO_VIET_TAT: Record<string, string> = {
	'Trung cấp': 'TC',
	'Cao đẳng': 'CD',
	'Đại học': 'DH',
	'Thạc sĩ': 'ThS',
	'Tiến sĩ': 'TS',
};

const SoVanBangForm = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, isView } =
		useModel('vbcc.sovanbang');

	// Dùng để lấy danh sách trình độ và hình thức đào tạo từ model khác
	const { danhSach: dsTrinhDo } = useModel('danhmuc.trinhdodaotao');
	const intl = useIntl();
	const [form] = Form.useForm();
	const soVaoSoHienTai = Form.useWatch('soVaoSoHienTai', form);
	const soChuSoVaoSo = Form.useWatch('soChuSoVaoSo', form);
	const soVaoSoFormat = Form.useWatch('soVaoSoFormat', form);
	const bookEntryNumberFormat = Form.useWatch('bookEntryNumberFormat', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}

		if (!record?._id) {
			const trinhDo = dsTrinhDo?.[0];
			const year = dayjs().format('YYYY');
			const vietTat = trinhDo ? TRINH_DO_VIET_TAT[trinhDo.ten] || '' : '';

			form.setFieldsValue({
				namHanhChinh: dayjs(),
				ten: `Sổ văn bằng ${trinhDo?.ten ?? ''} năm ${year}`,
				soVaoSoHienTai: 0,
				soChuSoVaoSo: 4,
				soVaoSoFormat: `{soVaoSo}/${year}/${vietTat}`,
				bookEntryNumberFormat: `{soVaoSo}/${year}/${vietTat}`,
			});
		}
	}, [record?._id, visibleForm, dsTrinhDo?.length]);

	const appendFormat = (format: string) => {
		if (!format) return '';

		const nextNumber = String((soVaoSoHienTai ?? 0) + 1).padStart(soChuSoVaoSo || 0, '0');
		const year = dayjs(form.getFieldValue('namHanhChinh')).format('YYYY');

		const maTrinhDo = String(form.getFieldValue('maTrinhDoDaoTao') || '');
		const trinhDo = dsTrinhDo.find((x) => x.ma === maTrinhDo);
		const vietTat = trinhDo ? TRINH_DO_VIET_TAT[trinhDo.ten] || '' : '';

		return format.replace('{soVaoSo}', nextNumber).replace('{nam}', year).replace('{trinhDo}', vietTat);
	};

	const onFinish = async (values: SoVanBang.IRecord) => {
		const trinhDo = dsTrinhDo.find((x) => x.ma === values?.maTrinhDoDaoTao);

		const submitData = {
			...values,
			namHanhChinh: dayjs(values.namHanhChinh).format('YYYY'),
			tenTrinhDoDaoTao: trinhDo?.ten,
			ruleSortPhuLuc: String(values.ruleSortPhuLuc)
				.split(',')
				.map((x) => x.trim())
				.filter(Boolean),
		};

		if (edit) {
			putModel(record?._id ?? '', submitData).catch((er) => console.log(er));
		} else {
			postModel(submitData).catch((er) => console.log(er));
		}
	};

	const handleValuesChange = (changedValues: any, allValues: any) => {
		if (edit) return;

		const { namHanhChinh, maTrinhDoDaoTao } = allValues;

		const isRelevantChange = Object.keys(changedValues).some((key) =>
			['namHanhChinh', 'maTrinhDoDaoTao'].includes(key),
		);

		if (!isRelevantChange) return;

		const year = dayjs(namHanhChinh).format('YYYY');
		const maTrinhDo = String(maTrinhDoDaoTao || '');
		const trinhDo = dsTrinhDo.find((x) => x.ma === maTrinhDo);
		const vietTat = trinhDo ? TRINH_DO_VIET_TAT[trinhDo.ten] || '' : '';

		if (year && trinhDo?.ten) {
			const tenSo = `Sổ văn bằng ${trinhDo.ten} năm ${year}`;
			const currentTen = form.getFieldValue('ten') || '';

			if (!currentTen || currentTen.startsWith('Sổ văn bằng')) {
				form.setFieldsValue({ ten: tenSo });
			}
		}

		const suggestedFormat = `{soVaoSo}/${year}/${vietTat}`;

		const currentFormat = form.getFieldValue('soVaoSoFormat') || '';
		const currentBookFormat = form.getFieldValue('bookEntryNumberFormat') || '';

		const updateValues: any = {};

		if (!currentFormat || currentFormat.startsWith('{soVaoSo}/')) {
			updateValues.soVaoSoFormat = suggestedFormat;
		}

		if (!currentBookFormat || currentBookFormat.startsWith('{soVaoSo}/')) {
			updateValues.bookEntryNumberFormat = suggestedFormat;
		}

		if (Object.keys(updateValues).length) {
			form.setFieldsValue(updateValues);
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' onValuesChange={handleValuesChange}>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={12}>
					<Form.Item name='namHanhChinh' label='Năm hành chính' rules={[...rules.required]}>
						<MyDatePicker pickerStyle='year' placeholder='Năm' format='YYYY' disabled={isView} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='maTrinhDoDaoTao' label='Trình độ đào tạo' rules={[...rules.required]}>
						<SelectTrinhDoDaoTao selectMa disabled={isView} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='ten'
						label='Tên sổ văn bằng'
						rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					>
						<Input placeholder='Nhập tên sổ' disabled={isView} />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='soVaoSoHienTai' label='Số vào sổ hiện tại' rules={[...rules.required]}>
						<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập số vào sổ hiện tại' disabled={isView} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='soChuSoVaoSo' label='Số chữ số vào sổ' rules={[...rules.required]}>
						<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập số chữ số vào sổ' disabled={isView} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Row gutter={[12, 12]}>
						<Col span={24} md={12}>
							<Form.Item
								name='soVaoSoFormat'
								label='Định dạng số vào sổ'
								extra={
									soVaoSoFormat && (
										<div style={{ color: '#888' }}>
											Số vào sổ tiếp theo: <b>{appendFormat(soVaoSoFormat)}</b>
										</div>
									)
								}
								rules={[...rules.required]}
							>
								<Input placeholder='VD: {soVaoSo}/2026/DH' disabled={isView} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='bookEntryNumberFormat'
								label='Định dạng số vào sổ (Tiếng Anh)'
								extra={
									bookEntryNumberFormat && (
										<div style={{ color: '#888' }}>
											Số vào sổ tiếp theo: <b>{appendFormat(bookEntryNumberFormat)}</b>
										</div>
									)
								}
							>
								<Input placeholder='VD: {soVaoSo}/2026/DH' disabled={isView} />
							</Form.Item>
						</Col>
					</Row>
				</Col>
				{/* <Col span={24}>
					<Form.Item name='ruleSortPhuLuc' label='Quy tắc sắp xếp phụ lục sinh số vào sổ' rules={[...rules.required]}>
						<Input placeholder='VD: maSinhVien,hoTen,nganh' style={{ width: '100%' }} />
					</Form.Item>
				</Col> */}

				<Col span={24}>
					<Form.Item name='moTa' label='Mô tả' rules={[...rules.text, ...rules.length(200)]}>
						<Input.TextArea placeholder='Nhập mô tả' style={{ width: '100%' }} disabled={isView} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView && (
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default SoVanBangForm;
