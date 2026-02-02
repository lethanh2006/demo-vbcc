import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectTrinhDoDaoTao from '@/pages/DanhMuc/TrinhDoTaoTao/components/Select';
import { ETrangThaiSoVanBang } from '@/services/VanBang/constant';
import type { SoVanBang } from '@/services/VanBang/SoVanBang/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';
import ChiTietSoVanBang from './components/ChiTiet';
import SoVanBangForm from './components/Form';
const SoVanBangPage = () => {
	const {
		page,
		limit,
		handleEdit,
		deleteModel,
		handleView,
		isView,
		//  duyetModel, getModel
	} = useModel('vbcc.sovanbang');

	// const handleDuyet = (soVanBangId: string) => {
	// 	if (soVanBangId) duyetModel(soVanBangId, getModel).catch(console.log);
	// };

	const onCell = (rec: SoVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<SoVanBang.IRecord>[] = [
		{
			title: 'Năm',
			dataIndex: 'namHanhChinh',
			width: 100,
			sorter: true,
			filterType: 'string',
			align: 'center',
			onCell,
		},
		{
			title: 'Tên sổ',
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Số vào sổ hiện tại',
			dataIndex: 'soVaoSoHienTai',
			width: 100,
			sorter: true,
			filterType: 'number',
			align: 'center',
			onCell,
		},
		{
			title: 'Trình độ',
			dataIndex: 'maTrinhDoDaoTao',
			width: 120,
			render: (val, rec) => rec?.trinhDoDaoTao?.ten ?? rec?.tenTrinhDoDaoTao ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDoDaoTao selectMa multiple />,
			onCell,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 180,
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		// {
		// 	title: 'Trạng thái',
		// 	dataIndex: 'trangThai',
		// 	width: 100,
		// 	filterType: 'select',
		// 	align: 'center',
		// 	filterData: Object.values(ETrangThaiSoVanBang),
		// 	render: (val: ETrangThaiSoVanBang) => <Tag color={colorTrangThaiSoVanBang[val]}>{val}</Tag>,
		// },
		// {
		// 	title: 'Người tạo',
		// 	dataIndex: 'nguoiTaoInfo',
		// 	width: 150,
		// 	filterType: 'string',
		// 	render: (val) => val?.hoTen ?? val?.username,
		// },
		// {
		// 	title: 'Người duyệt',
		// 	dataIndex: 'nguoiDuyetInfo',
		// 	width: 150,
		// 	filterType: 'string',
		// 	render: (val) => val?.hoTen ?? val?.username,
		// },
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					{/* <Popconfirm
						title='Bạn có chắc chắn muốn duyệt sổ văn bằng này?'
						placement='topLeft'
						onConfirm={() => handleDuyet(rec._id)}
					>
						<ButtonExtend
							tooltip='Duyệt'
							type='link'
							className='btn-success'
							icon={<CheckOutlined />}
							disabled={rec.trangThai === ETrangThaiSoVanBang.DA_DUYET}
						/>
					</Popconfirm> */}

					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />

					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title='Bạn có chắc chắn muốn xóa sổ văn bằng này?'
						placement='topRight'
					>
						<ButtonExtend
							tooltip='Xóa'
							danger
							type='link'
							icon={<DeleteOutlined />}
							disabled={rec.trangThai === ETrangThaiSoVanBang.DA_DUYET}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			modelName={'vbcc.sovanbang'}
			title='Sổ văn bằng'
			Form={isView ? ChiTietSoVanBang : SoVanBangForm}
			dependencies={[page, limit]}
			widthDrawer={isView ? 1200 : 800}
			showModalTitle
		/>
	);
};

export default SoVanBangPage;
