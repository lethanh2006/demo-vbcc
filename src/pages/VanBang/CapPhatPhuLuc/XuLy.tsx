import MyDatePicker from '@/components/MyDatePicker';
import { ETrangThaiCapBang } from '@/services/VanBang/constant';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalXuLyCapBang = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	title: string;
	trangThai?: ETrangThaiCapBang;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visible, setVisible, title, trangThai, getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, setVisibleForm, capPhatVanBangModel } = useModel('vbcc.phulucvanbang');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				...record,
				ngayCapPhuLuc: dayjs(),
			});
		}
	}, [record?._id, visible]);

	const onFinish = async (values: PhuLucVanBang.IRecord) => {
		capPhatVanBangModel(
			record?._id ?? '',
			{
				...record,
				...values,
				trangThai: trangThai,
				ngayCapPhuLuc: trangThai === ETrangThaiCapBang.DA_CAP_BANG ? values.ngayCapPhuLuc : null,
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
					className={trangThai === ETrangThaiCapBang.DA_CAP_BANG ? 'text-success' : 'text-error'}
				>
					{trangThai === ETrangThaiCapBang.DA_CAP_BANG ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
				</div>
				<div>
					{trangThai === ETrangThaiCapBang.DA_CAP_BANG
						? intl.formatMessage({ id: 'capphatvanbang.xuly.message.confirmed' })
						: intl.formatMessage({ id: 'capphatvanbang.xuly.message.notconfirmed' })}
				</div>
			</div>

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{trangThai === ETrangThaiCapBang.DA_CAP_BANG ? (
						<Col span={24}>
							<Form.Item
								name='ngayCapPhuLuc'
								label={intl.formatMessage({ id: 'capphatvanbang.xuly.label.thoigiancapphat' })}
								rules={[...rules.required]}
							>
								<MyDatePicker />
							</Form.Item>
						</Col>
					) : null}
					<Col span={24}>
						<Form.Item name='ghiChuCapBang' label={intl.formatMessage({ id: 'capphatvanbang.xuly.label.ghichu' })}>
							<Input placeholder={intl.formatMessage({ id: 'capphatvanbang.xuly.placeholder.ghichu' })} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'capphatvanbang.xuly.button.xacnhan' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXuLyCapBang;
