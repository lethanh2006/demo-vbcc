import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<HinhThucDaoTao.IRecordCoSo>('hinh-thuc-dao-tao');

	return {
		...objInit,
	};
};
