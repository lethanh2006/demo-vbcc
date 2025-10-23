import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import {
	getDanhSachQuyetDinhChuaThemVaoDotCapBang,
	themQuyetDinhVaoDotCapBang,
} from '@/services/VanBang/PhuLucVanBang';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import dayjs from '@/utils/dayjs';
import { Button, message, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

type TProps = {
	visible: boolean;
	onCancel: () => void;
	getData: () => void;
};

const ModalChonQuyetDinh: React.FC<TProps> = ({ visible, onCancel, getData: getDataExternal }) => {
	const { record: recDot } = useModel('vbcc.dotcapbangtotnghiep');
	const { formSubmiting, loading, selectedIds = [], setSelectedIds } = useModel('vbcc.quyetdinhtotnghiep');
	const [danhSach, setDanhSach] = useState<QuyetDinhTotNghiep.IRecord[]>([]);
	const [yearSelect, setYearSelect] = useState<any>(dayjs());

	const getData = async () => {
		if (!recDot?._id) return;
		try {
			const res = await getDanhSachQuyetDinhChuaThemVaoDotCapBang(
				recDot._id,
				yearSelect ? dayjs(yearSelect).format('YYYY') : undefined,
			);
			const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
			setDanhSach(data);
		} catch (error) {
			console.error(error);
			setDanhSach([]);
		}
	};

	useEffect(() => {
		if (visible && recDot?._id) {
			getData();
		} else {
			setDanhSach([]);
			setSelectedIds([]);
		}
	}, [visible, recDot?._id, yearSelect]);

	const handleSubmit = async () => {
		if (!selectedIds?.length) {
			message.warning('Vui lòng chọn ít nhất một quyết định');
			return;
		}
		if (!recDot?._id) return;
		try {
			await themQuyetDinhVaoDotCapBang(recDot._id, selectedIds);
			await getDataExternal();
			setSelectedIds([]);
			onCancel();
			message.success('Thêm quyết định vào đợt cấp bằng thành công');
		} catch {
			message.error('Có lỗi xảy ra khi thêm quyết định');
		}
	};

	const columns: IColumn<QuyetDinhTotNghiep.IRecord>[] = [
		{
			title: 'Số quyết định',
			dataIndex: 'soQuyetDinh',
			align: 'center',
			width: 150,
		},
		{
			title: 'Ngày ký',
			dataIndex: 'ngayBanHanh',
			align: 'center',
			width: 120,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 300,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<Modal title='Chọn quyết định tốt nghiệp' open={visible} width={800} onCancel={onCancel} footer={null}>
			<p style={{ margin: '0 0 16px', fontSize: 14 }}>Chọn quyết định tốt nghiệp thêm vào đợt cấp bằng này!</p>
			<TableStaticData
				columns={columns}
				data={danhSach}
				loading={loading}
				addStt
				hasTotal
				onReload={getData}
				otherProps={{
					pagination: false,
					rowKey: (rec: QuyetDinhTotNghiep.IRecord) => rec._id,
					rowSelection: {
						type: 'checkbox',
						selectedRowKeys: selectedIds,
						preserveSelectedRowKeys: true,
						onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
						columnWidth: 40,
					},
				}}
				otherButtons={[
					<Space style={{ marginBottom: 16 }}>
						<MyDatePicker
							style={{ width: 150 }}
							value={yearSelect}
							pickerStyle='year'
							placeholder='Chọn năm quyết định'
							format='YYYY'
							onChange={(val) => {
								setYearSelect(val);
								setSelectedIds([]);
							}}
							allowClear
						/>
					</Space>,
				]}
			/>
			<div className='form-footer'>
				<Button type='primary' loading={formSubmiting} onClick={handleSubmit} disabled={!selectedIds?.length}>
					Thêm vào đợt cấp bằng {selectedIds?.length > 0 ? `(${selectedIds.length})` : ''}
				</Button>
				<Button onClick={onCancel}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ModalChonQuyetDinh;
