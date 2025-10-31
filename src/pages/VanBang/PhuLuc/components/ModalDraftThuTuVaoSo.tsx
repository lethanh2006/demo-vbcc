import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

interface Props {
	data: {
		soVaoSoHienTai: number;
		idSoVanBang: string;
		sinhLaiToanBo: boolean;
	};
	onBack: () => void;
	onDone: () => void;
}

const ModalDraftThuTuVaoSo: React.FC<Props> = ({ data, onBack, onDone }) => {
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { sortPhuLucTamModel, sinhSoVaoSoModel, formSubmiting } = useModel('vbcc.phulucvanbang');
	const [draftList, setDraftList] = useState<PhuLucVanBang.IRecord[]>([]);

	useEffect(() => {
		const fetchDraftList = async () => {
			if (!recQuyetDinh?._id) return;
			try {
				const res = await sortPhuLucTamModel(recQuyetDinh._id, data);
				setDraftList(res?.data ?? []);
			} catch (err) {
				console.error('Lỗi khi lấy danh sách phụ lục dự kiến:', err);
			}
		};
		fetchDraftList();
	}, [recQuyetDinh?._id, JSON.stringify(data)]);

	const handleConfirm = async () => {
		if (!recQuyetDinh?._id) return;
		try {
			await sinhSoVaoSoModel(recQuyetDinh._id, data);
			onDone();
		} catch (err) {
			console.error(err);
		}
	};

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ (dự kiến)',
			dataIndex: 'soVaoSoTamThoi',
			width: 110,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 200,
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			width: 120,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={async () => draftList}
				dependencies={[draftList]}
				modelName='vbcc.phulucvanbang'
				buttons={{ create: false }}
				hideCard
			/>

			<div className='form-footer'>
				<Space>
					<Button type='primary' onClick={handleConfirm} loading={formSubmiting}>
						Xác nhận sinh số
					</Button>
					<Button onClick={onBack}>Quay lại</Button>
				</Space>
			</div>
		</>
	);
};

export default ModalDraftThuTuVaoSo;
