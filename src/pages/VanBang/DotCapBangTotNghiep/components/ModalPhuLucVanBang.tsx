import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import FilterHocKy from '../../../DaoTao/HocKy/FilterHocKy';
// import { ESettingKey } from '@/services/base/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { DeleteOutlined, ImportOutlined, PlusCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectQuyetDinh from '../../QuyetDinhTotNghiep/components/Select';
import ModalImportPhuLucVanBang from '../../PhuLuc/components/ModalImportPhuLuc';
import ExpandText from '@/components/ExpandText';
import ModalChonPhuLuc from './ModalChonPhuLuc';
import MyDatePicker from '@/components/MyDatePicker';

interface PhuLucVanBangPageProps {
	isQuyetDinh?: boolean;
	quyetDinhId?: string;
	dotCapBangId?: string;
}

const ModalPhuLucVanBang: React.FC<PhuLucVanBangPageProps> = (props) => {
	const intl = useIntl();
	const { isQuyetDinh, quyetDinhId, dotCapBangId } = props;
	const { page, limit, getModel, selectedIds, setSelectedIds, putModel, putManyModel } = useModel('vbcc.phulucvanbang');
	const {
		record: recQuyetDinh,
		danhSach: danhsachQuyetDinh,
		setRecord: setQuyetDinh,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const { record: recHocKy } = useModel('daotao.hocky');
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [visibleModalChonPhuLuc, setVisibleModalChonPhuLuc] = useState<boolean>(false);
	const [showModalCapBang, setShowModalCapBang] = useState(false);
	const [formCapBang, setFormCapBang] = useState({
		ngayCapBang: moment(),
		ghiChu: '',
	});

	const getData = () => {
		// Nếu không có dotCapBangId và quyetDinhId, không hiển thị dữ liệu
		if (!dotCapBangId && !quyetDinhId && !recQuyetDinh?._id) {
			return Promise.resolve();
		}

		const condition: any = {};

		if (recQuyetDinh?._id) {
			condition.idQuyetDinh = recQuyetDinh._id;
		} else if (quyetDinhId) {
			condition.idQuyetDinh = quyetDinhId;
		}

		if (dotCapBangId) {
			condition.idDotCapBang = dotCapBangId;
		}

		return getModel(condition).then(() => setSelectedIds([]));
	};

	const handleApply = () => {
		setVisibleModalChonPhuLuc(true);
	};

	const handleSubmit = () => {
		if (!selectedIds || selectedIds.length === 0) {
			message.warning('Vui lòng chọn ít nhất một phụ lục');
			return;
		}
		setShowModalCapBang(true);
	};

	const handleCapBangConfirm = async () => {
		if (!selectedIds || selectedIds.length === 0) {
			message.warning('Vui lòng chọn ít nhất một phụ lục');
			return;
		}

		try {
			await putManyModel(selectedIds, {
				kichHoat: true,
				ngayCapPhuLuc: formCapBang.ngayCapBang.toDate(),
				ghiChu: formCapBang.ghiChu,
			});

			message.success('Đã cập nhật trạng thái cấp bằng thành công');
			getData();
			setSelectedIds([]);
			setShowModalCapBang(false);
			setFormCapBang({
				ngayCapBang: moment(),
				ghiChu: '',
			});
		} catch (error) {
			message.error('Có lỗi xảy ra khi cập nhật trạng thái cấp bằng');
		}
	};
	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ',
			dataIndex: 'soVaoSoBang',
			filterType: 'string',
			width: 120,
		},
		{
			title: 'Số hiệu VB',
			dataIndex: 'soHieuVanBang',
			filterType: 'string',
			width: 120,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Đã cấp bằng',
			dataIndex: 'kichHoat',
			align: 'center',
			width: 90,
			filterType: 'select',
			filterData: [
				{ value: 'true', label: 'Đã cấp' },
				{ value: 'false', label: 'Chưa cấp' },
			],
			render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Đã cấp' : 'Chưa cấp'}</Tag>,
		},
		{
			title: 'Ngày cấp bằng',
			dataIndex: 'ngayCapPhuLuc',
			align: 'center',
			width: 120,
			filterType: 'date',
			sortable: true,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 120,
			filterType: 'string',
			render: (val) => <ExpandText> {val} </ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={async () => {
							try {
								await putModel(rec?._id, {
									...rec,
									dotCapBangId: null,
								});
								message.success('Đã gỡ quyết định khỏi đợt cấp bằng');
								getModel({ dotCapBangId });
							} catch {
								message.error('Lỗi khi gỡ quyết định');
							}
						}}
						title='Bạn có chắc chắn muốn xóa quyết định này khỏi đợt cấp bằng?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Gỡ khỏi đợt' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	const otherButtons = [
		<Tooltip title='Thêm quyết định hiện có vào Đợt cấp bằng này' key='apply-tooltip'>
			<Button type='primary' icon={<PlusCircleOutlined />} onClick={handleApply}>
				Thêm phụ lục
			</Button>
		</Tooltip>,
		<ButtonExtend
			icon={<ImportOutlined />}
			onClick={() => setVisibleImport(true)}
			key='import'
			disabled={!recQuyetDinh?._id && !quyetDinhId}
		>
			Nhập dữ liệu
		</ButtonExtend>,

		<ButtonExtend
			tooltip='Xác nhận đã cấp bằng cho những phục lục này'
			key=''
			disabled={!selectedIds?.length}
			icon={<UserAddOutlined />}
			onClick={handleSubmit}
		>
			Cấp bằng ({selectedIds?.length})
		</ButtonExtend>,
	];

	// Kiểm tra xem có đủ điều kiện để hiển thị dữ liệu không
	const hasRequiredParams = !!(dotCapBangId || quyetDinhId || recQuyetDinh?._id);

	return (
		<>
			{hasRequiredParams ? (
				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit, recQuyetDinh?._id, quyetDinhId, dotCapBangId]}
					modelName='vbcc.phulucvanbang'
					title={intl.formatMessage({ id: 'totnghiep.phulucvanbang.title' })}
					widthDrawer={800}
					Form={Form}
					formProps={{
						getData,
						isQuyetDinh,
						quyetDinhId: quyetDinhId || recQuyetDinh?._id,
						dotCapBangId,
					}}
					buttons={!!dotCapBangId ? { export: false, create: false } : undefined}
					rowSelection
					hideCard={isQuyetDinh}
					otherButtons={otherButtons}
					otherProps={{ rowkey: '_id' }}
				>
					{!isQuyetDinh && !quyetDinhId ? (
						<FilterHocKy allowClear style={{ marginBottom: 12 }}>
							<SelectQuyetDinh
								condition={{ maHocKy: recHocKy?.ma }}
								style={{ width: 250 }}
								value={recQuyetDinh?._id}
								onChange={(val) => setQuyetDinh(danhsachQuyetDinh.find((item) => item._id === val))}
								isSetRecord
								allowClear
							/>
						</FilterHocKy>
					) : null}
				</TableBase>
			) : (
				<div style={{ textAlign: 'center', padding: '20px' }}>
					Vui lòng chọn một Quyết định tốt nghiệp hoặc Đợt cấp bằng để hiển thị dữ liệu
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

			<Modal
				title='Xác nhận cấp bằng'
				visible={showModalCapBang}
				onCancel={() => setShowModalCapBang(false)}
				onOk={handleCapBangConfirm}
				okText='Xác nhận'
				cancelText='Hủy'
				width={500}
			>
				<div style={{ marginBottom: 16 }}>
					<h3>Thông tin cấp bằng</h3>
					<p>
						Số lượng phụ lục được chọn: <strong>{selectedIds?.length}</strong>
					</p>
				</div>

				<Form.Item label='Ngày cấp bằng' required style={{ marginBottom: 16 }}>
					<MyDatePicker
						value={formCapBang.ngayCapBang}
						onChange={(dateStr) => {
							setFormCapBang((prev) => ({
								...prev,
								ngayCapBang: moment(dateStr),
							}));
						}}
						placeholder='Chọn ngày cấp bằng'
					/>
				</Form.Item>

				<Form.Item label='Ghi chú cấp bằng' style={{ marginBottom: 0 }}>
					<Input.TextArea
						value={formCapBang.ghiChu}
						onChange={(e) => setFormCapBang((prev) => ({ ...prev, ghiChu: e.target.value }))}
						placeholder='Nhập ghi chú cấp bằng (nếu có)...'
						autoSize={{ minRows: 2, maxRows: 6 }}
					/>
				</Form.Item>
			</Modal>

			{/* Modal chọn quyết định để thêm vào đợt cấp bằng */}
			{dotCapBangId && (
				<ModalChonPhuLuc
					visible={visibleModalChonPhuLuc}
					onCancel={() => setVisibleModalChonPhuLuc(false)}
					dotCapBangId={dotCapBangId}
					onSuccess={getData}
				/>
			)}
		</>
	);
};

export default ModalPhuLucVanBang;
