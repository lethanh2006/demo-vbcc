import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExport from '@/components/Table/Export';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import SelectBieuMauPhuLuc from '@/pages/DanhMuc/BieuMauPhuLuc/components/Select';
import { primaryColor } from '@/services/base/constant';
import {
	colorTrangThaiQuyetDinhTotNghiep,
	ETrangThaiQuyetDinhTotNghiep,
	nameTrangThaiQuyetDinhTotNghiep,
} from '@/services/VanBang/constant';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import dayjs from '@/utils/dayjs';
import {
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	InfoCircleOutlined,
	MenuOutlined,
	PlusCircleOutlined,
	RollbackOutlined,
	SaveOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Popover, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectSoVanBang from '../SoVanBang/components/Select';
import ModalQuyetDinhTotNghiep from './components/Modal';
import StatQuyetDinhTotNghiep from './components/Stat';
import ModalYeuCauChinhSua from './components/YeuCauChinhSua';

const QuyetDinhTotNghiepPage = (props: {
	title: 'Tất cả quyết định' | 'Dự thảo cần duyệt' | 'Quyết định đã duyệt' | 'Quyết định đã hoàn thành';
}) => {
	const { title = 'Tất cả quyết định' } = props;
	const intl = useIntl();

	const {
		handleEdit,
		page,
		limit,
		deleteModel,
		setRecord,
		record,
		getModel,
		trinhLanhDaoModel,
		xuLyDuThaoModel,
		setVisibleForm,
		setEdit,
		setIsView,
		thongKeQuyetDinhModel,
	} = useModel('vbcc.quyetdinhtotnghiep');

	const [yearSelect, setYearSelect] = useState<any>(dayjs());
	const [visibleFormFile, setVisibleFormFile] = useState(false);
	const [visibleChinhSua, setVisibleChinhSua] = useState(false);
	const [visibleExport, setVisibleExport] = useState<boolean>(false);
	const [themMoiHoanThanh, setThemMoiHoanThanh] = useState<boolean>(false);

	let filters: any = [];

	if (title === intl.formatMessage({ id: 'qdtotnghiep.title.duthaocanduyet' })) {
		filters.push({
			active: true,
			field: 'trangThai',
			values: [ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO, ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA],
			operator: EOperatorType.INCLUDE,
		});
	}

	if (title === intl.formatMessage({ id: 'qdtotnghiep.title.daduyet' })) {
		filters.push({
			active: true,
			field: 'trangThai',
			values: [ETrangThaiQuyetDinhTotNghiep.CHINH_THUC],
			operator: EOperatorType.INCLUDE,
		});
	}

	if (title === intl.formatMessage({ id: 'qdtotnghiep.title.hoanthanh' })) {
		filters.push({
			active: true,
			field: 'trangThai',
			values: [ETrangThaiQuyetDinhTotNghiep.HOAN_THANH],
			operator: EOperatorType.INCLUDE,
		});
	}

	const getData = () => {
		getModel(yearSelect ? { nam: dayjs(yearSelect).format('YYYY') } : undefined, filters);
	};

	const getThongKe = () => {
		if (title === intl.formatMessage({ id: 'qdtotnghiep.title.tatca' }))
			thongKeQuyetDinhModel(yearSelect ? { nam: dayjs(yearSelect).format('YYYY') } : undefined);
	};
	useEffect(() => {
		getThongKe();
	}, [yearSelect, title]);

	const onCell = (rec: QuyetDinhTotNghiep.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const renderTrangThaiInfo = (rec: QuyetDinhTotNghiep.IRecord) => (
		<div style={{ fontSize: 12, maxWidth: 300, lineHeight: 1.45 }}>
			<div>
				<b>{intl.formatMessage({ id: 'qdtotnghiep.status.creator' })}</b> {rec?.nguoiTao?.hoTen ?? '—'}
				<br />
				{rec?.nguoiTao?.thoiGian && <em>{dayjs(rec?.nguoiTao?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
			</div>

			<br />

			<div>
				<b>{intl.formatMessage({ id: 'qdtotnghiep.status.handler' })}</b> {rec?.nguoiXuLy?.hoTen ?? '—'}
				<br />
				{rec?.nguoiXuLy?.thoiGian && <em>{dayjs(rec?.nguoiXuLy?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
			</div>

			<br />

			<div>
				<b>{intl.formatMessage({ id: 'qdtotnghiep.status.note' })}</b>
				<div style={{ whiteSpace: 'pre-wrap' }}>{rec?.ghiChuChinhSua || '—'}</div>
			</div>
		</div>
	);

	const columns: IColumn<QuyetDinhTotNghiep.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.nam' }),
			dataIndex: 'nam',
			width: 120,
			align: 'center',
			filterType: 'string',
			onCell,
			hide: !!yearSelect,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.soqd' }),
			dataIndex: 'soQuyetDinh',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.ngayky' }),
			dataIndex: 'ngayBanHanh',
			width: 110,
			filterType: 'date',
			align: 'center',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.sovanbang' }),
			dataIndex: 'idSoVanBang',
			width: 180,
			render: (val, rec) => rec?.soVanBang?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectSoVanBang multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.svsbd' }),
			dataIndex: 'soVaoSoBatDau',
			align: 'center',
			width: 100,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.svskt' }),
			dataIndex: 'soVaoSoKetThuc',
			align: 'center',
			width: 100,
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.slvb' }),
			dataIndex: 'soLuong',
			align: 'center',
			width: 100,
			render: (val, rec) => (val !== 0 ? val : '--'),
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.trinhdo' }),
			width: 150,
			render: (val, rec) => rec?.soVanBang?.trinhDoDaoTao?.ten,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.bieumau' }),
			dataIndex: 'maBieuMau',
			width: 160,
			render: (val, rec) => rec?.bieuMau?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectBieuMauPhuLuc multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.noidung' }),
			dataIndex: 'noiDung',
			width: 180,
			render: (val) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.dinhkem' }),
			dataIndex: 'url',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a
						onClick={(e) => {
							e.preventDefault();
							setRecord(rec);
							setVisibleFormFile(true);
						}}
					>
						{intl.formatMessage({ id: 'qdtotnghiep.common.viewDetail' })}
					</a>
				) : (
					'—'
				),
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.trangthai' }),
			dataIndex: 'trangThai',
			width: 150,
			align: 'center',
			fixed: 'right',
			filterType: title === 'Tất cả quyết định' ? 'select' : undefined,
			filterData: Object.values(ETrangThaiQuyetDinhTotNghiep).map((item) => ({
				value: item,
				label: nameTrangThaiQuyetDinhTotNghiep[item],
			})),
			render: (val, rec) => (
				<Space size={6}>
					<Tag
						color={colorTrangThaiQuyetDinhTotNghiep[val as ETrangThaiQuyetDinhTotNghiep]}
						style={{ padding: '2px 8px', fontWeight: 500 }}
					>
						{nameTrangThaiQuyetDinhTotNghiep[val as ETrangThaiQuyetDinhTotNghiep]}
					</Tag>

					<Popover placement='left' content={renderTrangThaiInfo(rec)}>
						<InfoCircleOutlined style={{ cursor: 'pointer', color: primaryColor }} />
					</Popover>
				</Space>
			),
		},

		{
			title: intl.formatMessage({ id: 'qdtotnghiep.column.thaotac' }),
			align: 'center',
			width: title === 'Quyết định đã duyệt' ? 60 : 90,
			fixed: 'right',
			render: (rec) => {
				const { DU_THAO, YEU_CAU_CHINH_SUA, TRINH_DU_THAO, HOAN_THANH } = ETrangThaiQuyetDinhTotNghiep;

				const canTrinhLanhDao = rec?.trangThai === DU_THAO || rec?.trangThai === YEU_CAU_CHINH_SUA;
				const canXuLyQuyetDinh = rec?.trangThai === TRINH_DU_THAO;

				const isHoanThanh = rec?.trangThai === HOAN_THANH;

				if (title === 'Quyết định đã duyệt') {
					return (
						<Popconfirm
							title={intl.formatMessage({ id: 'qdtotnghiep.confirm.complete' })}
							placement='topRight'
							onConfirm={() =>
								xuLyDuThaoModel(rec?._id, { trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }, getData)
							}
						>
							<ButtonExtend
								disabled={isHoanThanh}
								tooltip={intl.formatMessage({ id: 'qdtotnghiep.action.complete' })}
								type='link'
								icon={<SaveOutlined />}
							/>
						</Popconfirm>
					);
				}

				return (
					<>
						{title === 'Tất cả quyết định' ? (
							<Popconfirm
								title={intl.formatMessage({ id: 'qdtotnghiep.confirm.submitLeader' })}
								placement='topRight'
								onConfirm={() => trinhLanhDaoModel(rec?._id, getData)}
							>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'qdtotnghiep.action.submitLeader' })}
									type='link'
									icon={<SendOutlined />}
									disabled={!canTrinhLanhDao}
								/>
							</Popconfirm>
						) : (
							<Popconfirm
								title={intl.formatMessage({ id: 'qdtotnghiep.action.approve' })}
								placement='topRight'
								onConfirm={() =>
									xuLyDuThaoModel(rec?._id, { trangThai: ETrangThaiQuyetDinhTotNghiep.CHINH_THUC }, getData)
								}
							>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'qdtotnghiep.confirm.approve' })}
									type='link'
									className='btn-success'
									icon={<CheckOutlined />}
									disabled={!canXuLyQuyetDinh}
								/>
							</Popconfirm>
						)}

						<Popover
							placement='bottomLeft'
							trigger='hover'
							content={
								<Space direction='vertical' size={'small'}>
									{title !== 'Tất cả quyết định' && (
										<ButtonExtend
											type='link'
											tooltip={intl.formatMessage({ id: 'qdtotnghiep.action.requestEdit' })}
											icon={<RollbackOutlined />}
											className='btn-warning'
											disabled={!canXuLyQuyetDinh}
											onClick={() => {
												setRecord(rec);
												setVisibleChinhSua(true);
											}}
										>
											{intl.formatMessage({ id: 'qdtotnghiep.action.requestEdit' })}
										</ButtonExtend>
									)}

									<ButtonExtend
										type='link'
										tooltip={intl.formatMessage({ id: 'qdtotnghiep.action.edit' })}
										icon={<EditOutlined />}
										disabled={!canTrinhLanhDao}
										onClick={() => handleEdit(rec)}
									>
										{intl.formatMessage({ id: 'qdtotnghiep.action.edit' })}
									</ButtonExtend>

									<Popconfirm
										title={intl.formatMessage({ id: 'qdtotnghiep.confirm.delete' })}
										placement='topRight'
										onConfirm={() => deleteModel(rec._id)}
									>
										<ButtonExtend
											tooltip={intl.formatMessage({ id: 'qdtotnghiep.button.xoa' })}
											type='link'
											danger
											icon={<DeleteOutlined />}
											// disabled={!canTrinhLanhDao}
										>
											{intl.formatMessage({ id: 'qdtotnghiep.button.xoa' })}
										</ButtonExtend>
									</Popconfirm>
								</Space>
							}
						>
							<ButtonExtend
								// disabled={isHoanThanh}
								type='link'
								icon={<MenuOutlined />}
							/>
						</Popover>
					</>
				);
			},
			hide: title === 'Quyết định đã duyệt',
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, yearSelect, title]}
				modelName='vbcc.quyetdinhtotnghiep'
				title={title}
				widthDrawer={1200}
				// deleteMany
				// rowSelections
				buttons={{ create: title === 'Tất cả quyết định' }}
				Form={ModalQuyetDinhTotNghiep}
				formProps={{
					getData: () => {
						getData();
						getThongKe();
					},
					yearSelect: dayjs(yearSelect).format('YYYY'),
					title,
					themMoiHoanThanh,
					setThemMoiHoanThanh,
				}}
				otherButtons={[
					title === 'Quyết định đã hoàn thành' ? (
						<ButtonExtend
							key={'add'}
							type='primary'
							icon={<PlusCircleOutlined />}
							onClick={() => {
								setRecord({} as QuyetDinhTotNghiep.IRecord);
								setEdit(false);
								setIsView(false);
								setVisibleForm(true);
								setThemMoiHoanThanh(true);
							}}
						>
							{intl.formatMessage({ id: 'global.button.themmoi' })}
						</ButtonExtend>
					) : (
						<></>
					),
					<ButtonExtend key={'1'} icon={<ExportOutlined />} onClick={() => setVisibleExport(true)}>
						{intl.formatMessage({ id: 'qdtotnghiep.common.export' })}
					</ButtonExtend>,
				]}
				onReload={() => {
					getData();
					getThongKe();
				}}
			>
				<MyDatePicker
					style={{ width: 160, marginBottom: 12 }}
					pickerStyle='year'
					placeholder={intl.formatMessage({ id: 'qdtotnghiep.filter.chooseYear' })}
					value={yearSelect ? dayjs(yearSelect) : null}
					format='YYYY'
					allowClear
					onChange={(val) => setYearSelect(val ? dayjs(val) : null)}
				/>

				{title === 'Tất cả quyết định' && (
					<div style={{ marginBottom: 12 }}>
						<StatQuyetDinhTotNghiep />
					</div>
				)}
			</TableBase>

			<ModalExpandable
				title={intl.formatMessage({ id: 'qdtotnghiep.modal.evidence.title' })}
				width={950}
				open={visibleFormFile}
				onCancel={() => setVisibleFormFile(false)}
				footer={<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>}
			>
				<PreviewFile file={record?.url ?? ''} />
			</ModalExpandable>

			<ModalYeuCauChinhSua visible={visibleChinhSua} setVisible={setVisibleChinhSua} getData={getData} />

			<ModalExport
				visible={visibleExport}
				modelName='vbcc.quyetdinhtotnghiep'
				onCancel={() => setVisibleExport(false)}
				fileName={intl.formatMessage({ id: 'qdtotnghiep.export.filename' })}
				filters={filters}
				condition={{ nam: dayjs(yearSelect).format('YYYY') }}
			/>
		</>
	);
};

export default QuyetDinhTotNghiepPage;
