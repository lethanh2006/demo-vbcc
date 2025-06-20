import useInitModel from '@/hooks/useInitModel';
import type { NguoiKyVanBang } from '@/services/VanBang/NguoiKy/typing';

export default () => {
	const objInit = useInitModel<NguoiKyVanBang.IRecord>('nguoi-ky-van-bang');

	return {
		...objInit,
	};
};
