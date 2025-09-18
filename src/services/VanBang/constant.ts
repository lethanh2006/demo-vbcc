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
	{ headerName: 'Mã sinh viên', type: ELoaiDuLieuBieuMau.Text },
];

export const allowElementBieuMau: BieuMauPhuLuc.TElement[] = [
	{ headerName: 'CCCD', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Giới tính', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Nơi sinh', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Dân tộc', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Quốc tịch', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Tôn giáo', type: ELoaiDuLieuBieuMau.Text },

	{ headerName: 'Trình độ đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngành', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngành (Tiếng anh)', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Chuyên ngành', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Lớp', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Hình thức đào tạo', type: ELoaiDuLieuBieuMau.Text },
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
