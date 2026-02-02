import { PhuLucVanBang } from '../PhuLucVanBang/typing';
import { ELoaiYeuCauVangBang, ETrangThaiYeuCauVanBang } from './constant';

declare module LichSuVanBang {
	export interface IRecord {
		_id: string;
		phuLucVanBangId: string;
		phuLucVanBang: PhuLucVanBang.IRecord;
		thongTinCapNhatCapLai: PhuLucVanBang.IRecord;
		loai: ELoaiYeuCauVangBang;
		trangThai: ETrangThaiYeuCauVanBang;
		ghiChu: string;
		thoiGianYeuCau: Date;
		thoiGianXacNhan: Date;
		nguoiKy: {
			hoTen: string;
			maCanBo: string;
			ssoId: string;
		};
		thongTinPhuLucTruocKhiChinhSua: PhuLucVanBang.IRecord;
		createdAt: Date;
		updatedAt: Date;
	}
}
