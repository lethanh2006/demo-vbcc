declare module HocKy {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		soThuTu: number;
		namHocId: string;
		namHoc?: NamHoc.IRecord;
		// maTrinhDoDaoTao: string;
		// trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		// maHinhThucDaoTao: string;
		// hinhThucDaoTao: HinhThucDaoTao.IRecordCoSo;

		thoiGianBatDau: string;
		soTuan: number;
		isKyChinh: boolean;
		// isToChucDangKyNhuCau: boolean;

		active?: boolean;
		namBatDau?: number;

		//Mở lớp tín chỉ
		soTinChiDangKyHocTuNguyen: number;
		soHocPhanDangKyHocTuNguyen: number;

		//Quy đổi giờ giảng
		daKhoiTaoQuyDoiGioGiangDay: boolean;

		daChotLopHocPhan?: boolean;
		/** Check đánh giá giảng viên trước khi cho sinh viên xem điểm? */
		danhGiaGvXemDiem?: boolean;

		kyHienTai?: boolean;
	}
}
