import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectHinhThucDaoTao from '@/pages/DanhMuc/HinhThucDaoTao/components/Select';
import SelectNganhDaoTao from '@/pages/DanhMuc/NganhDaoTao/components/Select';
import SelectTrinhDoDaoTao from '@/pages/DanhMuc/TrinhDoTaoTao/components/Select';
import { EQuyetDinhStep, ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined, EditOutlined, ImportOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalImportPhuLucVanBang from '../../PhuLuc/components/ModalImportPhuLuc';
import ViewPhuLucVanBang from '../../PhuLuc/components/ViewRender';
import Form from './components/Form';

const DanhSachSinhVienQuyetDinh = (props: { afterAddNew?: (val: EQuyetDinhStep) => void }) => {
	const { afterAddNew } = props;
	const intl = useIntl();
	const { record: recQuyetDinh, setVisibleForm } = useModel('vbcc.quyetdinhtotnghiep');
	const { getModel, page, limit, deleteModel, handleEdit, handleView, isView } = useModel('vbcc.phulucvanbang');
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const disable =
		!!recQuyetDinh?._id &&
		(recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO ||
			recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.CHINH_THUC ||
			recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.HOAN_THANH);

	const getData = () => {
		if (recQuyetDinh?._id) {
			getModel({ idQuyetDinh: recQuyetDinh._id }, undefined, {
				soThuTuImport: 1,
			});
		}
	};

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.column.manguoihoc' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.column.hoten' }),
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.column.ngaysinh' }),
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.column.cccd' }),
			dataIndex: 'cmtCccd',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.column.trinhdo' }),
			dataIndex: 'trinhDoDaoTao',
			width: 140,
			render: (val, rec) => rec?.thongTinTrinhDoDaoTao?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDoDaoTao selectTen multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.column.hinhthuc' }),
			dataIndex: 'hinhThucDaoTao',
			width: 150,
			render: (val, rec) => rec?.thongTinHinhThucDaoTao?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectHinhThucDaoTao selectTen multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.column.nganh' }),
			dataIndex: 'nganhDaoTao',
			width: 140,
			render: (val, rec) => rec?.thongTinNganhDaoTao?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhDaoTao selectMa multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={disable}
						tooltip={intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.button.sua' })}
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEdit(rec)}
					/>

					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title={intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.confirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							disabled={disable}
							tooltip={intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
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
				title={intl.formatMessage({ id: 'thongtinvb.title' })}
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
						{intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.button.nhapdulieu' })}
					</ButtonExtend>,
				]}
				showModalTitle
			/>

			<div className='form-footer'>
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(EQuyetDinhStep.THONG_TIN);
					}}
					icon={<ArrowLeftOutlined />}
				>
					{intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.button.quaylai' })}
				</Button>
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(EQuyetDinhStep.DU_THAO_SO);
					}}
					icon={<ArrowRightOutlined />}
				>
					{intl.formatMessage({ id: 'qdtotnghiep.phulucvanbang.button.tieptheo' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>

			<ModalImportPhuLucVanBang
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					getData();
					setVisibleImport(false);
				}}
				params={{
					importSinhVien: '1',
					sort: { soThuTuImport: 1 },
				}}
				isThongTin
			/>
		</>
	);
};

export default DanhSachSinhVienQuyetDinh;
