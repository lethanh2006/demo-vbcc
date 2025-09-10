import useInitModel from '@/hooks/useInitModel';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>('quyet-dinh');
	const [dsAllQuyeDinh, setDsAllQuyetDinh] = useState<QuyetDinhTotNghiep.IRecord[]>([]);

	return {
		...objInit,
		dsAllQuyeDinh,
		setDsAllQuyetDinh,
	};
};
