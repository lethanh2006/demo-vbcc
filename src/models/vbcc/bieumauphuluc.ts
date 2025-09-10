import useInitModel from '@/hooks/useInitModel';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';

export default () => {
	// const quanTri = useCheckAccess('van-bang-chung-chi|quan-tri-vien');
	// const objInit = useInitModel<BieuMauPhuLuc.IRecord>(quanTri ? 'bieu-mau-phu-luc' : 'bieu-mau-phu-luc/don-vi');
	const objInit = useInitModel<BieuMauPhuLuc.IRecord>('bieu-mau-phu-luc');
	const { getOneModel, record } = objInit;

	const getBieuMauDetailModel = async (maBieuMau: string): Promise<BieuMauPhuLuc.IRecord> => {
		if (record?._id && record?.ma === maBieuMau) return record;
		return getOneModel({ ma: maBieuMau });
	};

	return {
		...objInit,
		getBieuMauDetailModel,
	};
};
