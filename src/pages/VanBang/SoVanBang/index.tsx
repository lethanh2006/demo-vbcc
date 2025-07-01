import { Popconfirm, Tag } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import SoVanBangForm from './components/Form'; // Adjust the path based on your file structure
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ExpandText from '@/components/ExpandText';
import SelectTrinhDo from '@/pages/DaoTao/CoSo/TrinhDo/components/Select';
import SelectHinhThuc from '@/pages/DaoTao/CoSo/HinhThucDaoTao/components/Select';
import { colorTrangThaiSoVanBang, ETrangThaiSoVanBang } from '@/services/VanBang/constant';
import { useEffect } from 'react';

const SoVanBangPage = () => {
	const { page, limit, handleEdit, deleteModel, duyetModel, getModel } = useModel('vbcc.sovanbang');
	const { getAllModel: hinhThucDaoTaoModel, danhSach: dsHinhThuc } = useModel('danhmuc.hinhthucdaotao');
	const { getAllModel: trinhDoDaoTaoModel, danhSach: dsTrinhDo } = useModel('danhmuc.trinhdo');

	useEffect(() => {
		hinhThucDaoTaoModel();
		trinhDoDaoTaoModel();
	}, []);

	const handleDuyet = (soVanBangId: string) => {
		if (soVanBangId) duyetModel(soVanBangId, getModel).catch(console.log);
	};

	const columns: IColumn<SoVanBang.IRecord>[] = [
		{
			title: 'Năm',
			dataIndex: 'namHanhChinh',
			width: 100,
			sorter: true,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Tên sổ',
			dataIndex: 'ten',
			width: 220,
			sorter: true,
			filterType: 'string',
		},
		{
			title: 'Số vào sổ hiện tại',
			dataIndex: 'soVaoSoHienTai',
			width: 100,
			sorter: true,
			filterType: 'number',
			align: 'center',
		},
		{
			title: 'Trình độ',
			dataIndex: 'maTrinhDo',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo selectMa multiple />,
			render: (val) => {
				const trinhDo = dsTrinhDo.find((x) => x.ma === val);
				return trinhDo?.ten ?? val;
			},
		},
		{
			title: 'Hình thức',
			dataIndex: 'maHinhThuc',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectHinhThuc selectMa multiple />,
			render: (val) => {
				const hinhThuc = dsHinhThuc.find((x) => x.ma === val);
				return hinhThuc?.ten ?? val;
			},
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 180,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 100,
			filterType: 'select',
			align: 'center',
			filterData: Object.values(ETrangThaiSoVanBang),
			render: (val: ETrangThaiSoVanBang) => <Tag color={colorTrangThaiSoVanBang[val]}>{val}</Tag>,
		},
		{
			title: 'Người tạo',
			dataIndex: 'nguoiTaoInfo',
			width: 150,
			filterType: 'string',
			render: (val) => val?.hoTen ?? val?.username,
		},
		{
			title: 'Người duyệt',
			dataIndex: 'nguoiDuyetInfo',
			width: 150,
			filterType: 'string',
			render: (val) => val?.hoTen ?? val?.username,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
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
					</Popconfirm>
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
		<div>
			<TableBase
				columns={columns}
				modelName={'vbcc.sovanbang'}
				title='Sổ văn bằng'
				Form={SoVanBangForm}
				dependencies={[page, limit]}
				widthDrawer={800}
			/>
		</div>
	);
};

export default SoVanBangPage;
