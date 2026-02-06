import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiThongTinUpdate } from '@/services/VanBang/constant';
import { getImportPhuLucVbTemplate } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Tag, Typography, message } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const { Text } = Typography;

const ModalImportPhuLucVanBang = (props: {
	visible: boolean;
	onCancel: () => void;
	onOk: () => void;
	params?: any;
	isThongTin?: boolean;
}) => {
	const intl = useIntl();
	const { visible, onCancel, onOk, params, isThongTin } = props;
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
			importPhuLucVanBangModel(
				isThongTin
					? { quyetDinhId: recQuyetDinh?._id, file, loaiThongTin: ELoaiThongTinUpdate.THONG_TIN_VAN_BANG }
					: { quyetDinhId: recQuyetDinh?._id, file },
				params,
			).then((res) => {
				if (res?.success === false) {
					message.error(intl.formatMessage({ id: 'modalimport.error.importfailed' }));
					setDataThatBai(res?.error ?? []);
					setVisibleModal(true);
				} else {
					message.success(intl.formatMessage({ id: 'modalimport.success.imported' }));
					onOk();
				}
			});
	};

	const onDownloadTemplate = () => {
		if (recQuyetDinh?._id)
			getImportPhuLucVbTemplate(recQuyetDinh._id, params).then((res) =>
				fileDownload(res.data, `Mẫu nhập Thông tin văn bằng QĐ ${recQuyetDinh.soQuyetDinh}.xlsx`),
			);
	};

	const columns: IColumn<PhuLucVanBang.IImportPhuLuc>[] = [
		{
			title: intl.formatMessage({ id: 'modalimport.column.field' }),
			dataIndex: 'field',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'modalimport.column.errorline' }),
			dataIndex: ['tableError', 'row'],
			width: 100,
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'modalimport.column.errorcolumn' }),
			dataIndex: ['tableError', 'column'],
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'modalimport.column.datatype' }),
			dataIndex: ['tableError', 'columnType'],
			width: 120,
			align: 'center',
			render: (val) => <Tag color='blue'>{val}</Tag>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'modalimport.column.errorvalue' }),
			dataIndex: ['tableError', 'value'],
			width: 120,
			render: (val) => <Tag color='red'>{val}</Tag>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'modalimport.column.errormessage' }),
			dataIndex: ['tableError', 'error'],
			width: 180,
			render: (val) => <Text type='danger'>{val}</Text>,
			filterType: 'string',
		},
	];

	return (
		<Modal
			title={intl.formatMessage({ id: 'modalimport.title' })}
			open={visible}
			onCancel={onCancel}
			footer={null}
			maskClosable={false}
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'modalimport.label.quyetdinh' })}>
							<Input value={recQuyetDinh?.soQuyetDinh} disabled />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name='file'
							label={intl.formatMessage({ id: 'modalimport.label.file' })}
							rules={[...rules.fileRequired]}
						>
							<UploadFile drag />
						</Form.Item>
					</Col>

					<Col span={24} style={{ textAlign: 'center', margin: '8px auto 12px', maxWidth: 400 }}>
						<i>{intl.formatMessage({ id: 'modalimport.note' })}</i>
						<br />
						<Button icon={<DownloadOutlined />} type='link' onClick={onDownloadTemplate}>
							{intl.formatMessage({ id: 'modalimport.button.downloadtemplate' })}
						</Button>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'modalimport.button.execute' })}
					</Button>
					<Button onClick={() => onCancel()}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>

			<Modal
				title={intl.formatMessage({ id: 'modalimport.modal.errordetail' })}
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				width={900}
			>
				<TableStaticData columns={columns} data={dataThatBai} size='small' hasTotal addStt />

				<div className='form-footer'>
					<Button onClick={() => setVisibleModal(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Modal>
		</Modal>
	);
};

export default ModalImportPhuLucVanBang;
