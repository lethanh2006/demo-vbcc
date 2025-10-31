import MyDatePicker from '@/components/MyDatePicker';
import SelectHinhThuc from '@/pages/DaoTao/CoSo/HinhThucDaoTao/components/Select';
import SelectTrinhDo from '@/pages/DaoTao/CoSo/TrinhDo/components/Select';
import type { SoVanBang } from '@/services/VanBang/SoVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SoVanBangForm = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('vbcc.sovanbang');

	// Dùng để lấy danh sách trình độ và hình thức đào tạo từ model khác
	const { danhSach: dsTrinhDo } = useModel('daotao.trinhdo');
	const { danhSach: dsHinhThuc } = useModel('daotao.hinhthucdaotao');
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
			const trinhDo = dsTrinhDo?.find((x) => x.ma === String(APP_CONFIG_INIT_TRINH_DO));
			const hinhThuc = dsHinhThuc?.find((x) => x.ma === String(APP_CONFIG_INIT_HINH_THUC));
			form.setFieldsValue({
				namHanhChinh: dayjs(),
				maTrinhDoDaoTao: APP_CONFIG_INIT_TRINH_DO,
				maHinhThucDaoTao: APP_CONFIG_INIT_HINH_THUC,
				ten: `Sổ văn bằng ${trinhDo?.ten} - ${hinhThuc?.ten} năm ${dayjs().format('YYYY')}`,
				soVaoSoHienTai: 0,
			});
		}
	}, [record?._id, visibleForm, dsTrinhDo?.length, dsHinhThuc?.length]);

	const appendFormat = (value: string) => {
		const key = '/{soVaoSo}';
		const str = String(value || '');
		return !edit && !str.endsWith(key) ? `${str}${key}` : str;
	};

	const onFinish = async (values: SoVanBang.IRecord) => {
		const trinhDo = dsTrinhDo.find((x) => x.ma === values?.maTrinhDoDaoTao);
		const hinhThuc = dsHinhThuc.find((x) => x.ma === values?.maHinhThucDaoTao);

		const submitData = {
			...values,
			namHanhChinh: dayjs(values.namHanhChinh).format('YYYY'),
			tenTrinhDoDaoTao: trinhDo?.ten,
			tenHinhThucDaoTao: hinhThuc?.ten,
			ruleSortPhuLuc: String(values.ruleSortPhuLuc)
				.split(',')
				.map((x) => x.trim())
				.filter(Boolean),
			soVaoSoFormat: appendFormat(values.soVaoSoFormat),
			bookEntryNumberFormat: appendFormat(values.bookEntryNumberFormat),
		};

		if (edit) {
			putModel(record?._id ?? '', submitData).catch((er) => console.log(er));
		} else {
			postModel(submitData).catch((er) => console.log(er));
		}
	};

	const handleValuesChange = (changedValues: any, allValues: any) => {
		const { namHanhChinh, maTrinhDoDaoTao, maHinhThucDaoTao } = allValues;

		if (!edit) {
			const isRelevantChange = Object.keys(changedValues).some((key) =>
				['namHanhChinh', 'maTrinhDoDaoTao', 'maHinhThucDaoTao'].includes(key),
			);

			if (isRelevantChange) {
				const year = dayjs(namHanhChinh).format('YYYY');
				const maTrinhDo = String(maTrinhDoDaoTao || '');
				const maHinhThuc = String(maHinhThucDaoTao || '');

				const trinhDo = dsTrinhDo.find((x) => x.ma === maTrinhDo);
				const hinhThuc = dsHinhThuc.find((x) => x.ma === maHinhThuc);

				if (year && trinhDo?.ten && hinhThuc?.ten) {
					const tenSo = `Sổ văn bằng ${trinhDo.ten} - ${hinhThuc.ten} năm ${year}`;

					const currentTen = form.getFieldValue('ten') || '';
					const shouldUpdate = !currentTen || currentTen.startsWith('Sổ văn bằng');

					if (shouldUpdate) {
						form.setFieldsValue({ ten: tenSo });
					}
				}
			}
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' onValuesChange={handleValuesChange}>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={12}>
					<Form.Item name='namHanhChinh' label='Năm hành chính' rules={[...rules.required]}>
						<MyDatePicker pickerStyle='year' placeholder='Năm' format='YYYY' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='maTrinhDoDaoTao' label='Trình độ đào tạo' rules={[...rules.required]}>
						<SelectTrinhDo selectMa />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='maHinhThucDaoTao' label='Hình thức đào tạo' rules={[...rules.required]}>
						<SelectHinhThuc selectMa hideAll />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='ten'
						label='Tên sổ văn bằng'
						rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					>
						<Input placeholder='Nhập tên sổ' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='soVaoSoHienTai' label='Số vào sổ hiện tại' rules={[...rules.required]}>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập số vào sổ hiện tại' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='soChuSoVaoSo' label='Số chữ số vào sổ' rules={[...rules.required]}>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập số chữ số vào sổ' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='soVaoSoFormat'
						label='Định dạng số vào sổ'
						extra={
							<div>
								<i style={{ color: '#888' }}>Ví dụ: TS25/{'{soVaoSo}'}</i>
								{soVaoSoFormat && (
									<div style={{ color: '#888', marginTop: 4 }}>
										Số vào sổ tiếp theo là:{' '}
										<b>
											{soVaoSoFormat}/{String((soVaoSoHienTai ?? 0) + 1).padStart(soChuSoVaoSo || 0, '0')}
										</b>
									</div>
								)}
							</div>
						}
						rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					>
						<Input
							placeholder='TS25/{soVaoSo}'
							suffix={!edit ? '/{soVaoSo}' : null}
							value={soVaoSoFormat || ''}
							onChange={(e) => form.setFieldsValue({ soVaoSoFormat: e.target.value })}
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item
						name='bookEntryNumberFormat'
						label='Định dạng số vào sổ (Tiếng Anh)'
						extra={
							<div>
								<i style={{ color: '#888' }}>Ví dụ: TS25/{'{soVaoSo}'}</i>
								{bookEntryNumberFormat && (
									<div style={{ color: '#888', marginTop: 4 }}>
										Số vào sổ tiếp theo là:{' '}
										<b>
											{bookEntryNumberFormat}/{String((soVaoSoHienTai ?? 0) + 1).padStart(soChuSoVaoSo || 0, '0')}
										</b>
									</div>
								)}
							</div>
						}
						rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					>
						<Input
							placeholder='TS25/{soVaoSo}'
							suffix={!edit ? '/{soVaoSo}' : null}
							value={bookEntryNumberFormat || ''}
							onChange={(e) => form.setFieldsValue({ bookEntryNumberFormat: e.target.value })}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='ruleSortPhuLuc' label='Quy tắc sắp xếp phụ lục sinh số vào sổ' rules={[...rules.required]}>
						<Input placeholder='Nhập quy tắc' style={{ width: '100%' }} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='moTa' label='Mô tả' rules={[...rules.text, ...rules.length(200)]}>
						<Input.TextArea placeholder='Nhập mô tả' style={{ width: '100%' }} />
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

export default SoVanBangForm;
