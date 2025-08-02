import useInitModel from '@/hooks/useInitModel';
import type { MucDichTraCuuPhuLuc } from '@/services/VanBang/MucDichTraCuuPhuLuc/typing';

export default () => {
	const objInit = useInitModel<MucDichTraCuuPhuLuc.IRecord>('muc-dich-tra-cuu-phu-luc');

	return {
		...objInit,
	};
};
