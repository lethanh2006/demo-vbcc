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
		phaseXuLy: EPhaseXacMinh;
		ghiChu: string;

		danhSachVanBanXacMinh: ISinhVienXacMinh[];
	}

	export interface ISinhVienXacMinh {
		_id: string;
		coThongTin: boolean;
		maSinhVien: string;
		hoTen: string;
		soHieuVanBang: string;
		soVaoSo: string;
		phuLucId: string;
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
		bieuMauId: string | null;
	}
}
