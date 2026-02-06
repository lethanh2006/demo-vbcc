import { ETrangThaiYeuCauVanBang } from '@/services/VanBang/LichSuVanBang/constant';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalXuLyPhuLuc = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	title: string;
	trangThai: ETrangThaiYeuCauVanBang;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visible, setVisible, title, trangThai, getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, setVisibleForm, xuLyYauCauVanBangModel } = useModel('vbcc.lichsuvanbang');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visible]);

	const onFinish = async (values: any) => {
		xuLyYauCauVanBangModel(
			record?._id ?? '',
			{
				trangThai: trangThai,
				thoiGianXacNhan: dayjs(),
				ghiChu: values.ghiChu,
			},
			getData,
		).then(() => {
			setVisible(false);
			setVisibleForm(false);
		});
	};

	return (
		<Modal open={visible} onCancel={() => setVisible(false)} title={title} footer={null} width={600}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div
					style={{ fontSize: 48 }}
					className={trangThai === ETrangThaiYeuCauVanBang.DA_DUYET ? 'text-success' : 'text-error'}
				>
					{trangThai === ETrangThaiYeuCauVanBang.DA_DUYET ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
				</div>
				<div>
					{trangThai === ETrangThaiYeuCauVanBang.DA_DUYET
						? intl.formatMessage(
								{ id: 'xulydexuat.modal.message.chapnhan' },
								{ type: record?.loai.toLocaleLowerCase() },
							)
						: intl.formatMessage({ id: 'xulydexuat.modal.message.tuchoi' }, { type: record?.loai.toLocaleLowerCase() })}
				</div>
			</div>

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='ghiChu' label={intl.formatMessage({ id: 'xulydexuat.modal.ghichu' })}>
							<Input placeholder={intl.formatMessage({ id: 'xulydexuat.modal.placeholder.ghichu' })} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'xulydexuat.modal.button.xacnhan' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXuLyPhuLuc;
