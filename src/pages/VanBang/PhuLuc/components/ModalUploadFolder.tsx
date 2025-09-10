import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ipIPFS } from '@/utils/ip';
import { CloudUploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Popconfirm, Popover, Upload } from 'antd';
import { create as createIPFS } from 'ipfs-http-client';
import { useState } from 'react';
import { useModel } from 'umi';

const ModalUploadFolder = (props: { visible: boolean; setVisible: (val: boolean) => void; getData?: () => void }) => {
	const { visible, setVisible, getData } = props;
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { uploadFolderModel, setFormSubmiting, formSubmiting } = useModel('vbcc.phulucvanbang');
	const [fileList, setFileList] = useState<any[]>();
	const [clientIPFS] = useState(createIPFS({ url: ipIPFS }));

	const onChange = (info: { fileList: any[] }) => setFileList(info.fileList);

	const onCancel = () => {
		setFileList(undefined);
		setVisible(false);
	};

	const addIPFS = async (file: any): Promise<PhuLucVanBang.TUploadFolder> => ({
		idVanBangIPFS: (await clientIPFS.add(file?.originFileObj))?.path,
		key: file?.originFileObj?.name?.split('.pdf')?.[0]?.split('.signed')?.[0],
	});

	const columns: IColumn<PhuLucVanBang.TUploadFolder>[] = [
		{
			title: 'Tệp tin',
			dataIndex: 'key',
			width: 250,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'message',
			width: 150,
		},
	];

	const onUpload = async () => {
		if (formSubmiting || !recQuyetDinh?._id) return;
		setFormSubmiting(true);
		Promise.all(fileList?.map((file) => addIPFS(file)) ?? [])
			.then((mangId) => {
				setFormSubmiting(false);
				uploadFolderModel(recQuyetDinh._id, mangId).then((folder: any) => {
					Modal.info({
						title: 'Kết quả',
						width: 800,
						icon: null,
						content: <TableStaticData data={folder} size='small' columns={columns} addStt />,
					});
					onCancel();
					if (getData) getData();
				});
			})
			.catch((er) => {
				message.error('Tải lên không thành công');
				console.log(er);
			})
			.finally(() => setFormSubmiting(false));
	};

	return (
		<Modal
			open={visible}
			title={
				<>
					Tải lên phụ lục văn bằng{' '}
					<Popover
						content={
							<>
								Upload danh sách Phụ lục Văn bằng chứng chỉ dưới dạng file scan PDF lên hệ thống.
								<br />
								Lưu ý: Tên file scan phải có định dạng <b>[Số vào sổ]_[Số hiệu văn bằng].pdf</b> tương ứng của VBCC.
							</>
						}
					>
						<QuestionCircleOutlined />
					</Popover>
				</>
			}
			destroyOnClose
			onCancel={onCancel}
			footer={[
				<Button onClick={onCancel} key='cancel'>
					Hủy
				</Button>,
				<Popconfirm
					title='Tải các file đã chọn lên?'
					key='upload'
					disabled={!fileList || fileList.length === 0}
					onConfirm={onUpload}
				>
					<Button
						type='primary'
						icon={<CloudUploadOutlined />}
						disabled={!fileList || fileList.length === 0}
						style={{ marginLeft: 8 }}
						loading={formSubmiting}
					>
						Tải lên ({fileList?.length ?? 0})
					</Button>
				</Popconfirm>,
			]}
		>
			<span>Chọn thư mục cần tải lên: </span>
			<Upload
				customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
				directory
				showUploadList={{ showDownloadIcon: false }}
				fileList={fileList}
				onChange={onChange}
				accept='.pdf'
			>
				<Button
					type='primary'
					icon={<CloudUploadOutlined />}
					disabled={fileList && fileList?.length > 0}
					style={{ margin: '0 0 16px 12px' }}
				>
					Upload thư mục
				</Button>
			</Upload>
		</Modal>
	);
};

export default ModalUploadFolder;
