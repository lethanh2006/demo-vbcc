export enum ELoaiLichSuPhoiBang {
  CAP_MOI = 'Cấp mới',
  HUY = 'Hủy',
  THAT_LAC = 'Thất lạc',
}
export const ColorLoaiLichSuPhoiBang = {
  [ELoaiLichSuPhoiBang.CAP_MOI]: 'blue',
  [ELoaiLichSuPhoiBang.HUY]: 'red',
  [ELoaiLichSuPhoiBang.THAT_LAC]: 'orange',
}

export enum ETrangThaiPhoiBang {
  CHUA_SU_DUNG = 'Chưa sử dụng',
  DA_SU_DUNG = 'Đã sử dụng',
  HUY = 'Hủy',
  THAT_LAC = 'Thất lạc',
}

export const ColorTrangThaiPhoiBang = {
  [ETrangThaiPhoiBang.CHUA_SU_DUNG]: 'blue',
  [ETrangThaiPhoiBang.DA_SU_DUNG]: 'green',
  [ETrangThaiPhoiBang.HUY]: 'red',
  [ETrangThaiPhoiBang.THAT_LAC]: 'orange',
}