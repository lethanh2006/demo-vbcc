import type { ETrangThaiDotCapBangTotNghiep } from '../constant';

declare module DotCapBangTotNghiep {
	export interface IRecord {
		_id: string;
		ten: string;
		nam: string;
		ngayBatDau: Date;
		ngayKetThuc: Date;
		trangThai: ETrangThaiDotCapBangTotNghiep;
		nguoiTaoInfo: {};
		nguoiDuyetInfo: {};
		maDonVi: string;
		ghiChu: string;
		createdAt: Date;
		updatedAt: Date;
	}
}
