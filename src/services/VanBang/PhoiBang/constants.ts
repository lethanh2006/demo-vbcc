export enum ELoaiLichSuPhoiBang {
  CAP_MOI = 'Cấp mới',
  HUY = 'Hủy'
}
export const ColorLoaiLichSuPhoiBang = {
  [ELoaiLichSuPhoiBang.CAP_MOI]: 'blue',
  [ELoaiLichSuPhoiBang.HUY]: 'red',
}

export enum ETrangThaiPhoiBang {
  CHUA_SU_DUNG = 'Chưa sử dụng',
  DA_SU_DUNG = 'Đã sử dụng',
  DA_TIEU_HUY = 'Đã tiêu hủy',
  THAT_LAC = 'Thất lạc',
  KHAC = 'Khác'
}

export const ColorTrangThaiPhoiBang = {
  [ETrangThaiPhoiBang.CHUA_SU_DUNG]: 'blue',
  [ETrangThaiPhoiBang.DA_SU_DUNG]: 'green',
  [ETrangThaiPhoiBang.DA_TIEU_HUY]: 'red',
  [ETrangThaiPhoiBang.THAT_LAC]: 'orange',
  [ETrangThaiPhoiBang.KHAC]: 'gray',
}