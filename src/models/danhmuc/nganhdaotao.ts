import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<NganhDaoTao.IRecord>('nganh');

	return {
		...objInit,
	};
};
