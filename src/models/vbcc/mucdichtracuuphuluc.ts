import useInitModel from '@/hooks/useInitModel';
import { ip3 } from '@/utils/ip';

const initSort = {
	soThuTu: 1 as 1 | -1, // Sắp xếp tăng dần theo trường 'soThuTu'
};

export default () => {
	const objInit = useInitModel<MucDichTraCuuPhuLuc.IRecord>(
		'muc-dich-tra-cuu-phu-luc',
		undefined,
		undefined,
		ip3,
		initSort,
	);

	return {
		...objInit,
	};
};
