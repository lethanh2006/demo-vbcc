import useCheckAccess from '@/hooks/useCheckAccess';
import { unitName } from '@/services/base/constant';
import { Card } from 'antd';
import { useIntl } from 'umi';
import TongHopVanBang from '../VanBang/TongHop';
import './components/style.less';

const TrangChu = () => {
	const intl = useIntl();
	const accessTrangChu = useCheckAccess('van-bang-chung-chi|trang-chu');

	if (accessTrangChu) {
		return <TongHopVanBang />;
	}

	return (
		<Card styles={{ body: { height: '100%' } }} variant='borderless'>
			<div className='home-welcome'>
				<h1 className='title'>{intl.formatMessage({ id: 'pages.trangchu.title' })}</h1>
				<h2 className='sub-title'>
					{intl.formatMessage({ id: 'pages.trangchu.subtitle' })} - {intl.formatMessage({ id: unitName }).toUpperCase()}
				</h2>
			</div>
		</Card>
	);
};

export default TrangChu;
