import MyDatePicker from '@/components/MyDatePicker';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Alert, Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import CardThongKe from './CardThongKe';


export interface SettingFormatPayload {
	ten?: string;
	prefix?: string;
	suffix?: string;
	startNumber: number;
	endNumber: number;
	ghiChu?: string;
	ngayNhap: Date;
	soKyTuPhoiBang?: number;
}

const SO_HIEU_TOKEN = '{soHieu}';

const parseDinhDangSoHieu = (raw?: string): { prefix?: string; suffix?: string } => {
	if (!raw) return {};
	const idx = raw.indexOf(SO_HIEU_TOKEN);
	if (idx === -1) return {};
	const pre = raw.slice(0, idx) || undefined;
	const suf = raw.slice(idx + SO_HIEU_TOKEN.length) || undefined;
	return { prefix: pre, suffix: suf };
};

const TabBieuMauPhoiBang = () => {
	const {
		record,
		setVisibleForm,
		edit,
		isView,
		getModel,
		formSubmiting,
		visibleForm,
		setIsView,
		postYeuCauCapMoiModel,
		putModel,
	} = useModel('vbcc.bieumauphoibang');
	const { getModel: getLichSu } = useModel('vbcc.lichsuphoibang');
	const { getModel: getPhoiBang } = useModel('vbcc.phoibang');

	const intl = useIntl();
	const [form] = Form.useForm<SettingFormatPayload>();


	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			let prefix = undefined;
			let suffix = undefined;

			if (record?.dinhDangSoHieu) {
				const parsed = parseDinhDangSoHieu(record.dinhDangSoHieu as string);
				prefix = parsed.prefix;
				suffix = parsed.suffix;
			}

			form.setFieldsValue({
				...(record as any),
				prefix,
				suffix,
				startNumber: record?.soBatDau,
				endNumber: record?.soKetThuc,
				ngayNhap: record?.ngayNhap ? dayjs(record.ngayNhap) : dayjs(),
				soKyTuPhoiBang: record?.soKyTuPhoiBang,
			});
			if (visibleForm) form.setFieldsValue({ ngayNhap: dayjs() });

		} else form.setFieldsValue({ ngayNhap: dayjs() });
	}, [record?._id, visibleForm, form]);

	const prefix = Form.useWatch('prefix', form);
	const suffix = Form.useWatch('suffix', form);
	const soKyTuPhoiBang = Form.useWatch('soKyTuPhoiBang', form);

	const renderPreview = () => {
		const pre = prefix ?? '...';
		const suf = suffix ?? '...';
		let demoNum = '1';
		if (soKyTuPhoiBang && soKyTuPhoiBang > 0) {
			demoNum = demoNum.padStart(soKyTuPhoiBang, '0');
		} else {
			demoNum = intl.formatMessage({ id: 'phoibang.text.sothutuphoi' });
		}
		return `${intl.formatMessage({ id: 'phoibang.text.maudemo' })} ${pre}${demoNum}${suf}`;
	};

	// const [modalConfig, setModalConfig] = useState<{ visible: boolean; type?: 'CAP_MOI' | 'HUY' }>({
	// 	visible: false,
	// });

	// const handleCapMoi = () => {
	// 	setModalConfig({ visible: true, type: 'CAP_MOI' });
	// };

	// const handleHuy = () => {
	// 	setModalConfig({ visible: true, type: 'HUY' });
	// };

	// const handleModalSubmit = async (values: any) => {
	// 	const mainValues = form.getFieldsValue();
	// 	const prefixStr = mainValues?.prefix ?? '';
	// 	const suffixStr = mainValues?.suffix ?? '';
	// 	const dinhDangSoHieuFormat = `${prefixStr}${SO_HIEU_TOKEN}${suffixStr}`;

	// 	const payload = {
	// 		id: record?._id,
	// 		dinhDangSoHieu: dinhDangSoHieuFormat,
	// 		soBatDau: values?.startNumber,
	// 		soKetThuc: values?.endNumber,
	// 		ngayNhap: values?.ngayNhap,
	// 		ghiChu: mainValues?.ghiChu,
	// 		ten: mainValues?.ten,
	// 	};

	// 	try {
	// 		if (modalConfig.type === 'CAP_MOI') {
	// 			await postYeuCauCapMoiModel(payload, getModel).then(() => {
	// 				getLichSu();
	// 				getPhoiBang();
	// 				setVisibleForm(false);
	// 				setIsView(false);
	// 			});
	// 		} else if (modalConfig.type === 'HUY') {
	// 			await postYeuCauHuyBieuMauModel(payload, getModel).then(() => {
	// 				getLichSu();
	// 				getPhoiBang();
	// 				setVisibleForm(false);
	// 				setIsView(false);
	// 			});
	// 		}
	// 		setModalConfig({ visible: false, type: undefined });
	// 	} catch (_) {}
	// };

	const onFinish = async (values: SettingFormatPayload) => {
		const prefixStr = values?.prefix ?? '';
		const suffixStr = values?.suffix ?? '';
		const dinhDangSoHieuFormat = `${prefixStr}${SO_HIEU_TOKEN}${suffixStr}`;

		if (edit) {
			const payload = {
				ten: values?.ten,
				dinhDangSoHieu: dinhDangSoHieuFormat,
				ghiChu: values?.ghiChu,
				soKyTuPhoiBang: values?.soKyTuPhoiBang,
			};
			putModel(record?._id!, payload, getModel)
				.then(() => {
				})
				.catch((er) => console.log(er));
		} else {
			const payload = {
				ten: values?.ten,
				dinhDangSoHieu: dinhDangSoHieuFormat,
				soBatDau: values?.startNumber,
				soKetThuc: values?.endNumber,
				ghiChu: values?.ghiChu,
				ngayNhap: values?.ngayNhap,
				soKyTuPhoiBang: values?.soKyTuPhoiBang,
			};
			postYeuCauCapMoiModel(payload, getModel)
				.then(() => {
					getLichSu();
					getPhoiBang();
					setVisibleForm(false);
					setIsView(false);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				{record?._id && (
					<Col span={24} style={{ marginBottom: 16 }}>
						<CardThongKe bieuMauId={record._id} variant='bieu-mau' />
					</Col>
				)}
				<Col span={24}>
					<Form.Item label={intl.formatMessage({ id: 'phoibang.text.tenbieumau' })} name='ten'>
						<Input placeholder={intl.formatMessage({ id: 'phoibang.placeholder.tenbieumau' })} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item label={intl.formatMessage({ id: 'phoibang.column.dinhdangsohieu' })}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								border: '1px solid #d9d9d9',
								borderRadius: 6,
								overflow: 'hidden',
							}}
						>
							<Form.Item name='prefix' noStyle>
								<Input placeholder={intl.formatMessage({ id: 'phoibang.placeholder.phandau' })} bordered={false} style={{ flex: 1, minWidth: 0 }} />
							</Form.Item>
							<span
								style={{
									whiteSpace: 'nowrap',
									padding: '0 8px',
									background: '#f5f5f5',
									borderLeft: '1px solid #d9d9d9',
									borderRight: '1px solid #d9d9d9',
									color: '#595959',
									fontWeight: 500,
									lineHeight: '30px',
									userSelect: 'none',
								}}
							>
								{intl.formatMessage({ id: 'phoibang.text.sothutuphoi' })}
							</span>
							<Form.Item name='suffix' noStyle>
								<Input placeholder={intl.formatMessage({ id: 'phoibang.placeholder.phanduoi' })} bordered={false} style={{ flex: 1, minWidth: 0 }} />
							</Form.Item>
						</div>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item label={intl.formatMessage({ id: 'phoibang.form.sokytuphoibang' })} name='soKyTuPhoiBang' rules={[{ required: true, message: intl.formatMessage({ id: 'phoibang.validate.sokytuphoibang' }) }]}>
						<InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'phoibang.placeholder.sokytuphoibang' })} min={1} />
					</Form.Item>
				</Col>
				<Col span={24} style={{ marginBottom: 12 }}>
					<Alert message={renderPreview()} type='info' showIcon />
				</Col>
				{!isView && (
					<>
						<Col span={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'phoibang.form.sobatdau' })}
								name='startNumber'
								rules={[{ required: true, message: intl.formatMessage({ id: 'phoibang.validate.sobatdau' }) }]}
							>
								<InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'phoibang.placeholder.vd1' })} min={0} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'phoibang.form.soketthuc' })}
								name='endNumber'
								dependencies={['startNumber']}
								rules={[
									{ required: true, message: intl.formatMessage({ id: 'phoibang.validate.soketthuc' }) },
									({ getFieldValue }: { getFieldValue: FormInstance['getFieldValue'] }) => ({
										validator(_: any, value: any) {
											const startNum = getFieldValue('startNumber');
											if (
												value === undefined ||
												value === null ||
												startNum === undefined ||
												startNum === null ||
												value >= startNum
											) {
												return Promise.resolve();
											}
											return Promise.reject(new Error(intl.formatMessage({ id: 'phoibang.validate.soketthuclonhon' })));
										},
									}),
								]}
							>
								<InputNumber style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'phoibang.placeholder.vd100' })} min={0} />
							</Form.Item>
						</Col>

						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: 'phoibang.form.ngaynhap' })} rules={[{ required: true }]} name='ngayNhap'>
								<MyDatePicker />
							</Form.Item>
						</Col>
					</>
				)}

				<Col span={24}>
					<Form.Item label={intl.formatMessage({ id: 'phoibang.column.ghichu' })} name='ghiChu'>
						<Input.TextArea rows={2} placeholder={intl.formatMessage({ id: 'phoibang.placeholder.ghichu' })} />
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

export default TabBieuMauPhoiBang;
