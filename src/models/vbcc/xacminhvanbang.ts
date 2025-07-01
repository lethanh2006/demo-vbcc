import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInt = useInitModel<XacMinhVanBang.IRecord>('xac-minh-van-bang');

	return {
		...objInt,
	};
};
