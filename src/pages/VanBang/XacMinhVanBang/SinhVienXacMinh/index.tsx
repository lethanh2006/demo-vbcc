import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExport from '@/components/Table/Export';
import ModalImport from '@/components/Table/Import';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
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
	PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Modal, Popconfirm, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewPhuLucVanBang from '../../PhuLuc/components/ViewRender';
import FormSinhVienXacMinh from './components/Form';
import ModalPhucDap from './components/PhucDap';

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
	const {
		getByIdModel,
		visibleForm: vsPhuLuc,
		setVisibleForm: setVsPhuLuc,
		loading: loadingPhuLuc,
	} = useModel('vbcc.phulucvanbang');

	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [visibleExport, setVisibleExport] = useState<boolean>(false);
	const [visiblePhucDap, setVisiblePhucDap] = useState<boolean>(false);

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
		setVisibleForm(true);

		getByIdModel(phuLucId);
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
			title: 'Phụ lục',
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
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			hide: isYeuCau || isXacMinh,
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
								onConfirm={() => putModel(rec._id, { coThongTin: true }, getData)}
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
							<Popconfirm
								onConfirm={() => putModel(rec._id, { coThongTin: false }, getData)}
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
					);
				if (isCongVan)
					return (
						<>
							<ButtonExtend tooltip='Tải biểu mẫu' type='link' icon={<DownloadOutlined />} />

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
							!recXacMinh?._id || ![EPhaseXacMinh.PHUC_DAP, EPhaseXacMinh.KET_QUA].includes(recXacMinh?.phaseXuLy)
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
				title='Xem chi tiết thông tin văn bằng'
				width={1000}
				footer={null}
			>
				<Spin spinning={loadingPhuLuc}>
					<ViewPhuLucVanBang hasPrint={false} />
				</Spin>
			</ModalExpandable>

			<ModalPhucDap visible={visiblePhucDap} setVisible={setVisiblePhucDap} getData={getData} isKetQua={isKetQua} />
		</>
	);
};

export default SinhVienXacMinhPage;
