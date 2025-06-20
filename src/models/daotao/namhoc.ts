import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<NamHoc.IRecord>('nam-hoc', undefined, undefined, ipDaoTao, { ma: -1 });

	return {
		...objInit,
	};
};
