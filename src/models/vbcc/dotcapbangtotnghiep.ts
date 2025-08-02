import useInitModel from '@/hooks/useInitModel';
import type { DotCapBangTotNghiep } from '@/services/VanBang/DotCapBangTotNghiep/typing';

export default () => {
	const objInit = useInitModel<DotCapBangTotNghiep.IRecord>('dot-cap-bang');

	return {
		...objInit,
	};
};
