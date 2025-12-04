import useInitModel from '@/hooks/useInitModel';
import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { nextStepXacMinh, thongKeXacMinhVanBang } from '@/services/VanBang/XacMinhVanBang';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInt = useInitModel<XacMinhVanBang.IRecord>('xac-minh-van-bang');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [thongKe, setThongKe] = useState<XacMinhVanBang.IThongKeXacMinhVanBang>();
	const { formSubmiting, setFormSubmiting } = objInt;

	const thongKeXacMinhVanBangModel = async () => {
		setLoadingThongKe(true);

		try {
			const res = await thongKeXacMinhVanBang();

			setThongKe(res?.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const nextStepXacMinhModel = async (
		xacMinhId: string,
		payLoad: {
			ghiChu?: string;
			phaseXuLy: EPhaseXacMinh;
		},
		getData?: () => void,
	): Promise<XacMinhVanBang.IRecord> => {
		if (formSubmiting) return Promise.reject('form submitting');
		setFormSubmiting(true);
		try {
			const response = await nextStepXacMinh(xacMinhId, payLoad);
			message.success('Chuyển thành công');
			if (getData) getData();
			return response?.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInt,
		thongKe,
		loadingThongKe,
		thongKeXacMinhVanBangModel,
		nextStepXacMinhModel,
	};
};
