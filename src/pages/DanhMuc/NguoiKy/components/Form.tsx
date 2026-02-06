import UploadFile from '@/components/Upload/UploadFile';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { ELoaiChuKy } from '@/services/VanBang/constant';
import { NguoiKyVanBang } from '@/services/VanBang/NguoiKy/typing';
import { ipIPFS, preIPFS } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { AuditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popover, Row, Select, message } from 'antd';
import { create as createIPFS } from 'ipfs-http-client';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormNguoiKyVanBang = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('vbcc.nguoiky');
	const { settings } = useModel('tienich.caidat');
	const { INFO_TENANT: settingVbcc } = settings;
	const [clientIPFS] = useState(createIPFS({ url: ipIPFS }));
	const intl = useIntl();
	const [form] = Form.useForm();

	const addIPFS = async (file: any) => preIPFS + (await clientIPFS.add(file?.originFileObj))?.path;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: NguoiKyVanBang.IRecord) => {
		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				undefined,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.button.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else if (settingVbcc?.require_IPFS) {
			let certIpfs = '';
			setFormSubmiting(true);
			try {
				certIpfs = await addIPFS(values.certIpfs?.fileList?.at(-1));
			} catch (error) {
				console.log(error);
				message.error('Có lỗi xảy ra');
			} finally {
				setFormSubmiting(false);
			}

			if (certIpfs)
				postModel(
					{ ...values, certIpfs },
					undefined,
					undefined,
					intl.formatMessage({ id: 'global.button.themmoithanhcong' }),
				)
					.then()
					.catch((er) => console.log(er));
		} else
			postModel(values, undefined, undefined, intl.formatMessage({ id: 'global.button.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit ? intl.formatMessage({ id: 'nguoiky.form.chinhsua' }) : intl.formatMessage({ id: 'nguoiky.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item
							name='ssoId'
							label={intl.formatMessage({ id: 'nguoiky.form.nguoiky' })}
							extra={intl.formatMessage({ id: 'nguoiky.form.nguoiky.extra' })}
						>
							<SelectNhanSuDebounce
								allowClear
								onChange={(val, option) => {
									const nhanSu = option?.rawData;
									form.setFieldsValue({
										hoTen: nhanSu?.hoTen,
										email: nhanSu?.emailCanBo,
										soDienThoai: nhanSu?.soDienThoai,
										chucVu: nhanSu?.chucVuChinh?.ten,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='hoTen'
							label={intl.formatMessage({ id: 'nguoiky.form.hoten' })}
							rules={[...rules.required, ...rules.text, ...rules.length(150)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'nguoiky.form.hoten.place' })} />
						</Form.Item>
					</Col>
					{/* <Col span={24} md={12}>
						<Form.Item name='idTenant' label='Trường' rules={[...rules.required]}>
							<Select
								options={danhSach?.map((tenant) => ({
									key: tenant._id,
									value: tenant._id,
									label: tenant.kyHieuTruong + ' - ' + tenant.tenDayDu,
								}))}
								disabled={edit}
							/>
						</Form.Item>
					</Col> */}
					<Col span={24} md={12}>
						<Form.Item
							name='chucVu'
							label={intl.formatMessage({ id: 'nguoiky.form.chucvu' })}
							rules={[...rules.text, ...rules.length(200)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'nguoiky.form.chucvu.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='email'
							label={intl.formatMessage({ id: 'nguoiky.form.email' })}
							rules={[...rules.text, ...rules.email, ...rules.length(50)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'nguoiky.form.email.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='soDienThoai'
							label={intl.formatMessage({ id: 'nguoiky.form.sdt' })}
							rules={[...rules.soDienThoai]}
						>
							<Input placeholder={intl.formatMessage({ id: 'nguoiky.form.sdt.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='loaiChuKy'
							label={intl.formatMessage({ id: 'nguoiky.form.loai' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'nguoiky.form.loai.place' })}
								options={Object.values(ELoaiChuKy).map((item) => ({
									label: item,
									value: item,
								}))}
							/>
						</Form.Item>
					</Col>

					{settingVbcc?.require_IPFS && (
						<Col span={24} md={12}>
							{edit ? (
								<div style={{ marginBottom: 24 }}>
									<a href={record?.certIpfs} target='_blank' rel='noreferrer'>
										<AuditOutlined /> {intl.formatMessage({ id: 'nguoiky.form.certIpfs.xem' })}
									</a>
								</div>
							) : (
								<Form.Item
									name='certIpfs'
									label={
										<>
											{intl.formatMessage({ id: 'nguoiky.form.certIpfs' })}
											<Popover
												content={
													<>
														{intl.formatMessage({ id: 'nguoiky.form.certIpfs.extra' })}
														<br />
														{intl.formatMessage({ id: 'nguoiky.form.certIpfs.extra1' })}
													</>
												}
											>
												<QuestionCircleOutlined style={{ marginLeft: 8 }} />
											</Popover>
										</>
									}
									rules={[...rules.fileRequired]}
								>
									<UploadFile accept='.crt' maxCount={1} />
								</Form.Item>
							)}
						</Col>
					)}
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

export default FormNguoiKyVanBang;
