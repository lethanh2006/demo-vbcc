import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import * as XLSX from 'xlsx';

const { Text } = Typography;

interface IImportError {
	row: any;
	index: number;
	rowErrors: string[];
}

const ModalImportCapBang = ({
	visible,
	onCancel,
	onOk,
	idDotCapBang,
}: {
	visible: boolean;
	onCancel: () => void;
	onOk: () => void;
	idDotCapBang: string;
}) => {
	const { formSubmiting, importPhuLucVanBangCapBangModel, getImportPhuLucCapBangTemplateModel } =
		useModel('vbcc.phulucvanbang');
	const [form] = Form.useForm();
	const [dataThatBai, setDataThatBai] = useState<IImportError[]>([]);
	const [visibleModal, setVisibleModal] = useState(false);
	const [importing, setImporting] = useState(false);

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
			setDataThatBai([]);
		}
	}, [visible]);

	const onFinish = async (values: any) => {
		const file = values.file?.fileList?.[0]?.originFileObj;
		if (!file || !idDotCapBang) return message.error('Vui lòng chọn file và đợt cấp bằng');

		setImporting(true);
		try {
			const buffer = await file.arrayBuffer();
			const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
			const sheet = workbook.Sheets[workbook.SheetNames[0]];
			const data = XLSX.utils.sheet_to_json(sheet);

			if (!data.length) throw new Error('File không có dữ liệu');

			const mappedData = data.map((row: any) => ({
				soHieuVanBang: row['Số hiệu văn bằng'] || '',
				hoTen: row['Họ tên'] || '',
				maSinhVien: row['Mã sinh viên'] || '',
				soVaoSoBang: row['Số vào sổ bằng'] || '',
				idDotCapBang: idDotCapBang,
			}));

			let success = 0;
			const errors: IImportError[] = [];

			for (let i = 0; i < mappedData.length; i++) {
				try {
					const res = await importPhuLucVanBangCapBangModel(mappedData[i], idDotCapBang);
					const validate = res?.data?.validate || [];
					const rowErrors = validate.flatMap((v: any) => v.rowErrors || []);
					if (rowErrors.length) {
						errors.push({ row: data[i], index: i + 1, rowErrors });
					} else success++;
				} catch {
					errors.push({ row: data[i], index: i + 1, rowErrors: ['Lỗi khi xử lý dòng dữ liệu'] });
				}
			}
			message.success(`Import thành công ${success} bản ghi`);
			onOk();
		} catch (err: any) {
			message.error(err.message || 'Có lỗi khi xử lý file');
		} finally {
			setImporting(false);
		}
	};

	const onDownloadTemplate = async () => {
		if (!idDotCapBang) return message.error('Chưa chọn đợt cấp bằng');
		await getImportPhuLucCapBangTemplateModel(idDotCapBang);
		message.success('Tải template thành công');
	};

	const columns: IColumn<IImportError>[] = [
		{ title: 'STT dòng', dataIndex: 'index', width: 80, align: 'center' },
		{
			title: 'Dữ liệu dòng',
			dataIndex: 'row',
			width: 300,
			render: (val) => (
				<div style={{ fontSize: 12 }}>
					{Object.entries(val || {}).map(([k, v]) => (
						<div key={k}>
							<Text strong>{k}:</Text> {String(v)}
						</div>
					))}
				</div>
			),
		},
		{
			title: 'Lỗi',
			dataIndex: 'rowErrors',
			width: 300,
			render: (val) => (
				<>
					{val?.map((err: string, idx: number) => (
						<Tag color='red' key={idx} style={{ marginBottom: 4 }}>
							{err}
						</Tag>
					))}
				</>
			),
		},
	];

	return (
		<Modal
			title='Nhập dữ liệu cấp bằng'
			open={visible}
			onCancel={onCancel}
			footer={null}
			maskClosable={false}
			width={700}
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='file' label='Tập tin danh sách cấp bằng' rules={[...rules.fileRequired]}>
					<UploadFile drag accept='.xlsx,.xls' maxCount={1} />
				</Form.Item>

				<div style={{ textAlign: 'center', marginBottom: 12 }}>
					<i>Dùng tập tin mẫu để xử lý nhanh và chính xác hơn</i>
					<br />
					<Button icon={<DownloadOutlined />} type='link' onClick={onDownloadTemplate} disabled={!idDotCapBang}>
						Tải tập tin mẫu
					</Button>
				</div>

				<div className='form-footer'>
					<Button loading={formSubmiting || importing} htmlType='submit' type='primary'>
						Thực hiện
					</Button>
					<Button onClick={onCancel}>Hủy</Button>
				</div>
			</Form>

			<Modal
				title='Chi tiết lỗi import'
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				width={900}
			>
				<TableStaticData columns={columns} data={dataThatBai} size='small' hasTotal />
				<div className='form-footer'>
					<Button onClick={() => setVisibleModal(false)}>Đóng</Button>
				</div>
			</Modal>
		</Modal>
	);
};

export default ModalImportCapBang;
