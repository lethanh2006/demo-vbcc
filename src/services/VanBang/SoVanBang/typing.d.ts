declare module SoVanBang {
	export interface IRecord {
		_id: string;
		ten: string;
		maTrinhDo?: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordBo;
		maHinhThuc?: string;
		hinhThucDaoTao?: HinhThucDaoTao.IRecordBo;
		namHanhChinh: number;
		trangThai: ETrangThaiSoVanBang;
		moTa: string;

		nguoiTaoInfo?: TNnguoiInfo;
		nguoiDuyetInfo?: TNnguoiInfo;

		soVaoSoHienTai: number;
	}

	export type TNnguoiInfo = {
		ssoId: string;
		hoTen: string;
		userName: string;
	};
}
