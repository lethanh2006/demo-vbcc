import { Modal, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import moment from 'moment';
import ExpandText from '@/components/ExpandText';
import { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';

type TProps = {
	visible: boolean;
	onCancel: () => void;
	dotCapBangId: string;
	onSuccess: () => void;
};

const ModalChonQuyetDinh: React.FC<TProps> = ({ visible, onCancel, onSuccess }) => {
	const { record: recDot } = useModel('vbcc.dotcapbangtotnghiep');
	const { getAllModel: getAllQuyetDinh, putManyModel, formSubmiting, loading } = useModel('vbcc.quyetdinhtotnghiep');
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [availableDecisions, setAvailableDecisions] = useState<QuyetDinhTotNghiep.IRecord[]>([]);

	// Lấy danh sách quyết định chưa được gán vào bất kỳ đợt cấp bằng nào
	const getData = () =>
		getAllQuyetDinh(undefined, undefined, { dotCapBangId: null } as any, undefined, undefined, false).then((res) =>
			setAvailableDecisions(res),
		);

	useEffect(() => {
		if (visible && recDot?._id) {
			getData();
		}
	}, [visible, recDot?._id]);

	// Reset giá trị khi mở modal
	useEffect(() => {
		if (visible) {
			setSelectedRowKeys([]);
		}
	}, [visible]);

	const handleSubmit = async () => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn ít nhất một quyết định');
			return;
		}

		try {
			await putManyModel(selectedRowKeys, { dotCapBangId: recDot?._id });

			message.success('Thêm quyết định vào đợt cấp bằng thành công');

			// Gọi callback onSuccess để báo hiệu cập nhật thành công
			if (onSuccess) {
				onSuccess();
			}
			onCancel();
			// Cập nhật lại danh sách quyết định chưa được gán
			getData();
		} catch (error) {
			console.log(error);
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
			render: (val: moment.MomentInput) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 300,
			render: (val: unknown) => <ExpandText>{val}</ExpandText>,
		},
	];

	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedKeys: React.Key[]) => {
			setSelectedRowKeys(selectedKeys as string[]);
		},
	};

	return (
		<Modal title='Chọn quyết định tốt nghiệp' visible={visible} width={800} onCancel={onCancel} footer={null}>
			<TableStaticData
				columns={columns}
				data={availableDecisions}
				loading={loading}
				otherProps={{ rowSelection, rowKey: '_id' }}
				addStt
				hasTotal
				onReload={getData}
			/>

			<div className='form-footer'>
				<Button type='primary' loading={formSubmiting} onClick={handleSubmit} disabled={selectedRowKeys.length === 0}>
					Thêm vào đợt cấp bằng {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}
				</Button>
				<Button onClick={onCancel}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ModalChonQuyetDinh;
