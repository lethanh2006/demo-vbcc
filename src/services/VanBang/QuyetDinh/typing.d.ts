import type { ELoaiQuyetDinh } from '@/services/DaoTao/constant';
import type { BieuMauPhuLuc } from '../BieuMauPhuLuc/typing';
import type { SoVanBang } from '../SoVanBang/typing';

declare module QuyetDinhTotNghiep {
	export interface IRecord {
		_id: string;
		soQuyetDinh: string;
		maHocKy: string;
		noiDung: string;
		soVanBangId: string;
		soVanBang: SoVanBang.IRecord;
		maBieuMau: string;
		bieuMau: BieuMauPhuLuc.IRecord;
		ngayBanHanh: string;
		loai: ELoaiQuyetDinh;
		url: string | null;
		kichHoat: string;
		softDeleted: string;
		soLuotTraCuu: string;
		idFileMau: string;
		maDonVi: string;
		idSoVanBang: string;
		dotCapBangId: string | null;
	}
}
