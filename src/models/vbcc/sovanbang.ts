import useInitModel from '@/hooks/useInitModel';
import { duyetSoVanBang } from '@/services/VanBang/SoVanBang';
import type { SoVanBang } from '@/services/VanBang/SoVanBang/typing';
import { message } from 'antd';

export default () => {
	const objInt = useInitModel<SoVanBang.IRecord>('so-van-bang');
	const { formSubmiting, setFormSubmiting } = objInt;

	const duyetModel = async (soVanBangId: string, getData: () => void): Promise<SoVanBang.IRecord> => {
		if (formSubmiting) return Promise.reject('form submitting');
		setFormSubmiting(true);
		try {
			const response = await duyetSoVanBang(soVanBangId);
			if (getData) getData();
			message.success('Duyệt thành công');
			return response?.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInt,
		duyetModel,
	};
};
