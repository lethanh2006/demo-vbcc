import type { BieuMauPhuLuc } from '../BieuMauPhuLuc/typing';
import type { QuyetDinhTotNghiep } from '../QuyetDinh/typing';
import type { ETrangThaiBlockchain } from '../constant';

declare module PhuLucVanBang {
	export interface IRecord {
		_id: string;
		idQuyetDinh: string;
		quyetDinh?: QuyetDinhTotNghiep.IRecord;
		maTruong?: string;

		soVaoSoBang: string;
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

		// historyId?: string;
		urlIpfs?: string | null;
		idVanBang?: string;
		signature?: string;
		idVanBangIPFS?: string;
		createdBlockchain?: ETrangThaiBlockchain;
		kichHoat?: boolean;

		// Cấp bằng
		idDotCapBang?: string | null;
		ngayCapPhuLuc?: Date | string;
		ghiChu: string;
		ghiChuCapBang?: string;
		bieuMau: BieuMauPhuLuc.IRecord;

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
		soPhuLucTheoDotTN: TThongKeTraCuu[];
	};

	export type TThongKeTraCuu = {
		ten: string;
		soLuongPhuLuc: number;
		soLuotTraCuuThanhCong: number;
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
}
