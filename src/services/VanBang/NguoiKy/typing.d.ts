import type { EGioiTinh } from '@/services/SinhVien/constant';

declare module NguoiKyVanBang {
	export interface IRecord {
		_id: string;
		hoTen: string;
		// hoDem: string;
		// ten: string;
		// ngaySinh: string;
		// gioiTinh: EGioiTinh;
		chucVu: string;
		email: string;
		soDienThoai: string;
		certIpfs: string;
		// idTenant: string;

		createdAt: string;
		updatedAt: string;
	}
}
