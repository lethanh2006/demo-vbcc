import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DotCapBangTotNghiep.IRecord>('dot-cap-bang');

	return {
		...objInit,
	};
};
