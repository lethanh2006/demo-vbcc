import useCheckAccess from '@/hooks/useCheckAccess';
import { unitName } from '@/services/base/constant';
import { Card } from 'antd';
import TongHopVanBang from '../VanBang/TongHop';
import './components/style.less';

const TrangChu = () => {
	const accessTrangChu = useCheckAccess('van-bang-chung-chi|trang-chu');

	if (accessTrangChu) {
		return <TongHopVanBang />;
	}

	return (
		<Card styles={{ body: { height: '100%' } }} variant='borderless'>
			<div className='home-welcome'>
				<h1 className='title'>PHÂN HỆ VĂN BẰNG CHỨNG CHỈ</h1>
				<h2 className='sub-title'>HỆ THỐNG CHUYỂN ĐỔI SỐ - {unitName.toUpperCase()}</h2>
			</div>
		</Card>
	);
};

export default TrangChu;
