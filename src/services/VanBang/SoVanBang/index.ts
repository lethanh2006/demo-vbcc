import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function duyetSoVanBang(soVanBangId: string) {
	return axios.post(`${ip3}/so-van-bang/${soVanBangId}/duyet`);
}
