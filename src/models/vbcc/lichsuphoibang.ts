import useInitModel from '@/hooks/useInitModel';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';

export default () => {
  const objInit = useInitModel<PhoiBang.ILichSuPhoiBang>('lich-su-phoi-bang');

  return {
    ...objInit,
  };
};