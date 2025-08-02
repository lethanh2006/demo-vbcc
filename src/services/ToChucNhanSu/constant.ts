export enum ETrangThaiChinhSuaNhanSu {
	BAN_NHAP = 'Bản nháp',
	BAN_NHAP_CHUYEN_VIEN = 'Bản nháp chuyên viên',
	CHO_XU_LY = 'Chờ xử lý',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
	DUYET_DANG_AP_DUNG = 'Duyệt - đang áp dụng',
}

export enum ELoaiHoSo {
	CAN_BO = 'Cán bộ',
	THINH_GIANG = 'Thỉnh giảng',
	KHAC = 'Khác',
}

export enum ETrangThaiNhanSu {
	DANG_LAM_VIEC = 'Đang làm việc',
	DA_CHUYEN_DI = 'Đã chuyển đi',
	DA_DIEU_DONG = 'Đã điều động',
	CHO_NGHI_HUU = 'Chờ nghỉ hưu',
	DA_NGHI_HUU = 'Đã nghỉ hưu',
	DA_BIET_PHAI = 'Đã biệt phái',
	CHUYEN_DEN = 'Chuyển đến',
	THOI_VIEC = 'Thôi việc',
	DANG_DI_HOC = 'Đang đi học',
	KHAC = 'Khác',
	NGHI_KHONG_LUONG = 'Nghỉ không lương',
	NGHI_THEO_CHE_DO = 'Nghỉ theo chế độ',
	HET_HAN_HOP_DONG = 'Hết hạn hợp đồng',
}

export const MapColorETrangThaiNhanSu = {
	[ETrangThaiNhanSu.DANG_LAM_VIEC]: 'green',
	[ETrangThaiNhanSu.DA_CHUYEN_DI]: 'orange',
	[ETrangThaiNhanSu.DA_DIEU_DONG]: 'orange',
	[ETrangThaiNhanSu.CHO_NGHI_HUU]: 'orange',
	[ETrangThaiNhanSu.DA_NGHI_HUU]: 'red',
	[ETrangThaiNhanSu.DA_BIET_PHAI]: 'blue',
	[ETrangThaiNhanSu.CHUYEN_DEN]: 'blue',
	[ETrangThaiNhanSu.THOI_VIEC]: 'red',
	[ETrangThaiNhanSu.DANG_DI_HOC]: 'blue',
	[ETrangThaiNhanSu.KHAC]: 'blue',
	[ETrangThaiNhanSu.NGHI_KHONG_LUONG]: 'yellow',
	[ETrangThaiNhanSu.NGHI_THEO_CHE_DO]: 'yellow',
	[ETrangThaiNhanSu.HET_HAN_HOP_DONG]: 'red',
};

export enum EHocVi {
	CU_NHAN = 'Cử nhân',
	KY_SU = 'Kỹ sư',
	DUOC_SI = 'Dược sĩ',
	BAC_SI = 'Bác sĩ',
	THAC_SI = 'Thạc sĩ',
	TIEN_SI = 'Tiến sĩ',
	TIEN_SI_KHOA_HOC = 'Tiến sĩ khoa học',
}

export enum EHocHam {
	GIAO_SU = 'Giáo sư',
	PHO_GIAO_SU = 'Phó giáo sư',
}

export const tenVietTatHocVi: Record<EHocVi, string> = {
	[EHocVi.CU_NHAN]: 'CN',
	[EHocVi.KY_SU]: 'KS',
	[EHocVi.DUOC_SI]: 'DS',
	[EHocVi.BAC_SI]: 'BS',
	[EHocVi.THAC_SI]: 'ThS',
	[EHocVi.TIEN_SI]: 'TS',
	[EHocVi.TIEN_SI_KHOA_HOC]: 'TSKH',
};

export const tenVietTatHocHam: Record<EHocHam, string> = {
	[EHocHam.GIAO_SU]: 'GS',
	[EHocHam.PHO_GIAO_SU]: 'PGS',
};
