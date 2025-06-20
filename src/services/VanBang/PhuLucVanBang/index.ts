import axios from '@/utils/axios';
import { ipVanBang } from '@/utils/ip';

export async function getImportPhuLucVbTemplate(quyetDinhId: string) {
	return axios.get(`${ipVanBang}/phu-luc-van-bang/import-template/quyet-dinh/${quyetDinhId}`, {
		responseType: 'arraybuffer',
	});
}

export async function importPhuLucVanBang(payload: { quyetDinhId: string; file: Blob }) {
	const form = new FormData();
	form.append('file', payload.file);
	return axios.post(`${ipVanBang}/phu-luc-van-bang/import/insert/quyet-dinh/${payload.quyetDinhId}`, form);
}

export async function putUpdateIpfs(idQuyetDinh: string, update: any[]) {
	return axios.put(`${ipVanBang}/phu-luc-van-bang/ipfs`, {
		idQuyetDinh,
		update,
	});
}

export const getThongKeTong = (maHocKy: string) => {
	return axios.get(`${ipVanBang}/phu-luc-van-bang/thong-ke-tong`, {
		params: maHocKy && {
			maHocKy: maHocKy,
		},
	});
};

export async function traCuuPhuLucVanBan(payLoad: any) {
	return axios.post(`${ipVanBang}/phu-luc-van-bang/public/tra-cuu-phu-luc-van-bang`, payLoad);
}

export const exportData = (
	payload: { listIdVanBang: string[]; quyetDinhId?: string; ngay: string; thang: string; nam: string },
	params: { idMau?: string },
) => {
	return axios.post(`${ipVanBang}/phu-luc-van-bang/exports-by-list-id`, payload, {
		params,
		responseType: 'arraybuffer',
	});
};

export async function updBlockchain(payLoad: any) {
	return axios.post(`${ipVanBang}/phu-luc-van-bang/create-blockchain/list-id-van-bang`, payLoad);
}
