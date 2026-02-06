import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExport from '@/components/Table/Export';
import ModalImport from '@/components/Table/Import';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { exportXacMinhVanBang } from '@/services/VanBang/XacMinhVanBang';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import { getFilenameHeader } from '@/utils/utils';
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CloseOutlined,
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
	ExportOutlined,
	FileTextOutlined,
	ImportOutlined,
	PlusCircleOutlined,
	SafetyOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tag } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewPhuLucVanBang from '../../PhuLuc/components/ViewRender';
import FormSinhVienXacMinh from './components/Form';
import ModalPhucDap from './components/PhucDap';
import ModalTraCuuThuCong from './components/TraCuu';

const SinhVienXacMinhPage = (props: {
	isYeuCau?: boolean;
	isXacMinh?: boolean;
	isCongVan?: boolean;
	isKetQua?: boolean;
	size?: 'small' | 'middle';
	afterAddNew?: (val: number) => void;
	hideThaoTac?: boolean;
	hideAdd?: boolean;
	hideImport?: boolean;
	hideExport?: boolean;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const {
		isYeuCau = false,
		isXacMinh = false,
		isCongVan = false,
		isKetQua = false,
		size = 'middle',
		afterAddNew,
		hideThaoTac = false,
		hideAdd = false,
		hideImport = false,
		hideExport = false,
		getData: getXacMinh,
	} = props;
	const {
		record: recXacMinh,
		setRecord: setRecXacMinh,
		nextStepXacMinhModel,
		formSubmiting,
		setVisibleForm: setvsXacMinh,
	} = useModel('vbcc.xacminhvanbang');
	const {
		loading,
		getAllModel,
		danhSach,
		putModel,
		setVisibleForm,
		visibleForm,
		setEdit,
		edit,
		setRecord,
		isView,
		setIsView,
		setDanhSach,
		handleEdit,
		deleteModel,
		selectedIds,
		setSelectedIds,
	} = useModel('vbcc.sinhvienxacminh');
	const { getByIdModel } = useModel('vbcc.phulucvanbang');

	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [visibleExport, setVisibleExport] = useState<boolean>(false);
	const [visiblePhucDap, setVisiblePhucDap] = useState<boolean>(false);
	const [visibleTraCuu, setVisibleTraCuu] = useState<boolean>(false);
	const [vsPhuLuc, setVsPhuLuc] = useState<boolean>(false);
	const [loadingExport, setLoadingExport] = useState<boolean>(false);

	const isHoanThanh = recXacMinh?.phaseXuLy === EPhaseXacMinh.HOAN_THANH;

	const getData = () => {
		if (recXacMinh?._id) {
			getAllModel(undefined, undefined, { yeuCauXacMinhVanBangId: recXacMinh?._id });
		} else {
			setDanhSach([]);
		}
	};

	useEffect(() => {
		getData();
	}, [recXacMinh?._id]);

	const handleChuyenBuoc = (trangThai: EPhaseXacMinh) => {
		nextStepXacMinhModel(
			recXacMinh?._id ?? '',
			{
				phaseXuLy: trangThai,
			},
			getXacMinh,
		).then((rec) => {
			setRecXacMinh({ ...recXacMinh, ...rec });
			if (afterAddNew) afterAddNew(isYeuCau ? 2 : 3);
		});
	};

	const showPhuLucDetail = (phuLucId: string) => {
		setVsPhuLuc(true);
		getByIdModel(phuLucId);
	};

	const handleExportPhieuPhucDap = (rec?: XacMinhVanBang.ISinhVienXacMinh, isAll?: boolean) => {
		if (recXacMinh?._id) {
			setLoadingExport(true);
			exportXacMinhVanBang(recXacMinh?._id, {
				ids: isAll ? [] : rec?._id ? [rec?._id] : selectedIds,
				getAll: isAll,
			})
				.then((res) => fileDownload(res.data, getFilenameHeader(res)))
				.finally(() => {
					setSelectedIds([]);
					setLoadingExport(false);
				});
		}
	};

	const columns: IColumn<XacMinhVanBang.ISinhVienXacMinh>[] = [
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.manguoihoc' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 130,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.hoten' }),
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.ngaysinh' }),
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.xeploai' }),
			dataIndex: 'xepLoai',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.sohieuvb' }),
			dataIndex: 'soHieuVanBang',
			width: 130,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.sovaoso' }),
			dataIndex: 'soVaoSo',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.thongtinvb' }),
			dataIndex: 'phuLucId',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a
						onClick={(e) => {
							showPhuLucDetail(val);
						}}
					>
						{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.link.viewdetail' })}
					</a>
				) : (
					<i>{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.link.khongco' })}</i>
				),
			hide: isYeuCau,
		},
		// {
		// 	title: 'Nội dung phúc đáp',
		// 	dataIndex: 'ghiChuKetQuaPhucDap',
		// 	width: 180,
		// 	render: (val, rec) => (
		// 		<ExpandText>
		// 			<div dangerouslySetInnerHTML={{ __html: val }} />
		// 		</ExpandText>
		// 	),
		// 	filterType: 'string',
		// 	hide: isYeuCau || isXacMinh,
		// },
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.filephucdap' }),
			dataIndex: 'urlPhanHoi',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a href={val} target='_blank' rel='noreferrer'>
						{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.link.viewdetail' })}
					</a>
				) : null,
			hide: !isKetQua,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.ketqua' }),
			dataIndex: 'coThongTin',
			align: 'center',
			width: 140,
			render: (val, rec) =>
				val ? (
					<Tag color='green'>{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.tag.coketqua' })}</Tag>
				) : (
					<Tag color='red'>{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.tag.khongcoketqua' })}</Tag>
				),
			fixed: 'right',
			hide: isYeuCau,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.column.thaotac' }),
			align: 'center',
			width: isKetQua || isCongVan ? 60 : 90,
			fixed: 'right',
			render: (val, rec) => {
				if (isXacMinh)
					return (
						<>
							<ButtonExtend
								disabled={isHoanThanh}
								tooltip={intl.formatMessage({ id: 'xacminhvanbang.sinhvien.action.tracuuthucong' })}
								type='link'
								icon={<SearchOutlined />}
								onClick={() => {
									setRecord(rec);
									setVisibleTraCuu(true);
								}}
							/>

							<Popconfirm
								onConfirm={() => putModel(rec._id, { ...rec, coThongTin: false, phuLucId: null }, getData)}
								title={intl.formatMessage({ id: 'xacminhvanbang.sinhvien.confirm.khongcoketqua' })}
								placement='topRight'
							>
								<ButtonExtend
									disabled={isHoanThanh}
									tooltip={intl.formatMessage({ id: 'xacminhvanbang.sinhvien.action.khongcoketqua' })}
									type='link'
									icon={<CloseOutlined />}
									danger
								/>
							</Popconfirm>

							{/* <Popconfirm
								onConfirm={() => putModel(rec._id, { ...rec, coThongTin: true }, getData)}
								title='Xác nhận có kết quả?'
								placement='topRight'
							>
								<ButtonExtend
									disabled={isHoanThanh}
									tooltip='Có kết quả'
									type='link'
									icon={<CheckOutlined />}
									className='btn-success'
								/>
							</Popconfirm> */}
							{/* <Popover
								placement='bottom'
								trigger='hover'
								content={
									<Space direction='vertical' size={'small'}>
										<ButtonExtend
											disabled={isHoanThanh}
											tooltip='Tra cứu thủ công'
											type='link'
											icon={<SearchOutlined />}
											onClick={() => {
												setRecord(rec);
												setVisibleTraCuu(true);
											}}
											size='small'
										>
											Tra cứu thủ công
										</ButtonExtend>
										<Popconfirm
											onConfirm={() => putModel(rec._id, { ...rec, coThongTin: false }, getData)}
											title='Xác nhận không có kết quả?'
											placement='topRight'
										>
											<ButtonExtend
												disabled={isHoanThanh}
												tooltip='Không có kết quả'
												type='link'
												icon={<CloseOutlined />}
												danger
												size='small'
											>
												Không có kết quả
											</ButtonExtend>
										</Popconfirm>
									</Space>
								}
							>
								<ButtonExtend disabled={isHoanThanh} type='link' icon={<MenuOutlined />} />
							</Popover> */}
						</>
					);
				if (isCongVan)
					return (
						<>
							<ButtonExtend
								loading={loadingExport}
								onClick={() => handleExportPhieuPhucDap(rec)}
								disabled={isHoanThanh}
								tooltip={intl.formatMessage({ id: 'xacminhvanbang.sinhvien.action.taibieumau' })}
								type='link'
								icon={<DownloadOutlined />}
							/>

							{/* <ButtonExtend
								disabled={isHoanThanh}
								tooltip='Phúc đáp'
								type='link'
								icon={<EditOutlined />}
								onClick={() => {
									setRecord(rec);
									setVisiblePhucDap(true);
								}}
							/> */}
						</>
					);
				if (isKetQua) {
					return (
						<ButtonExtend
							disabled={isHoanThanh}
							tooltip={intl.formatMessage({ id: 'xacminhvanbang.sinhvien.action.traketqua' })}
							type='link'
							icon={<EditOutlined />}
							onClick={() => {
								setRecord(rec);
								setVisiblePhucDap(true);
							}}
						/>
					);
				}
				return (
					<>
						<ButtonExtend
							disabled={isHoanThanh}
							tooltip={intl.formatMessage({ id: 'xacminhvanbang.action.chinhsua' })}
							onClick={() => handleEdit(rec)}
							type='link'
							icon={<EditOutlined />}
						/>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, getData)}
							title={intl.formatMessage({ id: 'xacminhvanbang.sinhvien.confirm.delete' })}
							placement='topRight'
						>
							<ButtonExtend
								disabled={isHoanThanh}
								tooltip={intl.formatMessage({ id: 'xacminhvanbang.action.xoa' })}
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</>
				);
			},
			hide: !!hideThaoTac,
		},
	];

	return (
		<>
			<TableStaticData
				loading={loading}
				data={danhSach}
				columns={columns}
				hasTotal
				addStt
				size={size}
				otherButtons={[
					<>
						{!hideAdd ? (
							<ButtonExtend
								tooltip={
									!recXacMinh?._id
										? intl.formatMessage({ id: 'xacminhvanbang.sinhvien.tooltip.chuathemmoi' })
										: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.themmoi' })
								}
								disabled={!recXacMinh?._id || isHoanThanh}
								icon={<PlusCircleOutlined />}
								onClick={() => {
									setRecord({} as XacMinhVanBang.ISinhVienXacMinh);
									setEdit(false);
									setIsView(false);
									setVisibleForm(true);
								}}
								type='primary'
								size={size}
							>
								{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.themmoi' })}
							</ButtonExtend>
						) : null}
						{!hideImport ? (
							<ButtonExtend
								tooltip={
									!recXacMinh?._id
										? intl.formatMessage({ id: 'xacminhvanbang.sinhvien.tooltip.chuathemmoi' })
										: intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.nhapdulieu' })
								}
								disabled={!recXacMinh?._id || isHoanThanh}
								icon={<ImportOutlined />}
								size={size}
								onClick={() => setVisibleImport(true)}
							>
								{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.nhapdulieu' })}
							</ButtonExtend>
						) : null}
						{/* {!hideExport ? (
							<ButtonExtend
								tooltip={!recXacMinh?._id ? 'Chưa thêm mới yêu cầu xác minh' : 'Xuất dữ liệu'}
								disabled={!recXacMinh?._id}
								icon={<ExportOutlined />}
								size={size}
								onClick={() => setVisibleExport(true)}
							>
								Xuất dữ liệu
							</ButtonExtend>
						) : null} */}
						{isCongVan ? (
							<>
								<ButtonExtend
									disabled={!selectedIds?.length || isHoanThanh}
									icon={<ExportOutlined />}
									size={size}
									onClick={() => handleExportPhieuPhucDap()}
									loading={loadingExport}
								>
									{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.xuatbieumaucanhan' })}{' '}
									{selectedIds?.length ? `(${selectedIds?.length})` : null}
								</ButtonExtend>
								<ButtonExtend
									disabled={isHoanThanh}
									icon={<ExportOutlined />}
									size={size}
									onClick={() => {
										setSelectedIds([]);
										handleExportPhieuPhucDap(undefined, true);
									}}
									loading={loadingExport}
								>
									{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.xuatbieumauchung' })}
								</ButtonExtend>
							</>
						) : null}
					</>,
				]}
				onReload={getData}
				otherProps={
					isCongVan
						? {
								pagination: false,
								scroll: { y: 400 },
								rowKey: (rec: XacMinhVanBang.ISinhVienXacMinh) => rec._id,
								rowSelection: {
									type: 'checkbox',
									selectedRowKeys: selectedIds,
									preserveSelectedRowKeys: true,
									onChange: (selectedRowKeys: any[]) => setSelectedIds(selectedRowKeys),
									columnWidth: 40,
								},
							}
						: { pagination: false, scroll: { y: 400 } }
				}
			/>

			<ModalImport
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					setVisibleForm(false);
					getData();
				}}
				modelName='vbcc.sinhvienxacminh'
				extendData={{ yeuCauXacMinhVanBangId: recXacMinh?._id ?? '' }}
			/>

			<ModalExport
				visible={visibleExport}
				modelName='vbcc.sinhvienxacminh'
				onCancel={() => setVisibleExport(false)}
				fileName='Danh sách văn phòng phẩm.xlsx'
				condition={{ yeuCauXacMinhVanBangId: recXacMinh?._id }}
			/>

			{isXacMinh || isYeuCau ? (
				<div className='form-footer'>
					<Button
						onClick={() => {
							if (afterAddNew) afterAddNew(isYeuCau ? 0 : 1);
						}}
						icon={<ArrowLeftOutlined />}
					>
						{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.quaylai' })}
					</Button>
					<Button
						disabled={
							!recXacMinh?._id ||
							!(
								isYeuCau
									? [EPhaseXacMinh.XAC_MINH, EPhaseXacMinh.PHUC_DAP, EPhaseXacMinh.KET_QUA, EPhaseXacMinh.HOAN_THANH]
									: [EPhaseXacMinh.PHUC_DAP, EPhaseXacMinh.KET_QUA, EPhaseXacMinh.HOAN_THANH]
							).includes(recXacMinh?.phaseXuLy)
						}
						onClick={() => {
							if (afterAddNew) afterAddNew(isYeuCau ? 2 : 3);
						}}
						icon={<ArrowRightOutlined />}
					>
						{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.tieptuc' })}
					</Button>
					{isYeuCau ? (
						<Button
							loading={formSubmiting}
							disabled={!recXacMinh?._id || recXacMinh?.phaseXuLy !== EPhaseXacMinh.YEU_CAU || isHoanThanh}
							onClick={() => handleChuyenBuoc(EPhaseXacMinh.XAC_MINH)}
							icon={<SafetyOutlined />}
							type='primary'
						>
							{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.tienhanh' })}
						</Button>
					) : (
						<Button
							disabled={
								recXacMinh?.phaseXuLy === EPhaseXacMinh.PHUC_DAP ||
								recXacMinh?.phaseXuLy === EPhaseXacMinh.KET_QUA ||
								isHoanThanh
							}
							onClick={() => handleChuyenBuoc(EPhaseXacMinh.PHUC_DAP)}
							icon={<FileTextOutlined />}
							type='primary'
						>
							{intl.formatMessage({ id: 'xacminhvanbang.sinhvien.button.chuanbicongvan' })}
						</Button>
					)}

					<Button onClick={() => setvsXacMinh(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			) : null}

			<Modal
				title={`${edit ? intl.formatMessage({ id: 'xacminhvanbang.sinhvien.modal.title.chinhsua' }) : isView ? intl.formatMessage({ id: 'xacminhvanbang.sinhvien.modal.title.chitiet' }) : intl.formatMessage({ id: 'xacminhvanbang.sinhvien.modal.title.themmoi' })}`}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormSinhVienXacMinh getData={getData} />
			</Modal>

			<ModalExpandable
				open={vsPhuLuc}
				onCancel={() => setVsPhuLuc(false)}
				title={intl.formatMessage({ id: 'xacminhvanbang.sinhvien.modal.chitietvanbang' })}
				width={1000}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVsPhuLuc(false)}>
							{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
						</Button>
					</div>
				}
			>
				<ViewPhuLucVanBang hasPrint={false} hideFooter />
			</ModalExpandable>

			<ModalPhucDap visible={visiblePhucDap} setVisible={setVisiblePhucDap} getData={getData} isKetQua={isKetQua} />

			<ModalTraCuuThuCong visible={visibleTraCuu} setVisible={setVisibleTraCuu} getData={getData} />
		</>
	);
};

export default SinhVienXacMinhPage;
