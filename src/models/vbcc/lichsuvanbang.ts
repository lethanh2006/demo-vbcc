import useInitModel from '@/hooks/useInitModel';
import { xuLyYauCauVanBang } from '@/services/VanBang/LichSuVanBang';
import { ETrangThaiYeuCauVanBang } from '@/services/VanBang/LichSuVanBang/constant';
import { LichSuVanBang } from '@/services/VanBang/LichSuVanBang/typing';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<LichSuVanBang.IRecord>('lich-su-van-bang');
	const { formSubmiting, setFormSubmiting } = objInit;

	const xuLyYauCauVanBangModel = async (
		idLichSu: string,
		payload: {
			trangThai: ETrangThaiYeuCauVanBang;
			ghiChu?: string;
			thoiGianXacNhan: any;
		},
		getData?: () => void,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			const res = await xuLyYauCauVanBang(idLichSu, payload);
			message.success('Lưu thành công');
			if (getData) getData();

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		xuLyYauCauVanBangModel,
	};
};
