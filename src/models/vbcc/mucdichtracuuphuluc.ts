import useInitModel from '@/hooks/useInitModel';

const initSort = {
	soThuTu: 1 as 1 | -1, // Sắp xếp tăng dần theo trường 'soThuTu'
};

export default () => {
	const objInit = useInitModel<MucDichTraCuuPhuLuc.IRecord>('muc-dich-tra-cuu-phu-luc', undefined, initSort);

	return {
		...objInit,
	};
};
