import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiXacMinh, ELoaiPhucDap, EPhaseXacMinh, nameTrangThaiXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Popconfirm, Spin, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewPhuLucVanBang from '../PhuLuc/components/ViewRender';
import ModalXacMinhVanBang from './components/Modal';
import ModalCaiDatXacMinh from './components/ModalCaiDat';

const XacMinhVanBangPage = (props: { title?: 'Yêu cầu đang xử lý' | 'Yêu cầu chờ ký' | 'Yêu cầu hoàn thành' }) => {
	const { title } = props;
	const { getModel, page, limit, deleteModel, handleEdit, record, setRecord } = useModel('vbcc.xacminhvanbang');
	const { visibleForm, setVisibleForm, loading } = useModel('vbcc.phulucvanbang');

	const [isFormBieuMauVisible, setIsFormBieuMauVisible] = useState(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const onCell = (rec: XacMinhVanBang.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const trangThai =
		title === 'Yêu cầu đang xử lý'
			? [EPhaseXacMinh.XAC_MINH, EPhaseXacMinh.PHUC_DAP, EPhaseXacMinh.KET_QUA]
			: title === 'Yêu cầu chờ ký'
				? [EPhaseXacMinh.KET_QUA]
				: title === 'Yêu cầu hoàn thành'
					? [EPhaseXacMinh.HOAN_THANH]
					: null;

	const getData = () => {
		getModel(
			undefined,
			trangThai
				? [
						{
							active: true,
							field: 'phaseXuLy',
							operator: EOperatorType.INCLUDE,
							values: trangThai,
						},
					]
				: undefined,
		);
	};

	const columns: IColumn<XacMinhVanBang.IRecord>[] = [
		{
			title: 'Người yêu cầu',
			dataIndex: 'nguoiYeuCau',
			filterType: 'string',
			width: 160,
			onCell,
		},
		{
			title: 'Loại phúc đáp',
			dataIndex: 'loaiPhucDap',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiPhucDap),
			onCell,
		},
		{
			title: 'Đơn vị',
			dataIndex: 'tenDonVi',
			filterType: 'string',
			width: 180,
			align: 'center',
			onCell,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			filterType: 'string',
			width: 120,
			align: 'center',
			onCell,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			filterType: 'string',
			width: 180,
			align: 'center',
			onCell,
		},
		{
			title: 'Ngày gửi',
			dataIndex: 'ngayGuiYeuCau',
			filterType: 'date',
			render: (val: Date) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			width: 120,
			align: 'center',
			onCell,
		},
		{
			title: 'Mục đích xác minh',
			dataIndex: 'mucDichXacMinh',
			filterType: 'string',
			width: 200,
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Kết quả phúc đáp',
			dataIndex: 'urlFilePhucDapChung',
			width: 120,
			render: (val, rec) =>
				val?.length && (
					<a
						onClick={() => {
							setRecord(rec);
							setVisibleFormFile(true);
						}}
					>
						Xem chi tiết
					</a>
				),
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'phaseXuLy',
			width: 150,
			align: 'center',
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(trangThai ?? EPhaseXacMinh).map((item) => ({
				value: item,
				label: nameTrangThaiXacMinh[item],
			})),
			onCell,
			render: (val: EPhaseXacMinh) => <Tag color={colorTrangThaiXacMinh[val]}>{nameTrangThaiXacMinh[val]}</Tag>,
		},
		{
			title: 'Thao tác',
			width: 90,
			fixed: 'right',
			align: 'center',
			render: (_, record) => {
				const isHoanThanh = record?.phaseXuLy === EPhaseXacMinh.HOAN_THANH;
				return (
					<>
						<ButtonExtend
							disabled={isHoanThanh}
							tooltip='Chỉnh sửa'
							onClick={() => handleEdit(record)}
							type='link'
							icon={<EditOutlined />}
						/>

						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topRight'
						>
							<ButtonExtend disabled={isHoanThanh} tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
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
				modelName={'vbcc.xacminhvanbang'}
				Form={ModalXacMinhVanBang}
				formProps={{ getData }}
				widthDrawer={1200}
				dependencies={[page, limit]}
				title={title ?? 'Tất cả yêu cầu'}
				extra={[
					<ButtonExtend
						key='add'
						type='link'
						onClick={() => setIsFormBieuMauVisible(true)}
						icon={<SettingOutlined />}
						tooltip='Biểu mẫu'
					/>,
				]}
			>
				{/* <StatXacMinhVanBang /> */}
			</TableBase>

			<ModalExpandable
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				title='Xem chi tiết thông tin văn bằng'
				width={1000}
				footer={null}
			>
				<Spin spinning={loading}>
					<ViewPhuLucVanBang hasPrint={false} />
				</Spin>
			</ModalExpandable>

			<ModalCaiDatXacMinh visible={isFormBieuMauVisible} onClose={() => setIsFormBieuMauVisible(false)} />

			<ModalExpandable
				title='Chi tiết tệp tin'
				width={1000}
				open={visibleFormFile}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.urlFilePhucDapChung ?? []} />
			</ModalExpandable>
		</>
	);
};

export default XacMinhVanBangPage;
