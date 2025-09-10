import MyDatePicker from '@/components/MyDatePicker';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalCapBang = (props: { visible: boolean; setVisible: (val: boolean) => void; getData: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visible, setVisible, getData } = props;
	const { selectedIds, formSubmiting, putManyModel, setSelectedIds } = useModel('vbcc.phulucvanbang');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				ngayCapPhuLuc: dayjs(),
			});
		}
	}, [visible]);

	const onFinish = async (values: PhuLucVanBang.IRecord) => {
		if (!selectedIds || selectedIds.length === 0) {
			message.warning('Vui lòng chọn ít nhất một phụ lục');
			return;
		}

		try {
			await putManyModel(
				selectedIds,
				{
					kichHoat: true,
					ngayCapPhuLuc: values.ngayCapPhuLuc,
					ghiChu: values.ghiChu,
				},
				getData(),
			);

			setSelectedIds([]);
			setVisible(false);
		} catch (error) {
			message.error('Có lỗi xảy ra khi cập nhật trạng thái cấp bằng');
		}
	};

	return (
		<Modal title='Xác nhận cấp bằng' open={visible} onCancel={() => setVisible(false)} footer={null}>
			<div style={{ marginBottom: 16 }}>
				<h3>Thông tin cấp bằng</h3>
				<p>
					Số lượng phụ lục được chọn: <strong>{selectedIds?.length}</strong>
				</p>
			</div>

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label='Ngày cấp bằng' name='ngayCapPhuLuc' rules={[...rules.required]}>
							<MyDatePicker placeholder='Chọn ngày cấp bằng' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label='Ghi chú cấp bằng' name='ghiChu'>
							<Input.TextArea rows={3} placeholder='Nhập ghi chú cấp bằng (nếu có)...' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalCapBang;
