import { ELoaiPhucDap, ETrangThaiXacMinh } from '../constant';

declare module XacMinhVanBang {
	export interface IRecord {
		// thông tin yêu cầu
		_id: number;
		nguoiYeuCau: string;
		tenDonVi: string;
		soDienThoai: string;
		email: string;
		ngayGuiYeuCau: Date;
		mucDichXacMinh: string;

		// thông tin phản hồi
		daPhanHoi: boolean;
		coThongTin: boolean;

		// thông tin sinh viên
		maSinhVien: string;
		hoTen: string;
		soHieuVanBang: string;
		soVaoSo: string;

		idVanBang: string;
		phuLucId: string;
		urlYeuCau: string;
		urlPhanHoi: string;

		filePhucDap: string | null;
		loaiPhucDap: ELoaiPhucDap;
		noiDungPhucDap: string;
		trangThaiXacMinh: ETrangThaiXacMinh;
		nguoiTao: {
			ssoId: string;
			hoTen: string;
			thoiGian: Date;
		};
		nguoiXuLy: {
			ssoId: string;
			hoTen: string;
			thoiGian: Date;
		};
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
