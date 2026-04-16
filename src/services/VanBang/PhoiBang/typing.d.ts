import { ELoaiLichSuPhoiBang, ETrangThaiPhoiBang } from "@/services/VanBang/PhoiBang/constants";

declare module PhoiBang {
  export interface IRecord {
    _id: string;
    trangThai: ETrangThaiPhoiBang;
    soHieuVanBang: string;
    soThuTuPhoi?: number;
    idBieuMauPhoiBang?: string;
    bieuMauPhoiBang?: IBieuMauPhoiBang;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }

  export interface IBieuMauPhoiBang {
    _id?: string;
    ten?: string;
    dinhDangSoHieu?: string;
    ngayNhap?: Date;
    ghiChu?: string;
    soBatDau?: number;
    soKetThuc?: number;
  }

  export interface ILichSuPhoiBang extends IBieuMauPhoiBang {
    bieuMauPhoiBang?: IRecord;
    bieuMauPhoiBangId: string
    loai: ELoaiLichSuPhoiBang;
  }
}