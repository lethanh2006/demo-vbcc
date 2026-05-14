import useInitModel from '@/hooks/useInitModel';
import { postYeuCauCapMoi, postYeuCauHuyBieuMau } from '@/services/VanBang/PhoiBang';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<PhoiBang.IBieuMauPhoiBang>('bieu-mau-phoi-bang');
  const { formSubmiting, setFormSubmiting } = objInit;

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type?: 'CAP_MOI' | 'HUY';
    activeRecord?: PhoiBang.IBieuMauPhoiBang;
  }>({
    visible: false,
  });

  const postYeuCauHuyBieuMauModel = async (payload: any, getData?: () => void) => {
    if (formSubmiting) return Promise.reject('Form submiting');
    setFormSubmiting(true);

    try {
      const res = await postYeuCauHuyBieuMau(payload);
      message.success('Hủy thành công');
      if (getData) getData();

      return res.data?.data
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setFormSubmiting(false);
    }
  }

  const postYeuCauCapMoiModel = async (payload: any, getData?: () => void) => {
    if (formSubmiting) return Promise.reject('Form submiting');
    setFormSubmiting(true);

    try {
      const res = await postYeuCauCapMoi(payload);
      message.success('Cấp mới thành công');
      if (getData) getData();

      return res.data?.data
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setFormSubmiting(false);
    }
  }

  return {
    ...objInit,
    postYeuCauCapMoiModel,
    postYeuCauHuyBieuMauModel,
    modalConfig,
    setModalConfig,
  };
};