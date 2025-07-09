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
