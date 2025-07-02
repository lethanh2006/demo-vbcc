import { Modal, Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import { genExcelFile } from '@/utils/utils';
import { getChiTietLuotTraCuu } from '@/services/VanBang/PhuLucVanBang';

interface ChiTietTraCuu {
	soQuyetDinh: string;
	tongTraCuu: number;
	mucDich: {
		[mucDich: string]: number;
	};
}

interface ModalTraCuuProps {
	visible: boolean;
	onClose: () => void;
	maHocKy: string | undefined;
	idSoVanBang: string | undefined;
	ten: SoVanBang.IRecord | undefined;
}

const ModalTongLuotTraCuu: React.FC<ModalTraCuuProps> = ({ visible, onClose, maHocKy, idSoVanBang, ten }) => {
	const [data, setData] = useState<ChiTietTraCuu[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (visible && maHocKy && idSoVanBang) {
			setLoading(true);
			getChiTietLuotTraCuu(maHocKy, idSoVanBang)
				.then((res) => setData(res?.data || []))
				.finally(() => setLoading(false));
		}
	}, [visible, maHocKy, idSoVanBang]);

	const allMucDichs = Array.from(new Set(data.flatMap((item) => Object.keys(item.mucDich))));

	const columns = [
		{
			title: 'Số quyết định',
			dataIndex: 'soQuyetDinh',
			key: 'soQuyetDinh',
		},
		{
			title: 'Tổng tra cứu',
			dataIndex: 'tongTraCuu',
			key: 'tongTraCuu',
		},
		...allMucDichs.map((mucDich) => ({
			title: mucDich,
			dataIndex: ['mucDich', mucDich],
			key: mucDich,
			render: (_: any, record: ChiTietTraCuu) => record.mucDich[mucDich] || 0,
		})),
	];

	const handleExport = () => {
		const header = ['Số quyết định', 'Tổng tra cứu', ...allMucDichs];
		const rows = data.map((item) => [
			item.soQuyetDinh,
			item.tongTraCuu,
			...allMucDichs.map((muc) => item.mucDich[muc] || 0),
		]);
		genExcelFile([header, ...rows], `TraCuu_${maHocKy}_${idSoVanBang}.xlsx`, 'ChiTietTraCuu');
	};

	return (
		<Modal
			title={`Chi tiết lượt tra cứu`}
			visible={visible}
			onCancel={onClose}
			width={900}
			footer={[
				<Button key='export' type='primary' onClick={handleExport} disabled={!data.length}>
					Xuất dữ liệu
				</Button>,
				<Button key='close' onClick={onClose}>
					Đóng
				</Button>,
			]}
		>
			<div style={{ marginBottom: 16, fontWeight: 600, fontSize: 16 }}>
				Sổ văn bằng: {ten?.ten || <span style={{ fontWeight: 400, color: '#888' }}>(Chưa có tên)</span>}
			</div>
			<Table<ChiTietTraCuu>
				rowKey='soQuyetDinh'
				dataSource={data}
				columns={columns}
				loading={loading}
				pagination={false}
			/>
		</Modal>
	);
};

export default ModalTongLuotTraCuu;
