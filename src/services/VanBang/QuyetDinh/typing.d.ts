import type { BieuMauPhuLuc } from '../BieuMauPhuLuc/typing';

declare module QuyetDinhTotNghiep {
	export interface IRecord {
		_id: string;
		maHocKy: string;
		soQuyetDinh: string;
		maBieuMau: string;
		bieuMau?: BieuMauPhuLuc.IRecord;

		dotCapBangId?: string | null;
		dotCapBang?: DotCapBangTotNghiep.IRecord;

		ngayBanHanh: string;
		kichHoat: boolean;
		noiDung?: string;
		url?: string | null;

		updatedAt?: string;
		createdAt?: string;
	}
}
