import type { ELoaiDuLieuBieuMau } from '../constant';

declare module BieuMauPhuLuc {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		elements: TElement[];
		listIdFileBieuMau: any;

		createdAt: string;
		updatedAt: string;
	}

	export type TElement = {
		headerName: string;
		type?: ELoaiDuLieuBieuMau = ELoaiDuLieuBieuMau.Text;
		cot?: CotBang[];

		// Temp
		isRequired?: boolean = false;
		value?: string | number;
	};

	export type CotBang = {
		headerName: string;
		type: ELoaiDuLieuBieuMau;
	};
}
