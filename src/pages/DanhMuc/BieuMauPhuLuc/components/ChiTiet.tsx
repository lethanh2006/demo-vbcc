import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import FormTable from '@/pages/VanBang/PhuLuc/components/FormTable';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Form, Input, InputNumber, Modal, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormItemFileBieuMau from '../FileBieuMau/FormItem';

const ChiTietBieuMauPhuLuc = () => {
	const intl = useIntl();
	const { tableData, setTableData } = useModel('vbcc.phulucvanbang');
	const { record, visibleForm, setVisibleForm } = useModel('vbcc.bieumauphuluc');
	const [openedTableKey, setOpenedTableKey] = useState<string | null>(null);
	const [editFormTable, setEditFormTable] = useState<boolean>(false);
	const [recordTable, setRecordTable] = useState<any>({});

	useEffect(() => {
		if (!visibleForm) {
			setTableData(null);
		}
	}, [visibleForm]);

	const onCancelFormTable = () => {
		setOpenedTableKey(null);
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
					title: intl.formatMessage({ id: 'bieumau.chitiet.thaotac' }),
					align: 'center',
					width: 80,
					fixed: 'right',
					render: (rec: any, agg, index) => (
						<>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
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
								title={intl.formatMessage({ id: 'bieumau.chitiet.confirm.xoa' })}
								placement='topRight'
							>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
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
							title={`${editFormTable ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${element.headerName}`}
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
		<>
			<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'bieumau.chitiet.mabieumau' })}>
					{record?.ma ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'bieumau.chitiet.tenbieumau' })}>
					{record?.ten ?? '--'}
				</Descriptions.Item>
			</Descriptions>

			<div className='fw500' style={{ marginTop: 12 }}>
				{intl.formatMessage({ id: 'bieumau.chitiet.cauhinhbieumau' })}
			</div>
			<Form layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'bieumau.chitiet.hoten' })}
							name='hoTen'
							rules={[...rules.required, ...rules.text, ...rules.length(100)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'bieumau.chitiet.hoten.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label={intl.formatMessage({ id: 'bieumau.chitiet.ngaysinh' })} name='ngaySinh'>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'bieumau.chitiet.manguoihoc' })}
							name='maSinhVien'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'bieumau.chitiet.manguoihoc.place' })} />
						</Form.Item>
					</Col>

					{record?._id && (
						<>
							{record.elements?.map((element, index) => (
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
			</Form>

			<div className='fw500' style={{ marginTop: 12 }}>
				{intl.formatMessage({ id: 'bieumau.chitiet.file' })}
			</div>
			<FormItemFileBieuMau value={record?.listIdFileBieuMau ?? []} hide />

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</>
	);
};

export default ChiTietBieuMauPhuLuc;
