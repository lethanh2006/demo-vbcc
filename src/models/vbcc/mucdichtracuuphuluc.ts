import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<MucDichTraCuuPhuLuc.IRecord>('muc-dich-tra-cuu-phu-luc', undefined, { soThuTu: 1 });

	return {
		...objInit,
	};
};
