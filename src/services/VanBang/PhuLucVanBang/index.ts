import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getImportPhuLucVbTemplate(quyetDinhId: string) {
	return axios.get(`${ip3}/phu-luc-van-bang-import/import-template/quyet-dinh/${quyetDinhId}`, {
		responseType: 'arraybuffer',
	});
}

// export async function getImportPhuLucVbTemplate(quyetDinhId: string) {
// 	return axios.get(`${ip3}/phu-luc-van-bang/import-template/quyet-dinh/${quyetDinhId}`, {
// 		responseType: 'arraybuffer',
// 	});
// }

export async function importPhuLucVanBang(payload: { quyetDinhId: string; file: Blob }) {
	const form = new FormData();
	form.append('file', payload.file);
	return axios.post(`${ip3}/phu-luc-van-bang-import/import/insert/quyet-dinh/${payload.quyetDinhId}`, form);
}

export async function putUpdateIpfs(idQuyetDinh: string, update: any[]) {
	return axios.put(`${ip3}/phu-luc-van-bang/ipfs`, {
		idQuyetDinh,
		update,
	});
}

export const getThongKeTong = (nam: string, idSoVanBang: string, isDonVi: boolean) => {
	return axios.get(`${ip3}/phu-luc-van-bang/thong-ke-tong${isDonVi ? '/don-vi' : ''}`, {
		params: { nam, idSoVanBang },
	});
};

export const getChiTietLuotTraCuu = (maHocKy: string, idSoVanBang: string) => {
	return axios.get(`${ip3}/phu-luc-van-bang/chi-tiet-luot-tra-cuu`, {
		params: { maHocKy, idSoVanBang },
	});
};

export async function traCuuPhuLucVanBanPublic(payLoad: any) {
	return axios.post(`${ip3}/phu-luc-van-bang/public/tra-cuu-phu-luc-van-bang`, payLoad);
}

export async function chiTietPhuLucVanBanPublic(id: string) {
	return axios.get(`${ip3}/phu-luc-van-bang/public/chi-tiet-phu-luc/${id}`);
}

export const exportData = (payload: {
	idMau: string[];
	listIdVanBang: string[];
	quyetDinhId?: string;
	ngay: string;
	thang: string;
	nam: string;
	mode: 'PDF' | 'DOCX';
}) => {
	return axios.post(`${ip3}/phu-luc-van-bang/exports-by-list-id`, payload, {
		responseType: 'arraybuffer',
	});
};

export async function updBlockchain(payLoad: any) {
	return axios.post(`${ip3}/phu-luc-van-bang/create-blockchain/list-id-van-bang`, payLoad);
}

export async function sinhSoVaoSo(idQuyetDinh: string, payLoad: any) {
	return axios.post(`${ip3}/phu-luc-van-bang/sinh-so-vao-so/${idQuyetDinh}`, payLoad);
}

export async function postTrinhKyVanBang(payLoad: any) {
	return axios.post(`${ip3}/phu-luc-van-bang/trinh-ky-van-bang`, payLoad);
}
