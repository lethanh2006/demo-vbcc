import useInitModel from '@/hooks/useInitModel';
import { ip3 } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DotCapBangTotNghiep.IRecord>('dot-cap-bang', undefined, undefined, ip3);

	return {
		...objInit,
	};
};
