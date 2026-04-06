import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function postYeuCauHuyBieuMau(payload: any) {
	return axios.post(`${ip3}/bieu-mau-phoi-bang/huy`, payload);
}

export async function postYeuCauCapMoi(payload: any) {
	return axios.post(`${ip3}/bieu-mau-phoi-bang/nhap`, payload);
}
