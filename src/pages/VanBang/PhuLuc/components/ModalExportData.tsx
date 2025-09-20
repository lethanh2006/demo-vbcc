import MyDatePicker from '@/components/MyDatePicker';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import { exportData } from '@/services/VanBang/PhuLucVanBang';
import dayjs from '@/utils/dayjs';
import socket, { ESocketType } from '@/utils/socket';
import { FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Descriptions, message, Modal, Progress, Radio, Row, Space, Tabs, Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ModalExportData = () => {
	const { visiblePrint, setVisiblePrint, dataToSignOrPush } = useModel('vbcc.phulucvanbang');
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const [exporting, setExporting] = useState(false);
	const [exportDetail, setExportDetail] = useState<{ total: number; current: number }>({
		total: 0,
		current: 0,
	});
	const exportStatus = exportDetail.current === exportDetail.total && exportDetail.total > 0 ? 'Done' : 'None';
	const [fileList, setFileList] = useState<any[]>([]);
	const [ngayThang, setngayThang] = useState<any>(dayjs());
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	const [selectedMaus, setSelectedMaus] = useState<string[]>([]);
	const [mode, setMode] = useState<'PDF' | 'DOCX'>('PDF');

	useEffect(() => {
		if (!visiblePrint) {
			setSelectedMaus([]);
			setFileList([]);
		}

		setExportDetail({ current: 0, total: dataToSignOrPush?.length });

		// if (recQuyetDinh?.bieuMau?.listIdFileBieuMau?.length) {
		// 	setSelectedMaus([recQuyetDinh?.bieuMau?.listIdFileBieuMau[0]?.idFile]);
		// } else if (dataToSignOrPush[0]?.quyetDinh?.bieuMau?.listIdFileBieuMau?.length) {
		// 	setSelectedMaus([dataToSignOrPush[0]?.quyetDinh?.bieuMau?.listIdFileBieuMau[0]?.idFile]);
		// } else {
		// 	setSelectedMaus([]);
		// }
	}, [visiblePrint]);

	const increExportCurrent = () => setExportDetail(({ current, total }) => ({ total, current: current + 1 }));

	useEffect(() => {
		socket.on(ESocketType.DATA_EXPORTED, () => increExportCurrent());
	}, []);

	const onExport = async () => {
		if (exporting) return;

		if (!selectedMaus.length && !fileList.length) {
			return message.error('Không có mẫu in phụ lục. Vui lòng chọn hoặc upload mẫu mới');
		}

		setExporting(true);

		let idsMau: string[] = [];

		if (fileList.length && fileList[0].originFileObj) {
			const res = await uploadFile({
				file: fileList[0].originFileObj,
				scope: EFileScope.PUBLIC,
			});
			const uploadedId = res.data?.data?.file?._id;
			if (uploadedId) {
				idsMau = [uploadedId];
			}
		} else if (selectedMaus.length) {
			idsMau = selectedMaus;
		}

		await exportData({
			idMau: idsMau,
			quyetDinhId: recQuyetDinh?._id,
			listIdVanBang: dataToSignOrPush.map((item) => item._id),
			ngay: ngayThang.format('DD'),
			thang: ngayThang.format('MM'),
			nam: ngayThang.format('YYYY'),
			mode,
		})
			.then(() => {
				// message.success('Lưu thành công');
				message.info('Đang xử lý dữ liệu. Vui lòng đợi trong ít phút...');
				// fileDownload(res.data, getFilenameHeader(res));

				setVisiblePrint(false);
			})
			.finally(() => setExporting(false));

		return;
	};

	const beforeUpload = (file: RcFile) => {
		const isLt5M = file.size / 1024 / 1024 < 2;
		if (!isLt5M) {
			message.error('Dung lượng file phải nhỏ hơn 2MB!');
		}
		return isLt5M;
	};

	const mauOptions =
		recQuyetDinh?.bieuMau?.listIdFileBieuMau || dataToSignOrPush[0]?.quyetDinh?.bieuMau?.listIdFileBieuMau || [];

	return (
		<Modal
			open={visiblePrint}
			closable={false}
			maskClosable={false}
			onCancel={() => setVisiblePrint(false)}
			title='In phụ lục'
			footer={null}
		>
			{recQuyetDinh?._id || dataToSignOrPush.length === 1 ? (
				<Descriptions column={1}>
					<Descriptions.Item label='Quyết định'>
						{recQuyetDinh?.soQuyetDinh ?? dataToSignOrPush[0]?.quyetDinh?.soQuyetDinh}
					</Descriptions.Item>
					<Descriptions.Item label='Mô tả'>
						{recQuyetDinh?.noiDung ?? dataToSignOrPush[0]?.quyetDinh?.noiDung}
					</Descriptions.Item>
					<Descriptions.Item label='Số mục thống kê'>{dataToSignOrPush?.length || 'Tất cả'} phụ lục</Descriptions.Item>
					<Descriptions.Item label='Mẫu in phụ lục'>
						<Tabs
							style={{ marginTop: -10 }}
							size='small'
							defaultActiveKey={mauOptions.length ? 'select' : 'upload'}
							items={[
								{
									key: 'select',
									label: 'Chọn mẫu có sẵn',
									children: mauOptions.length ? (
										<Checkbox.Group
											value={selectedMaus}
											onChange={(checkedValues) => setSelectedMaus(checkedValues as string[])}
										>
											<Space direction='vertical'>
												{mauOptions.map((item, idx: number) => (
													<div key={item.idFile}>
														<Checkbox value={item.idFile}>
															<a
																onClick={(e) => {
																	e.preventDefault();
																	setPreviewImage(item.idFile);
																	setPreviewOpen(true);
																}}
															>
																{item?.ten ?? `Tệp tin ${idx + 1}`}
															</a>
														</Checkbox>
													</div>
												))}
											</Space>
										</Checkbox.Group>
									) : (
										<i style={{ color: 'red' }}>(chưa có mẫu)</i>
									),
								},
								{
									key: 'upload',
									label: 'Upload mẫu mới',
									children: (
										<Upload
											customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
											fileList={fileList}
											onChange={({ fileList: fl }) => setFileList(fl)}
											accept='.doc,.docx'
											maxCount={1}
											beforeUpload={beforeUpload}
										>
											<Button icon={<UploadOutlined />}>Chọn tệp mẫu mới</Button>
										</Upload>
									),
								},
							]}
						/>
					</Descriptions.Item>
					<Descriptions.Item label='Ngày in phụ lục'>
						<MyDatePicker value={ngayThang} onChange={(val) => setngayThang(dayjs(val))} />
					</Descriptions.Item>
					<Descriptions.Item label='Định dạng xuất file'>
						<Radio.Group value={mode} onChange={(e) => setMode(e.target.value)} size='small'>
							<Radio.Button value='PDF'>PDF</Radio.Button>
							<Radio.Button value='DOCX'>DOCX</Radio.Button>
						</Radio.Group>
					</Descriptions.Item>
				</Descriptions>
			) : null}

			<div style={{ marginTop: 12, marginBottom: 12 }} className='text-error'>
				Chú ý: Quá trình in phụ lục có thể mất một khoảng thời gian tùy thuộc vào số lượng phụ lục. Hệ thống sẽ gửi
				thông báo đường dẫn tải về khi hoàn tất.
				<br />
				Vui lòng không lặp lại thao tác trong khi đang thực hiện.
			</div>

			{exporting && (
				<>
					<div style={{ marginTop: 24, width: '100%' }}>
						<Progress
							percent={exportDetail.current === 0 ? 0 : Math.round((exportDetail.current / exportDetail.total) * 100)}
							status={exportStatus !== 'Done' ? 'active' : 'normal'}
						/>
					</div>

					<Row justify='center'>
						<Col>
							<span>({`${exportDetail.current}/${exportDetail.total} bản`}). </span>
							{exportStatus !== 'Done' ? <>Vui lòng đợi trong ít phút....</> : <>Quá trình đã hoàn tất</>}
						</Col>
					</Row>
				</>
			)}

			<div className='form-footer'>
				<Button type='primary' loading={exporting} onClick={onExport} icon={<FilePdfOutlined />}>
					In phụ lục
				</Button>
				<Button onClick={() => setVisiblePrint(false)}>Hủy</Button>
			</div>

			<ModalExpandable
				title='Xem trước tập tin'
				width={1000}
				open={previewOpen}
				footer={null}
				onCancel={() => setPreviewOpen(false)}
			>
				<PreviewFile file={previewImage} isFileId />

				<div className='form-footer'>
					<Button onClick={() => setPreviewOpen(false)}>Đóng</Button>
				</div>
			</ModalExpandable>
		</Modal>
	);
};

export default ModalExportData;
