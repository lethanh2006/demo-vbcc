import { Button, Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectSoVanBang from '../../SoVanBang/components/Select';

interface Props {
	onNext: (values: any, draftList: any[]) => void;
	onCancel: () => void;
}

const ModalSinhSo: React.FC<Props> = ({ onNext, onCancel }) => {
	const [form] = Form.useForm();
	const intl = useIntl();
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { sortPhuLucTamModel, formSubmiting } = useModel('vbcc.phulucvanbang');
	const { danhSach: dsSoVanBang } = useModel('vbcc.sovanbang');

	useEffect(() => {
		form.setFieldsValue({
			soVaoSoHienTai: recQuyetDinh?.soVanBang?.soVaoSoHienTai,
			idSoVanBang: recQuyetDinh?.soVanBang?._id,
			ruleSortPhuLuc: recQuyetDinh?.soVanBang?.ruleSortPhuLuc,
			sinhLaiToanBo: false,
		});
	}, [recQuyetDinh]);

	const onFinish = async (values: any) => {
		if (!recQuyetDinh?._id) return;

		try {
			const res = await sortPhuLucTamModel(recQuyetDinh._id, values);
			onNext(values, res?.data ?? []);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item label='Sổ văn bằng' name='idSoVanBang'>
						<SelectSoVanBang
							onChange={(val) => {
								const index = dsSoVanBang?.find((item) => item?._id === val);
								form.setFieldsValue({
									soVaoSoHienTai: index?.soVaoSoHienTai,
								});
							}}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Số vào sổ hiện tại' name='soVaoSoHienTai'>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập số vào sổ' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name='sinhLaiToanBo'
						valuePropName='checked'
						extra='Nếu chọn, toàn bộ số vào sổ sẽ được sinh lại từ đầu, có thể thay đổi các số đã cấp trước đó.'
					>
						<Checkbox>Sinh lại toàn bộ</Checkbox>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='ruleSortPhuLuc' extra='Quy tắc sắp xếp phụ lục trong sổ văn bằng'>
						<Input
							onChange={(e) => {
								const value = e.target.value;
								const index = dsSoVanBang?.find((item) => item?._id === value);
								form.setFieldsValue({
									ruleSortPhuLuc: index?.ruleSortPhuLuc,
								});
							}}
							disabled
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} type='primary' htmlType='submit'>
					Tiếp theo
				</Button>
				<Button onClick={onCancel}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default ModalSinhSo;
