import type { ETrangThaiMucDichTraCuuPhuLuc } from '../constant';

declare module MucDichTraCuuPhuLuc {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		soThuTu: number;
		moTa: string;
		soLuongChon: number;
		maDonVi: string;
		active: boolean;
		trangThaiDuyet: ETrangThaiMucDichTraCuuPhuLuc;
	}
}
