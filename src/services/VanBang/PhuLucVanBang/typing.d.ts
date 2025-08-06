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
		soHieuVanBang: string;
		hoTen: string;
		ngaySinh: string;
		maSinhVien: string;
		maBieuMau?: string;
		templateData?: BieuMauPhuLuc.TElement[];

		// historyId?: string;
		urlIpfs?: string | null;
		idVanBang?: string;
		signature?: string;
		idVanBangIPFS?: string;
		createdBlockchain?: ETrangThaiBlockchain;
		kichHoat?: boolean;

		// Cấp bằng
		ngayCapPhuLuc?: Date | string;
		ghiChu: string;

		createdAt?: string;
		updatedAt?: string;

		// Temp
		index?: number;
		key?: string;
		dotCapBangId?: string | null;
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
