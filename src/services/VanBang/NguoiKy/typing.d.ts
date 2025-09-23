import type { ELoaiChuKy } from '../constant';

declare module NguoiKyVanBang {
	export interface IRecord {
		_id: string;
		ssoId: string;
		hoTen: string;
		// hoDem: string;
		// ten: string;
		// ngaySinh: string;
		// gioiTinh: EGioiTinh;
		chucVu: string;
		email: string;
		soDienThoai: string;
		certIpfs: any;
		// idTenant: string;

		x: number;
		y: number;
		w: number;
		h: number;

		loaiChuKy: ELoaiChuKy;

		createdAt: string;
		updatedAt: string;
	}
}
