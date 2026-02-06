import { LichSuVanBang } from '@/services/VanBang/LichSuVanBang/typing';
import { Descriptions, Empty } from 'antd';
import dayjs from 'dayjs';
import { useIntl } from 'umi';

const ViewCapMoiPhuLuc = (props: { data?: LichSuVanBang.IRecord }) => {
	const intl = useIntl();
	const { data } = props;

	if (!data) {
		return <Empty description={intl.formatMessage({ id: 'xulydexuat.capmoi.empty' })} />;
	}

	return (
		<>
			<Descriptions column={2}>
				<Descriptions.Item label={intl.formatMessage({ id: 'xulydexuat.capmoi.label.hoten' })}>
					{data.nguoiKy.hoTen ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xulydexuat.capmoi.label.macanbo' })}>
					{data.nguoiKy.maCanBo ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xulydexuat.capmoi.label.thoigiancapphat' })}>
					{data.thoiGianXacNhan ? dayjs(data.thoiGianXacNhan).format('DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xulydexuat.capmoi.label.ghichu' })}>
					{data.ghiChu || '--'}
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default ViewCapMoiPhuLuc;
