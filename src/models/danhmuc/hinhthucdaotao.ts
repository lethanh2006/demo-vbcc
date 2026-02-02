import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<HinhThucDaoTao.IRecord>('hinh-thuc-dao-tao');

	return {
		...objInit,
	};
};
