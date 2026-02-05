import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectHinhThucDaoTao from '@/pages/DanhMuc/HinhThucDaoTao/components/Select';
import SelectNganhDaoTao from '@/pages/DanhMuc/NganhDaoTao/components/Select';
import SelectTrinhDoDaoTao from '@/pages/DanhMuc/TrinhDoTaoTao/components/Select';
import FormTable from '@/pages/VanBang/PhuLuc/components/FormTable';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormSinhVienQuyetDinh = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData } = props;
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
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
	} = useModel('vbcc.phulucvanbang');
	const [openedTableKey, setOpenedTableKey] = useState<string | null>(null);
	const [editFormTable, setEditFormTable] = useState<boolean>(false);
	const [recordTable, setRecordTable] = useState<any>({});

	const onCancelFormTable = () => {
		setOpenedTableKey(null);
	};

	const recBieuMau = recQuyetDinh?.bieuMau;

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setRecordTable(undefined);
			setTableData([]);
		} else if (record?._id) {
			const templateData = record.templateData;

			const updatedTemplateData = recBieuMau?.elements?.map((elm) => {
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

			form.setFieldsValue(record);
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
			values.ngaySinh = dayjs(values.ngaySinh).startOf('day').toISOString();
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
					<InputNumber style={{ width: '100%' }} placeholder={`Nhập ${element.headerName?.toLocaleLowerCase()}`} />
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
					title: 'Thao tác',
					align: 'center',
					width: 80,
					fixed: 'right',
					render: (rec: any, agg, index) => (
						<>
							<ButtonExtend
								tooltip='Chỉnh sửa'
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
								title='Bạn có chắc chắn muốn xoá dòng này?'
								placement='topRight'
							>
								<ButtonExtend tooltip='Xoá' size='small' danger type='link' icon={<DeleteOutlined />} />
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
									Thêm mới
								</Button>,
							]}
						/>

						<Modal
							destroyOnClose
							width={700}
							footer={false}
							title={`${editFormTable ? 'Chỉnh sửa' : 'Thêm mới'} ${element.headerName}`}
							open={openedTableKey === element.headerName}
							onCancel={onCancelFormTable}
						>
							<FormTable record={recordTable} onCancel={onCancelFormTable} edit={editFormTable} elements={element} />
						</Modal>
					</>
				);
			default:
				return <Input placeholder={`Nhập ${element.headerName?.toLocaleLowerCase()}`} />;
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Form.Item label='Quyết định tốt nghiệp'>
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
					<Form.Item
						label='Mã người học'
						name='maSinhVien'
						rules={[...rules.required, ...rules.text, ...rules.length(20)]}
					>
						<Input placeholder='Nhập mã người học' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Họ tên' name='hoTen' rules={[...rules.required, ...rules.text, ...rules.length(100)]}>
						<Input placeholder='Nhập họ tên' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Ngày sinh' name='ngaySinh'>
						<MyDatePicker />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Giới tính' name='gioiTinh'>
						<Select
							placeholder='Chọn giới tính'
							options={[
								{ label: 'Nam', value: 'Nam' },
								{ label: 'Nữ', value: 'Nữ' },
								{ label: 'Khác', value: 'Khác' },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Nơi sinh' name='noiSinh'>
						<Input placeholder='Nhập nơi sinh' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Quốc tịch' name='quocTich'>
						<Input placeholder='Nhập quốc tịch' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Số CMND/CCCD' name='cmtCccd'>
						<Input placeholder='Nhập số CMMD/CCCD' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Trình độ đào tạo' name='trinhDoDaoTao'>
						<SelectTrinhDoDaoTao selectTen />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Hình thức đào tạo' name='hinhThucDaoTao'>
						<SelectHinhThucDaoTao selectTen />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Ngành đào tạo' name='nganhDaoTao'>
						<SelectNganhDaoTao selectMa />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='Năm tốt nghiệp' name='namTotNghiep'>
						<Input placeholder='Nhập năm tốt nghiệp' />
					</Form.Item>
				</Col>
				{recBieuMau?._id && (
					<>
						<Col span={24}>
							Theo biểu mẫu phụ lục: <b>{recBieuMau.ten}</b>
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
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormSinhVienQuyetDinh;
