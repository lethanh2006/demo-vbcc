import PreviewFile from '@/components/PreviewFile';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const FormItemFileBieuMau = (props: {
	value?: BieuMauPhuLuc.TFileBieuMau[];
	onChange?: (data: BieuMauPhuLuc.TFileBieuMau[]) => void;
	disabled?: boolean;
	hide?: boolean;
}) => {
	const intl = useIntl();
	const { handleEdit, setVisibleForm, visibleForm, setEdit, edit, record, setRecord, isView, setIsView, handleView } =
		useModel('vbcc.filebieumau');
	const { value = [], onChange, disabled, hide } = props;
	const [previewOpen, setPreviewOpen] = useState(false);

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: BieuMauPhuLuc.TFileBieuMau) => {
		if (!record?.index) {
			const data = [...value, rec];
			if (onChange) onChange(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(record?.index - 1, 1, rec);
			if (onChange) onChange(data);
			setVisibleForm(false);
		}
	};

	const onCell = (rec: BieuMauPhuLuc.TFileBieuMau) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<BieuMauPhuLuc.TFileBieuMau>[] = [
		{
			title: intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.tenfile' }),
			dataIndex: 'ten',
			width: 220,
			onCell,
		},

		{
			title: intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.file' }),
			dataIndex: 'idFile',
			width: 180,
			render: (val, rec) =>
				val && (
					<a
						onClick={(e) => {
							setRecord(rec);
							setPreviewOpen(true);
						}}
					>
						{intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.chitiet' })}
					</a>
				),
		},
		{
			title: intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						type='link'
						onClick={() => handleEdit(rec)}
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => onDelete(rec.index - 1)}
						title={intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.confirm.xoa' })}
						placement='topLeft'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
			hide: hide,
		},
	];

	return (
		<>
			<TableStaticData
				data={value}
				columns={columns}
				size='small'
				hasTotal
				addStt
				otherProps={{ pagination: false, scroll: { y: 400 } }}
			>
				{!hide && (
					<Button
						disabled={disabled}
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setRecord({} as BieuMauPhuLuc.TFileBieuMau);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						size='small'
						type='primary'
					>
						{intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
				)}
			</TableStaticData>

			<Modal
				title={
					edit
						? intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.form.chinhsua' })
						: isView
							? intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.form.chitiet' })
							: intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.form.themmoi' })
				}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<Form onOk={onAdd} />
			</Modal>

			<ModalExpandable
				title={intl.formatMessage({ id: 'bieumau.form.cauhinh.kieudulieu.xemtruoc' })}
				width={1000}
				open={previewOpen}
				footer={null}
				onCancel={() => setPreviewOpen(false)}
			>
				<PreviewFile file={record?.idFile} isFileId />

				<div className='form-footer'>
					<Button onClick={() => setPreviewOpen(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default FormItemFileBieuMau;
