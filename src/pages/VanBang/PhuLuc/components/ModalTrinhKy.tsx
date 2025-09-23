import MyDatePicker from '@/components/MyDatePicker';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import dayjs from '@/utils/dayjs';
import { FilePdfOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Descriptions, message, Modal, Radio, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ModalTrinhKyVanBang = (props: { visible: boolean; setVisible: (val: boolean) => void; getData: () => void }) => {
	const { visible, setVisible, getData } = props;

	const { selectedIds, dataToSignOrPush, postTrinhKyVanBangModel } = useModel('vbcc.phulucvanbang');
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');

	const [exporting, setExporting] = useState(false);
	const [ngayThang, setngayThang] = useState<any>(dayjs());
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [selectedMau, setSelectedMau] = useState<string>();
	const [trinhKyLai, setTrinhKyLai] = useState<boolean>(false);

	useEffect(() => {
		if (!visible) {
			setSelectedMau('');
		}
	}, [visible]);

	const onExport = async () => {
		if (exporting) return;

		if (!selectedMau) {
			return message.error('Vui lòng chọn một mẫu trình ký');
		}

		setExporting(true);

		await postTrinhKyVanBangModel(
			{
				listIdVanBang: selectedIds ?? [],
				quyetDinhId: recQuyetDinh?._id ?? '',
				ngay: ngayThang.format('DD'),
				thang: ngayThang.format('MM'),
				nam: ngayThang.format('YYYY'),
				mode: 'PDF',
				trinhKyLai,
				idMauTrinhKy: selectedMau,
			},
			getData,
		)
			.then(() => {
				setVisible(false);
			})
			.finally(() => setExporting(false));

		return;
	};

	return (
		<Modal title='Trình ký văn bằng' open={visible} onCancel={() => setVisible(false)} footer={null}>
			<div style={{ marginBottom: 12 }}>
				<i>
					Sau khi xác nhận trình ký, hệ thống sẽ <strong>sinh file</strong> dựa trên mẫu trình ký đã chọn.
				</i>
			</div>
			<Descriptions column={1}>
				<Descriptions.Item label='Quyết định'>
					{recQuyetDinh?.soQuyetDinh ?? dataToSignOrPush[0]?.quyetDinh?.soQuyetDinh}
				</Descriptions.Item>
				<Descriptions.Item label='Mô tả'>
					{recQuyetDinh?.noiDung ?? dataToSignOrPush[0]?.quyetDinh?.noiDung}
				</Descriptions.Item>
				<Descriptions.Item label='Số phụ lục'>{dataToSignOrPush?.length || 'Tất cả'} phụ lục</Descriptions.Item>
				<Descriptions.Item label='Mẫu trình ký'>
					<Radio.Group value={selectedMau} onChange={(e) => setSelectedMau(e.target.value)}>
						<Space direction='vertical'>
							{recQuyetDinh?.bieuMau?.listIdFileBieuMau?.map((item, idx: number) => (
								<Radio key={item.idFile} value={item.idFile}>
									<a
										onClick={(e) => {
											e.preventDefault();
											setPreviewImage(item.idFile);
											setPreviewOpen(true);
										}}
									>
										{item?.ten ?? `Tệp tin ${idx + 1}`}
									</a>
								</Radio>
							))}
						</Space>
					</Radio.Group>
				</Descriptions.Item>
				<Descriptions.Item label='Ngày trình ký'>
					<MyDatePicker value={ngayThang} onChange={(val) => setngayThang(dayjs(val))} />
				</Descriptions.Item>
				<Descriptions.Item label='Tùy chọn'>
					<Checkbox checked={trinhKyLai} onChange={(e) => setTrinhKyLai(e.target.checked)}>
						Trình ký lại
					</Checkbox>
					<Tooltip title='Chọn nếu muốn trình ký lại văn bằng đã từng được trình ký trước đó (ví dụ: chỉnh sửa thông tin, thay đổi mẫu).'>
						<InfoCircleOutlined type='text' />
					</Tooltip>
				</Descriptions.Item>
			</Descriptions>

			<div className='form-footer' style={{ marginTop: 16 }}>
				<Button type='primary' loading={exporting} onClick={onExport} icon={<FilePdfOutlined />}>
					Xác nhận trình ký
				</Button>
				<Button onClick={() => setVisible(false)}>Hủy</Button>
			</div>

			<ModalExpandable
				title='Xem trước tập tin'
				width={1000}
				open={previewOpen}
				footer={null}
				onCancel={() => setPreviewOpen(false)}
			>
				<PreviewFile file={previewImage} isFileId />
				<div className='form-footer' style={{ marginTop: 16, textAlign: 'right' }}>
					<Button onClick={() => setPreviewOpen(false)}>Đóng</Button>
				</div>
			</ModalExpandable>
		</Modal>
	);
};

export default ModalTrinhKyVanBang;
