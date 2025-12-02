import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function xuLyYauCauVanBang(idLichSu: string, payLoad: any) {
	return axios.put(`${ip3}/lich-su-van-bang/${idLichSu}/lanh-dao/xac-nhan`, payLoad);
}
