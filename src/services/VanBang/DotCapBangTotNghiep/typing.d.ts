declare module DotCapBangTotNghiep {
	export interface IRecord {
		_id: string;
		ten: string;
		nam: string;
		ngayBatDau: Date;
		ngayKetThuc: Date;
		quyetDinhId?: string;
	}
}
