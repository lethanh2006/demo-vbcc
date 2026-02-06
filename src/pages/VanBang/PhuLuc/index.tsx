import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import { ETagColor } from '@/services/base/constant';
import {
	colorLoaiYeuCauChinhSuaVanBang,
	colorTrangThaiBlc,
	colorTrangThaiTotNghiep,
	ELoaiYeuCauChinhSuaVanBang,
	EQuyetDinhStep,
	ETrangThaiBlockchain,
	ETrangThaiCapBang,
	ETrangThaiQuyetDinhTotNghiep,
	nameLoaiYeuCauChinhSuaVanBang,
	nameTrangThaiTotNghiep,
} from '@/services/VanBang/constant';
import { validateHoanThanh, xuatVanBangQuyetDinh } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import {
	ArrowLeftOutlined,
	BoldOutlined,
	CheckCircleOutlined,
	CloudUploadOutlined,
	EditOutlined,
	ExportOutlined,
	FilePdfOutlined,
	FormOutlined,
	ImportOutlined,
	InfoCircleOutlined,
	MenuOutlined,
	ReloadOutlined,
	RollbackOutlined,
	SaveOutlined,
	SearchOutlined,
	SettingOutlined,
	SignatureOutlined,
	UndoOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Alert, Button, Descriptions, Dropdown, Form, Input, Menu, Popconfirm, Popover, Space, Tag } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectQuyetDinhTotNghiep from '../QuyetDinhTotNghiep/components/Select';
import CauHinhPhuLucVanBang from './components/CauHinh';
import FormPhuLucVanBang from './components/Form';
import ModalSignVanBang from './components/KySoVanBang';
import ModalExportData from './components/ModalExportData';
import ModalImportPhuLucVanBang from './components/ModalImportPhuLuc';
import ModalPushBlockchain from './components/ModalPushBlockchain';
import ModalSign from './components/ModalSign';
import ModalTrinhKyVanBang from './components/ModalTrinhKy';
import ModalUploadFolder from './components/ModalUploadFolder';
import PreviewIPFS from './components/Preview';
import ViewPhuLucVanBang from './components/ViewRender';

const PhuLucVanBangPage = (props: {
	isQuyetDinh?: boolean;
	afterAddNew?: (val: EQuyetDinhStep) => void;
	title?: 'Tất cả quyết định' | 'Dự thảo cần duyệt' | 'Quyết định đã duyệt';
	themMoiHoanThanh?: boolean;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { isQuyetDinh = false, afterAddNew, title, themMoiHoanThanh } = props;
	const {
		page,
		limit,
		handleEdit,
		getModel,
		danhSach,
		selectedIds,
		setSelectedIds,
		setDataToSignOrPush,
		setVisibleSign,
		setVisiblePush,
		setVisiblePrint,
		setRecord,
		total,
		isView,
		edit,
		handleView,
		setVisibleSignVanBang,
		record,
		putModel,
		yeuCauCapNhatVanBangModel,
	} = useModel('vbcc.phulucvanbang');
	const {
		formSubmiting,
		record: recQuyetDinh,
		danhSach: danhsachQuyetDinh,
		setRecord: setQuyetDinh,
		setVisibleForm,
		xuLyDuThaoModel,
		getByIdModel,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const { record: recNguoiKy, getByIdModel: getNguoiKy } = useModel('vbcc.nguoiky');
	const { settings } = useModel('tienich.caidat');
	const [yearSelect, setYearSelect] = useState<any>();
	const [showUpload, setShowUpload] = useState(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleTrinhKy, setVisibleTrinhKy] = useState<boolean>(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [recEditInline, setRecEditInline] = useState<PhuLucVanBang.IRecord>();
	const [valiHoanThanh, setValiHoanThanh] = useState<boolean>(false);
	const [loadingExport, setLoadingExport] = useState<boolean>(false);
	const [loadingValidate, setLoadingValidate] = useState<boolean>(false);
	const { INFO_TENANT: settingVbcc } = settings;
	const [trangThaiYeuCau, setTrangThaiYeuCau] = useState<'Cấp lại' | 'Chỉnh sửa' | 'Thu hồi'>('Cấp lại');

	const isHoanThanh = recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.HOAN_THANH;

	//Get quyết định lấy số vào sổ
	const getQuyetDinh = () => {
		getByIdModel(recQuyetDinh?._id ?? '', true);
	};

	const getValidateHoanThanh = () => {
		if (isQuyetDinh && recQuyetDinh?._id) {
			setLoadingValidate(true);
			validateHoanThanh(recQuyetDinh?._id)
				.then((res) => setValiHoanThanh(res?.data?.data))
				.finally(() => setLoadingValidate(false));
		}
	};

	useEffect(() => {
		getNguoiKy('me');
	}, []);

	useEffect(() => {
		getValidateHoanThanh();
	}, [recQuyetDinh?._id, isQuyetDinh]);

	useEffect(() => {
		if (!recEditInline) {
			resetFieldsForm(form);
		}
	}, [recEditInline]);

	const getData = () => {
		const filters: any[] = [
			{
				active: true,
				field: 'soVaoSoBang',
				operator: EOperatorType.NOT_NULL,
			},
		];

		if (yearSelect) {
			filters.push({
				active: true,
				field: ['quyetDinh', 'ngayBanHanh'],
				operator: EOperatorType.BETWEEN,
				values: [
					dayjs(yearSelect.toString()).startOf('year').toISOString(),
					dayjs(yearSelect.toString()).endOf('year').toISOString(),
				],
			});
		}

		getModel(
			{
				idQuyetDinh: recQuyetDinh?._id,
			},
			filters,
		);
	};

	const handleSign = () => {
		if (selectedIds?.length) {
			setDataToSignOrPush(danhSach.filter((item) => selectedIds.includes(item._id)));
			setVisibleSign(true);
		}
	};

	const handlePush = () => {
		if (selectedIds?.length) {
			setDataToSignOrPush(danhSach.filter((item) => selectedIds.includes(item._id)));
			setVisiblePush(true);
		}
	};

	const handlePrint = () => {
		if (recQuyetDinh?._id) {
			setDataToSignOrPush(danhSach.filter((item) => selectedIds?.includes(item._id)));
			setVisiblePrint(true);
		}
	};

	const handlePrintVanBang = () => {
		if (recQuyetDinh?._id) {
			setDataToSignOrPush(danhSach.filter((item) => selectedIds?.includes(item._id)));
			setVisibleSignVanBang(true);
		}
	};

	const onFinish = (value: PhuLucVanBang.IRecord) => {
		if (recEditInline?.soHieuVanBang !== value.soHieuVanBang)
			putModel(
				recEditInline?._id ?? '',
				{ soHieuVanBang: value.soHieuVanBang ?? null },
				() => {
					getData();
					if (isQuyetDinh) getValidateHoanThanh();
				},
				true,
				false,
			);
		setRecEditInline(undefined);
	};

	const handleXuatVanBangQuyetDinh = async () => {
		if (!recQuyetDinh?._id) return;
		setLoadingExport(true);
		try {
			const res = await xuatVanBangQuyetDinh(recQuyetDinh._id, {
				sort: { soVaoSoBang: 1 },
			});
			fileDownload(res.data, `DanhSach_ThongTinVanBang_${recQuyetDinh.soQuyetDinh}.xlsx`);
		} catch (e) {
			console.error(e);
		} finally {
			setLoadingExport(false);
		}
	};

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.sovaoso' }),
			dataIndex: 'soVaoSoBang',
			filterType: 'string',
			width: 120,
			onCell,
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.sohieuvb' }),
			dataIndex: 'soHieuVanBang',
			filterType: 'string',
			width: 120,
			onCell:
				isQuyetDinh && !isHoanThanh
					? (rec) => ({
							onClick: () => recEditInline?._id !== rec?._id && setRecEditInline(rec),
							className: 'hovered-cell',
						})
					: onCell,
			render: (val, rec) =>
				recEditInline?._id === rec?._id ? (
					<Form onFinish={onFinish} form={form}>
						<Form.Item initialValue={val} name='soHieuVanBang' noStyle>
							<Input autoFocus onBlur={() => setRecEditInline(undefined)} />
						</Form.Item>
					</Form>
				) : (
					<span>{val}</span>
				),
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.hoten' }),
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.ngaysinh' }),
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.manguoihoc' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.quyetdinh' }),
			dataIndex: 'idQuyetDinh',
			width: 140,
			render: (val, rec) => (
				<>
					{rec.quyetDinh?.soQuyetDinh ?? ''},{' '}
					{rec.quyetDinh?.ngayBanHanh ? dayjs(rec.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : ''}
				</>
			),
			hide: !!recQuyetDinh?._id,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.taptin' }),
			dataIndex: 'urlIpfs',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a
						onClick={(e) => {
							e.preventDefault();
							setRecord(rec);
							setVisibleModal(true);
						}}
					>
						{intl.formatMessage({ id: 'thongtinvb.text.xemchitiet' })}
					</a>
				) : (
					<i>{intl.formatMessage({ id: 'thongtinvb.text.chuaupload' })}</i>
				),
			hide: !settingVbcc?.require_IPFS,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.vanbang' }),
			width: 120,
			children: [
				{
					title: intl.formatMessage({ id: 'thongtinvb.column.taptin' }),
					dataIndex: 'fileVanBang',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						!val ? (
							<Tag color='red'>{intl.formatMessage({ id: 'thongtinvb.text.chuatrinhky' })}</Tag>
						) : (
							<a
								onClick={(e) => {
									e.preventDefault();
									setRecord(rec);
									setVisibleFormFile(true);
								}}
							>
								{intl.formatMessage({ id: 'thongtinvb.text.xemchitiet' })}
							</a>
						),
				},
				{
					title: intl.formatMessage({ id: 'thongtinvb.column.kysovanbang' }),
					dataIndex: 'daKy',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>{intl.formatMessage({ id: 'thongtinvb.text.daky' })}]</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label={intl.formatMessage({ id: 'thongtinvb.desc.nguoiky' })}>
													{rec?.nguoiKy?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label={intl.formatMessage({ id: 'thongtinvb.desc.thoigianky' })}>
													{rec?.thoiGianKy ? dayjs(rec?.thoiGianKy).format('HH:mm DD/MM/YYYY') : '--'}
												</Descriptions.Item>
											</Descriptions>
										</div>
									}
								>
									<InfoCircleOutlined />
								</Popover>
							</Space>
						) : (
							<Tag color='orange'>{intl.formatMessage({ id: 'thongtinvb.text.chuaky' })}</Tag>
						),
				},
				{
					title: intl.formatMessage({ id: 'thongtinvb.column.dongdau' }),
					dataIndex: 'daDongDau',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>{intl.formatMessage({ id: 'thongtinvb.text.dadongdau' })}</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label={intl.formatMessage({ id: 'thongtinvb.desc.nguoidongdau' })}>
													{rec?.nguoiDongGiau?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label={intl.formatMessage({ id: 'thongtinvb.desc.thoigiandongdau' })}>
													{rec?.thoiGianDongGiau ? dayjs(rec?.thoiGianDongGiau).format('HH:mm DD/MM/YYYY') : '--'}
												</Descriptions.Item>
											</Descriptions>
										</div>
									}
								>
									<InfoCircleOutlined />
								</Popover>
							</Space>
						) : (
							<Tag color='orange'>{intl.formatMessage({ id: 'thongtinvb.text.chuadongdau' })}</Tag>
						),
				},
			],
			hide: !settingVbcc?.require_diploma_signature,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.trangthaiphatbang' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (_: any, record: PhuLucVanBang.IRecord) => {
				const trangThai = (
					<Tag color={colorTrangThaiTotNghiep[_ as ETrangThaiCapBang]}>
						{nameTrangThaiTotNghiep[_ as ETrangThaiCapBang]}
					</Tag>
				);

				const ngayCap = record?.ngayCapPhuLuc ? `${dayjs(record.ngayCapPhuLuc).format('DD/MM/YYYY')}` : null;

				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<div>{trangThai}</div>
						{record?.trangThai === ETrangThaiCapBang.DA_CAP_BANG && ngayCap && (
							<div style={{ fontSize: 12 }}>{ngayCap}</div>
						)}
					</div>
				);
			},
			filterData: Object.values(ETrangThaiCapBang).map((item) => ({
				value: item,
				label: nameTrangThaiTotNghiep[item as ETrangThaiCapBang],
			})),
			onCell,
			hide: isQuyetDinh,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.kysothongtin' }),
			dataIndex: 'signature',
			align: 'center',
			width: 80,
			render: (val) => <Tag color={!!val ? ETagColor.GREEN : ETagColor.RED}>{!!val ? 'Đã ký' : 'Chưa ký'}</Tag>,
			hide: !settingVbcc?.require_signature,
			onCell,
		},
		{
			title: 'Blockchain',
			dataIndex: 'createdBlockchain',
			align: 'center',
			width: 180,
			filterType: 'select',
			filterData: Object.values(ETrangThaiBlockchain).map((item) => ({ label: item, value: item })),
			render: (val: ETrangThaiBlockchain) => (
				<div style={{ color: colorTrangThaiBlc[val] }}>
					<Space>
						{val === ETrangThaiBlockchain.DA_LUU ? (
							<CheckCircleOutlined />
						) : val === ETrangThaiBlockchain.CHUA_CAP_NHAT ? (
							<EditOutlined />
						) : (
							<WarningOutlined />
						)}{' '}
						{val}
					</Space>
				</div>
			),
			hide: !settingVbcc?.blockChain,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.ghichudeXuat' }),
			dataIndex: 'ghiChuYeuCau',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			hide: isQuyetDinh,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.trangthaixuly' }),
			dataIndex: 'loaiYeuCauChinhSua',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				rec?.isThuHoi ? (
					<Tag color='red'>{intl.formatMessage({ id: 'thongtinvb.text.dathuhoi' })}</Tag>
				) : (
					<Tag color={colorLoaiYeuCauChinhSuaVanBang[val as ELoaiYeuCauChinhSuaVanBang]}>
						{nameLoaiYeuCauChinhSuaVanBang[val as ELoaiYeuCauChinhSuaVanBang]}
					</Tag>
				),
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(ELoaiYeuCauChinhSuaVanBang).map((item) => ({
				label: nameLoaiYeuCauChinhSuaVanBang[item],
				value: item,
			})),
			onCell,
			hide: isQuyetDinh,
		},
		{
			title: intl.formatMessage({ id: 'thongtinvb.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popover
						placement='bottomLeft'
						trigger='hover'
						content={
							<Space direction='vertical' size={'small'}>
								<ButtonExtend
									disabled={rec?.loaiYeuCauChinhSua === ELoaiYeuCauChinhSuaVanBang.CAP_NHAT}
									tooltip={intl.formatMessage({ id: 'thongtinvb.tooltip.dexuatchinhsua' })}
									type='link'
									icon={<EditOutlined />}
									onClick={() => {
										setTrangThaiYeuCau('Chỉnh sửa');
										handleEdit(rec);
									}}
									size='small'
								>
									{intl.formatMessage({ id: 'thongtinvb.tooltip.dexuatchinhsua' })}
								</ButtonExtend>
								<ButtonExtend
									disabled={rec?.loaiYeuCauChinhSua === ELoaiYeuCauChinhSuaVanBang.CAP_LAI}
									tooltip={intl.formatMessage({ id: 'thongtinvb.tooltip.dexuatcaplai' })}
									type='link'
									icon={<RollbackOutlined />}
									onClick={() => {
										setTrangThaiYeuCau('Cấp lại');
										handleEdit(rec);
									}}
									size='small'
								>
									{intl.formatMessage({ id: 'thongtinvb.tooltip.dexuatcaplai' })}
								</ButtonExtend>
								<Popconfirm
									title={intl.formatMessage({ id: 'thongtinvb.confirm.thuhoi' })}
									placement='topRight'
									onConfirm={() =>
										yeuCauCapNhatVanBangModel(rec?._id, { loai: 'Thu hồi', thoiGianYeuCau: dayjs() }, getData)
									}
								>
									<ButtonExtend
										disabled={rec?.loaiYeuCauChinhSua === ELoaiYeuCauChinhSuaVanBang.THU_HOI || !!rec?.isThuHoi}
										size='small'
										tooltip={intl.formatMessage({ id: 'thongtinvb.tooltip.dexuatthuhoi' })}
										type='link'
										icon={<UndoOutlined />}
										danger
									>
										{intl.formatMessage({ id: 'thongtinvb.tooltip.dexuatthuhoi' })}
									</ButtonExtend>
								</Popconfirm>
							</Space>
						}
					>
						<ButtonExtend type='link' icon={<MenuOutlined />} />
					</Popover>
				</>
			),
			hide: isQuyetDinh,
		},
	];

	const otherButtons = [
		<ButtonExtend
			icon={<ImportOutlined />}
			onClick={() => setVisibleImport(true)}
			key='import'
			disabled={!recQuyetDinh?._id}
		>
			{intl.formatMessage({ id: 'thongtinvb.button.nhapdulieu' })}
		</ButtonExtend>,
		<ButtonExtend
			icon={<ExportOutlined />}
			onClick={handleXuatVanBangQuyetDinh}
			key='export'
			disabled={!recQuyetDinh?._id}
			loading={loadingExport}
		>
			{intl.formatMessage({ id: 'thongtinvb.button.xuatvanbang' })}
		</ButtonExtend>,
	];

	if (settingVbcc?.require_IPFS)
		otherButtons.push(
			<ButtonExtend
				icon={<CloudUploadOutlined />}
				onClick={() => setShowUpload(true)}
				tooltip={intl.formatMessage({ id: 'thongtinvb.tooltip.uploadfolder' })}
				disabled={!recQuyetDinh?._id}
				key='upload'
			>
				{intl.formatMessage({ id: 'thongtinvb.button.uploadvanbang' })}
			</ButtonExtend>,
		);
	if (settings?.INFO_TENANT?.require_diploma_signature) {
		otherButtons.push(
			<ButtonExtend
				icon={<FormOutlined />}
				onClick={() => setVisibleTrinhKy(true)}
				key='trinhky'
				disabled={!total || !recQuyetDinh?._id}
			>
				{intl.formatMessage({ id: 'thongtinvb.button.trinhky' })} ({selectedIds?.length || 'Tất cả'})
			</ButtonExtend>,
		);
	}
	otherButtons.push(
		<ButtonExtend key='Export' icon={<FilePdfOutlined />} onClick={handlePrint} disabled={!total || !recQuyetDinh?._id}>
			{intl.formatMessage({ id: 'thongtinvb.button.inthongtin' })} ({selectedIds?.length || 'Tất cả'})
		</ButtonExtend>,
	);
	if (recNguoiKy?._id)
		otherButtons.push(
			<Dropdown
				overlay={
					<Menu>
						{settingVbcc?.require_signature && (
							<Menu.Item key='thongtin' onClick={handleSign}>
								{intl.formatMessage({ id: 'thongtinvb.button.thongtin' })}
							</Menu.Item>
						)}
						<Menu.Item key='vanbang' onClick={handlePrintVanBang}>
							{intl.formatMessage({ id: 'thongtinvb.button.vanbang' })}
						</Menu.Item>
					</Menu>
				}
				disabled={!selectedIds?.length}
			>
				<ButtonExtend disabled={!selectedIds?.length} className='btn-success' icon={<SignatureOutlined />} key='sign'>
					{intl.formatMessage({ id: 'thongtinvb.button.kysovanbang' })} ({selectedIds?.length ?? 0})
				</ButtonExtend>
			</Dropdown>,
		);
	if (settingVbcc?.blockChain)
		otherButtons.push(
			<ButtonExtend
				disabled={!selectedIds?.length}
				className='btn-success'
				icon={<BoldOutlined />}
				onClick={handlePush}
				key='push'
			>
				{intl.formatMessage({ id: 'thongtinvb.button.dayblockchain' })} ({selectedIds?.length ?? 0})
			</ButtonExtend>,
		);

	return (
		<>
			{isQuyetDinh && !valiHoanThanh ? (
				<Alert
					style={{ marginBottom: 12 }}
					type='warning'
					showIcon
					message={intl.formatMessage({ id: 'thongtinvb.alert.thieuSoHieu' })}
				/>
			) : null}

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recQuyetDinh?._id, yearSelect]}
				modelName='vbcc.phulucvanbang'
				title={intl.formatMessage({ id: 'thongtinvb.title' })}
				widthDrawer={1000}
				modalTitle={intl.formatMessage({
					id: isView
						? 'thongtinvb.modal.view.title'
						: edit
							? 'thongtinvb.modal.edit.title'
							: 'thongtinvb.modal.create.title',
				})}
				Form={isView ? ViewPhuLucVanBang : FormPhuLucVanBang}
				formProps={{ getData, trangThaiYeuCau }}
				buttons={{
					create: false,
					export: true,
				}}
				hideCard={isQuyetDinh}
				otherButtons={otherButtons}
				extra={
					<Space wrap>
						<ButtonExtend
							icon={<SearchOutlined />}
							onClick={() => window.open('/tra-cuu-van-bang', '_blank')}
							tooltip={intl.formatMessage({ id: 'thongtinvb.button.tracuu' })}
							type='link'
						/>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'thongtinvb.button.cauhinh' })}
							onClick={() => setVisibleCauHinh(true)}
							icon={<SettingOutlined />}
							type='link'
						/>
					</Space>
				}
				rowSelection
				showModalTitle
			>
				{!isQuyetDinh ? (
					<Space wrap style={{ marginBottom: 12 }}>
						<MyDatePicker
							style={{ width: 150 }}
							value={yearSelect}
							pickerStyle='year'
							placeholder={intl.formatMessage({ id: 'thongtinvb.filter.namhanhchinh' })}
							format='YYYY'
							onChange={(val) => {
								if (val) {
									setYearSelect(dayjs(val));
								} else {
									setYearSelect(null);
								}
							}}
							allowClear
						/>

						<SelectQuyetDinhTotNghiep
							condition={
								yearSelect
									? { nam: dayjs(yearSelect).format('YYYY'), trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }
									: { trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }
							}
							style={{ width: 250 }}
							value={recQuyetDinh?._id}
							onChange={(val) => setQuyetDinh(danhsachQuyetDinh?.find((item) => item._id === val))}
							allowClear
						/>
					</Space>
				) : null}
			</TableBase>

			{isQuyetDinh && (
				<div className='form-footer'>
					<Button
						onClick={() => {
							if (afterAddNew) afterAddNew(themMoiHoanThanh ? EQuyetDinhStep.THONG_TIN : EQuyetDinhStep.DU_THAO_SO);
						}}
						icon={<ArrowLeftOutlined />}
					>
						{intl.formatMessage({ id: 'thongtinvb.button.quaylai' })}
					</Button>

					{(title === 'Quyết định đã duyệt' || themMoiHoanThanh) && (
						<>
							<Popconfirm
								disabled={isHoanThanh || !valiHoanThanh}
								onConfirm={() =>
									xuLyDuThaoModel(
										recQuyetDinh?._id ?? '',
										{ trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH },
										getQuyetDinh,
									)
								}
								title={intl.formatMessage({ id: 'thongtinvb.confirm.hoanthanhqd' })}
								placement='topRight'
							>
								<Button
									disabled={isHoanThanh || !valiHoanThanh}
									loading={formSubmiting || loadingValidate}
									type='primary'
									icon={<SaveOutlined />}
								>
									{intl.formatMessage({ id: 'thongtinvb.button.hoanthanh' })}
								</Button>
							</Popconfirm>
							<Button disabled={loadingValidate} loading={loadingValidate} icon={<ReloadOutlined />}>
								{intl.formatMessage({ id: 'thongtinvb.button.lammoiso' })}
							</Button>
						</>
					)}

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			)}

			<ModalImportPhuLucVanBang
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					getData();
					if (isQuyetDinh) getValidateHoanThanh();
					setVisibleImport(false);
				}}
				params={{
					sort: { soVaoSoBang: 1 },
				}}
				isThongTin
			/>

			<ModalExportData />

			<CauHinhPhuLucVanBang visible={visibleCauHinh} setVisible={setVisibleCauHinh} />

			{settingVbcc?.require_IPFS && (
				<>
					<ModalUploadFolder visible={showUpload} setVisible={setShowUpload} getData={getData} />

					<PreviewIPFS visible={visibleModal} setVisible={setVisibleModal} />
				</>
			)}

			{settingVbcc?.blockChain && (
				<ModalPushBlockchain
					getData={() => {
						getData();
						setSelectedIds([]);
					}}
				/>
			)}

			{settingVbcc?.require_signature && (
				<>
					<ModalSign
						getData={() => {
							getData();
							setSelectedIds([]);
						}}
					/>
				</>
			)}

			<ModalTrinhKyVanBang visible={visibleTrinhKy} setVisible={setVisibleTrinhKy} getData={getData} />

			<ModalSignVanBang getData={() => getData()} />

			<ModalExpandable
				title={intl.formatMessage({ id: 'thongtinvb.modal.previewfile.title' })}
				width={1000}
				open={visibleFormFile}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.fileVanBang ?? ''} />
			</ModalExpandable>
		</>
	);
};

export default PhuLucVanBangPage;
