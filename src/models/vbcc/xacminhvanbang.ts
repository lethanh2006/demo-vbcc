import useInitModel from '@/hooks/useInitModel';
import { ip3 } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<XacMinhVanBang.IRecord>('xac-minh-van-bang', undefined, undefined, ip3);

	return {
		...objInt,
	};
};
