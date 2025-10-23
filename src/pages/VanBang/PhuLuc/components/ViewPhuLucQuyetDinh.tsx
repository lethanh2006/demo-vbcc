import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { getExportDanhSachPhuLuc, getPhuLucCapBang } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, CloseOutlined, ExportOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChonPhuLuc from '../../DotCapBangTotNghiep/components/ModalChonPhuLuc';
import Form from './Form';
import ModalImportCapBang from './ModalImportPhuLucCapBang';
import ViewPhuLucVanBang from './ViewRender';

const ViewPhuLucQuyetDinh = (props: { getData?: any; isDotCapBang?: boolean }) => {
	const intl = useIntl();
	const { getData, isDotCapBang: isdotCapBang = false } = props;
	const { settings } = useModel('tienich.caidat');
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
	} = useModel('vbcc.phulucvanbang');
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { record: recDot } = useModel('vbcc.dotcapbangtotnghiep');
	const { INFO_TENANT: settingVbcc } = settings;
	const [visibleModalChonPhuLuc, setVisibleModalChonPhuLuc] = useState<boolean>(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);

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

				// const ngayCap = record?.ngayCapPhuLuc ? `Ngày: ${dayjs(record.ngayCapPhuLuc).format('DD/MM/YYYY')}` : null;

				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<div>{trangThai}</div>
						{/* {ngayCap && <div>{ngayCap}</div>} */}
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
			title: 'Ghi chú cấp bằng',
			dataIndex: 'ghiChuCapBang',
			width: 120,
			filterType: 'string',
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
						<Popconfirm
							title={<input id={`note-${rec._id}`} placeholder='Ghi chú hoàn tác' style={{ width: '100%' }} />}
							description='Thu hồi cấp bằng cho phục lục này?'
							onConfirm={async () => {
								const ghiChuCapBang = (document.getElementById(`note-${rec._id}`) as HTMLInputElement)?.value || '';
								await putModel(rec._id, { kichHoat: false, idDotCapBang: null, ghiChuCapBang }, fetchData, true);
							}}
						>
							<ButtonExtend tooltip='Hoàn tác' danger type='link' icon={<SyncOutlined />} />
						</Popconfirm>
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
							<ButtonExtend tooltip='Cấp bằng' type='link' icon={<CheckCircleOutlined />} />
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
				title={intl.formatMessage({ id: 'vanbang.phulucvanbang.title' })}
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
								// <ButtonExtend icon={<ImportOutlined />} onClick={() => setVisibleImport(true)} key='import'>
								// 	Nhập dữ liệu
								// </ButtonExtend>,

								<Button icon={<ExportOutlined />} onClick={handleExportTemplate} disabled={!recDot?._id}>
									Xuất dữ liệu
								</Button>,

								// <Tooltip title='Thêm phụ lục hiện có vào đợt cấp bằng này' key='apply-tooltip'>
								// 	<Button type='primary' icon={<PlusCircleOutlined />} onClick={() => setVisibleModalChonPhuLuc(true)}>
								// 		Thêm phụ lục
								// 	</Button>
								// </Tooltip>,

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
										<Button type='link' icon={<CheckCircleOutlined />}>
											Cấp bằng
										</Button>
									</Popconfirm>
								) : null,
							].filter(Boolean) as React.JSX.Element[])
						: []
				}
			/>

			<ModalChonPhuLuc
				visible={visibleModalChonPhuLuc}
				onCancel={() => setVisibleModalChonPhuLuc(false)}
				getData={fetchData}
			/>

			<ModalImportCapBang
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					setVisibleImport(false);
					fetchData();
				}}
				idDotCapBang={recDot?._id || ''}
			/>
		</>
	);
};

export default ViewPhuLucQuyetDinh;
