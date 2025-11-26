import type { ELoaiQuyetDinh } from '@/services/DaoTao/constant';
import type { BieuMauPhuLuc } from '../BieuMauPhuLuc/typing';
import type { SoVanBang } from '../SoVanBang/typing';
import { ETrangThaiQuyetDinhTotNghiep } from '../constant';

declare module QuyetDinhTotNghiep {
	export interface IRecord {
		_id: string;
		nam: string; //Năm hành chính
		soQuyetDinh: string;
		maHocKy: string;
		noiDung: string;
		idSoVanBang: string;
		soVanBang: SoVanBang.IRecord;
		maBieuMau: string;
		bieuMau: BieuMauPhuLuc.IRecord;
		ngayBanHanh: string | null;
		loai: ELoaiQuyetDinh;
		url: string | null;
		kichHoat: string;
		softDeleted: string;
		soLuotTraCuu: string;
		idFileMau: string;
		maDonVi: string;

		soVaoSoHienTai: number;
		ruleSortPhuLuc: string[];
		ghiChuChinhSua: string;
		trangThai: ETrangThaiQuyetDinhTotNghiep;
		thoiGianGui: string;
		nguoiTao: {
			ssoId: string;
			hoTen: string;
			thoiGian: date;
		};
		nguoiXuLy: {
			ssoId: string;
			hoTen: string;
			thoiGian: date;
		};

		dotCapBangId: string | null;
	}
}
