import dayjs from '@/utils/dayjs';
import { Descriptions } from 'antd';
import { useModel } from 'umi';

const ChiTietSinhVienXacMinh = () => {
	const { record } = useModel('vbcc.sinhvienxacminh');

	return (
		<Descriptions
			column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			className='highlight'
			layout='vertical'
			colon={false}
		>
			<Descriptions.Item label='Mã người học'>{record?.maSinhVien ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Họ tên'>{record?.hoTen ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Ngày sinh'>
				{record?.ngaySinh ? dayjs(record?.ngaySinh).format('DD/MM/YYYY') : '--'}
			</Descriptions.Item>
			<Descriptions.Item label='Xếp loại'>{record?.xepLoai ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Số hiệu văn bằng'>{record?.soHieuVanBang ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Số vào sổ'>{record?.soVaoSo ?? '--'}</Descriptions.Item>
		</Descriptions>
	);
};

export default ChiTietSinhVienXacMinh;
