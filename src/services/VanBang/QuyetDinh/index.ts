import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function trinhLanhDao(idQuyetDinh: string) {
	return axios.put(`${ip3}/quyet-dinh/${idQuyetDinh}/trinh-lanh-dao`);
}

export async function xuLyDuThao(idQuyetDinh: string, payLoad: any) {
	return axios.put(`${ip3}/quyet-dinh/${idQuyetDinh}/xu-ly-du-thao`, payLoad);
}
