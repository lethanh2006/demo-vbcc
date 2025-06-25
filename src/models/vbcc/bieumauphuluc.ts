import { ShowAllVanBang } from '@/hooks/useCheckAccess';
import useInitModel from '@/hooks/useInitModel';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';

export default () => {
	const showAllVanBang = ShowAllVanBang();

	const objInit = useInitModel<BieuMauPhuLuc.IRecord>(showAllVanBang ? 'bieu-mau-phu-luc' : 'bieu-mau-phu-luc/don-vi');
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
