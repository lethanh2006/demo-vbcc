import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalImport from '@/components/Table/Import';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiTotNghiep, ETrangThaiCapBang, nameTrangThaiTotNghiep } from '@/services/VanBang/constant';
import { getExportDanhSachPhuLuc, getPhuLucCapBang } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { CheckOutlined, CloseOutlined, ExportOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './Form';
import ViewPhuLucVanBang from './ViewRender';

const ViewPhuLucQuyetDinh = (props: { getData?: any; isDotCapBang?: boolean }) => {
	const intl = useIntl();
	const { isDotCapBang: isdotCapBang = false } = props;
	const {
		page,
		limit,
		handleView,
		isView,
		deleteModel,
		putModel,
		putManyModel,
		selectedIds,
		setSelectedIds,
		danhSach,
		setDanhSach,
		getImportPhuLucCapBangTemplateModel,
	} = useModel('vbcc.phulucvanbang');
	const { record: recQuyetDinh, visibleForm, setVisibleForm } = useModel('vbcc.quyetdinhtotnghiep');
	const { record: recDot } = useModel('vbcc.dotcapbangtotnghiep');

	const unactivatedIds: string[] =
		selectedIds && Array.isArray(danhSach)
			? (danhSach ?? [])
					.filter((r: PhuLucVanBang.IRecord) => selectedIds.includes(r._id) && !r?.idDotCapBang)
					.map((r: PhuLucVanBang.IRecord) => r._id)
			: [];

	const fetchData = async () => {
		if (!recDot?._id) return;
		const res = await getPhuLucCapBang(recDot._id);
		setDanhSach(res?.data ?? res ?? []);
	};

	useEffect(() => {
		fetchData();
	}, [recDot?._id, page, limit]);

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const handleExportTemplate = async () => {
		if (!recDot?._id) return;
		try {
			const res = await getExportDanhSachPhuLuc(recDot._id);
			fileDownload(res.data, `DanhSach_PhuLuc_CapBang${recDot.ten}.xlsx`);
		} catch (e) {
			console.error(e);
		}
	};

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
			dataIndex: ['quyetDinh', 'soQuyetDinh'],
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
			title: 'Trạng thái phát bằng',
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
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 140,
			fixed: 'right',
			render: (val, rec) => (
				<>
					{rec.kichHoat ? (
						rec.idDotCapBang === recDot?._id ? (
							<Popconfirm
								title={<input id={`note-${rec._id}`} placeholder='Ghi chú hoàn tác' style={{ width: '100%' }} />}
								description='Thu hồi cấp bằng cho phụ lục này?'
								onConfirm={async () => {
									const ghiChuCapBang = (document.getElementById(`note-${rec._id}`) as HTMLInputElement)?.value || '';
									await putModel(rec._id, { kichHoat: false, idDotCapBang: null, ghiChuCapBang }, fetchData, true);
								}}
							>
								<ButtonExtend tooltip='Hoàn tác' danger type='link' icon={<SyncOutlined />} />
							</Popconfirm>
						) : (
							<ButtonExtend
								tooltip='Phụ lục này thuộc đợt khác, không thể thu hồi ở đợt này'
								type='link'
								disabled
								icon={<SyncOutlined />}
							/>
						)
					) : (
						<Popconfirm
							title={<input id={`note-${rec._id}`} placeholder='Ghi chú cấp bằng' style={{ width: '100%' }} />}
							description='Cấp bằng cho phụ lục này?'
							onConfirm={async () => {
								const ghiChuCapBang = (document.getElementById(`note-${rec._id}`) as HTMLInputElement)?.value || '';
								const payload: any = { kichHoat: true, ghiChuCapBang };
								if (isdotCapBang && recDot?._id) payload.idDotCapBang = recDot._id;
								await putModel(rec._id, payload, fetchData, true);
							}}
						>
							<ButtonExtend tooltip='Cấp bằng' type='link' icon={<CheckOutlined />} />
						</Popconfirm>
					)}

					<ButtonExtend tooltip='Xem chi tiết' type='link' icon={<EyeOutlined />} onClick={() => handleView(rec)} />

					{!rec.kichHoat && (
						<>
							<Popconfirm
								title='Loại bỏ phụ lục khỏi đợt này?'
								placement='topRight'
								onConfirm={async () => {
									await deleteModel(rec._id);
								}}
							>
								<ButtonExtend tooltip='Loại bỏ khỏi đợt' danger type='link' icon={<CloseOutlined />} />
							</Popconfirm>
						</>
					)}
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				getData={async () => danhSach}
				columns={columns}
				params={{ idQuyetDinh: recQuyetDinh?._id }}
				dependencies={[page, limit, recQuyetDinh?._id]}
				modelName='vbcc.phulucvanbang'
				title={intl.formatMessage({ id: 'thongtinvb.title' })}
				hideCard
				rowSelection
				detailRow={{
					getCheckboxProps: (record: PhuLucVanBang.IRecord) => ({
						disabled: record.kichHoat === true,
					}),
				}}
				buttons={{ create: false }}
				Form={isView ? ViewPhuLucVanBang : Form}
				// deleteMany={true}
				widthDrawer={800}
				otherButtons={
					isdotCapBang
						? ([
								<Button icon={<ExportOutlined />} onClick={handleExportTemplate} disabled={!recDot?._id}>
									Xuất dữ liệu
								</Button>,
								selectedIds && selectedIds.length > 0 ? (
									<Popconfirm
										key='capbang-many'
										title={`Cấp bằng cho ${unactivatedIds.length} phụ lục chưa được cấp?`}
										placement='topRight'
										onConfirm={async () => {
											const payload: any = { kichHoat: true };
											if (isdotCapBang && recDot?._id) payload.idDotCapBang = recDot._id;
											await putManyModel(unactivatedIds, payload, fetchData, true);
											setSelectedIds([]);
										}}
									>
										<Button type='link' icon={<CheckOutlined />}>
											Cấp bằng
										</Button>
									</Popconfirm>
								) : null,
							].filter(Boolean) as React.JSX.Element[])
						: []
				}
			/>

			<ModalImport
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				onOk={() => {
					setVisibleForm(false);
					fetchData();
				}}
				modelName='vbcc.phulucvanbang'
				getTemplate={() => getImportPhuLucCapBangTemplateModel(recDot?._id || '')}
				titleTemplate='Template_Cap_Bang.xlsx'
				extendData={{ idDotCapBang: recDot?._id || '' }}
			/>
		</>
	);
};

export default ViewPhuLucQuyetDinh;
