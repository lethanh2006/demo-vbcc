import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import SelectHinhThucDaoTao from '@/pages/DanhMuc/HinhThucDaoTao/components/Select';
import SelectNganhDaoTao from '@/pages/DanhMuc/NganhDaoTao/components/Select';
import SelectTrinhDoDaoTao from '@/pages/DanhMuc/TrinhDoTaoTao/components/Select';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormTable from './FormTable';

const FormPhuLucVanBang = (props: {
	getData?: () => void;
	title?: string;
	[key: string]: any;
	trangThaiYeuCau?: 'Cấp lại' | 'Chỉnh sửa' | 'Thu hồi';
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData, trangThaiYeuCau } = props;
	const { settings } = useModel('tienich.caidat');
	const {
		record,
		edit,
		setVisibleForm,
		formSubmiting,
		visibleForm,
		putModel,
		postModel,
		setFormSubmiting,
		tableData,
		setTableData,
		yeuCauCapNhatVanBangModel,
	} = useModel('vbcc.phulucvanbang');
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { record: recBieuMau, getBieuMauDetailModel } = useModel('vbcc.bieumauphuluc');
	const [openedTableKey, setOpenedTableKey] = useState<string | null>(null);
	const [editFormTable, setEditFormTable] = useState<boolean>(false);
	const [recordTable, setRecordTable] = useState<any>({});
	const { INFO_TENANT: settingVbcc } = settings;

	const onCancelFormTable = () => {
		setOpenedTableKey(null);
	};

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setRecordTable(undefined);
			setTableData([]);
		} else {
			getBieuMauDetailModel(recQuyetDinh?.maBieuMau ?? '').then((bm) => {
				if (record?._id) {
					const templateData = record.templateData;

					if (bm) {
						const updatedTemplateData = bm.elements?.map((elm) => {
							const matched = templateData?.find((i) => i.headerName === elm.headerName);

							if (elm.type === ELoaiDuLieuBieuMau.Table) {
								setTableData((prev: any) => ({
									...prev,
									[elm.headerName]: matched?.value ?? [],
								}));
							}

							return {
								...elm,
								value: matched?.value ?? null,
							};
						});

						record.templateData = updatedTemplateData as any;
					}

					form.setFieldsValue(record);
				}
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: PhuLucVanBang.IRecord) => {
		setFormSubmiting(true);
		const urlIpfs = await buildUpLoadFile(values, 'urlIpfs');
		values.urlIpfs = urlIpfs;
		setFormSubmiting(false);

		values.fullName = values.hoTen;

		const templateData: any[] =
			recBieuMau?.elements?.map((element, index) => {
				let value = values?.templateData?.[index]?.value;

				if (element.type === ELoaiDuLieuBieuMau.Date && value) {
					value = dayjs(value).startOf('day').toISOString();
				}

				if (element.type === ELoaiDuLieuBieuMau.Table) {
					value = tableData?.[element.headerName] ?? [];
				}

				return {
					...element,
					value,
				};
			}) ?? [];

		if (values.ngaySinh) {
			values.ngaySinh = dayjs(values.ngaySinh).startOf('day').format('YYYY-MM-DD');
		}

		values.templateData = templateData;

		if (edit) {
			putModel(record?._id ?? '', values, getData).catch(console.log);
		} else {
			postModel({ ...values, idQuyetDinh: recQuyetDinh?._id }, getData).catch(console.log);
		}
	};

	const renderFormItemByType = (element: BieuMauPhuLuc.TElement) => {
		switch (element.type) {
			case ELoaiDuLieuBieuMau.Number:
				return (
					<InputNumber
						style={{ width: '100%' }}
						placeholder={`${intl.formatMessage({ id: 'formthongtin.placeholder.input' })} ${element.headerName?.toLocaleLowerCase()}`}
					/>
				);
			case ELoaiDuLieuBieuMau.Date:
				return <MyDatePicker />;
			case ELoaiDuLieuBieuMau.Table:
				const columns: IColumn<any>[] = [];

				element?.cot?.forEach((item) => {
					columns.push({
						title: item.headerName,
						dataIndex: item.headerName,
						width: 120,
					});
				});

				columns.push({
					title: intl.formatMessage({ id: 'formthongtin.action' }),
					align: 'center',
					width: 80,
					fixed: 'right',
					render: (rec: any, agg, index) => (
						<>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'formthongtin.action.edit' })}
								size='small'
								onClick={() => {
									setEditFormTable(true);
									setRecordTable({ ...rec, index });
									setOpenedTableKey(element.headerName);
								}}
								type='link'
								icon={<EditOutlined />}
							/>

							<Popconfirm
								onConfirm={() => {
									const newData = tableData?.[element.headerName]?.filter((_: any, i: number) => i !== index);
									setTableData({
										...tableData,
										[element.headerName]: newData,
									});
								}}
								title={intl.formatMessage({ id: 'formthongtin.confirm.delete' })}
								placement='topRight'
							>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'formthongtin.action.delete' })}
									size='small'
									danger
									type='link'
									icon={<DeleteOutlined />}
								/>
							</Popconfirm>
						</>
					),
				});

				return (
					<>
						<TableStaticData
							otherProps={{ pagination: false }}
							addStt
							size='small'
							columns={columns}
							data={tableData?.[element.headerName] ?? []}
							hasTotal
							otherButtons={[
								<Button
									key={'1'}
									size='small'
									type='primary'
									icon={<PlusCircleOutlined />}
									onClick={() => {
										setRecordTable(undefined);
										setEditFormTable(false);
										setOpenedTableKey(element.headerName);
									}}
								>
									{intl.formatMessage({ id: 'global.button.themmoi' })}
								</Button>,
							]}
						/>

						<Modal
							destroyOnClose
							width={700}
							footer={false}
							title={`${editFormTable ? intl.formatMessage({ id: 'formthongtin.modal.title.edit' }) : intl.formatMessage({ id: 'formthongtin.modal.title.add' })} ${element.headerName}`}
							open={openedTableKey === element.headerName}
							onCancel={onCancelFormTable}
						>
							<FormTable record={recordTable} onCancel={onCancelFormTable} edit={editFormTable} elements={element} />
						</Modal>
					</>
				);
			default:
				return (
					<Input
						placeholder={`${intl.formatMessage({ id: 'formthongtin.placeholder.input' })} ${element.headerName?.toLocaleLowerCase()}`}
					/>
				);
		}
	};

	const handleYeuCau = async (loai: 'Cấp lại' | 'Chỉnh sửa' | 'Thu hồi') => {
		let thongTinCapNhatCapLai = form.getFieldsValue();

		setFormSubmiting(true);
		const urlIpfs = await buildUpLoadFile(thongTinCapNhatCapLai, 'urlIpfs');
		thongTinCapNhatCapLai.urlIpfs = urlIpfs;
		setFormSubmiting(false);

		thongTinCapNhatCapLai.fullName = thongTinCapNhatCapLai.hoTen;

		const templateData: any[] =
			recBieuMau?.elements?.map((element, index) => {
				let value = thongTinCapNhatCapLai?.templateData?.[index]?.value;

				if (element.type === ELoaiDuLieuBieuMau.Date && value) {
					value = dayjs(value).startOf('day').toISOString();
				}

				if (element.type === ELoaiDuLieuBieuMau.Table) {
					value = tableData?.[element.headerName] ?? [];
				}

				return {
					...element,
					value,
				};
			}) ?? [];

		if (thongTinCapNhatCapLai.ngaySinh) {
			thongTinCapNhatCapLai.ngaySinh = dayjs(thongTinCapNhatCapLai.ngaySinh).format('YYYY-MM-DD');
		}

		thongTinCapNhatCapLai.templateData = templateData;

		yeuCauCapNhatVanBangModel(
			record?._id ?? '',
			{ loai, thoiGianYeuCau: dayjs(), thongTinCapNhatCapLai: { ...record, ...thongTinCapNhatCapLai } },
			getData,
		)
			.then(() => setVisibleForm(false))
			.catch((err) => console.log(err));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Form.Item label={intl.formatMessage({ id: 'formthongtin.label.quyetdinh' })}>
						<Input
							value={
								recQuyetDinh?.soQuyetDinh ??
								`${record?.quyetDinh?.soQuyetDinh ?? ''}, ${
									record?.quyetDinh?.ngayBanHanh ? dayjs(record.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : ''
								}`
							}
							disabled
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'formthongtin.label.sovaoso' })} name='soVaoSoBang'>
						<Input placeholder={intl.formatMessage({ id: 'formthongtin.placeholder.sovaoso' })} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='bookEntryNumberFormat' label={intl.formatMessage({ id: 'formthongtin.label.sovaosoen' })}>
						<Input placeholder={intl.formatMessage({ id: 'formthongtin.placeholder.sovaosoen' })} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'formthongtin.label.sohieuvanbang' })}
						name='soHieuVanBang'
						rules={[...rules.required, ...rules.text, ...rules.length(100)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'formthongtin.placeholder.sohieuvanbang' })} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'formthongtin.label.hoten' })}
						name='hoTen'
						rules={[...rules.required, ...rules.text, ...rules.length(100)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'formthongtin.placeholder.hoten' })} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'formthongtin.label.ngaysinh' })} name='ngaySinh'>
						<MyDatePicker />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'formthongtin.label.manguoihoc' })}
						name='maSinhVien'
						rules={[...rules.required, ...rules.text, ...rules.length(20)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'formthongtin.placeholder.manguoihoc' })} />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'formthongtin.label.cmndcccd' })} name='cmtCccd'>
						<Input placeholder={intl.formatMessage({ id: 'formthongtin.placeholder.cmndcccd' })} />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'formthongtin.label.trinhdodaotao' })} name='trinhDoDaoTao'>
						<SelectTrinhDoDaoTao selectMa />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'formthongtin.label.hinhthucdaotao' })} name='hinhThucDaoTao'>
						<SelectHinhThucDaoTao selectMa />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'formthongtin.label.nganhdaotao' })} name='nganhDaoTao'>
						<SelectNganhDaoTao selectMa />
					</Form.Item>
				</Col>

				{!settingVbcc?.require_IPFS && (
					<Col span={24} md={12}>
						<Form.Item label={intl.formatMessage({ id: 'formthongtin.label.taptinvanbang' })} name='urlIpfs'>
							<UploadFile maxCount={1} otherProps={{ accept: '.pdf' }} />
						</Form.Item>
					</Col>
				)}
				{recBieuMau?._id && (
					<>
						<Col span={24}>
							{intl.formatMessage({ id: 'formthongtin.label.theobieumauphu' })} <b>{recBieuMau.ten}</b>
						</Col>
						{recBieuMau.elements.map((element, index) => (
							<Col span={24} md={element.type === ELoaiDuLieuBieuMau.Table ? 24 : 12} key={element.headerName}>
								<Form.Item
									label={element.headerName}
									name={['templateData', index, 'value']}
									rules={element.type === ELoaiDuLieuBieuMau.Text ? [...rules.text, ...rules.length(300)] : []}
								>
									{renderFormItemByType(element)}
								</Form.Item>
							</Col>
						))}
					</>
				)}
			</Row>

			<div className='form-footer'>
				{/* <Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.luulai' })}
				</Button> */}
				{trangThaiYeuCau === 'Chỉnh sửa' && (
					<Button loading={formSubmiting} type='primary' onClick={() => handleYeuCau('Chỉnh sửa')}>
						{intl.formatMessage({ id: 'formthongtin.button.dexuatchinhsua' })}
					</Button>
				)}
				{trangThaiYeuCau === 'Cấp lại' && (
					<Button loading={formSubmiting} type='primary' onClick={() => handleYeuCau('Cấp lại')}>
						{intl.formatMessage({ id: 'formthongtin.button.dexuatcaplai' })}
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormPhuLucVanBang;
