import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getImportPhuLucVbTemplate(quyetDinhId: string, params?: any) {
	return axios.get(`${ip3}/phu-luc-van-bang-import/import-template/quyet-dinh/${quyetDinhId}`, {
		responseType: 'arraybuffer',
		params,
	});
}

// export async function getImportPhuLucVbTemplate(quyetDinhId: string) {
// 	return axios.get(`${ip3}/phu-luc-van-bang/import-template/quyet-dinh/${quyetDinhId}`, {
// 		responseType: 'arraybuffer',
// 	});
// }

export async function importPhuLucVanBang(payload: { quyetDinhId: string; file: Blob }, params?: any) {
	const form = new FormData();
	form.append('file', payload.file);
	return axios.post(`${ip3}/phu-luc-van-bang-import/import/insert/quyet-dinh/${payload.quyetDinhId}`, form, {
		params,
	});
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

export async function sortPhuLucTam(idQuyetDinh: string, payLoad: any) {
	return axios.post(`${ip3}/phu-luc-van-bang/sort-phu-luc-tam/${idQuyetDinh}`, payLoad);
}

export async function postTrinhKyVanBang(payLoad: any) {
	return axios.post(`${ip3}/phu-luc-van-bang/trinh-ky-van-bang`, payLoad);
}

export const getDanhSachQuyetDinhChuaThemVaoDotCapBang = async (idDotCapBang?: string, nam?: string) => {
	const res = await axios.get(
		`${ip3}/quyet-dinh-dot-cap-bang/danh-sach-quyet-dinh-chua-them-vao-dot-cap-bang/${idDotCapBang}/${nam}`,
	);
	return res.data;
};

export const getQuyetDinhTheoDotCapBang = async (idDotCapBang: string) => {
	const res = await axios.get(`${ip3}/quyet-dinh-dot-cap-bang/danh-sach-quyet-dinh-theo-dot-cap-bang/${idDotCapBang}`);
	return res.data;
};

export async function themQuyetDinhVaoDotCapBang(idDotCapBang: string, idQuyetDinh: string[]) {
	return axios.post(`${ip3}/quyet-dinh-dot-cap-bang/them-quyet-dinh-vao-dot-cap-bang/${idDotCapBang}`, {
		idQuyetDinh,
	});
}

export async function loaiBoQuyetDinhKhoiDotCapBang(idDotCapBang: string, idQuyetDinh: string[]) {
	return axios.delete(`${ip3}/quyet-dinh-dot-cap-bang/xoa-quyet-dinh-khoi-dot-cap-bang/${idDotCapBang}`, {
		data: { idQuyetDinh },
	});
}

export async function getPhuLucCapBang(idDotCapBang: string) {
	const res = await axios.get(`${ip3}/phu-luc-van-bang/phu-luc-cap-bang/${idDotCapBang}`);
	return res.data;
}

export const importPhuLucVanBangCapBang = (row: any) =>
	axios
		.post(`${ip3}/phu-luc-van-bang-import-cap-bang/import/insert`, {
			rows: [row],
			mode: 'UPDATE',
		})
		.then((res) => res.data);

export async function getImportPhuLucCapBangTemplate(idDotCapBang: string) {
	return axios.get(`${ip3}/phu-luc-van-bang-import-cap-bang/import-xlsx-template-by-dot/${idDotCapBang}`, {
		responseType: 'arraybuffer',
	});
}

export async function getExportDanhSachPhuLuc(idDotCapBang: string) {
	return axios.get(`${ip3}/phu-luc-van-bang/export-phu-luc/dot-cap-bang/${idDotCapBang}`, {
		responseType: 'arraybuffer',
	});
}

export async function yeuCauCapNhatVanBang(idVanBang: string, payLoad: any) {
	return axios.post(`${ip3}/phu-luc-van-bang/${idVanBang}/yeu-cau-cap-nhat`, payLoad);
}
