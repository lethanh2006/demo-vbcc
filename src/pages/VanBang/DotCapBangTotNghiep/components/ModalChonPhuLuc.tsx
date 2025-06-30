import { Modal, Button, message, Tag } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { IColumn } from '@/components/Table/typing';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';

type TProps = {
	visible: boolean;
	onCancel: () => void;
	onSuccess: () => void;
	dotCapBangId: string;
	// idDotCapBang: string;
};

const ModalChonPhuLuc: React.FC<TProps> = ({ visible, onCancel, dotCapBangId, onSuccess }) => {
	const {
		getModel: getPhuLuc,
		putManyModel,
		formSubmiting,
		loading,
		selectedIds = [],
		page,
		limit,
	} = useModel('vbcc.phulucvanbang');

	// Lấy danh sách phụ lục chưa được gán vào bất kỳ đợt cấp bằng nào
	const getData = async () => {
		return await getPhuLuc(
			undefined,
			undefined,
			{
				dotCapBangId: null,
				// daCapBang: false,
				// daCapPhuLuc: false,
			} as any,
			undefined,
			undefined,
		);
	};

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
		if (selectedIds.length === 0) {
			message.warning('Vui lòng chọn ít nhất một phụ lục');
			return;
		}

		try {
			await putManyModel(selectedIds, {
				dotCapBangId: String(dotCapBangId),
			});

			message.success('Thêm phụ lục vào đợt cấp bằng thành công');
			onSuccess?.();
			onCancel();
		} catch (error) {
			console.error(error);
			message.error('Có lỗi xảy ra khi thêm phụ lục');
		}
	};

	return (
		<Modal title='Chọn phụ lục văn bằng' visible={visible} width={800} onCancel={onCancel} footer={null}>
			<TableBase
				title='Thêm phụ lục văn bằng vào đợt cấp bằng'
				columns={columns}
				modelName='vbcc.phulucvanbangrieng'
				getData={getData}
				addStt
				rowSelection
				dependencies={[page, limit]}
				otherProps={{ rowKey: '_id' }}
			/>
			<div className='form-footer'>
				<Button type='primary' loading={formSubmiting} onClick={handleSubmit} disabled={selectedIds.length === 0}>
					Thêm vào đợt cấp bằng {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
				</Button>
				<Button onClick={onCancel}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ModalChonPhuLuc;
