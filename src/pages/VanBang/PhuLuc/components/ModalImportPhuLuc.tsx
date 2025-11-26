import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import { getImportPhuLucVbTemplate } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Tag, Typography, message } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Text } = Typography;

const ModalImportPhuLucVanBang = (props: {
	visible: boolean;
	onCancel: () => void;
	onOk: () => void;
	params?: any;
}) => {
	const { visible, onCancel, onOk, params } = props;
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { formSubmiting, importPhuLucVanBangModel } = useModel('vbcc.phulucvanbang');
	const [form] = Form.useForm();
	const [dataThatBai, setDataThatBai] = useState<PhuLucVanBang.IImportPhuLuc[]>([]);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		}
	}, [visible]);

	const onFinish = (values: any) => {
		const file = values.file.fileList?.[0]?.originFileObj;
		if (recQuyetDinh?._id && file)
			importPhuLucVanBangModel({ quyetDinhId: recQuyetDinh?._id, file }, params).then((res) => {
				if (res?.success === false) {
					message.error('Nhập dữ liệu thất bại');
					setDataThatBai(res?.error ?? []);
					setVisibleModal(true);
				} else {
					message.success('Nhập dữ liệu thành công');
					onOk();
				}
			});
	};

	const onDownloadTemplate = () => {
		if (recQuyetDinh?._id)
			getImportPhuLucVbTemplate(recQuyetDinh._id, params).then((res) =>
				fileDownload(res.data, `Mẫu nhập Phụ lục văn bằng QĐ ${recQuyetDinh.soQuyetDinh}.xlsx`),
			);
	};

	const columns: IColumn<PhuLucVanBang.IImportPhuLuc>[] = [
		{
			title: 'Trường dữ liệu',
			dataIndex: 'field',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Dòng lỗi',
			dataIndex: ['tableError', 'row'],
			width: 100,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Cột lỗi',
			dataIndex: ['tableError', 'column'],
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Loại dữ liệu',
			dataIndex: ['tableError', 'columnType'],
			width: 120,
			align: 'center',
			render: (val) => <Tag color='blue'>{val}</Tag>,
			filterType: 'string',
		},
		{
			title: 'Giá trị lỗi',
			dataIndex: ['tableError', 'value'],
			width: 120,
			render: (val) => <Tag color='red'>{val}</Tag>,
			filterType: 'string',
		},
		{
			title: 'Thông báo lỗi',
			dataIndex: ['tableError', 'error'],
			width: 180,
			render: (val) => <Text type='danger'>{val}</Text>,
			filterType: 'string',
		},
	];

	return (
		<Modal title='Nhập phụ lục văn bằng' open={visible} onCancel={onCancel} footer={null} maskClosable={false}>
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

			<Modal
				title='Chi tiết thông tin lỗi'
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				width={900}
			>
				<TableStaticData columns={columns} data={dataThatBai} size='small' hasTotal addStt />

				<div className='form-footer'>
					<Button onClick={() => setVisibleModal(false)}>Hủy</Button>
				</div>
			</Modal>
		</Modal>
	);
};

export default ModalImportPhuLucVanBang;
