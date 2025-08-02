import type { ETrangThaiSoVanBang } from '../constant';

declare module SoVanBang {
	export interface IRecord {
		_id: string;
		ten: string;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordBo;
		maHinhThucDaoTao: string;
		hinhThucDaoTao?: HinhThucDaoTao.IRecordBo;
		namHanhChinh: string;
		trangThai: ETrangThaiSoVanBang;
		nguoiTaoInfo: TNnguoiInfo;
		nguoiDuyetInfo: TNnguoiInfo;
		soVaoSoHienTai: 0;
		createdAt: Date;
		updatedAt: Date;
		moTa: string;
		maDonVi: string;
		soVaoSoFormat: string;
	}

	export type TNnguoiInfo = {
		ssoId: string;
		hoTen: string;
		userName: string;
	};
}
