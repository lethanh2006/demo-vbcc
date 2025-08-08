import ExpandText from '@/components/ExpandText';
import { EOperatorType } from '@/components/Table/constant';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { Button, message, Modal } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

type TProps = {
	visible: boolean;
	onCancel: () => void;
	getData: () => void;
};

const ModalChonPhuLuc: React.FC<TProps> = ({ visible, onCancel, getData: getDataExternal }) => {
	const { record: recDot } = useModel('vbcc.dotcapbangtotnghiep');
	const { dsAllQuyeDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { getAllModel, putManyModel, formSubmiting, selectedIds, setSelectedIds, loading } =
		useModel('vbcc.phulucvanbang');
	const [danhSach, setDanhSach] = useState<PhuLucVanBang.IRecord[]>([]);

	const getData = async () => {
		getAllModel(
			undefined,
			undefined,
			{
				dotCapBangId: null,
			},
			[
				{
					active: true,
					field: 'idQuyetDinh',
					operator: EOperatorType.INCLUDE,
					values: dsAllQuyeDinh?.map((item) => item?._id),
				},
			],
			undefined,
			false,
		).then((res) => setDanhSach(res));
	};

	useEffect(() => {
		if (visible && recDot?._id) {
			getData();
		} else {
			setDanhSach([]);
			setSelectedIds([]);
		}
	}, [visible, recDot?._id]);

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ',
			dataIndex: 'soVaoSoBang',
			align: 'center',
			width: 120,
		},
		{
			title: 'Số hiệu VB',
			dataIndex: 'soHieuVanBang',
			align: 'center',
			width: 120,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 160,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val: moment.MomentInput) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
		},
		{
			title: 'Thông tin quyết định',
			align: 'center',
			width: 180,
			render: (val, rec) => (
				<ExpandText>
					{rec?.quyetDinh?.soQuyetDinh
						? `Số QĐ: ${rec.quyetDinh.soQuyetDinh}${
								rec.quyetDinh.ngayBanHanh ? ` - ${moment(rec.quyetDinh.ngayBanHanh).format('DD/MM/YYYY')}` : ''
						  }`
						: 'Chưa có QĐ'}
				</ExpandText>
			),
		},
	];

	const handleSubmit = async () => {
		if (selectedIds?.length === 0) {
			message.warning('Vui lòng chọn ít nhất một phụ lục');
			return;
		}

		try {
			await putManyModel(
				selectedIds ?? [],
				{
					dotCapBangId: recDot?._id,
				},
				getDataExternal,
			);

			onCancel();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Modal title='Chọn phụ lục văn bằng' visible={visible} width={800} onCancel={onCancel} footer={null}>
			<TableStaticData
				columns={columns}
				data={danhSach?.filter((item) => item?.kichHoat !== true)}
				loading={loading}
				addStt
				hasTotal
				onReload={getData}
				otherProps={{
					pagination: false,
					rowKey: (rec: PhuLucVanBang.IRecord) => rec._id,
					rowSelection: {
						type: 'checkbox',
						selectedRowKeys: selectedIds,
						preserveSelectedRowKeys: true,
						onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
						columnWidth: 40,
					},
				}}
			/>
			<div className='form-footer'>
				<Button type='primary' loading={formSubmiting} onClick={handleSubmit} disabled={selectedIds?.length === 0}>
					Thêm vào đợt cấp bằng {selectedIds?.length ?? 0 > 0 ? `(${selectedIds?.length})` : ''}
				</Button>
				<Button onClick={onCancel}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ModalChonPhuLuc;
