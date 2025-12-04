import useInitModel from '@/hooks/useInitModel';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';

export default () => {
	const objInit = useInitModel<XacMinhVanBang.ISinhVienXacMinh>('sinh-vien-xac-minh-van-bang');

	return {
		...objInit,
	};
};
