import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<TrinhDoDaoTao.IRecordCoSo>('trinh-do-dao-tao', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
