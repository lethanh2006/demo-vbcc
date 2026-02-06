import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ipIPFS } from '@/utils/ip';
import { CloudUploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Popconfirm, Popover, Upload } from 'antd';
import { create as createIPFS } from 'ipfs-http-client';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';

const ModalUploadFolder = (props: { visible: boolean; setVisible: (val: boolean) => void; getData?: () => void }) => {
	const intl = useIntl();
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
			title: intl.formatMessage({ id: 'modaluploadfolder.column.file' }),
			dataIndex: 'key',
			width: 250,
		},
		{
			title: intl.formatMessage({ id: 'modaluploadfolder.column.status' }),
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
						title: intl.formatMessage({ id: 'modaluploadfolder.modal.result' }),
						width: 800,
						icon: null,
						content: <TableStaticData data={folder} size='small' columns={columns} addStt />,
					});
					onCancel();
					if (getData) getData();
				});
			})
			.catch((er) => {
				message.error(intl.formatMessage({ id: 'modaluploadfolder.error.uploadfailed' }));
				console.log(er);
			})
			.finally(() => setFormSubmiting(false));
	};

	return (
		<Modal
			open={visible}
			title={
				<>
					{intl.formatMessage({ id: 'modaluploadfolder.title' })}{' '}
					<Popover
						content={
							<span
								dangerouslySetInnerHTML={{
									__html: intl.formatMessage({ id: 'modaluploadfolder.popover.content' }),
								}}
							/>
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
					{intl.formatMessage({ id: 'modaluploadfolder.button.cancel' })}
				</Button>,
				<Popconfirm
					title={intl.formatMessage({ id: 'modaluploadfolder.popconfirm.upload' })}
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
						{intl.formatMessage({ id: 'modaluploadfolder.button.upload' })} ({fileList?.length ?? 0})
					</Button>
				</Popconfirm>,
			]}
		>
			<span>{intl.formatMessage({ id: 'modaluploadfolder.select.folder' })} </span>
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
					{intl.formatMessage({ id: 'modaluploadfolder.button.uploadfolder' })}
				</Button>
			</Upload>
		</Modal>
	);
};

export default ModalUploadFolder;
