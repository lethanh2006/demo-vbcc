import { ShowAllVanBang } from '@/hooks/useCheckAccess';
import useInitModel from '@/hooks/useInitModel';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';

export default () => {
	const showAllVanBang = ShowAllVanBang();

	const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>(showAllVanBang ? 'quyet-dinh' : 'quyet-dinh/don-vi');

	return {
		...objInit,
	};
};
