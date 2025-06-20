import UploadFile from '@/components/Upload/UploadFile';
import { getImportPhuLucVbTemplate } from '@/services/VanBang/PhuLucVanBang';
import rules from '@/utils/rules';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import fileDownload from 'js-file-download';
import { useModel } from 'umi';

const ModalImportPhuLucVanBang = (props: { visible: boolean; onCancel: () => void; onOk: () => void }) => {
	const { visible, onCancel, onOk } = props;
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { formSubmiting, importPhuLucVanBangModel } = useModel('vbcc.phulucvanbang');
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		const file = values.file.fileList?.[0]?.originFileObj;
		if (recQuyetDinh?._id && file)
			importPhuLucVanBangModel({ quyetDinhId: recQuyetDinh?._id, file }).then(() => {
				onOk();
				form.resetFields();
			});
	};

	const onDownloadTemplate = () => {
		if (recQuyetDinh?._id)
			getImportPhuLucVbTemplate(recQuyetDinh._id).then((res) =>
				fileDownload(res.data, `Mẫu nhập Phụ lục văn bằng QĐ ${recQuyetDinh.soQuyetDinh}.xlsx`),
			);
	};

	return (
		<Modal title='Nhập phụ lục văn bằng' visible={visible} onCancel={onCancel} footer={null} maskClosable={false}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label='Quyết định tốt nghiệp'>
							<Input value={recQuyetDinh?.soQuyetDinh} disabled />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='file' label='Tập tin danh sách phụ lục' rules={[...rules.fileRequired]}>
							<UploadFile drag />
						</Form.Item>
					</Col>

					<Col span={24} style={{ textAlign: 'center', margin: '8px auto 12px', maxWidth: 400 }}>
						<i>Sử dụng tập dữ liệu mẫu để việc xử lý được thực hiện nhanh chóng và chính xác</i>
						<br />
						<Button icon={<DownloadOutlined />} type='link' onClick={onDownloadTemplate}>
							Tải tập tin mẫu
						</Button>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Thực hiện
					</Button>
					<Button onClick={() => onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalImportPhuLucVanBang;
