import useInitModel from '@/hooks/useInitModel';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import { useState } from 'react';

export default () => {
	// const quanTri = useCheckAccess('van-bang-chung-chi|quan-tri-vien');
	// const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>(quanTri ? 'quyet-dinh' : 'quyet-dinh/don-vi');
	const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>('quyet-dinh');
	const [dsAllQuyeDinh, setDsAllQuyetDinh] = useState<QuyetDinhTotNghiep.IRecord[]>([]);

	return {
		...objInit,
		dsAllQuyeDinh,
		setDsAllQuyetDinh,
	};
};
