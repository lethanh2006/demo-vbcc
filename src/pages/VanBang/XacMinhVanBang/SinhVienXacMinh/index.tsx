import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExport from '@/components/Table/Export';
import ModalImport from '@/components/Table/Import';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { exportPhieuPhucDap } from '@/services/VanBang/XacMinhVanBang';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import { getFilenameHeader } from '@/utils/utils';
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	DownloadOutlined,
	EditOutlined,
	ExportOutlined,
	FileTextOutlined,
	ImportOutlined,
	MenuOutlined,
	PlusCircleOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Modal, Popconfirm, Popover } from 'antd';
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
	const { record: recXacMinh, setRecord: setRecXacMinh, nextStepXacMinhModel } = useModel('vbcc.xacminhvanbang');
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

	const handleChuyenBuoc = () => {
		nextStepXacMinhModel(
			recXacMinh?._id ?? '',
			{
				phaseXuLy: EPhaseXacMinh.PHUC_DAP,
			},
			getXacMinh,
		).then((rec) => {
			setRecXacMinh({ ...recXacMinh, ...rec });
			if (afterAddNew) afterAddNew(2);
		});
	};

	const showPhuLucDetail = (phuLucId: string) => {
		setVsPhuLuc(true);
		getByIdModel(phuLucId);
	};

	const handleDownload = (rec: XacMinhVanBang.ISinhVienXacMinh) => {
		setLoadingExport(true);
		exportPhieuPhucDap(rec?._id)
			.then((res) => fileDownload(res.data, getFilenameHeader(res)))
			.finally(() => setLoadingExport(false));
	};

	const columns: IColumn<XacMinhVanBang.ISinhVienXacMinh>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
		},
		{
			title: 'Số hiệu VB',
			dataIndex: 'soHieuVanBang',
			width: 130,
			filterType: 'string',
		},
		{
			title: 'Số vào sổ',
			dataIndex: 'soVaoSo',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Phụ lục xác minh',
			dataIndex: 'phuLucId',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a
						onClick={(e) => {
							showPhuLucDetail(rec?.phuLucId);
						}}
					>
						Xem chi tiết
					</a>
				) : (
					<i>Không có</i>
				),
		},
		{
			title: 'Nội dung phúc đáp',
			dataIndex: 'ghiChuKetQuaPhucDap',
			width: 180,
			render: (val, rec) => (
				<ExpandText>
					<div dangerouslySetInnerHTML={{ __html: val }} />
				</ExpandText>
			),
			filterType: 'string',
			hide: isYeuCau || isXacMinh,
		},
		{
			title: 'File phúc đáp',
			dataIndex: 'urlPhanHoi',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem chi tiết
					</a>
				) : null,
			hide: !isKetQua,
		},
		{
			title: 'Kết quả',
			dataIndex: 'coThongTin',
			align: 'center',
			width: 90,
			render: (val, rec) => <Checkbox checked={!!val} />,
			fixed: 'right',
			hide: isYeuCau,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: isKetQua ? 60 : 90,
			fixed: 'right',
			render: (val, rec) => {
				if (isXacMinh)
					return (
						<>
							<Popconfirm
								onConfirm={() => putModel(rec._id, { ...rec, coThongTin: true }, getData)}
								title='Xác nhận có kết quả?'
								placement='topRight'
							>
								<ButtonExtend
									disabled={isHoanThanh}
									tooltip='Có kết quả'
									type='link'
									icon={<CheckCircleOutlined />}
									className='btn-success'
								/>
							</Popconfirm>
							<Popover
								placement='bottom'
								trigger='hover'
								content={
									<>
										<ButtonExtend
											disabled={isHoanThanh}
											tooltip='Tra cứu thủ công'
											type='link'
											icon={<SearchOutlined />}
											onClick={() => {
												setRecord(rec);
												setVisibleTraCuu(true);
											}}
										/>
										<Popconfirm
											onConfirm={() => putModel(rec._id, { ...rec, coThongTin: false }, getData)}
											title='Xác nhận không có kết quả?'
											placement='topRight'
										>
											<ButtonExtend
												disabled={isHoanThanh}
												tooltip='Không có kết quả'
												type='link'
												icon={<CloseCircleOutlined />}
												danger
											/>
										</Popconfirm>
									</>
								}
							>
								<ButtonExtend disabled={isHoanThanh} type='link' tooltip='Thêm thao tác' icon={<MenuOutlined />} />
							</Popover>
						</>
					);
				if (isCongVan)
					return (
						<>
							<ButtonExtend
								loading={loadingExport}
								onClick={() => handleDownload(rec)}
								disabled={isHoanThanh}
								tooltip='Tải biểu mẫu'
								type='link'
								icon={<DownloadOutlined />}
							/>

							<ButtonExtend
								disabled={isHoanThanh}
								tooltip='Phúc đáp'
								type='link'
								icon={<EditOutlined />}
								onClick={() => {
									setRecord(rec);
									setVisiblePhucDap(true);
								}}
							/>
						</>
					);

				if (isKetQua) {
					return (
						<ButtonExtend
							disabled={isHoanThanh}
							tooltip='Trả kết quả'
							type='link'
							icon={<EditOutlined />}
							onClick={() => {
								setRecord(rec);
								setVisiblePhucDap(true);
							}}
						/>
					);
				}

				return null;
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
								tooltip={!recXacMinh?._id ? 'Chưa thêm mới yêu cầu xác minh' : 'Thêm mới'}
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
								Thêm mới
							</ButtonExtend>
						) : null}
						{!hideImport ? (
							<ButtonExtend
								tooltip={!recXacMinh?._id ? 'Chưa thêm mới yêu cầu xác minh' : 'Nhập dữ liệu'}
								disabled={!recXacMinh?._id || isHoanThanh}
								icon={<ImportOutlined />}
								size={size}
								onClick={() => setVisibleImport(true)}
							>
								Nhập dữ liệu
							</ButtonExtend>
						) : null}
						{!hideExport ? (
							<ButtonExtend
								tooltip={!recXacMinh?._id ? 'Chưa thêm mới yêu cầu xác minh' : 'Xuất dữ liệu'}
								disabled={!recXacMinh?._id}
								icon={<ExportOutlined />}
								size={size}
								onClick={() => setVisibleExport(true)}
							>
								Xuất dữ liệu
							</ButtonExtend>
						) : null}
					</>,
				]}
				onReload={getData}
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

			{isXacMinh ? (
				<div className='form-footer'>
					<Button
						onClick={() => {
							if (afterAddNew) afterAddNew(0);
						}}
						icon={<ArrowLeftOutlined />}
					>
						Quay lại
					</Button>
					<Button
						disabled={
							!recXacMinh?._id ||
							![EPhaseXacMinh.PHUC_DAP, EPhaseXacMinh.KET_QUA, EPhaseXacMinh.HOAN_THANH].includes(recXacMinh?.phaseXuLy)
						}
						onClick={() => {
							if (afterAddNew) afterAddNew(2);
						}}
						icon={<ArrowRightOutlined />}
					>
						Tiếp theo
					</Button>
					<Button
						disabled={
							recXacMinh?.phaseXuLy === EPhaseXacMinh.PHUC_DAP ||
							recXacMinh?.phaseXuLy === EPhaseXacMinh.KET_QUA ||
							isHoanThanh
						}
						onClick={handleChuyenBuoc}
						icon={<FileTextOutlined />}
						type='primary'
					>
						Chuẩn bị công văn
					</Button>
					<Button onClick={() => setVisibleForm(false)} icon={<CloseCircleOutlined />} danger>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			) : null}

			<Modal
				title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} sinh viên xác minh`}
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
				title='Chi tiết thông tin văn bằng'
				width={1000}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleForm(false)}>
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
