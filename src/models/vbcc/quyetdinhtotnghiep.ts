import useInitModel from '@/hooks/useInitModel';
import { ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import { trinhLanhDao, xuLyDuThao } from '@/services/VanBang/QuyetDinh';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	// const quanTri = useCheckAccess('van-bang-chung-chi|quan-tri-vien');
	// const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>(quanTri ? 'quyet-dinh' : 'quyet-dinh/don-vi');
	const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>('quyet-dinh');
	const [dsAllQuyeDinh, setDsAllQuyetDinh] = useState<QuyetDinhTotNghiep.IRecord[]>([]);
	const { formSubmiting, setFormSubmiting } = objInit;

	const trinhLanhDaoModel = async (idQuyetDinh: string, getData?: () => void): Promise<QuyetDinhTotNghiep.IRecord> => {
		if (formSubmiting) return Promise.reject('form submitting');
		setFormSubmiting(true);
		try {
			const response = await trinhLanhDao(idQuyetDinh);
			message.success('Lưu thành công');
			if (getData) getData();
			return response?.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	const xuLyDuThaoModel = async (
		idQuyetDinh: string,
		payLoad: { trangThai: ETrangThaiQuyetDinhTotNghiep; ghiChuChinhSua?: string },
		getData?: () => void,
	): Promise<QuyetDinhTotNghiep.IRecord> => {
		if (formSubmiting) return Promise.reject('form submitting');
		setFormSubmiting(true);
		try {
			const response = await xuLyDuThao(idQuyetDinh, payLoad);
			message.success('Lưu thành công');
			if (getData) getData();
			return response?.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		dsAllQuyeDinh,
		setDsAllQuyetDinh,
		trinhLanhDaoModel,
		xuLyDuThaoModel,
	};
};
