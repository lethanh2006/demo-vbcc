import { ETagColor } from '../base/constant';
import type { BieuMauPhuLuc } from './BieuMauPhuLuc/typing';

// BIỂU MẪU PHỤ LỤC
export enum ELoaiDuLieuBieuMau {
	Text = 'Text',
	Date = 'Date',
	Number = 'Number',
	Table = 'Table',
}

export const loaiDuLieuBieuMau: Record<ELoaiDuLieuBieuMau, string> = {
	[ELoaiDuLieuBieuMau.Text]: 'Chuỗi ký tự',
	[ELoaiDuLieuBieuMau.Number]: 'Kiểu số',
	[ELoaiDuLieuBieuMau.Date]: 'Ngày tháng',
	[ELoaiDuLieuBieuMau.Table]: 'Bảng',
};

// bảng điểm mặc định
export const defaultTranscriptColumns: { headerName: string; type: ELoaiDuLieuBieuMau }[] = [
	{ headerName: 'Mã học phần', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Tên học phần', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Số tín chỉ', type: ELoaiDuLieuBieuMau.Number },
	{ headerName: 'Học kỳ', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Điểm hệ 10', type: ELoaiDuLieuBieuMau.Number },
	{ headerName: 'Điểm hệ 4', type: ELoaiDuLieuBieuMau.Number },
	{ headerName: 'Điểm chữ', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ghi chú', type: ELoaiDuLieuBieuMau.Text },
];

//Chuẩn đầu ra
export const defaultChuanDauRaColumns: { headerName: string; type: ELoaiDuLieuBieuMau }[] = [
	{ headerName: 'Mã PLO', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Nội dung PLO', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Nhóm chuẩn đầu ra', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Mức điểm tối thiểu', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Mức điểm đạt được', type: ELoaiDuLieuBieuMau.Text },
];

export const defaultElementBieuMau: BieuMauPhuLuc.TElement[] = [
	{ headerName: 'Họ tên', type: ELoaiDuLieuBieuMau.Text, isRequired: true },
	{ headerName: 'Ngày sinh', type: ELoaiDuLieuBieuMau.Date, isRequired: true },
	{ headerName: 'Mã người học', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Trình độ đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Hình thức đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngành đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Số CMND/CCCD', type: ELoaiDuLieuBieuMau.Text },
];

export const allowElementBieuMau: BieuMauPhuLuc.TElement[] = [
	{ headerName: 'CCCD', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Giới tính', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Nơi sinh', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Dân tộc', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Quốc tịch', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Tôn giáo', type: ELoaiDuLieuBieuMau.Text },

	// { headerName: 'Trình độ đào tạo', type: ELoaiDuLieuBieuMau.Text },
	// { headerName: 'Ngành', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngành (Tiếng anh)', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Chuyên ngành', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Lớp', type: ELoaiDuLieuBieuMau.Text },
	// { headerName: 'Hình thức đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Tính chất CTĐT', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngôn ngữ đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Khóa', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Niên khóa', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Thời gian đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngày nhập học', type: ELoaiDuLieuBieuMau.Date },
	{ headerName: 'Năm tốt nghiệp', type: ELoaiDuLieuBieuMau.Text },

	{ headerName: 'Điểm tổng kết', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Điểm tổng kết (hệ 4)', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Số tín chỉ tích lũy', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Xếp loại', type: ELoaiDuLieuBieuMau.Text },

	{ headerName: 'Điểm rèn luyện', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Xếp hạng rèn luyện', type: ELoaiDuLieuBieuMau.Text },

	{ headerName: 'Bảng điểm sinh viên', type: ELoaiDuLieuBieuMau.Table },
	{ headerName: 'Chuẩn đầu ra CTĐT', type: ELoaiDuLieuBieuMau.Table },

	{ headerName: 'Đề tài khoa học', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Mô tả đề tài', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Người hướng dẫn', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Chương trình đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngày đánh giá tốt nghiệp', type: ELoaiDuLieuBieuMau.Text },
];

// PHỤ LỤC VĂN BẰNG
export enum ETrangThaiPhuLuc {
	CHUA_VAO_SO = 'Chưa vào sổ',
	DA_VAO_SO = 'Đã vào sổ',
}

export const colorTrangThaiPhuLuc: Record<ETrangThaiPhuLuc, string> = {
	[ETrangThaiPhuLuc.CHUA_VAO_SO]: 'yellow',
	[ETrangThaiPhuLuc.DA_VAO_SO]: 'blue',
};

export enum ETrangThaiBlockchain {
	CHUA_LUU = 'Chưa đưa lên blockchain',
	DA_LUU = 'Đã lưu trên blockchain',
	CHUA_CAP_NHAT = 'Chưa cập nhật thay đổi lên blockchain',
}

export const colorTrangThaiBlc: Record<ETrangThaiBlockchain, string> = {
	[ETrangThaiBlockchain.CHUA_LUU]: 'blue',
	[ETrangThaiBlockchain.CHUA_CAP_NHAT]: 'orange',
	[ETrangThaiBlockchain.DA_LUU]: 'green',
};

export enum ETrangThaiSoVanBang {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	TU_CHOI = 'Từ chối',
}

export const colorTrangThaiSoVanBang: Record<ETrangThaiSoVanBang, ETagColor> = {
	[ETrangThaiSoVanBang.CHO_DUYET]: ETagColor.DEFAULT,
	[ETrangThaiSoVanBang.DA_DUYET]: ETagColor.GREEN,
	[ETrangThaiSoVanBang.TU_CHOI]: ETagColor.RED,
};

export enum ELoaiYeuCauChinhSuaVanBang {
	HOAN_THANH = 'Hoàn thành',
	CAP_LAI = 'Cấp lại',
	CAP_NHAT = 'Cập nhật',
	THU_HOI = 'Thu hồi',
}

export const nameLoaiYeuCauChinhSuaVanBang: Record<ELoaiYeuCauChinhSuaVanBang, string> = {
	[ELoaiYeuCauChinhSuaVanBang.HOAN_THANH]: 'Hoàn thành',
	[ELoaiYeuCauChinhSuaVanBang.CAP_LAI]: 'Cấp lại',
	[ELoaiYeuCauChinhSuaVanBang.CAP_NHAT]: 'Chỉnh sửa',
	[ELoaiYeuCauChinhSuaVanBang.THU_HOI]: 'Thu hồi',
};

export const colorLoaiYeuCauChinhSuaVanBang: Record<ELoaiYeuCauChinhSuaVanBang, ETagColor> = {
	[ELoaiYeuCauChinhSuaVanBang.HOAN_THANH]: ETagColor.GREEN,
	[ELoaiYeuCauChinhSuaVanBang.CAP_LAI]: ETagColor.BLUE,
	[ELoaiYeuCauChinhSuaVanBang.CAP_NHAT]: ETagColor.GOLD,
	[ELoaiYeuCauChinhSuaVanBang.THU_HOI]: ETagColor.RED,
};

export enum ETrangThaiMucDichTraCuuPhuLuc {
	CHO_XU_LY = 'Chờ xử lý',
	KHONG_DUYET = 'Không duyệt',
	DUYET = 'Duyệt',
	YCCS = 'Yêu cầu chỉnh sửa lại',
}

export enum ETrangThaiDotCapBangTotNghiep {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	TU_CHOI = 'Từ chối',
}

export const colorTrangThaiCapBangToiNghiep: Record<ETrangThaiDotCapBangTotNghiep, ETagColor> = {
	[ETrangThaiDotCapBangTotNghiep.CHO_DUYET]: ETagColor.DEFAULT,
	[ETrangThaiDotCapBangTotNghiep.DA_DUYET]: ETagColor.GREEN,
	[ETrangThaiDotCapBangTotNghiep.TU_CHOI]: ETagColor.RED,
};

export enum ELoaiChuKy {
	KY_SO = 'Ký số',
	DONG_DAU_VAN_THU = 'Đóng dấu văn thư',
}

export const colorLoaiChuKy: Record<ELoaiChuKy, ETagColor> = {
	[ELoaiChuKy.KY_SO]: ETagColor.BLUE,
	[ELoaiChuKy.DONG_DAU_VAN_THU]: ETagColor.GREEN,
};

//QUYẾT ĐỊNH TỐT NGHIỆP
export enum ETrangThaiQuyetDinhTotNghiep {
	DU_THAO = 'Dự thảo',
	TRINH_DU_THAO = 'Trình dự thảo',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
	CHINH_THUC = 'Chính thức',
	HOAN_THANH = 'Hoàn thành',
}

export const nameTrangThaiQuyetDinhTotNghiep: Record<ETrangThaiQuyetDinhTotNghiep, string> = {
	[ETrangThaiQuyetDinhTotNghiep.DU_THAO]: 'Dự thảo',
	[ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO]: 'Chờ duyệt',
	[ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA]: 'Yêu cầu chỉnh sửa',
	[ETrangThaiQuyetDinhTotNghiep.CHINH_THUC]: 'Đã duyệt',
	[ETrangThaiQuyetDinhTotNghiep.HOAN_THANH]: 'Hoàn thành',
};

export const colorTrangThaiQuyetDinhTotNghiep: Record<ETrangThaiQuyetDinhTotNghiep, ETagColor> = {
	[ETrangThaiQuyetDinhTotNghiep.DU_THAO]: ETagColor.ORANGE,
	[ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO]: ETagColor.BLUE,
	[ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA]: ETagColor.RED,
	[ETrangThaiQuyetDinhTotNghiep.CHINH_THUC]: ETagColor.GEEKBLUE,
	[ETrangThaiQuyetDinhTotNghiep.HOAN_THANH]: ETagColor.GREEN,
};

//Xác minh văn bằng
export enum ELoaiPhucDap {
	VAN_BAN_SO = 'Văn bản số',
	VAN_BAN_GIAY = 'Văn bản giấy',
}

export enum EPhaseXacMinh {
	YEU_CAU = 'Yêu cầu xác minh',
	XAC_MINH = 'Xác minh văn bằng',
	PHUC_DAP = 'Công văn phúc đáp',
	KET_QUA = 'Trả kết quả',
	HOAN_THANH = 'Hoàn thành',
}

export const nameTrangThaiXacMinh: Record<EPhaseXacMinh, string> = {
	[EPhaseXacMinh.YEU_CAU]: 'Đang xử lý',
	[EPhaseXacMinh.XAC_MINH]: 'Xác minh văn bằng',
	[EPhaseXacMinh.PHUC_DAP]: 'Chuẩn bị công văn',
	[EPhaseXacMinh.KET_QUA]: 'Xử lý công văn',
	[EPhaseXacMinh.HOAN_THANH]: 'Hoàn thành',
};

export const colorTrangThaiXacMinh: Record<EPhaseXacMinh, ETagColor> = {
	[EPhaseXacMinh.YEU_CAU]: ETagColor.ORANGE,
	[EPhaseXacMinh.XAC_MINH]: ETagColor.BLUE,
	[EPhaseXacMinh.PHUC_DAP]: ETagColor.GEEKBLUE,
	[EPhaseXacMinh.KET_QUA]: ETagColor.GREEN,
	[EPhaseXacMinh.HOAN_THANH]: ETagColor.GREEN,
};

export enum ETrangThaiCapBang {
	CHO_CAP_BANG = 'Chờ cấp bằng',
	DA_CAP_BANG = 'Đã cấp bằng',
}

export const nameTrangThaiTotNghiep: Record<ETrangThaiCapBang, string> = {
	[ETrangThaiCapBang.CHO_CAP_BANG]: 'Chưa phát bằng',
	[ETrangThaiCapBang.DA_CAP_BANG]: 'Đã phát bằng',
};

export const colorTrangThaiTotNghiep: Record<ETrangThaiCapBang, ETagColor> = {
	[ETrangThaiCapBang.CHO_CAP_BANG]: ETagColor.BLUE,
	[ETrangThaiCapBang.DA_CAP_BANG]: ETagColor.GREEN,
};

export enum EQuyetDinhStep {
	THONG_TIN = 'THONG_TIN',
	DANH_SACH_SV = 'DANH_SACH_SV',
	DU_THAO_SO = 'DU_THAO_SO',
	PHU_LUC = 'PHU_LUC',
}

export const STEP_ORDER: EQuyetDinhStep[] = [
	EQuyetDinhStep.THONG_TIN,
	EQuyetDinhStep.DANH_SACH_SV,
	EQuyetDinhStep.DU_THAO_SO,
	EQuyetDinhStep.PHU_LUC,
];

export enum ELoaiThongTinUpdate {
	THONG_TIN_VAN_BANG = 'Thông tin văn bằng',
	SO_HIEU_VAN_BANG = 'Số hiệu văn bằng',
}
