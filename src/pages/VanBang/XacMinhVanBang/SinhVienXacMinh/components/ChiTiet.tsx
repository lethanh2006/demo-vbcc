import { Descriptions } from 'antd';
import { useModel } from 'umi';

const ChiTietSinhVienXacMinh = () => {
	const { record } = useModel('vbcc.sinhvienxacminh');

	return (
		<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}>
			<Descriptions.Item label='Mã sinh viên'>{record?.maSinhVien ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='Họ tên'>{record?.hoTen ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='Số hiệu văn bằng'>{record?.soHieuVanBang ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='Số vào sổ'>{record?.soVaoSo ?? '--'}</Descriptions.Item>

			<Descriptions.Item label='File yêu cầu'>
				{record?.urlYeuCau ? (
					<a href={record?.urlYeuCau} target='_blank' rel='noreferrer'>
						Xem file
					</a>
				) : (
					'--'
				)}
			</Descriptions.Item>

			<Descriptions.Item label='File phản hồi'>
				{record?.urlPhanHoi ? (
					<a href={record?.urlPhanHoi} target='_blank' rel='noreferrer'>
						Xem file
					</a>
				) : (
					'--'
				)}
			</Descriptions.Item>

			<Descriptions.Item label='Ghi chú kết quả phúc đáp' span={2}>
				{record?.ghiChuKetQuaPhucDap ?? '--'}
			</Descriptions.Item>

			<Descriptions.Item label='Ghi chú' span={2}>
				{record?.ghiChu ?? '--'}
			</Descriptions.Item>
		</Descriptions>
	);
};

export default ChiTietSinhVienXacMinh;
