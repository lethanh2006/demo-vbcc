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
	ELoaiYeuCauChinhSuaVanBang,
	ETrangThaiBlockchain,
	ETrangThaiQuyetDinhTotNghiep,
	nameLoaiYeuCauChinhSuaVanBang,
} from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import {
	ArrowLeftOutlined,
	BoldOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	CloudUploadOutlined,
	EditOutlined,
	FilePdfOutlined,
	FormOutlined,
	ImportOutlined,
	InfoCircleOutlined,
	MenuOutlined,
	RollbackOutlined,
	SaveOutlined,
	SearchOutlined,
	SettingOutlined,
	SignatureOutlined,
	UndoOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Descriptions, Dropdown, Form, Input, Menu, Popconfirm, Popover, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalCapBang from '../DotCapBangTotNghiep/components/ModalCapBang';
import SelectQuyetDinh from '../QuyetDinhTotNghiep/components/Select';
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
	afterAddNew?: (val: number) => void;
	title?: 'Thông tin quyết định' | 'Dự thảo cần duyệt' | 'Quyết định đã duyệt';
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { isQuyetDinh = false, afterAddNew, title } = props;
	const {
		page,
		limit,
		handleEdit,
		getModel,
		danhSach,
		setDanhSach,
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
	const [yearSelect, setYearSelect] = useState<any>(dayjs());
	const [showUpload, setShowUpload] = useState(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [showModalCapBang, setShowModalCapBang] = useState<boolean>(false);
	const [visibleTrinhKy, setVisibleTrinhKy] = useState<boolean>(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [recEditInline, setRecEditInline] = useState<PhuLucVanBang.IRecord>();
	const { INFO_TENANT: settingVbcc } = settings;
	const [trangThaiYeuCau, setTrangThaiYeuCau] = useState<'Cấp lại' | 'Chỉnh sửa' | 'Thu hồi'>('Cấp lại');

	const isHoanThanh = recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.HOAN_THANH;

	//Get quyết định lấy số vào sổ
	const getQuyetDinh = () => {
		getByIdModel(recQuyetDinh?._id ?? '', true);
	};

	// set lại quyết định sau khi sinh số vào sổ
	useEffect(() => {
		setQuyetDinh(danhsachQuyetDinh?.find((item) => item?._id === recQuyetDinh?._id));
	}, [JSON.stringify(danhsachQuyetDinh)]);

	useEffect(() => {
		getNguoiKy('me');
	}, []);

	const getData = () => {
		if (recQuyetDinh?._id)
			getModel(
				{
					idQuyetDinh: recQuyetDinh?._id,
				},
				[
					{
						active: true,
						field: 'soVaoSoBang',
						operator: EOperatorType.NOT_NULL,
					},
				],
			);
		else setDanhSach([]);
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
			putModel(recEditInline?._id ?? '', { soHieuVanBang: value.soHieuVanBang }, getData, true, false);
		setRecEditInline(undefined);
	};

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ',
			dataIndex: 'soVaoSoBang',
			filterType: 'string',
			width: 120,
			onCell,
			sortable: true,
		},
		{
			title: 'Số hiệu VB',
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
						<Form.Item initialValue={val} name='soHieuVanBang' rules={[...rules.required]} noStyle>
							<Input autoFocus onBlur={() => setRecEditInline(undefined)} />
						</Form.Item>
					</Form>
				) : (
					<span>{val}</span>
				),
			sortable: true,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Mã người học',
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Quyết định',
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
			title: 'Tập tin',
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
						Xem chi tiết
					</a>
				) : (
					<i>(Chưa upload)</i>
				),
			hide: !settingVbcc?.require_IPFS,
		},
		{
			title: 'Văn bằng',
			width: 120,
			children: [
				{
					title: 'Tập tin',
					dataIndex: 'fileVanBang',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						!val ? (
							<Tag color='red'>Chưa trình ký</Tag>
						) : (
							<a
								onClick={(e) => {
									e.preventDefault();
									setRecord(rec);
									setVisibleFormFile(true);
								}}
							>
								Xem chi tiết
							</a>
						),
				},
				{
					title: 'Ký số',
					dataIndex: 'daKy',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>Đã ký</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Người ký'>{rec?.nguoiKy?.hoTen ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Thời gian ký'>
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
							<Tag color='orange'>Chưa ký</Tag>
						),
				},
				{
					title: 'Đóng dấu',
					dataIndex: 'daDongDau',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>Đã đóng dấu</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Người đóng dấu'>
													{rec?.nguoiDongGiau?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Thời gian đóng dấu'>
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
							<Tag color='orange'>Chưa đóng dấu</Tag>
						),
				},
			],
			hide: !settingVbcc?.require_diploma_signature,
		},
		{
			title: 'Cấp bằng',
			dataIndex: 'kichHoat',
			align: 'center',
			width: 120,
			render: (_: any, record: PhuLucVanBang.IRecord) => {
				const trangThai = record?.kichHoat ? (
					<Tag color='green'>Đã cấp bằng</Tag>
				) : (
					<Tag color='red'>Chưa cấp bằng</Tag>
				);

				const ngayCap = record?.ngayCapPhuLuc ? `Ngày: ${dayjs(record.ngayCapPhuLuc).format('DD/MM/YYYY')}` : null;

				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<div>{trangThai}</div>
						{ngayCap && <div>{ngayCap}</div>}
					</div>
				);
			},
			filterType: 'select',
			filterData: [
				{ value: true as any, label: 'Đã cấp bằng' },
				{ value: false, label: 'Chưa cấp bằng' },
			],
			onCell,
			hide: isQuyetDinh,
		},
		{
			title: 'Ký số thông tin',
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
			title: 'Thu hồi',
			dataIndex: 'isThuHoi',
			align: 'center',
			width: 60,
			render: (val) => <Checkbox checked={val} />,
			onCell,
			hide: isQuyetDinh,
		},
		{
			title: 'Ghi chú yêu cầu',
			dataIndex: 'ghiChuYeuCau',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			hide: isQuyetDinh,
		},
		{
			title: 'Trạng thái Yêu cầu',
			dataIndex: 'loaiYeuCauChinhSua',
			align: 'center',
			width: 120,
			render: (val, rec) => (
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
			title: 'Thao tác',
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
									tooltip='Yêu cầu chỉnh sửa'
									type='link'
									icon={<EditOutlined />}
									onClick={() => {
										setTrangThaiYeuCau('Chỉnh sửa');
										handleEdit(rec);
									}}
									size='small'
								>
									Yêu cầu chỉnh sửa
								</ButtonExtend>
								<ButtonExtend
									disabled={rec?.loaiYeuCauChinhSua === ELoaiYeuCauChinhSuaVanBang.CAP_LAI}
									tooltip='Yêu cầu cấp lại'
									type='link'
									icon={<RollbackOutlined />}
									onClick={() => {
										setTrangThaiYeuCau('Cấp lại');
										handleEdit(rec);
									}}
									size='small'
								>
									Yêu cầu cấp lại
								</ButtonExtend>
								<Popconfirm
									title='Xác nhận thu hồi phụ lục?'
									placement='topRight'
									onConfirm={() =>
										yeuCauCapNhatVanBangModel(rec?._id, { loai: 'Thu hồi', thoiGianYeuCau: dayjs() }, getData)
									}
								>
									<ButtonExtend
										disabled={rec?.loaiYeuCauChinhSua === ELoaiYeuCauChinhSuaVanBang.THU_HOI || !!rec?.isThuHoi}
										size='small'
										tooltip='Thu hồi'
										type='link'
										icon={<UndoOutlined />}
										danger
									>
										Thu hồi
									</ButtonExtend>
								</Popconfirm>
							</Space>
						}
					>
						<ButtonExtend type='link' tooltip='Thêm thao tác' icon={<MenuOutlined />} />
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
			Nhập dữ liệu
		</ButtonExtend>,
	];

	if (settingVbcc?.require_IPFS)
		otherButtons.push(
			<ButtonExtend
				icon={<CloudUploadOutlined />}
				onClick={() => setShowUpload(true)}
				tooltip='Upload thư mục bản scan văn bằng chứng chỉ'
				disabled={!recQuyetDinh?._id}
				key='upload'
			>
				Upload văn bằng
			</ButtonExtend>,
		);
	if (!!recQuyetDinh?._id) {
		if (settings?.INFO_TENANT?.require_diploma_signature) {
			otherButtons.push(
				<ButtonExtend icon={<FormOutlined />} onClick={() => setVisibleTrinhKy(true)} key='trinhky' disabled={!total}>
					Trình ký ({selectedIds?.length || 'Tất cả'})
				</ButtonExtend>,
			);
		}
		otherButtons.push(
			<ButtonExtend key='Export' icon={<FilePdfOutlined />} onClick={handlePrint} disabled={!total}>
				In phụ lục ({selectedIds?.length || 'Tất cả'})
			</ButtonExtend>,
		);
	}

	if (recNguoiKy?._id)
		otherButtons.push(
			<Dropdown
				overlay={
					<Menu>
						{settingVbcc?.require_signature && (
							<Menu.Item key='thongtin' onClick={handleSign}>
								Thông tin
							</Menu.Item>
						)}
						<Menu.Item key='vanbang' onClick={handlePrintVanBang}>
							Văn bằng
						</Menu.Item>
					</Menu>
				}
				disabled={!selectedIds?.length}
			>
				<ButtonExtend disabled={!selectedIds?.length} className='btn-success' icon={<SignatureOutlined />} key='sign'>
					Ký số ({selectedIds?.length ?? 0})
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
				Đẩy lên Blockchain ({selectedIds?.length ?? 0})
			</ButtonExtend>,
		);

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				params={{ idQuyetDinh: recQuyetDinh?._id }}
				dependencies={[page, limit, recQuyetDinh?._id]}
				modelName='vbcc.phulucvanbang'
				title={intl.formatMessage({ id: 'vanbang.phulucvanbang.title' })}
				widthDrawer={1000}
				modalTitle={
					isView
						? 'Xem chi tiết thông tin văn bằng'
						: edit
							? 'Cập nhật thông tin văn bằng'
							: 'Thêm mới thông tin văn bằng'
				}
				Form={isView ? ViewPhuLucVanBang : FormPhuLucVanBang}
				formProps={{ getData, vbccSettings: settingVbcc, trangThaiYeuCau }}
				buttons={{
					create: false,
				}}
				hideCard={isQuyetDinh}
				otherButtons={otherButtons}
				extra={
					<Space wrap>
						<ButtonExtend
							icon={<SearchOutlined />}
							onClick={() => window.open('/tra-cuu-van-bang', '_blank')}
							tooltip='Tra cứu'
							type='link'
						/>
						<ButtonExtend
							tooltip='Cấu hình'
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
							placeholder='Chọn năm hành chính'
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

						<SelectQuyetDinh
							condition={
								yearSelect
									? { nam: dayjs(yearSelect).format('YYYY'), trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }
									: { trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }
							}
							style={{ width: 250 }}
							value={recQuyetDinh?._id}
							onChange={(val) => setQuyetDinh(danhsachQuyetDinh?.find((item) => item._id === val))}
							isSetRecord
						/>
					</Space>
				) : null}
			</TableBase>

			{isQuyetDinh && (
				<div className='form-footer'>
					<Button
						onClick={() => {
							if (afterAddNew) afterAddNew(2);
						}}
						icon={<ArrowLeftOutlined />}
					>
						Quay lại
					</Button>

					{title === 'Quyết định đã duyệt' && (
						<Popconfirm
							disabled={isHoanThanh}
							onConfirm={() =>
								xuLyDuThaoModel(
									recQuyetDinh?._id ?? '',
									{ trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH },
									getQuyetDinh,
								)
							}
							title='Xác nhận hoàn thành quyết định tốt nghiệp?'
							placement='topRight'
						>
							<Button disabled={isHoanThanh} loading={formSubmiting} type='primary' icon={<SaveOutlined />}>
								Hoàn thành
							</Button>
						</Popconfirm>
					)}

					<Button onClick={() => setVisibleForm(false)} icon={<CloseCircleOutlined />} danger>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			)}

			<ModalImportPhuLucVanBang
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					getData();
					setVisibleImport(false);
				}}
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

			<ModalCapBang visible={showModalCapBang} setVisible={setShowModalCapBang} getData={getData} />

			<ModalTrinhKyVanBang visible={visibleTrinhKy} setVisible={setVisibleTrinhKy} getData={getData} />

			<ModalSignVanBang getData={() => getData()} />

			<ModalExpandable
				title='Chi tiết tệp tin'
				width={1000}
				open={visibleFormFile}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.fileVanBang ?? ''} />
			</ModalExpandable>
		</>
	);
};

export default PhuLucVanBangPage;
