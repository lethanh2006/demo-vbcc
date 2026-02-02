import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<TrinhDoDaoTao.IRecord>('trinh-do-dao-tao');

	return {
		...objInit,
	};
};
