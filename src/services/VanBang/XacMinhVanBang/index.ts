import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export const exportXacMinhVanBang = async (idVanBang: string, bieuMauId?: string) => {
	return axios.get(`${ip3}/xac-minh-van-bang/${idVanBang}/export${bieuMauId ? `?bieuMauId=${bieuMauId}` : ''}`, {
		responseType: 'arraybuffer',
	});
};

export const getXacMinhSetting = async () => {
	return axios.get(`${ip3}/xac-minh-van-bang/setting`);
};
