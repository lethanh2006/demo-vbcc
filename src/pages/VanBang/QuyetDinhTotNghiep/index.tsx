import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import SelectBieuMauPhuLuc from '@/pages/DanhMuc/BieuMauPhuLuc/components/Select';
import { primaryColor } from '@/services/base/constant';
import {
	colorTrangThaiQuyetDinhTotNghiep,
	ETrangThaiQuyetDinhTotNghiep,
	nameTrangThaiQuyetDinhTotNghiep,
} from '@/services/VanBang/constant';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import dayjs from '@/utils/dayjs';
import {
	CheckCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	InfoCircleOutlined,
	MenuOutlined,
	RollbackOutlined,
	SaveOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Popover, Space, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectSoVanBang from '../SoVanBang/components/Select';
import ModalQuyetDinhTotNghiep from './components/Modal';
import ModalYeuCauChinhSua from './components/YeuCauChinhSua';

const QuyetDinhTotNghiepPage = (props: {
	title: 'Thông tin quyết định' | 'Dự thảo cần duyệt' | 'Quyết định đã duyệt';
}) => {
	const { title = 'Thông tin quyết định' } = props;

	const { handleEdit, page, limit, deleteModel, setRecord, record, getModel, trinhLanhDaoModel, xuLyDuThaoModel } =
		useModel('vbcc.quyetdinhtotnghiep');

	const [yearSelect, setYearSelect] = useState<any>(dayjs());
	const [visibleFormFile, setVisibleFormFile] = useState(false);
	const [visibleChinhSua, setVisibleChinhSua] = useState(false);

	const getData = () => {
		let filters: any = [];

		if (title === 'Dự thảo cần duyệt') {
			filters.push({
				active: true,
				field: 'trangThai',
				values: [ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO, ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA],
				operator: EOperatorType.INCLUDE,
			});
		}

		if (title === 'Quyết định đã duyệt') {
			filters.push({
				active: true,
				field: 'trangThai',
				values: [ETrangThaiQuyetDinhTotNghiep.CHINH_THUC, ETrangThaiQuyetDinhTotNghiep.HOAN_THANH],
				operator: EOperatorType.INCLUDE,
			});
		}

		getModel({ nam: dayjs(yearSelect).format('YYYY') }, filters);
	};

	const onCell = (rec: QuyetDinhTotNghiep.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const renderTrangThaiInfo = (rec: QuyetDinhTotNghiep.IRecord) => (
		<div style={{ fontSize: 12, maxWidth: 300, lineHeight: 1.45 }}>
			<div>
				<b>Người tạo:</b> {rec?.nguoiTao?.hoTen ?? '—'}
				<br />
				{rec?.nguoiTao?.thoiGian && <em>{dayjs(rec?.nguoiTao?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
			</div>

			<br />

			<div>
				<b>Người xử lý:</b> {rec?.nguoiXuLy?.hoTen ?? '—'}
				<br />
				{rec?.nguoiXuLy?.thoiGian && <em>{dayjs(rec?.nguoiXuLy?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
			</div>

			<br />

			<div>
				<b>Ghi chú chỉnh sửa:</b>
				<div style={{ whiteSpace: 'pre-wrap' }}>{rec?.ghiChuChinhSua || '—'}</div>
			</div>
		</div>
	);

	const columns: IColumn<QuyetDinhTotNghiep.IRecord>[] = [
		{
			title: 'Năm hành chính',
			dataIndex: 'nam',
			width: 120,
			align: 'center',
			filterType: 'string',
			onCell,
			hide: !!yearSelect,
		},
		{
			title: 'Số quyết định',
			dataIndex: 'soQuyetDinh',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Ngày ký',
			dataIndex: 'ngayBanHanh',
			width: 110,
			filterType: 'date',
			align: 'center',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'idSoVanBang',
			width: 180,
			render: (val, rec) => rec?.soVanBang?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectSoVanBang multiple />,
			onCell,
		},
		{
			title: 'Biểu mẫu phụ lục',
			dataIndex: 'maBieuMau',
			width: 160,
			render: (val, rec) => rec?.bieuMau?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectBieuMauPhuLuc multiple selectMa />,
			onCell,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 180,
			render: (val) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Đính kèm',
			dataIndex: 'url',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a
						onClick={(e) => {
							e.preventDefault();
							setRecord(rec);
							setVisibleFormFile(true);
						}}
					>
						Xem chi tiết
					</a>
				) : (
					'—'
				),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 150,
			align: 'center',
			fixed: 'right',
			filterType: title === 'Thông tin quyết định' ? 'select' : undefined,
			filterData: Object.values(ETrangThaiQuyetDinhTotNghiep).map((item) => ({
				value: item,
				label: nameTrangThaiQuyetDinhTotNghiep[item],
			})),
			render: (val, rec) => (
				<Space size={6}>
					<Tag
						color={colorTrangThaiQuyetDinhTotNghiep[val as ETrangThaiQuyetDinhTotNghiep]}
						style={{ padding: '2px 8px', fontWeight: 500 }}
					>
						{nameTrangThaiQuyetDinhTotNghiep[val as ETrangThaiQuyetDinhTotNghiep]}
					</Tag>

					<Popover placement='left' content={renderTrangThaiInfo(rec)}>
						<InfoCircleOutlined style={{ cursor: 'pointer', color: primaryColor }} />
					</Popover>
				</Space>
			),
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: title === 'Quyết định đã duyệt' ? 60 : 90,
			fixed: 'right',
			render: (rec) => {
				const { DU_THAO, YEU_CAU_CHINH_SUA, TRINH_DU_THAO, HOAN_THANH } = ETrangThaiQuyetDinhTotNghiep;

				const canTrinhLanhDao = rec?.trangThai === DU_THAO || rec?.trangThai === YEU_CAU_CHINH_SUA;
				const canXuLyQuyetDinh = rec?.trangThai === TRINH_DU_THAO || rec?.trangThai === YEU_CAU_CHINH_SUA;

				const isHoanThanh = rec?.trangThai === HOAN_THANH;

				if (title === 'Quyết định đã duyệt') {
					return (
						<Popconfirm
							title='Xác nhận hoàn thành quyết định tốt nghiệp?'
							placement='topRight'
							onConfirm={() =>
								xuLyDuThaoModel(rec?._id, { trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }, getData)
							}
						>
							<ButtonExtend disabled={isHoanThanh} tooltip='Hoàn thành' type='link' icon={<SaveOutlined />} />
						</Popconfirm>
					);
				}

				return (
					<>
						{title === 'Thông tin quyết định' ? (
							<Popconfirm
								title='Trình lãnh đạo quyết định?'
								placement='topRight'
								onConfirm={() => trinhLanhDaoModel(rec?._id, getData)}
							>
								<ButtonExtend
									tooltip='Trình lãnh đạo'
									type='link'
									icon={<SendOutlined />}
									disabled={!canTrinhLanhDao}
								/>
							</Popconfirm>
						) : (
							<Popconfirm
								title='Duyệt quyết định?'
								placement='topRight'
								onConfirm={() =>
									xuLyDuThaoModel(rec?._id, { trangThai: ETrangThaiQuyetDinhTotNghiep.CHINH_THUC }, getData)
								}
							>
								<ButtonExtend
									tooltip='Duyệt quyết định'
									type='link'
									className='btn-success'
									icon={<CheckCircleOutlined />}
									disabled={!canXuLyQuyetDinh}
								/>
							</Popconfirm>
						)}

						<Popover
							placement='bottomLeft'
							trigger='hover'
							content={
								<Space direction='vertical' size={'small'}>
									{title !== 'Thông tin quyết định' && (
										<ButtonExtend
											type='link'
											tooltip='Yêu cầu chỉnh sửa'
											icon={<RollbackOutlined />}
											className='btn-warning'
											disabled={!canXuLyQuyetDinh}
											onClick={() => {
												setRecord(rec);
												setVisibleChinhSua(true);
											}}
										>
											Yêu cầu chỉnh sửa
										</ButtonExtend>
									)}

									<ButtonExtend
										type='link'
										tooltip='Chỉnh sửa'
										icon={<EditOutlined />}
										disabled={!canTrinhLanhDao}
										onClick={() => handleEdit(rec)}
									>
										Chỉnh sửa
									</ButtonExtend>

									<Popconfirm title='Xóa quyết định?' placement='topRight' onConfirm={() => deleteModel(rec._id)}>
										<ButtonExtend
											tooltip='Xóa'
											type='link'
											danger
											icon={<DeleteOutlined />}
											disabled={!canTrinhLanhDao}
										>
											Xóa
										</ButtonExtend>
									</Popconfirm>
								</Space>
							}
						>
							<ButtonExtend disabled={isHoanThanh} type='link' icon={<MenuOutlined />} />
						</Popover>
					</>
				);
			},
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, yearSelect, title]}
				modelName='vbcc.quyetdinhtotnghiep'
				title={title}
				widthDrawer={1200}
				deleteMany
				rowSelection
				buttons={{ export: true }}
				Form={ModalQuyetDinhTotNghiep}
				formProps={{ getData, yearSelect: dayjs(yearSelect).format('YYYY'), title }}
			>
				<MyDatePicker
					style={{ width: 160, marginBottom: 12 }}
					pickerStyle='year'
					placeholder='Chọn năm hành chính'
					value={yearSelect ? dayjs(yearSelect) : null}
					format='YYYY'
					allowClear
					onChange={(val) => setYearSelect(val ? dayjs(val) : null)}
				/>
			</TableBase>

			<ModalExpandable
				title='Chi tiết minh chứng'
				width={950}
				open={visibleFormFile}
				onCancel={() => setVisibleFormFile(false)}
				footer={<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>}
			>
				<PreviewFile file={record?.url ?? ''} />
			</ModalExpandable>

			<ModalYeuCauChinhSua visible={visibleChinhSua} setVisible={setVisibleChinhSua} getData={getData} />
		</>
	);
};

export default QuyetDinhTotNghiepPage;
