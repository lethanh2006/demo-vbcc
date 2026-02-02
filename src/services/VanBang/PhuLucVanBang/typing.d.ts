import type { BieuMauPhuLuc } from '../BieuMauPhuLuc/typing';
import { DotCapBangTotNghiep } from '../DotCapBangTotNghiep/typing';
import type { QuyetDinhTotNghiep } from '../QuyetDinh/typing';
import type { ELoaiYeuCauChinhSuaVanBang, ETrangThaiBlockchain, ETrangThaiTotNghiep } from '../constant';

declare module PhuLucVanBang {
	export interface IRecord {
		_id: string;
		idQuyetDinh: string;
		quyetDinh?: QuyetDinhTotNghiep.IRecord;
		dotCapBang?: DotCapBangTotNghiep.IRecord;
		maTruong?: string;

		soVaoSoBang: string;
		soVaoSoTamThoi: string;
		bookEntryNumberFormat: string;
		soHieuVanBang: string;
		hoTen: string;
		fullName: string;
		ngaySinh: string;
		maSinhVien: string;
		maBieuMau?: string;
		templateData?: BieuMauPhuLuc.TElement[];
		tenDeTai: string;
		nguoiHuongDan: string;
		moTaDeTai: string;
		hinhThucDaoTao: string;
		thongTinHinhThucDaoTao: HinhThucDaoTao.IRecord;
		trinhDoDaoTao: string;
		thongTinTrinhDoDaoTao: TrinhDoDaoTao.IRecord;
		nganhDaoTao: string;
		thongTinNganhDaoTao: NganhDaoTao.IRecord;
		namTotNghiep: string;
		cmtCccd: string;
		gioiTinh: string;
		quocTich: string;

		// historyId?: string;
		urlIpfs?: string | null;
		idVanBang?: string;
		signature?: string;
		idVanBangIPFS?: string;
		createdBlockchain?: ETrangThaiBlockchain;
		kichHoat?: boolean;

		// Cấp bằng
		idDotCapBang?: string | null;
		ngayCapPhuLuc?: Date | string | null;
		ghiChu: string;
		ghiChuCapBang?: string;
		bieuMau: BieuMauPhuLuc.IRecord;
		trangThai: ETrangThaiTotNghiep;

		createdAt?: string;
		updatedAt?: string;

		//trình ký
		fileVanBang: string;
		idFileVanBang?: string;
		trinhKy?: boolean;
		thoiGianKy?: Date;
		thoiGianDongGiau?: Date;
		daKy?: boolean;
		daDongDau?: boolean;
		nguoiKy: {
			hoTen: string;
			ssoId: string;
		};
		nguoiDongGiau: {
			hoTen: string;
			ssoId: string;
		};

		ghiChuYeuCau?: string;
		isThuHoi?: boolean;
		loaiYeuCauChinhSua: ELoaiYeuCauChinhSuaVanBang;

		// Temp
		index?: number;
		key?: string;

		//fake
		token?: string;
		url?: string;
		uploadUrl?: string;
		uploaded?: boolean;
		message?: string;
		status?: string;
		soThuTuImport?: number;
	}

	export type TUploadFolder = Pick<IRecord, 'urlIpfs' | 'idVanBangIPFS'> & {
		key: string;
		message?: string;
	};

	export type TUpdateSignature = {
		key: string;
		signature: string;
		message?: string;
	};

	export interface IThongTinTraCuu {
		DuLieu: IRecord;
	}

	export type TSetting = {
		_id?: string;
		require_signature?: boolean;
		require_diploma_signature?: boolean;
		require_IPFS?: boolean;
		blockChain?: boolean;
	};

	export type TTongHop = {
		tongSoQuyetDinh: number;
		tongSoPhuLuc: number;
		tongSoDaKy: number;
		tongSoDaDuaLenBlockchain: number;
		soLuotTraCuu: number;
		soLuongXacMinh: number;
		soLuongCapLai: number;
		soLuongCapNhat: number;
		soLuongThuHoi: number;
		choLayBang: number;
		daCapBang: number;

		//Xác minh văn bằng
		soXacMinhYeuCau: number;
		soPLXacMinhVanBang: number;
		soPLCongVanPhucDap: number;
		soPLTraKetQua: number;
		soPLHoanThanh: number;

		soPhuLucTheoDotTN: TThongKeTraCuu[];
		soPhuLucTheoTrinhDo: TThongKeTrinhDoDaoTao[];
	};

	export type TThongKeTraCuu = {
		ten: string;
		soLuongPhuLuc: number;
		soLuotTraCuuThanhCong: number;
		soQuyetDinh: string;
		choCapBang: number;
		daCapBang: number;
		tongSo: number;
	};

	export type TThongKeTrinhDoDaoTao = {
		ma: string;
		soLuotTraCuu: number;
		soPhuLucChoCapBang: number;
		soPhuLucDaCapBang: number;
		ten: string;
		tongSoPhuLuc: number;
	};

	export type TTongHopNam = {
		soLuongCapMoiVanBang: number;
		soLuongDuocPhat: number;
		thang: number;
	};

	export interface IChiTietTraCuu {
		soQuyetDinh: string;
		tongTraCuu: number;
		mucDich: Record<string, number>;
	}

	export interface IImportPhuLuc {
		row: number;
		identityKey: string;
		field: string;
		tableError: {
			row: number;
			column: string;
			columnType: string;
			value: string;
			error: string;
		};
	}

	export interface IThongKePhuLucTheoNam {
		nam: number;
		thongKeHinhThucDaoTao: IThongKePhuLucTheoNamItem[];
		thongKeNganhDaoTao: IThongKePhuLucTheoNamItem[];
		thongKeTrinhDoDaoTao: IThongKePhuLucTheoNamItem[];
	}
	export interface IThongKePhuLucTheoNamItem {
		ten: string;
		soLuong: number;
	}
}
