import useInitModel from '@/hooks/useInitModel';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';

export default () => {
	const objInit = useInitModel<BieuMauPhuLuc.IRecord>('bieu-mau-phu-luc');
	const { getOneModel, record } = objInit;

	const getBieuMauDetailModel = async (maBieuMau: string): Promise<BieuMauPhuLuc.IRecord> => {
		if (record?._id && record?.ma === maBieuMau) return record;
		else return getOneModel({ ma: maBieuMau });
	};

	return {
		...objInit,
		getBieuMauDetailModel,
	};
};
