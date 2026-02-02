import { LichSuVanBang } from '@/services/VanBang/LichSuVanBang/typing';
import { Descriptions, Empty } from 'antd';
import dayjs from 'dayjs';

const ViewCapMoiPhuLuc = (props: { data?: LichSuVanBang.IRecord }) => {
	const { data } = props;

	if (!data) {
		return <Empty description='Không có dữ liệu' />;
	}

	return (
		<>
			<Descriptions column={2}>
				<Descriptions.Item label='Họ tên'>{data.nguoiKy.hoTen ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã cán bộ'>{data.nguoiKy.maCanBo ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Thời gian cấp phát'>
					{data.thoiGianXacNhan ? dayjs(data.thoiGianXacNhan).format('DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Ghi chú'>{data.ghiChu || '--'}</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default ViewCapMoiPhuLuc;
