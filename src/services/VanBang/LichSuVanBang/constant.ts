import { ETagColor } from '@/services/base/constant';

export enum ELoaiYeuCauVangBang {
	CAP_MOI = 'Cấp mới',
	CAP_LAI = 'Cấp lại',
	CHINH_SUA = 'Chỉnh sửa',
	THU_HOI = 'Thu hồi',
}

export enum ETrangThaiYeuCauVanBang {
	CHO_XAC_NHAN = 'Chờ xác nhận',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const nameLoaiYeuCauVangBang: Record<ETrangThaiYeuCauVanBang, string> = {
	[ETrangThaiYeuCauVanBang.CHO_XAC_NHAN]: 'Chờ duyệt',
	[ETrangThaiYeuCauVanBang.DA_DUYET]: 'Đã duyệt',
	[ETrangThaiYeuCauVanBang.KHONG_DUYET]: 'Không duyệt',
};

export const colorLoaiYeuCauVangBang: Record<ELoaiYeuCauVangBang, ETagColor> = {
	[ELoaiYeuCauVangBang.CAP_MOI]: ETagColor.GREEN,
	[ELoaiYeuCauVangBang.CAP_LAI]: ETagColor.BLUE,
	[ELoaiYeuCauVangBang.CHINH_SUA]: ETagColor.GOLD,
	[ELoaiYeuCauVangBang.THU_HOI]: ETagColor.RED,
};

export const colorTrangThaiYeuCauVanBang: Record<ETrangThaiYeuCauVanBang, ETagColor> = {
	[ETrangThaiYeuCauVanBang.CHO_XAC_NHAN]: ETagColor.BLUE,
	[ETrangThaiYeuCauVanBang.DA_DUYET]: ETagColor.GREEN,
	[ETrangThaiYeuCauVanBang.KHONG_DUYET]: ETagColor.RED,
};
