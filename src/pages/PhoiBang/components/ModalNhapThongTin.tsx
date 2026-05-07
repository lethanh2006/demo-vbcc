import MyDatePicker from '@/components/MyDatePicker';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Button, Col, Form, InputNumber, Modal, Row, Input, Select } from 'antd';
import { ETrangThaiPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';

const ModalNhapThongTinPhoiBang = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		modalConfig,
		setModalConfig,
		formSubmiting,
		postYeuCauCapMoiModel,
		postYeuCauHuyBieuMauModel,
		getModel,
	} = useModel('vbcc.bieumauphoibang');
	const { getModel: getLichSu } = useModel('vbcc.lichsuphoibang');
	const { getModel: getPhoiBang } = useModel('vbcc.phoibang');

	const { visible, type, activeRecord } = modalConfig || {};

	useEffect(() => {
		if (!visible) resetFieldsForm(form, { ngayNhap: dayjs() });
	}, [visible, form]);

	const handleCancel = () => {
		setModalConfig({ visible: false, type: undefined, activeRecord: undefined });
	};

	const handleOk = async (values: any) => {
		const payload = {
			id: activeRecord?._id,
			dinhDangSoHieu: activeRecord?.dinhDangSoHieu,
			soBatDau: values.startNumber,
			soKetThuc: values.endNumber,
			ngayNhap: values.ngayNhap,
			ghiChu: values.ghiChu !== undefined ? values.ghiChu : activeRecord?.ghiChu,
			ten: activeRecord?.ten,
			loai: values.loai,
			soKyTuPhoiBang: activeRecord?.soKyTuPhoiBang,
		};

		try {
			if (type === 'CAP_MOI') {
				await postYeuCauCapMoiModel(payload, getModel).then(() => {
					getLichSu();
					getPhoiBang();
				});
			} else if (type === 'HUY') {
				await postYeuCauHuyBieuMauModel(payload, getModel).then(() => {
					getLichSu();
					getPhoiBang();
				});
			}
			handleCancel();
		} catch (_) { }
	};

	const renderFooter = () => {
		return [
			<Button key="submit" type="primary" loading={formSubmiting} onClick={() => form.submit()}>
				{intl.formatMessage({ id: 'global.button.xacnhan' })}
			</Button>,
			<Button key="back" onClick={handleCancel}>
				{intl.formatMessage({ id: 'global.button.huy' })}
			</Button>,
		];
	};

	const title = type === 'CAP_MOI' 
		? intl.formatMessage({ id: 'phoibang.modal.capmoi.title' }) 
		: intl.formatMessage({ id: 'phoibang.modal.huy.title' });

	return (
		<Modal
			title={title}
			open={visible}
			onCancel={handleCancel}
			onOk={() => form.submit()}
			confirmLoading={formSubmiting}
			footer={renderFooter()}
		>
			<Form	
				form={form}
				layout='vertical'
				onFinish={handleOk}
				initialValues={{ ngayNhap: dayjs() }}
			>
				<Row gutter={[12, 0]}>
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
							<MyDatePicker defaultValue={dayjs()} />
						</Form.Item>
					</Col>
					{type === 'HUY' && (
						<Col span={24}>
							<Form.Item
								label={intl.formatMessage({ id: 'phoibang.column.trangthai' })}
								name='loai'
								rules={[...rules.required]}
							>
								<Select placeholder={intl.formatMessage({ id: 'phoibang.placeholder.trangthai' })}>
									<Select.Option value={ETrangThaiPhoiBang.HUY}>{ETrangThaiPhoiBang.HUY}</Select.Option>
									<Select.Option value={ETrangThaiPhoiBang.THAT_LAC}>{ETrangThaiPhoiBang.THAT_LAC}</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					)}
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'phoibang.column.ghichu' })} name='ghiChu'>
							<Input.TextArea rows={2} placeholder={intl.formatMessage({ id: 'phoibang.placeholder.ghichu' })} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default ModalNhapThongTinPhoiBang;
