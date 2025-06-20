import UploadFile from '@/components/Upload/UploadFile';
import { ipIPFS, preIPFS } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { AuditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popover, Row, message } from 'antd';
import { create as createIPFS } from 'ipfs-http-client';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormNguoiKyVanBang = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('vbcc.nguoiky');
	const [clientIPFS] = useState(createIPFS({ url: ipIPFS }));
	const intl = useIntl();
	const [form] = Form.useForm();

	const addIPFS = async (file: any) => preIPFS + (await clientIPFS.add(file?.originFileObj))?.path;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else {
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
				postModel({ ...values, certIpfs })
					.then()
					.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} người ký văn bằng`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						<Form.Item name='hoTen' label='Họ tên' rules={[...rules.required, ...rules.text, ...rules.length(150)]}>
							<Input placeholder='Nhập họ tên người ký' />
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
						<Form.Item name='chucVu' label='Chức vụ' rules={[...rules.text, ...rules.length(200)]}>
							<Input placeholder='Nhập chức vụ' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='email' label='Email' rules={[...rules.text, ...rules.email, ...rules.length(50)]}>
							<Input placeholder='Nhập email' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='soDienThoai' label='SĐT' rules={[...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>

					<Col span={24}>
						{edit ? (
							<div style={{ marginBottom: 24 }}>
								<a href={record?.certIpfs} target='_blank' rel='noreferrer'>
									<AuditOutlined /> Xem chữ ký số
								</a>
							</div>
						) : (
							<Form.Item
								name='certIpfs'
								label={
									<>
										Chữ ký số
										<Popover
											content={
												<>
													File chữ ký số dưới dạng .crt, dùng để xác thực định danh cá nhân.
													<br />
													Mỗi người sẽ có 1 file chữ ký số riêng biệt, được cơ quan có thẩm quyền cấp.
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
