import MyDatePicker from '@/components/MyDatePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { ESettingKey, ETagColor } from '@/services/base/constant';
import { colorTrangThaiBlc, ETrangThaiBlockchain } from '@/services/VanBang/constant';
import { getImportPhuLucVbTemplate } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import {
	BoldOutlined,
	CheckCircleOutlined,
	CloudUploadOutlined,
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
	FilePdfOutlined,
	FormOutlined,
	ImportOutlined,
	SearchOutlined,
	SettingOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { message, Popconfirm, Space, Tag } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectQuyetDinh from '../QuyetDinhTotNghiep/components/Select';
import CauHinhPhuLucVanBang from './components/CauHinh';
import Form from './components/Form';
import ModalExportData from './components/ModalExportData';
import ModalImportPhuLucVanBang from './components/ModalImportPhuLuc';
import ModalPushBlockchain from './components/ModalPushBlockchain';
import ModalSign from './components/ModalSign';
import ModalUploadFolder from './components/ModalUploadFolder';
import PreviewIPFS from './components/Preview';
import ViewPhuLucVanBang from './components/ViewRender';

const PhuLucVanBangPage = (props: { isQuyetDinh?: boolean }) => {
	const intl = useIntl();
	const { isQuyetDinh } = props;
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
	} = useModel('vbcc.phulucvanbang');
	const {
		record: recQuyetDinh,
		danhSach: danhsachQuyetDinh,
		setRecord: setQuyetDinh,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const { settings } = useModel('tienich.caidat');
	const [yearSelect, setYearSelect] = useState<any>(moment().year());
	const [showUpload, setShowUpload] = useState(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
	const settingVbcc = settings[ESettingKey.INFO_TENANT_VBCC];

	const getData = () => getModel({ idQuyetDinh: recQuyetDinh?._id }).then(() => setSelectedIds([]));

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

	const handlePrintOne = (rec: PhuLucVanBang.IRecord) => {
		setDataToSignOrPush([rec]);
		setVisiblePrint(true);
	};

	const onDownloadTemplate = async () => {
		if (!recQuyetDinh?._id) {
			return;
		}
		setLoadingDownload(true);
		try {
			const res = await getImportPhuLucVbTemplate(recQuyetDinh._id);
			fileDownload(res.data, `Mẫu nhập Phụ lục văn bằng QĐ ${recQuyetDinh.soQuyetDinh}.xlsx`);
		} catch (error) {
			console.error('Lỗi khi tải file mẫu:', error);
			message.error('Không thể tải file mẫu, vui lòng thử lại!');
		} finally {
			setLoadingDownload(false);
		}
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
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
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
					{rec.quyetDinh?.ngayBanHanh ? moment(rec.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : ''}
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
			title: 'Ký số',
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
					{val === ETrangThaiBlockchain.DA_LUU ? (
						<CheckCircleOutlined />
					) : val === ETrangThaiBlockchain.CHUA_CAP_NHAT ? (
						<EditOutlined />
					) : (
						<WarningOutlined />
					)}{' '}
					<small>{val}</small>
				</div>
			),
			hide: !settingVbcc?.blockChain,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='In phụ lục'
						type='link'
						icon={<FilePdfOutlined />}
						onClick={() => handlePrintOne(rec)}
					/>
					<ButtonExtend tooltip='Chỉnh sửa' type='link' icon={<EditOutlined />} onClick={() => handleEdit(rec)} />
					<Popconfirm
						// disabled={isQuyetDinh && rec.trangThaiPhuLuc === ETrangThaiPhuLuc.DA_VAO_SO}
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa phụ lục này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	const otherButtons = [
		<ButtonExtend
			icon={<DownloadOutlined />}
			onClick={onDownloadTemplate}
			key='download-template'
			disabled={!recQuyetDinh?._id}
			loading={loadingDownload}
		>
			Tải file mẫu
		</ButtonExtend>,
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
	if (settingVbcc?.require_signature)
		otherButtons.push(
			<ButtonExtend
				disabled={!selectedIds?.length}
				className='btn-success'
				icon={<FormOutlined />}
				onClick={handleSign}
				key='sign'
			>
				Ký số ({selectedIds?.length ?? 0})
			</ButtonExtend>,
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
	if (!!recQuyetDinh?._id)
		otherButtons.push(
			<ButtonExtend key='Export' icon={<FilePdfOutlined />} onClick={handlePrint} disabled={!total}>
				In phụ lục ({selectedIds?.length || 'Tất cả'})
			</ButtonExtend>,
		);

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recQuyetDinh?._id]}
				modelName='vbcc.phulucvanbang'
				title={intl.formatMessage({ id: 'vanbang.phulucvanbang.title' })}
				widthDrawer={1000}
				Form={isView ? ViewPhuLucVanBang : Form}
				formProps={{ getData, isQuyetDinh }}
				buttons={{ create: !!recQuyetDinh?._id }}
				rowSelection
				deleteMany
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
			>
				{!isQuyetDinh ? (
					<Space wrap style={{ marginBottom: 12 }}>
						<MyDatePicker
							style={{ width: 200 }}
							value={yearSelect ? moment(yearSelect, 'YYYY') : null}
							pickerStyle='year'
							placeholder='Chọn năm hành chính'
							format='YYYY'
							onChange={(val) => {
								if (val) {
									setYearSelect(moment(val).year());
								} else {
									setYearSelect(undefined);
								}
							}}
							allowClear
						/>

						<SelectQuyetDinh
							condition={yearSelect ? { nam: String(yearSelect) } : undefined}
							style={{ width: 250 }}
							value={recQuyetDinh?._id}
							onChange={(val) => setQuyetDinh(danhsachQuyetDinh.find((item) => item._id === val))}
							isSetRecord
							allowClear
						/>
					</Space>
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
		</>
	);
};

export default PhuLucVanBangPage;
