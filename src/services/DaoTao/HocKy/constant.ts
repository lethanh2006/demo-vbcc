export enum ECachTinhDiem {
	TRUNG_BINH = 'Trung bình',
	DAT = 'Đạt/không đạt',
}

export enum ELoaiNhuCauHocPhan {
	KE_HOACH = 'soNhuCauTheoKeHoach',
	HOC_CHAM = 'soNhuCauChamKeHoach',
	HOC_LAI = 'soNhuCauHocLai',
	HOC_CAI_THIEN = 'soNhuCauHocCaiThien',
	CAM_THI = 'soNhuCauCamThi',
}

export const loaiNhuCauHocPhan: Record<ELoaiNhuCauHocPhan, string> = {
	[ELoaiNhuCauHocPhan.KE_HOACH]: 'Đúng tiến trình',
	[ELoaiNhuCauHocPhan.HOC_CHAM]: 'Chậm tiến độ',
	[ELoaiNhuCauHocPhan.HOC_LAI]: 'Học lại',
	[ELoaiNhuCauHocPhan.HOC_CAI_THIEN]: 'Cải thiện',
	[ELoaiNhuCauHocPhan.CAM_THI]: 'Cấm thi kỳ trước',
};

export const ColorLoaiNhuCauHocPhan = ['#007eb9', '#057B85', '#84C318', '#F9E900', '#F6AF65', '#FF6F6F', '#e04ed4'];

// Trong thống kê đợt đăng ký tín chỉ
export const LoaiDangKyTinChi = {
	// nhuCau: 'Theo nhu cầu',
	tienTrinh: 'Theo đúng tiến trình',
	hocVuot: 'Học vượt',
	hocLai: 'Học lại',
	hocCaiThien: 'Học cải thiện',
	chuaTheoTienTrinh: 'Chưa theo tiến trình',
	ngoaiChuongTrinh: 'Ngoài chương trình đào tạo',
};

export enum ELoaiHocPhanDangKyTinChi {
	// NHU_CAU = 'NhuCau',
	TIEN_TRINH = 'TienTrinh',
	HOC_LAI = 'HocLai',
	HOC_VUOT = 'HocVuot',
	CAI_THIEN = 'HocCaiThien',
	// NGANH_2 = 'kyTruoc',
	CHUA_THEO_TIEN_TRINH = 'ChuaTheoTienTrinh',
	HOC_NGOAI = 'NgoaiChuongTrinh',
	// TAT_CA = 'TatCa',
}

export const LoaiHocPhanDangKyTinChi = {
	// [ELoaiHocPhanDangKyTinChi.NHU_CAU]: 'Theo nhu cầu',
	[ELoaiHocPhanDangKyTinChi.TIEN_TRINH]: 'Theo đúng tiến trình',
	[ELoaiHocPhanDangKyTinChi.HOC_LAI]: 'Học lại',
	[ELoaiHocPhanDangKyTinChi.HOC_VUOT]: 'Học vượt',
	[ELoaiHocPhanDangKyTinChi.CAI_THIEN]: 'Học cải thiện',
	// [ELoaiHocPhanDangKyTinChi.NGANH_2]: 'Học ngành 2',
	[ELoaiHocPhanDangKyTinChi.CHUA_THEO_TIEN_TRINH]: 'Chưa theo tiến trình',
	[ELoaiHocPhanDangKyTinChi.HOC_NGOAI]: 'Học ngoài CTĐT',
	// [ELoaiHocPhanDangKyTinChi.TAT_CA]: 'Tất cả học phần',
};

// Lớp học phần

export enum ELoaiLopHocPhan {
	CHINH = 'C',
	LY_THUYET = 'LT',
	THUC_HANH = 'TH',
	THI_NGHIEM = 'TN',
	BAI_TAP = 'BT',
	BAI_TAP_LOP = 'BTL',
	DO_AN_TOT_NGHIEP = 'DATN',
	// NHU_CAU = 'NC',
}

export const ETenLoaiLopHocPhan: Record<ELoaiLopHocPhan, string> = {
	[ELoaiLopHocPhan.CHINH]: 'Lớp tín chỉ',
	[ELoaiLopHocPhan.LY_THUYET]: 'Lớp lý thuyết',
	[ELoaiLopHocPhan.THUC_HANH]: 'Lớp thực hành',
	[ELoaiLopHocPhan.THI_NGHIEM]: 'Lớp thí nghiệm',
	[ELoaiLopHocPhan.BAI_TAP]: 'Lớp bài tập',
	[ELoaiLopHocPhan.BAI_TAP_LOP]: 'Lớp bài tập lớn',
	[ELoaiLopHocPhan.DO_AN_TOT_NGHIEP]: 'Lớp đồ án tốt nghiệp',
	// [ELoaiLopHocPhan.NHU_CAU]: 'Lớp nhu cầu',
};

export enum ETrangThaiLopHocPhan {
	MO = 'Mở',
	DONG = 'Đóng',
}

// Hình thức giảng dạy

export enum EHinhThucGiangDay {
	ONLINE = 'Online',
	TRUC_TIEP = 'Trực tiếp',
	KET_HOP = 'Kết hợp',
}

// Trạng thái điểm thành phần lớp

export enum ETrangThaiDiemLop {
	CHUA_NHAP_DIEM = 'Chưa nhập điểm',
	CHUA_NOP_DIEM = 'Chưa nộp điểm',
	DA_NOP_DIEM = 'Đã nộp điểm',
	DA_DUYET = 'Đã duyệt',
	QUAN_LY_DUYET = 'Quản lý duyệt',
}

export const trangThaiDiemLop: Record<ETrangThaiDiemLop, string> = {
	[ETrangThaiDiemLop.CHUA_NHAP_DIEM]: 'Chưa nhập điểm',
	[ETrangThaiDiemLop.CHUA_NOP_DIEM]: 'Chưa nộp điểm',
	[ETrangThaiDiemLop.DA_NOP_DIEM]: 'Đã nộp điểm',
	[ETrangThaiDiemLop.DA_DUYET]: 'Chuyên viên đã duyệt',
	[ETrangThaiDiemLop.QUAN_LY_DUYET]: 'Đã duyệt',
};

export const labelTrangThaiDiemLop: Record<ETrangThaiDiemLop, string> = {
	[ETrangThaiDiemLop.CHUA_NHAP_DIEM]: 'Lớp chưa nhập điểm',
	[ETrangThaiDiemLop.CHUA_NOP_DIEM]: 'Lớp chưa nộp điểm',
	[ETrangThaiDiemLop.DA_NOP_DIEM]: 'Lớp đã nộp điểm (chờ CV duyệt)',
	[ETrangThaiDiemLop.DA_DUYET]: 'Lớp chuyên viên đã duyệt (chờ LĐ duyệt)',
	[ETrangThaiDiemLop.QUAN_LY_DUYET]: 'Lớp đã duyệt',
};

export const colorTrangThaiDiemLop: Record<ETrangThaiDiemLop, string> = {
	[ETrangThaiDiemLop.CHUA_NHAP_DIEM]: 'red',
	[ETrangThaiDiemLop.CHUA_NOP_DIEM]: 'orange',
	[ETrangThaiDiemLop.DA_NOP_DIEM]: 'blue',
	[ETrangThaiDiemLop.DA_DUYET]: 'purple',
	[ETrangThaiDiemLop.QUAN_LY_DUYET]: 'green',
};

// Trạng thái điểm kết thúc học phần
export enum ETrangThaiDuyetDiem {
	CHUA_DUYET = 'CHUA_DUYET',
	CHUYEN_VIEN_DUYET = 'CHUYEN_VIEN_DUYET',
	QUAN_LY_DUYET = 'QUAN_LY_DUYET',
}

export const colorTrangThaiDuyetDiem: Record<ETrangThaiDuyetDiem, string> = {
	[ETrangThaiDuyetDiem.CHUA_DUYET]: 'orange',
	[ETrangThaiDuyetDiem.CHUYEN_VIEN_DUYET]: 'blue',
	[ETrangThaiDuyetDiem.QUAN_LY_DUYET]: 'green',
};

export const trangThaiDuyetDiem: Record<ETrangThaiDuyetDiem, string> = {
	[ETrangThaiDuyetDiem.CHUA_DUYET]: 'Chưa duyệt',
	[ETrangThaiDuyetDiem.CHUYEN_VIEN_DUYET]: 'Chuyên viên duyệt',
	[ETrangThaiDuyetDiem.QUAN_LY_DUYET]: 'Quản lý duyệt',
};

// PHÂN CÔNG GIẢNG DẠY
export enum ELoaiPhanCongGiangDay {
	CAN_BO = 'CAN_BO',
	CAN_BO_PHU = 'CAN_BO_PHU',
	THINH_GIANG = 'THINH_GIANG',
}

export const loaiPhanCongGiangDay: Record<ELoaiPhanCongGiangDay, string> = {
	[ELoaiPhanCongGiangDay.CAN_BO]: 'Giảng viên cơ hữu',
	[ELoaiPhanCongGiangDay.CAN_BO_PHU]: 'Giảng viên cơ hữu phụ',
	[ELoaiPhanCongGiangDay.THINH_GIANG]: 'Thỉnh giảng',
};

// DUYỆT GIẢNG DẠY
export enum ETrangThaiDuyetGiangDay {
	DA_DUYET = 'Đã duyệt',
	DANG_XU_LY = 'Đang xử lý',
	CHUA_CO_DANG_KY = 'Chưa có đăng ký',
}

export const colorTrangThaiDuyetGiangDay: Record<ETrangThaiDuyetGiangDay, string> = {
	[ETrangThaiDuyetGiangDay.CHUA_CO_DANG_KY]: 'orange',
	[ETrangThaiDuyetGiangDay.DANG_XU_LY]: 'blue',
	[ETrangThaiDuyetGiangDay.DA_DUYET]: 'green',
};

export enum ELoaiHocLuc {
	XUAT_SAC = 'Xuất sắc',
	GIOI = 'Giỏi',
	KHA = 'Khá',
	TRUNG_BINH = 'Trung bình',
	YEU = 'Yếu',
	KEM = 'Kém',
	EMPTY = 'Chưa xếp loại',
}

export const colorLoaiHocLuc: Record<ELoaiHocLuc, string> = {
	[ELoaiHocLuc.XUAT_SAC]: '#52c41a',
	[ELoaiHocLuc.GIOI]: '#7ecb08',
	[ELoaiHocLuc.KHA]: '#f1e20b',
	[ELoaiHocLuc.TRUNG_BINH]: '#ffc20a',
	[ELoaiHocLuc.YEU]: '#ef9b20',
	[ELoaiHocLuc.KEM]: '#ea5545',
	[ELoaiHocLuc.EMPTY]: '#939393',
};

// LOG Lớp tín chỉ
export enum ELoaiLogLopHocPhan {
	THAY_DOI_HOC_VIEN = 'THAY_DOI_HOC_VIEN',
}

export enum ELoaiThayDoiHocVien {
	HUY = 'HUY',
	CHUYEN = 'CHUYEN',
}

export const LoaiThayDoiHocVien: Record<ELoaiThayDoiHocVien, string> = {
	[ELoaiThayDoiHocVien.CHUYEN]: 'Chuyển lớp',
	[ELoaiThayDoiHocVien.HUY]: 'Hủy',
};

// Loại thời gian nhập điểm học kỳ
export enum ELoaiThoiGianNhapDiem {
	FROM_TO = 'Từ ngày đến ngày',
	NUM_DAY = 'Theo số ngày (kể từ buổi học cuối)',
}

// LOG Nhập điểm
export enum ELoaiLogDiem {
	TP = 'ThanhPhan',
	KTHP = 'KetThucHocPhan',
	DUYET_TP = 'DuyetThanhPhan',
	DUYET_KTHP = 'DuyetKthp',
}

// Nhập điểm: Trạng thái thi
export enum ETrangThaiThi {
	CHUA_XET = 'Chưa xét',
	CAM_THI = 'Cấm thi',
	DU_DIEU_KIEN = 'Đủ điều kiện',
}

/** Cảnh báo kết quả học tập */
export enum EValidateCanhBaoHocTap {
	TONG_SO_TIN_CHI_KHONG_DAT = 'validateTongSoTinChiKhongDat',
	TONG_SO_TIN_CHI_NO_TOAN_KHOA = 'validateTongSoTinChiNoToanKhoa',
	DIEM_TRUNG_BINH_HOC_KY = 'validateDiemTrungBinhHocKy',
	DIEM_TRUNG_BINH_TICH_LUY = 'validateDiemTrungBinhTichLuy',
}

/** Buộc thôi học */
export enum EValidateBuocThoiHoc {
	SO_LAN_CANH_BAO = 'validateSoLanCanhBao',
	CANH_BAO_LIEN_TIEP = 'validateCanhBaoLienTiep',
	TU_BO_HOC = 'validateTuBoHoc',
	KY_LUAT = 'validateKyLuat',
	KHONG_HOAN_THANH_HOC_PHI = 'validateKhongHoanThanhHocPhi',
	THOI_GIAN_HOC = 'validateThoiGianHoc',
}

export const validateKetQuaHocTap: Record<EValidateCanhBaoHocTap | EValidateBuocThoiHoc, string> = {
	//Cảnh báo kết quả học tập
	[EValidateCanhBaoHocTap.TONG_SO_TIN_CHI_KHONG_DAT]: 'Tổng số tín chỉ không đạt',
	[EValidateCanhBaoHocTap.TONG_SO_TIN_CHI_NO_TOAN_KHOA]: 'Tổng số tín chỉ chưa đạt toàn khóa',
	[EValidateCanhBaoHocTap.DIEM_TRUNG_BINH_HOC_KY]: 'Điểm trung bình học kỳ (hệ 4)',
	[EValidateCanhBaoHocTap.DIEM_TRUNG_BINH_TICH_LUY]: 'Điểm trung bình tích lũy (hệ 4)',

	//Cảnh báo thôi học
	[EValidateBuocThoiHoc.SO_LAN_CANH_BAO]: 'Số lần cảnh báo học tập',
	[EValidateBuocThoiHoc.CANH_BAO_LIEN_TIEP]: 'Cảnh báo học tập liên tiếp',
	[EValidateBuocThoiHoc.TU_BO_HOC]: 'Tự ý bỏ học/không đăng ký tín chỉ',
	[EValidateBuocThoiHoc.KY_LUAT]: 'Kỷ luật',
	[EValidateBuocThoiHoc.KHONG_HOAN_THANH_HOC_PHI]: 'Không hoàn thành học phí',
	[EValidateBuocThoiHoc.THOI_GIAN_HOC]: 'Thời gian học tập quá giới hạn',
};

export enum ELoaiHpSv {
	THEO_KE_HOACH = 'THEO_KE_HOACH',
	CHAM_KE_HOACH = 'CHAM_KE_HOACH',
	VUOT_KE_HOACH = 'VUOT_KE_HOACH',
	HOC_CAI_THIEN = 'HOC_CAI_THIEN',
	HOC_LAI = 'HOC_LAI',
}

export const mapNhuCauHpLoaiHpSv: Record<ELoaiNhuCauHocPhan, ELoaiHpSv> = {
	[ELoaiNhuCauHocPhan.KE_HOACH]: ELoaiHpSv.THEO_KE_HOACH,
	[ELoaiNhuCauHocPhan.HOC_LAI]: ELoaiHpSv.HOC_LAI,
	[ELoaiNhuCauHocPhan.HOC_CAI_THIEN]: ELoaiHpSv.HOC_CAI_THIEN,
	[ELoaiNhuCauHocPhan.CAM_THI]: ELoaiHpSv.HOC_LAI,
	[ELoaiNhuCauHocPhan.HOC_CHAM]: ELoaiHpSv.CHAM_KE_HOACH,
};

//Đăng ký nhu cầu
export enum ETrangThaiHocPhanDangKyNhuCau {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	KHONG_DUYET = 'KHONG_DUYET',
	DA_PHAN_LOP = 'DA_PHAN_LOP',
}

export const mapTrangThaiHocPhanDangKyNhuCau: Record<ETrangThaiHocPhanDangKyNhuCau, string> = {
	[ETrangThaiHocPhanDangKyNhuCau.CHO_DUYET]: 'Chờ duyệt',
	[ETrangThaiHocPhanDangKyNhuCau.DA_DUYET]: 'Đã duyệt',
	[ETrangThaiHocPhanDangKyNhuCau.KHONG_DUYET]: 'Không duyệt',
	[ETrangThaiHocPhanDangKyNhuCau.DA_PHAN_LOP]: 'Đã phân lớp',
};

export const colorTrangThaiHocPhanDangKyNhuCau: Record<ETrangThaiHocPhanDangKyNhuCau, string> = {
	[ETrangThaiHocPhanDangKyNhuCau.CHO_DUYET]: 'blue',
	[ETrangThaiHocPhanDangKyNhuCau.DA_DUYET]: 'orange',
	[ETrangThaiHocPhanDangKyNhuCau.KHONG_DUYET]: 'red',
	[ETrangThaiHocPhanDangKyNhuCau.DA_PHAN_LOP]: 'green',
};
