import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<TrinhDoDaoTao.IRecordCoSo>('trinh-do-dao-tao');

	return {
		...objInit,
	};
};
