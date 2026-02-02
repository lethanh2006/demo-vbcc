import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { IColumn } from '@/components/Table/typing';
import { ETagColor } from '@/services/base/constant';
import {
	colorTrangThaiBlc,
	colorTrangThaiTotNghiep,
	ETrangThaiBlockchain,
	ETrangThaiCapBang,
	ETrangThaiQuyetDinhTotNghiep,
	nameTrangThaiTotNghiep,
} from '@/services/VanBang/constant';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import {
	CheckCircleOutlined,
	CheckOutlined,
	EditOutlined,
	InfoCircleOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Descriptions, Popover, Space, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import PreviewIPFS from '../PhuLuc/components/Preview';
import ViewPhuLucVanBang from '../PhuLuc/components/ViewRender';
import SelectQuyetDinhTotNghiep from '../QuyetDinhTotNghiep/components/Select';
import ModalXuLyCapBang from './XuLy';

const CapPhatPhuLucPage = () => {
	const {
		record: recQuyetDinh,
		danhSach: danhsachQuyetDinh,
		setRecord: setQuyetDinh,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const { page, limit, getModel, setRecord, handleView, record } = useModel('vbcc.phulucvanbang');
	const { settings } = useModel('tienich.caidat');
	const { INFO_TENANT: settingVbcc } = settings;
	const [yearSelect, setYearSelect] = useState<any>();
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: ETrangThaiCapBang;
	}>();

	const getData = () => {
		// if (recQuyetDinh?._id)
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
			onCell,
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
			title: 'Trạng thái phát bằng',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={colorTrangThaiTotNghiep[val as ETrangThaiCapBang]}>
					{nameTrangThaiTotNghiep[val as ETrangThaiCapBang]}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiCapBang).map((item) => ({
				value: item,
				label: nameTrangThaiTotNghiep[item as ETrangThaiCapBang],
			})),
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
			title: 'Thời gian cấp bằng',
			dataIndex: 'ngayCapPhuLuc',
			align: 'center',
			width: 100,
			render: (val, rec) => rec?.trangThai === ETrangThaiCapBang.DA_CAP_BANG && val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Ghi chú cấp bằng',
			dataIndex: 'ghiChuCapBang',
			width: 200,
			render: (val) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => {
				return (
					<>
						<ButtonExtend
							disabled={rec?.trangThai === ETrangThaiCapBang.DA_CAP_BANG}
							onClick={() => {
								setRecord(rec);
								setTrangThai({ title: 'Cấp phát văn bằng', trangThai: ETrangThaiCapBang.DA_CAP_BANG });
								setVisibleXuLy(true);
							}}
							tooltip='Đã phát bằng'
							className='btn-success'
							type='link'
							icon={<CheckOutlined />}
						/>

						{/* <ButtonExtend
							disabled={rec?.trangThai === ETrangThaiCapBang.CHO_CAP_BANG}
							onClick={() => {
								setRecord(rec);
								setTrangThai({ title: 'Chưa phát văn bằng', trangThai: ETrangThaiCapBang.CHO_CAP_BANG });
								setVisibleXuLy(true);
							}}
							tooltip='Chưa phát bằng'
							danger
							type='link'
							icon={<CloseOutlined />}
						/> */}
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
				params={{ idQuyetDinh: recQuyetDinh?._id }}
				dependencies={[page, limit, recQuyetDinh?._id]}
				modelName='vbcc.phulucvanbang'
				title={'Cấp phát văn bằng'}
				widthDrawer={1000}
				modalTitle={'Xem chi tiết thông tin văn bằng'}
				Form={ViewPhuLucVanBang}
				buttons={{
					create: false,
				}}
				showModalTitle
			>
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

					<SelectQuyetDinhTotNghiep
						allowClear
						condition={
							yearSelect
								? { nam: dayjs(yearSelect).format('YYYY'), trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }
								: { trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }
						}
						style={{ width: 250 }}
						value={recQuyetDinh?._id}
						onChange={(val) => setQuyetDinh(danhsachQuyetDinh?.find((item) => item._id === val))}
						// isSetRecord
					/>
				</Space>
			</TableBase>

			{settingVbcc?.require_IPFS && (
				<>
					<PreviewIPFS visible={visibleModal} setVisible={setVisibleModal} />
				</>
			)}

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

			<ModalXuLyCapBang
				visible={visibleXuLy}
				setVisible={setVisibleXuLy}
				title={trangThai?.title ?? ''}
				trangThai={trangThai?.trangThai}
				getData={getData}
			/>
		</>
	);
};

export default CapPhatPhuLucPage;
