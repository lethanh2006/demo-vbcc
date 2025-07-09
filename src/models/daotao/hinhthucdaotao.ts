import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HinhThucDaoTao.IRecordCoSo>('hinh-thuc-dao-tao', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
