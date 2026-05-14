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
    ghiChu?: string;
  }

  export interface IBieuMauPhoiBang {
    _id?: string;
    ten?: string;
    dinhDangSoHieu?: string;
    soKyTuPhoiBang?: number;
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

  export interface IThongKeBieuMau {
    soLanCapMoi: number;
    soLanHuy: number;
    soLanThatLac: number;
  }

  export interface IThongKeTrangThai {
    trangThai: ETrangThaiPhoiBang | string;
    soLuong: number;
  }
}