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
import { useIntl, useModel } from 'umi';

type TProps = {
	visible: boolean;
	onCancel: () => void;
	getData: () => void;
};

const ModalChonQuyetDinh: React.FC<TProps> = ({ visible, onCancel, getData: getDataExternal }) => {
	const intl = useIntl();
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
			setDanhSach(Array.isArray(res?.data) ? res.data : Array.isArray(res));
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
			message.warning(intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.warning.chonquyetdinh' }));
			return;
		}
		if (!recDot?._id) return;
		try {
			await themQuyetDinhVaoDotCapBang(recDot._id, selectedIds);
			await getDataExternal();
			setSelectedIds([]);
			onCancel();
			message.success(intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.success' }));
		} catch {
			message.error(intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.error' }));
		}
	};

	const columns: IColumn<QuyetDinhTotNghiep.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.column.namhanhchinh' }),
			dataIndex: 'nam',
			align: 'center',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.column.soquyetdinh' }),
			dataIndex: 'soQuyetDinh',
			align: 'center',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.column.ngayky' }),
			dataIndex: 'ngayBanHanh',
			align: 'center',
			width: 120,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.column.noidung' }),
			dataIndex: 'noiDung',
			width: 300,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<Modal
			title={intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.title' })}
			open={visible}
			width={800}
			onCancel={onCancel}
			footer={null}
		>
			<p style={{ margin: '0 0 16px', fontSize: 14 }}>
				{intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.description' })}
			</p>
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
						onChange: (selectedRowKeys: any[]) => setSelectedIds(selectedRowKeys),
						columnWidth: 40,
					},
				}}
				otherButtons={[
					<Space style={{ marginBottom: 16 }}>
						<MyDatePicker
							style={{ width: 150 }}
							value={yearSelect}
							pickerStyle='year'
							placeholder={intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.placeholder.chonnam' })}
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
					{intl.formatMessage({ id: 'dotcapbang.chonquyetdinh.button.themvaodot' })}{' '}
					{selectedIds?.length > 0 ? `(${selectedIds.length})` : ''}
				</Button>
				<Button onClick={onCancel}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalChonQuyetDinh;
