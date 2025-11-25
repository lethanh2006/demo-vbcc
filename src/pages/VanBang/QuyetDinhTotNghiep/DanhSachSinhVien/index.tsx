import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined, ImportOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalImportPhuLucVanBang from '../../PhuLuc/components/ModalImportPhuLuc';
import ViewPhuLucVanBang from '../../PhuLuc/components/ViewRender';
import Form from './components/Form';

const DanhSachSinhVienQuyetDinh = () => {
	const intl = useIntl();
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { getModel, page, limit, deleteModel, handleEdit, handleView, isView } = useModel('vbcc.phulucvanbang');
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const disable =
		!!recQuyetDinh?._id &&
		(recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO ||
			recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.CHINH_THUC);

	const getData = () => {
		if (recQuyetDinh?._id) {
			getModel({ idQuyetDinh: recQuyetDinh._id });
		}
	};

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
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
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={disable}
						tooltip='Chỉnh sửa'
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEdit(rec)}
					/>

					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa phụ lục này?'
						placement='topRight'
					>
						<ButtonExtend disabled={disable} tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
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
				title={intl.formatMessage({ id: 'vanbang.phulucvanbang.title' })}
				widthDrawer={800}
				Form={isView ? ViewPhuLucVanBang : Form}
				formProps={{ getData }}
				hideCard
				rowSelection
				buttons={{ create: disable ? false : true }}
				otherButtons={[
					<ButtonExtend
						icon={<ImportOutlined />}
						onClick={() => setVisibleImport(true)}
						key='import'
						disabled={!recQuyetDinh?._id || disable}
					>
						Nhập dữ liệu
					</ButtonExtend>,
				]}
				showModalTitle
			/>

			<ModalImportPhuLucVanBang
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					getData();
					setVisibleImport(false);
				}}
				params={{
					importSinhVien: '1',
				}}
			/>
		</>
	);
};

export default DanhSachSinhVienQuyetDinh;
