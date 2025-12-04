import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function exportXacMinhVanBang(idVanBang: string, bieuMauId?: string) {
	const url = `${ip3}/xac-minh-van-bang/${idVanBang}/export`;
	return axios.get(url, {
		params: bieuMauId ? { bieuMauId } : {},
		responseType: 'arraybuffer',
	});
}

export const getXacMinhSetting = async () => {
	return axios.get(`${ip3}/xac-minh-van-bang/setting`);
};

export const thongKeXacMinhVanBang = async () => {
	return axios.get(`${ip3}/xac-minh-van-bang/thong-ke`);
};

export const nextStepXacMinh = async (xacMinhId: string, payLoad: any) => {
	return axios.put(`${ip3}/xac-minh-van-bang/${xacMinhId}/next-step`, payLoad);
};

export async function exportPhieuPhucDap(idSVXacMinh: string) {
	return axios.get(`${ip3}/sinh-vien-xac-minh-van-bang/${idSVXacMinh}/export/phieu-phuc-dap`, {
		responseType: 'arraybuffer',
	});
}
