import dayjs from '@/utils/dayjs';
import { Descriptions } from 'antd';
import { useIntl, useModel } from 'umi';

const ChiTietSinhVienXacMinh = () => {
	const intl = useIntl();
	const { record } = useModel('vbcc.sinhvienxacminh');

	return (
		<Descriptions
			column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			className='highlight'
			layout='vertical'
			colon={false}
		>
			<Descriptions.Item label={intl.formatMessage({ id: 'xacminhvanbang.chitiet.label.manguoihoc' })}>
				{record?.maSinhVien ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'xacminhvanbang.chitiet.label.hoten' })}>
				{record?.hoTen ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'xacminhvanbang.chitiet.label.ngaysinh' })}>
				{record?.ngaySinh ? dayjs(record?.ngaySinh).format('DD/MM/YYYY') : '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'xacminhvanbang.chitiet.label.xeploai' })}>
				{record?.xepLoai ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'xacminhvanbang.chitiet.label.sohieuvanbang' })}>
				{record?.soHieuVanBang ?? '--'}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'xacminhvanbang.chitiet.label.sovaoso' })}>
				{record?.soVaoSo ?? '--'}
			</Descriptions.Item>
		</Descriptions>
	);
};

export default ChiTietSinhVienXacMinh;
