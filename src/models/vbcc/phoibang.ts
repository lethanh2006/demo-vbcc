import useInitModel from '@/hooks/useInitModel';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';

export default () => {
  const objInit = useInitModel<PhoiBang.IRecord>('phoi-bang');

  return {
    ...objInit,
  };
};