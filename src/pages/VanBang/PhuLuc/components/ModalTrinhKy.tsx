import MyDatePicker from '@/components/MyDatePicker';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import dayjs from '@/utils/dayjs';
import { FilePdfOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Descriptions, message, Modal, Radio, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ModalTrinhKyVanBang = (props: { visible: boolean; setVisible: (val: boolean) => void; getData: () => void }) => {
	const intl = useIntl();
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
			return message.error(intl.formatMessage({ id: 'modaltrinhky.error.selecttemplate' }));
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
		<Modal
			title={intl.formatMessage({ id: 'modaltrinhky.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
		>
			<div style={{ marginBottom: 12 }}>
				<i>
					<span
						dangerouslySetInnerHTML={{
							__html: intl.formatMessage({ id: 'modaltrinhky.description' }),
						}}
					/>
				</i>
			</div>
			<Descriptions column={1}>
				<Descriptions.Item label={intl.formatMessage({ id: 'modaltrinhky.label.quyetdinh' })}>
					{recQuyetDinh?.soQuyetDinh ?? dataToSignOrPush[0]?.quyetDinh?.soQuyetDinh}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'modaltrinhky.label.mota' })}>
					{recQuyetDinh?.noiDung ?? dataToSignOrPush[0]?.quyetDinh?.noiDung}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'modaltrinhky.label.sophuluc' })}>
					{dataToSignOrPush?.length || intl.formatMessage({ id: 'modaltrinhky.label.all' })}{' '}
					{intl.formatMessage({ id: 'modaltrinhky.label.phuluc' })}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'modaltrinhky.label.mautrinhky' })}>
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
										{item?.ten ?? `${intl.formatMessage({ id: 'modaltrinhky.file.default' })} ${idx + 1}`}
									</a>
								</Radio>
							))}
						</Space>
					</Radio.Group>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'modaltrinhky.label.ngaytrinhky' })}>
					<MyDatePicker value={ngayThang} onChange={(val) => setngayThang(dayjs(val))} />
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'modaltrinhky.label.tuychon' })}>
					<Checkbox checked={trinhKyLai} onChange={(e) => setTrinhKyLai(e.target.checked)}>
						{intl.formatMessage({ id: 'modaltrinhky.checkbox.trinhkylai' })}
					</Checkbox>
					<Tooltip title={intl.formatMessage({ id: 'modaltrinhky.tooltip.trinhkylai' })}>
						<InfoCircleOutlined type='text' />
					</Tooltip>
				</Descriptions.Item>
			</Descriptions>

			<div className='form-footer' style={{ marginTop: 16 }}>
				<Button type='primary' loading={exporting} onClick={onExport} icon={<FilePdfOutlined />}>
					{intl.formatMessage({ id: 'modaltrinhky.button.confirm' })}
				</Button>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>

			<ModalExpandable
				title={intl.formatMessage({ id: 'modaltrinhky.modal.preview' })}
				width={1000}
				open={previewOpen}
				footer={null}
				onCancel={() => setPreviewOpen(false)}
			>
				<PreviewFile file={previewImage} isFileId />
				<div className='form-footer' style={{ marginTop: 16, textAlign: 'right' }}>
					<Button onClick={() => setPreviewOpen(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</ModalExpandable>
		</Modal>
	);
};

export default ModalTrinhKyVanBang;
