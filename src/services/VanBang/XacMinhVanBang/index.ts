import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export const getXacMinhSetting = async () => {
	return axios.get(`${ip3}/xac-minh-van-bang/setting`);
};

export const thongKeXacMinhVanBang = async () => {
	return axios.get(`${ip3}/xac-minh-van-bang/thong-ke`);
};

export const nextStepXacMinh = async (xacMinhId: string, payLoad: any) => {
	return axios.put(`${ip3}/xac-minh-van-bang/${xacMinhId}/next-step`, payLoad);
};

export const exportXacMinhVanBang = async (xacMinhId: string, payLoad: any) => {
	return axios.post(`${ip3}/xac-minh-van-bang/${xacMinhId}/export`, payLoad, {
		responseType: 'arraybuffer',
	});
};

export async function exportPhieuPhucDap(idSVXacMinh: string) {
	return axios.get(`${ip3}/sinh-vien-xac-minh-van-bang/${idSVXacMinh}/export/phieu-phuc-dap`, {
		responseType: 'arraybuffer',
	});
}

export async function exportManyPhieuPhucDap(payLoad: any) {
	return axios.post(`${ip3}/sinh-vien-xac-minh-van-bang/export/phieu-phuc-dap/many`, payLoad, {
		responseType: 'arraybuffer',
	});
}
