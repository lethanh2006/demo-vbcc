import type { ELoaiDuLieuBieuMau } from '../constant';

declare module BieuMauPhuLuc {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		elements: TElement[];
		idFileMau: any;

		createdAt: string;
		updatedAt: string;
	}

	export type TElement = {
		headerName: string;
		type?: ELoaiDuLieuBieuMau = ELoaiDuLieuBieuMau.Text;

		// Temp
		isRequired?: boolean = false;
		value?: string | number;
	};
}
