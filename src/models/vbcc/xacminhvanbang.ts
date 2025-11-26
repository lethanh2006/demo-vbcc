import useInitModel from '@/hooks/useInitModel';
import { thongKeXacMinhVanBang } from '@/services/VanBang/XacMinhVanBang';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import { useState } from 'react';

export default () => {
	const objInt = useInitModel<XacMinhVanBang.IRecord>('xac-minh-van-bang');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [thongKe, setThongKe] = useState<XacMinhVanBang.IThongKeXacMinhVanBang>();

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

	return {
		...objInt,
		thongKe,
		loadingThongKe,
		thongKeXacMinhVanBangModel,
	};
};
