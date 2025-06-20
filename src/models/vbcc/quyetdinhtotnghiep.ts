import useInitModel from '@/hooks/useInitModel';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';

export default () => {
	const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>('quyet-dinh');

	return {
		...objInit,
	};
};
