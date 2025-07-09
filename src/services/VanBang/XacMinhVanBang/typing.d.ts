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
	}

	export interface ISetting {
		_id: string;
		bieuMauId: string | null;
	}
}
