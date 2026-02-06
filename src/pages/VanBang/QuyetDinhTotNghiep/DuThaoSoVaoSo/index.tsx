import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import SelectHinhThucDaoTao from '@/pages/DanhMuc/HinhThucDaoTao/components/Select';
import SelectNganhDaoTao from '@/pages/DanhMuc/NganhDaoTao/components/Select';
import SelectTrinhDoDaoTao from '@/pages/DanhMuc/TrinhDoTaoTao/components/Select';
import {
	defaultElementBieuMau,
	ELoaiDuLieuBieuMau,
	EQuyetDinhStep,
	ETrangThaiQuyetDinhTotNghiep,
} from '@/services/VanBang/constant';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { genExcelFile, resetFieldsForm } from '@/utils/utils';
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	SendOutlined,
} from '@ant-design/icons';
import {
	Button,
	Checkbox,
	Col,
	Dropdown,
	Form,
	Input,
	InputNumber,
	Menu,
	Modal,
	Popconfirm,
	Row,
	Select,
	Spin,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';
import ViewPhuLucVanBang from '../../PhuLuc/components/ViewRender';
import ModalYeuCauChinhSua from '../components/YeuCauChinhSua';
import FormSinhVienQuyetDinh from '../DanhSachSinhVien/components/Form';
import TitlePrint from './TitlePrint';

const toCamel = (str: string) => {
	return str
		.replace(/Đ/g, 'D')
		.replace(/đ/g, 'd')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9\s]/g, '')
		.trim()
		.split(/\s+/)
		.map((word, index) => {
			const w = word.toLowerCase();
			if (index === 0) return w;
			return w.charAt(0).toUpperCase() + w.slice(1);
		})
		.join('');
};

const DuThaoSoVaoSoQuyetDinh = (props: {
	afterAddNew?: (val: EQuyetDinhStep) => void;
	title?: 'Tất cả quyết định' | 'Dự thảo cần duyệt' | 'Quyết định đã duyệt';
}) => {
	const { afterAddNew, title } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const [formDuKien] = Form.useForm();
	const {
		record: recQuyetDinh,
		setVisibleForm: setVisibleQuyetDinh,
		trinhLanhDaoModel,
		xuLyDuThaoModel,
		getByIdModel,
		loading,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const {
		getAllModel,
		danhSach,
		sortPhuLucTamModel,
		formSubmiting,
		putModel,
		deleteModel,
		handleEdit,
		visibleForm,
		setVisibleForm,
		isView,
		handleView,
	} = useModel('vbcc.phulucvanbang');
	const [visibleChinhSua, setVisibleChinhSua] = useState(false);
	const [recEditInline, setRecEditInline] = useState<PhuLucVanBang.IRecord>();
	const componentRef = useRef(null);

	const disable =
		!!recQuyetDinh?._id &&
		(recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO ||
			recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.CHINH_THUC ||
			recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.HOAN_THANH);

	const trinhLanhDao =
		recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.DU_THAO ||
		recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA;

	const canXuLyQuyetDinh = recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO;

	const handlePrint = useReactToPrint({ contentRef: componentRef });

	//Get quyết định lấy số vào sổ
	const getQuyetDinh = () => {
		getByIdModel(recQuyetDinh?._id ?? '', true);
	};

	const getData = () => {
		if (recQuyetDinh?._id) {
			getAllModel(
				undefined,
				{ soThuTuImport: 1 },
				{
					idQuyetDinh: recQuyetDinh._id,
				},
			);
		}
	};

	useEffect(() => {
		getData();
	}, [recQuyetDinh?._id]);

	useEffect(() => {
		getByIdModel(recQuyetDinh?._id ?? '', true).then((res) =>
			form.setFieldsValue({
				soVaoSoHienTai: res?.soVaoSoHienTai || res?.soVanBang?.soVaoSoHienTai,
				ruleSortPhuLuc: res?.ruleSortPhuLuc,
				sinhLaiToanBo: false,
			}),
		);
	}, []);

	useEffect(() => {
		if (!recEditInline) {
			resetFieldsForm(formDuKien);
		}
	}, [recEditInline]);

	const onFinish = (values: any) => {
		values.idSoVanBang = recQuyetDinh?.idSoVanBang;
		sortPhuLucTamModel(recQuyetDinh?._id ?? '', values, () => {
			getData();
			getQuyetDinh();
		})
			.then()
			.catch((er) => console.log(er));
	};

	const onFinishSoVaoSo = (value: PhuLucVanBang.IRecord) => {
		if (recEditInline?.soVaoSoTamThoi !== value.soVaoSoTamThoi)
			putModel(recEditInline?._id ?? '', { soVaoSoTamThoi: value.soVaoSoTamThoi }, getData, true, false);
		setRecEditInline(undefined);
	};

	const transformDataToExcelFormat = () => {
		const headers = [
			'Họ',
			'Tên',
			'Ngày sinh',
			'Giới tính',
			'Xếp loại TN',
			'Trình độ đào tạo',
			'Hình thức đào tạo',
			'Ngành đào tạo',
			'Số vào sổ',
			'Ngày cấp bằng',
		];
		const dataRows = danhSach.map((item) => [
			splitHoTen(item?.hoTen).ho,
			splitHoTen(item?.hoTen).ten,
			item?.ngaySinh && dayjs(item?.ngaySinh).format('DD/MM/YYYY'),
			item.gioiTinh,
			item?.templateData?.find((item) => item?.headerName === 'Xếp loại TN')?.value,
			item.thongTinTrinhDoDaoTao?.ten ?? item?.trinhDoDaoTao,
			item.thongTinHinhThucDaoTao?.ten ?? item?.hinhThucDaoTao,
			item.thongTinNganhDaoTao?.ten ?? item?.nganhDaoTao,
			item.soVaoSoTamThoi,
			item?.ngayCapPhuLuc && dayjs(item?.ngayCapPhuLuc).format('DD/MM/YYYY'),
		]);
		return [headers, ...dataRows];
	};

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phuluc.cot.sovao' }),
			dataIndex: 'soVaoSoTamThoi',
			width: 110,
			onCell: disable
				? undefined
				: (rec) => ({
						onClick: () => recEditInline?._id !== rec?._id && setRecEditInline(rec),
						className: 'hovered-cell',
					}),
			render: (val, rec) =>
				recEditInline?._id === rec?._id ? (
					<Form onFinish={onFinishSoVaoSo} form={formDuKien}>
						<Form.Item initialValue={val} name='soVaoSoTamThoi' rules={[...rules.required]} noStyle>
							<Input autoFocus onBlur={() => setRecEditInline(undefined)} />
						</Form.Item>
					</Form>
				) : (
					<span>{val}</span>
				),
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phuluc.cot.hoten' }),
			dataIndex: 'hoTen',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phuluc.cot.manguoihoc' }),
			dataIndex: 'maSinhVien',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phuluc.cot.cccd' }),
			dataIndex: 'cmtCccd',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phuluc.cot.trinhdo' }),
			dataIndex: 'trinhDoDaoTao',
			width: 140,
			render: (val, rec) => rec?.thongTinTrinhDoDaoTao?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDoDaoTao multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phuluc.cot.hinhthuc' }),
			dataIndex: 'hinhThucDaoTao',
			width: 150,
			render: (val, rec) => rec?.thongTinHinhThucDaoTao?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectHinhThucDaoTao multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phuluc.cot.nganh' }),
			dataIndex: 'nganhDaoTao',
			width: 140,
			render: (val, rec) => rec?.thongTinNganhDaoTao?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhDaoTao multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phuluc.cot.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={disable}
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEdit(rec)}
					/>

					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title={intl.formatMessage({ id: 'qdtotnghiep.phuluc.xacnhan.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							disabled={disable}
							tooltip={intl.formatMessage({ id: 'qdtotnghiep.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	const splitHoTen = (fullName?: string) => {
		if (!fullName) return { ho: '', ten: '' };
		const parts = fullName.trim().split(/\s+/);
		const ten = parts.pop() || '';
		const ho = parts.join(' ');
		return { ho, ten };
	};

	const columnsPrint: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.ho' }),
			width: 120,
			render: (_, rec) => splitHoTen(rec?.hoTen).ho,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.ten' }),
			align: 'right',
			width: 90,
			render: (_, rec) => splitHoTen(rec?.hoTen).ten,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.ngaysinh' }),
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.gioitinh' }),
			dataIndex: 'gioiTinh',
			align: 'center',
			width: 60,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.xeploai' }),
			align: 'center',
			width: 100,
			render: (val, rec) => rec?.templateData?.find((item) => item?.headerName === 'Xếp loại TN')?.value,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.trinhdo' }),
			align: 'center',
			dataIndex: 'trinhDoDaoTao',
			width: 100,
			render: (val, rec) => rec?.thongTinTrinhDoDaoTao?.ten ?? val,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.hinhthuc' }),
			align: 'center',
			dataIndex: 'hinhThucDaoTao',
			width: 100,
			render: (val, rec) => rec?.thongTinHinhThucDaoTao?.ten ?? val,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.nganh' }),
			align: 'center',
			dataIndex: 'nganhDaoTao',
			width: 180,
			render: (val, rec) => rec?.thongTinNganhDaoTao?.ten ?? val,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.sovao' }),
			align: 'center',
			dataIndex: 'soVaoSoTamThoi',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.in.cot.ngaycap' }),
			align: 'center',
			dataIndex: 'ngayCapPhuLuc',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
		},
	];

	return (
		<>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={12}>
							<Form.Item label={intl.formatMessage({ id: 'qdtotnghiep.sovao.form.title.sovanbang' })}>
								<Input
									value={recQuyetDinh?.soVanBang?.ten}
									placeholder={intl.formatMessage({ id: 'qdtotnghiep.sovao.form.placeholder.sovanbang' })}
									disabled
								/>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'qdtotnghiep.sovao.form.sovao.hientai' })}
								name='soVaoSoHienTai'
							>
								<InputNumber
									style={{ width: '100%' }}
									placeholder={intl.formatMessage({ id: 'qdtotnghiep.sovao.form.placeholder.sovao' })}
									disabled={disable}
								/>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='sinhLaiToanBo'
								valuePropName='checked'
								extra={intl.formatMessage({ id: 'qdtotnghiep.sovao.form.sinhlaiall.ghichu' })}
							>
								<Checkbox disabled={disable}>
									{intl.formatMessage({ id: 'qdtotnghiep.sovao.form.sinhlaiall' })}
								</Checkbox>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='ruleSortPhuLuc'
								label={intl.formatMessage({ id: 'qdtotnghiep.sovao.form.quytac.sapxep' })}
							>
								<Select
									mode='multiple'
									placeholder={intl.formatMessage({ id: 'qdtotnghiep.sovao.form.quytac.sapxep.placeholder' })}
									options={[
										...defaultElementBieuMau.map((item) => ({
											value: toCamel(item.headerName),
											label: item.headerName,
										})),

										...(recQuyetDinh?.bieuMau?.elements
											?.filter((item) => item?.type !== ELoaiDuLieuBieuMau.Table)
											.map((item) => ({
												value: toCamel(item.headerName),
												label: item.headerName,
											})) || []),
									]}
									disabled={disable}
									allowClear
								/>
							</Form.Item>
						</Col>
					</Row>

					<div className='form-footer'>
						<Button loading={formSubmiting} type='primary' htmlType='submit' disabled={disable}>
							{intl.formatMessage({ id: 'qdtotnghiep.sovao.form.nut.sinhso' })}
						</Button>
					</div>
				</Form>
			</Spin>

			<div style={{ marginTop: 12 }}>
				<TableStaticData
					columns={columns}
					data={danhSach ?? []}
					loading={loading}
					addStt
					hasTotal
					onReload={getData}
					otherButtons={[
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item key='thongtin' onClick={() => handlePrint()}>
										{intl.formatMessage({ id: 'qdtotnghiep.xuat.pdf.thongtin' })}{' '}
									</Menu.Item>
									<Menu.Item
										key='vanbang'
										onClick={() => genExcelFile(transformDataToExcelFormat(), 'Dự thảo số vào sổ.xlsx')}
									>
										{intl.formatMessage({ id: 'qdtotnghiep.xuat.excel.tatca' })}
									</Menu.Item>
								</Menu>
							}
						>
							<ButtonExtend icon={<ExportOutlined />}>
								{intl.formatMessage({ id: 'qdtotnghiep.xuat.duthao' })}
							</ButtonExtend>
						</Dropdown>,
					]}
				/>
			</div>

			<div className='form-footer'>
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(EQuyetDinhStep.DANH_SACH_SV);
					}}
					icon={<ArrowLeftOutlined />}
				>
					{intl.formatMessage({ id: 'qdtotnghiep.thaotac.quaylai' })}
				</Button>
				{title === 'Tất cả quyết định' ? (
					<Popconfirm
						onConfirm={() =>
							trinhLanhDaoModel(recQuyetDinh?._id ?? '', getQuyetDinh).then(() => setVisibleQuyetDinh(false))
						}
						title={intl.formatMessage({ id: 'qdtotnghiep.confirm.submitLeader' })}
						placement='topRight'
					>
						<Button icon={<SendOutlined />} type='primary' disabled={!trinhLanhDao}>
							{intl.formatMessage({ id: 'qdtotnghiep.action.submitLeader' })}
						</Button>
					</Popconfirm>
				) : (
					<>
						<Popconfirm
							onConfirm={() =>
								xuLyDuThaoModel(
									recQuyetDinh?._id ?? '',
									{ trangThai: ETrangThaiQuyetDinhTotNghiep.CHINH_THUC },
									getQuyetDinh,
								).then(() => {
									if (afterAddNew) afterAddNew(EQuyetDinhStep.PHU_LUC);
								})
							}
							title={intl.formatMessage({ id: 'qdtotnghiep.xacnhan.duyet' })}
							placement='topRight'
						>
							<Button icon={<CheckOutlined />} className='btn-success' type='primary' disabled={!canXuLyQuyetDinh}>
								{intl.formatMessage({ id: 'qdtotnghiep.action.approve' })}
							</Button>
						</Popconfirm>

						<Button
							className='btn-warning'
							type='primary'
							disabled={!canXuLyQuyetDinh}
							onClick={() => setVisibleChinhSua(true)}
							icon={<EditOutlined />}
						>
							{intl.formatMessage({ id: 'qdtotnghiep.action.requestEdit' })}
						</Button>
					</>
				)}
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(EQuyetDinhStep.PHU_LUC);
					}}
					icon={<ArrowRightOutlined />}
					disabled={
						recQuyetDinh?.trangThai !== ETrangThaiQuyetDinhTotNghiep.CHINH_THUC &&
						recQuyetDinh?.trangThai !== ETrangThaiQuyetDinhTotNghiep.HOAN_THANH
					}
				>
					{intl.formatMessage({ id: 'qdtotnghiep.thaotac.tieptheo' })}
				</Button>
				<Button onClick={() => setVisibleQuyetDinh(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>

			<ModalYeuCauChinhSua visible={visibleChinhSua} setVisible={setVisibleChinhSua} getData={getQuyetDinh} />

			<Modal
				title={intl.formatMessage({
					id: isView ? 'qdtotnghiep.modal.xemchitiet.tieude' : 'qdtotnghiep.modal.chinhsua.tieude',
				})}
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={isView ? 1000 : 800}
			>
				{isView ? <ViewPhuLucVanBang hasPrint={false} /> : <FormSinhVienQuyetDinh getData={getData} />}
			</Modal>

			<PrintTemplate ref={componentRef} hideTieuNgu isCompact footer={<></>}>
				<TitlePrint />
				<div className='to-print'>
					<TableStaticData
						columns={columnsPrint}
						data={danhSach ?? []}
						addStt
						size='small'
						otherProps={{ pagination: false, scroll: undefined }}
					/>
				</div>
			</PrintTemplate>
		</>
	);
};

export default DuThaoSoVaoSoQuyetDinh;
