import type { BieuMauPhuLuc } from './BieuMauPhuLuc/typing';

// BIỂU MẪU PHỤ LỤC

export enum ELoaiDuLieuBieuMau {
	Text = 'Text',
	Date = 'Date',
	Number = 'Number',
}

export const loaiDuLieuBieuMau: Record<ELoaiDuLieuBieuMau, string> = {
	[ELoaiDuLieuBieuMau.Text]: 'Chuỗi ký tự',
	[ELoaiDuLieuBieuMau.Number]: 'Kiểu số',
	[ELoaiDuLieuBieuMau.Date]: 'Ngày tháng',
};

export const defaultElementBieuMau: BieuMauPhuLuc.TElement[] = [
	{ headerName: 'Họ tên', isRequired: true },
	{ headerName: 'Ngày sinh', type: ELoaiDuLieuBieuMau.Date, isRequired: true },
	{ headerName: 'Mã sinh viên' },
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
	{ headerName: 'Chuyên ngành', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Lớp', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Hình thức đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Tính chất đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngôn ngữ đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Khóa', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Niên khóa', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Thời gian đào tạo', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Ngày nhập học', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Năm tốt nghiệp', type: ELoaiDuLieuBieuMau.Text },

	{ headerName: 'Điểm tổng kết', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Số tín chỉ tích lũy', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Xếp loại', type: ELoaiDuLieuBieuMau.Text },

	{ headerName: 'Điểm rèn luyện', type: ELoaiDuLieuBieuMau.Text },
	{ headerName: 'Xếp hạng rèn luyện', type: ELoaiDuLieuBieuMau.Text },
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
