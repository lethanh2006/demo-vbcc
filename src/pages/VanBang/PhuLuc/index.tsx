import MyDatePicker from '@/components/MyDatePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { ESettingKey, ETagColor } from '@/services/base/constant';
import { colorTrangThaiBlc, ETrangThaiBlockchain } from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import {
	BoldOutlined,
	CheckCircleOutlined,
	CloudUploadOutlined,
	DatabaseOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	FilePdfOutlined,
	FormOutlined,
	ImportOutlined,
	InfoCircleOutlined,
	PlusCircleOutlined,
	SearchOutlined,
	SettingOutlined,
	SignatureOutlined,
	UserAddOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Descriptions, Dropdown, Menu, Popconfirm, Popover, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalCapBang from '../DotCapBangTotNghiep/components/ModalCapBang';
import ModalChonPhuLuc from '../DotCapBangTotNghiep/components/ModalChonPhuLuc';
import SelectQuyetDinh from '../QuyetDinhTotNghiep/components/Select';
import SelectQuyetDinhTotNghiepDot from '../QuyetDinhTotNghiep/components/SelectQuyetDinhDot';
import CauHinhPhuLucVanBang from './components/CauHinh';
import Form from './components/Form';
import ModalSignVanBang from './components/KySoVanBang';
import ModalExportData from './components/ModalExportData';
import ModalImportPhuLucVanBang from './components/ModalImportPhuLuc';
import ModalPushBlockchain from './components/ModalPushBlockchain';
import ModalSign from './components/ModalSign';
import ModalSinhSoVaoSo from './components/ModalSinhSo';
import ModalTrinhKyVanBang from './components/ModalTrinhKy';
import ModalUploadFolder from './components/ModalUploadFolder';
import PreviewIPFS from './components/Preview';
import ViewPhuLucVanBang from './components/ViewRender';

const PhuLucVanBangPage = (props: { isQuyetDinh?: boolean; isDotCapBang?: boolean; getData?: any }) => {
	const intl = useIntl();
	const { isQuyetDinh = false, isDotCapBang = false, getData: getDataV2 } = props;
	const {
		page,
		limit,
		deleteModel,
		getModel,
		handleEdit,
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
		handleView,
		putModel,
		setVisibleSignVanBang,
	} = useModel('vbcc.phulucvanbang');
	const {
		record: recQuyetDinh,
		danhSach: danhsachQuyetDinh,
		setRecord: setQuyetDinh,
		dsAllQuyeDinh,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const { record: recDotCapCang } = useModel('vbcc.dotcapbangtotnghiep');
	const { settings } = useModel('tienich.caidat');
	const [yearSelect, setYearSelect] = useState<any>(dayjs());
	const [showUpload, setShowUpload] = useState(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [showModalCapBang, setShowModalCapBang] = useState<boolean>(false);
	const [visibleModalChonPhuLuc, setVisibleModalChonPhuLuc] = useState<boolean>(false);
	const [visibleSinhSo, setVisibleSinhSo] = useState<boolean>(false);
	const [visibleTrinhKy, setVisibleTrinhKy] = useState<boolean>(false);
	const settingVbcc = settings[ESettingKey.INFO_TENANT_VBCC];

	// set lại quyết định sau khi sinh số vào sổ
	useEffect(() => {
		setQuyetDinh(danhsachQuyetDinh?.find((item) => item?._id === recQuyetDinh?._id));
	}, [JSON.stringify(danhsachQuyetDinh)]);

	const condition: any = {};

	if (recQuyetDinh?._id) {
		condition.idQuyetDinh = recQuyetDinh?._id;
	}

	if (isDotCapBang) {
		condition.idDotCapBang = recDotCapCang?._id;
	}

	const getData = () => getModel(condition).then(() => setSelectedIds([]));

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

	// const handlePrintOne = (rec: PhuLucVanBang.IRecord) => {
	// 	setDataToSignOrPush([rec]);
	// 	setVisiblePrint(true);
	// };

	const handlePrintVanBang = () => {
		if (recQuyetDinh?._id) {
			setDataToSignOrPush(danhSach.filter((item) => selectedIds?.includes(item._id)));
			setVisibleSignVanBang(true);
		}
	};

	const delePhuLucDot = (rec: PhuLucVanBang.IRecord) => {
		putModel(rec?._id ?? '', { idDotCapBang: null }, getData);
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
		},
		{
			title: 'Số hiệu VB',
			dataIndex: 'soHieuVanBang',
			filterType: 'string',
			width: 120,
			onCell,
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
			title: 'Mã SV',
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
			hide: isQuyetDinh || !!recQuyetDinh?._id,
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
					title: 'File ký',
					dataIndex: 'fileVanBang',
					align: 'center',
					width: 120,
					render: (val, rec) => (
						<Space>
							{!val ? (
								<Tag color='red'>Chưa trình ký</Tag>
							) : (
								<a href={val} target='_blank' rel='noreferrer'>
									Tập tin
								</a>
							)}

							{val && (
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Người ký'>{rec?.nguoiKy?.hoTen ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Thời gian ký'>
													{rec?.thoiGianKy ? dayjs(rec?.thoiGianKy).format('HH:mm DD/MM/YYYY') : '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Người đóng dấu'>
													{rec?.nguoiDongGiau?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Thời gian đóng dấu'>
													{rec?.thoiGianDongGiau ? dayjs(rec?.thoiGianDongGiau).format('HH:mm DD/MM/YYYY') : '--'}
												</Descriptions.Item>
											</Descriptions>
										</div>
									}
									trigger='hover'
								>
									<InfoCircleOutlined />
								</Popover>
							)}
						</Space>
					),
				},
				{
					title: 'Ký số',
					dataIndex: 'daKy',
					align: 'center',
					width: 120,
					render: (val, rec) => (val ? <Tag color='green'>Đã ký</Tag> : <Tag color='orange'>Chưa ký</Tag>),
				},
				{
					title: 'Đóng dấu',
					dataIndex: 'daDongDau',
					align: 'center',
					width: 120,
					render: (val, rec) => (val ? <Tag color='green'>Đã đóng dấu</Tag> : <Tag color='orange'>Chưa đóng dấu</Tag>),
				},
			],
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
			title: 'Thao tác',
			align: 'center',
			width: isDotCapBang ? 90 : 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Xem chi tiết' type='link' icon={<EyeOutlined />} onClick={() => handleView(rec)} />
					{!isDotCapBang && (
						<ButtonExtend tooltip='Chỉnh sửa' type='link' icon={<EditOutlined />} onClick={() => handleEdit(rec)} />
					)}
					<Popconfirm
						onConfirm={() => (isDotCapBang ? delePhuLucDot(rec) : deleteModel(rec._id, getData))}
						title='Bạn có chắc chắn muốn xóa phụ lục này?'
						placement='topRight'
					>
						<ButtonExtend
							// disabled={isQuyetDinh && rec.trangThaiPhuLuc === ETrangThaiPhuLuc.DA_VAO_SO}
							// disabled={rec.kichHoat === true}
							tooltip='Xóa'
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
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
	if (!!recQuyetDinh?._id)
		otherButtons.push(
			<ButtonExtend icon={<DatabaseOutlined />} onClick={() => setVisibleSinhSo(true)} key='sinhSo'>
				Sinh số vào sổ
			</ButtonExtend>,
			<ButtonExtend
				icon={<SignatureOutlined />}
				onClick={() => setVisibleTrinhKy(true)}
				key='trinhky'
				disabled={!total}
			>
				Trình ký ({selectedIds?.length || 'Tất cả'})
			</ButtonExtend>,
			<ButtonExtend key='Export' icon={<FilePdfOutlined />} onClick={handlePrint} disabled={!total}>
				In phụ lục ({selectedIds?.length || 'Tất cả'})
			</ButtonExtend>,
		);

	if (settingVbcc?.require_signature)
		otherButtons.push(
			<Dropdown
				overlay={
					<Menu>
						{/* <Menu.Item key='thongtin' onClick={handleSign}>
							Thông tin
						</Menu.Item> */}
						<Menu.Item key='vanbang' onClick={handlePrintVanBang}>
							Văn bằng
						</Menu.Item>
					</Menu>
				}
			>
				<ButtonExtend disabled={!selectedIds?.length} className='btn-success' icon={<FormOutlined />} key='sign'>
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

	if (isDotCapBang) {
		otherButtons.push(
			<>
				<ButtonExtend type='primary' icon={<PlusCircleOutlined />} onClick={() => setVisibleModalChonPhuLuc(true)}>
					Thêm phụ lục
				</ButtonExtend>
				<ButtonExtend
					tooltip='Xác nhận đã cấp bằng cho những phục lục này'
					disabled={!selectedIds?.length}
					icon={<UserAddOutlined />}
					onClick={() => setShowModalCapBang(true)}
				>
					Cấp bằng ({selectedIds?.length})
				</ButtonExtend>
			</>,
		);
	}

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				params={condition}
				dependencies={[page, limit, recQuyetDinh?._id, recDotCapCang?._id]}
				modelName='vbcc.phulucvanbang'
				title={intl.formatMessage({ id: 'vanbang.phulucvanbang.title' })}
				widthDrawer={1000}
				Form={isView ? ViewPhuLucVanBang : Form}
				formProps={{ getData, isQuyetDinh, vbccSettings: settingVbcc }}
				buttons={{ create: !!recQuyetDinh?._id && !isDotCapBang }}
				hideCard={isQuyetDinh || isDotCapBang}
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
				otherProps={{
					rowKey: (rec: PhuLucVanBang.IRecord) => rec._id,
					rowSelection: {
						type: 'checkbox',
						selectedRowKeys: selectedIds,
						preserveSelectedRowKeys: true,
						onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
						columnWidth: 40,
						// hideSelectAll: true,
					},
				}}
			>
				{!isQuyetDinh && !isDotCapBang ? (
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
							condition={yearSelect ? { nam: dayjs(yearSelect).format('YYYY') } : undefined}
							style={{ width: 250 }}
							value={recQuyetDinh?._id}
							onChange={(val) => setQuyetDinh(danhsachQuyetDinh?.find((item) => item._id === val))}
							isSetRecord
							// allowClear
						/>
					</Space>
				) : null}

				{isDotCapBang ? (
					<SelectQuyetDinhTotNghiepDot
						style={{ width: 250, marginBottom: 12 }}
						value={recQuyetDinh?._id}
						onChange={(val) => setQuyetDinh(dsAllQuyeDinh?.find((item) => item._id === val))}
						isSetRecord
						allowClear
					/>
				) : null}
			</TableBase>

			<ModalImportPhuLucVanBang
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					getData();
					setVisibleImport(false);
				}}
			/>

			<ModalUploadFolder visible={showUpload} setVisible={setShowUpload} getData={getData} />

			<ModalSign
				getData={() => {
					getData();
					setSelectedIds([]);
				}}
			/>

			<ModalPushBlockchain
				getData={() => {
					getData();
					setSelectedIds([]);
				}}
			/>

			<ModalExportData />

			<CauHinhPhuLucVanBang visible={visibleCauHinh} setVisible={setVisibleCauHinh} />

			<PreviewIPFS visible={visibleModal} setVisible={setVisibleModal} />

			<ModalCapBang visible={showModalCapBang} setVisible={setShowModalCapBang} getData={getData} />

			<ModalChonPhuLuc
				visible={visibleModalChonPhuLuc}
				onCancel={() => setVisibleModalChonPhuLuc(false)}
				getData={getData}
			/>

			<ModalSinhSoVaoSo
				visible={visibleSinhSo}
				setVisibe={setVisibleSinhSo}
				getData={() => {
					getData();
					if (getDataV2) getDataV2();
				}}
			/>

			<ModalTrinhKyVanBang visible={visibleTrinhKy} setVisible={setVisibleTrinhKy} getData={getData} />

			<ModalSignVanBang getData={() => getData()} />
		</>
	);
};

export default PhuLucVanBangPage;
