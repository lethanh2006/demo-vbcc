import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiPhucDap } from '@/services/VanBang/constant';
import rules from '@/utils/rules';
import { Col, Form, FormInstance, Input, Row, Select } from 'antd';

const FormPhucDap = (props: { form: FormInstance }) => {
	const { form } = props;
	const loaiPhucDap: ELoaiPhucDap = Form.useWatch('loaiPhucDap', form);

	return (
		<Row gutter={[12, 0]}>
			<Col span={24}>
				<Form.Item name='loaiPhucDap' label='Loại phúc đáp' rules={[...rules.required]}>
					<Select
						placeholder='Chọn loại phúc đáp'
						options={Object.values(ELoaiPhucDap).map((item) => ({
							key: item,
							value: item,
							label: item,
						}))}
					/>
				</Form.Item>
			</Col>
			{loaiPhucDap === ELoaiPhucDap.VAN_BAN_GIAY ? (
				<>
					<Col span={24}>
						<Form.Item name='noiDungPhucDap' label='Nội dung phúc đáp'>
							<Input.TextArea rows={3} placeholder='Nhập nội dung' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='filePhucDap' label='File phúc đáp' extra={<a>Tải file mẫu</a>}>
							<UploadFile maxCount={5} />
						</Form.Item>
					</Col>
				</>
			) : null}
		</Row>
	);
};

export default FormPhucDap;
