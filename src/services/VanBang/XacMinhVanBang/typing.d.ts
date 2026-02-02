import { ELoaiPhucDap, EPhaseXacMinh } from '../constant';

declare module XacMinhVanBang {
	export interface IRecord {
		_id: string;
		nguoiYeuCau: string;
		tenDonVi: string;
		soDienThoai: string;
		email: string;
		ngayGuiYeuCau: Date;
		mucDichXacMinh: string;
		daPhanHoi: boolean;
		loaiPhucDap: ELoaiPhucDap;
		soCongVan: string;
		phaseXuLy: EPhaseXacMinh;
		ghiChu: string;
		urlFilePhucDapChung: string[] | null;

		danhSachVanBanXacMinh: ISinhVienXacMinh[];
	}

	export interface ISinhVienXacMinh {
		_id: string;
		coThongTin: boolean;
		maSinhVien: string;
		hoTen: string;
		ngaySinh: string;
		xepLoai: string;
		soHieuVanBang: string;
		soVaoSo: string;
		phuLucId: string | null;
		urlYeuCau: string | null;
		urlPhanHoi: string | null;
		ghiChuKetQuaPhucDap: string;
		ghiChu: string;
		yeuCauXacMinhVanBangId: string;
		yeuCauXacMinhVanBang: IRecord;
	}

	export interface IThongKeXacMinhVanBang {
		choXuLy: number;
		dangXacMinh: number;
		traKetQua: number;
	}

	export interface ISetting {
		_id: string;
		bieuMauId: any;
	}

	export interface IThongKeXacMinhVanBangNam {
		phaseXuLy: EPhaseXacMinh;
		soLuong: number;
	}
}
