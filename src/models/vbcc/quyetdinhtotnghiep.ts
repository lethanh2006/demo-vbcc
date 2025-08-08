import { ShowAllVanBang } from '@/hooks/useCheckAccess';
import useInitModel from '@/hooks/useInitModel';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import { useState } from 'react';

export default () => {
	const showAllVanBang = ShowAllVanBang();

	const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>(showAllVanBang ? 'quyet-dinh' : 'quyet-dinh/don-vi');
	const [dsAllQuyeDinh, setDsAllQuyetDinh] = useState<QuyetDinhTotNghiep.IRecord[]>([]);

	return {
		...objInit,
		dsAllQuyeDinh,
		setDsAllQuyetDinh,
	};
};
