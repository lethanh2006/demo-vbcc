import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ELoaiPhucDap, ETrangThaiXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ModalPhucDap = (props: { visible: boolean; setVisible: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visible, setVisible } = props;
	const { record, formSubmiting, putModel, setFormSubmiting } = useModel('vbcc.xacminhvanbang');
	const loaiPhucDap: ELoaiPhucDap = Form.useWatch('loaiPhucDap', form);
	const [trangThai, setTrangThai] = useState<ETrangThaiXacMinh>(ETrangThaiXacMinh.CHO_XU_LY);

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				...record,
				loaiPhucDap: record?.loaiPhucDap ?? ELoaiPhucDap.VAN_BAN_GIAY,
			});
		}
	}, [visible]);

	const onFinish = async (values: XacMinhVanBang.IRecord) => {
		values.trangThaiXacMinh = trangThai;
		setFormSubmiting(true);
		const filePhucDap = await buildUpLoadFile(values, 'filePhucDap');
		values.filePhucDap = filePhucDap;
		setFormSubmiting(false);

		putModel(record?._id ?? '', values)
			.then(() => setVisible(false))
			.catch((err) => console.log(err));
	};

	return (
		<Modal title='Xác nhận yêu cầu chỉnh sửa' open={visible} onCancel={() => setVisible(false)} footer={null}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
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

				<div className='form-footer'>
					<Button
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setTrangThai(ETrangThaiXacMinh.DANG_XAC_MINH);
							form.submit();
						}}
					>
						Tiến hành xác minh
					</Button>
					<Button
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setTrangThai(ETrangThaiXacMinh.TRA_KET_QUA);
							form.submit();
						}}
						className='btn-success'
					>
						Trả kết quả
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalPhucDap;
