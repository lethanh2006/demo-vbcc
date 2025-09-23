import { EOperatorType } from '@/components/Table/constant';
import type { TFilter } from '@/components/Table/typing';
import useInitModel from '@/hooks/useInitModel';
import { type ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { ipNhanSu } from '@/utils/ip';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';

export default () => {
	const objInit = useInitModel<ToChucNhanSu.INhanSu>('thong-tin-nhan-su', undefined, undefined, ipNhanSu);
	const { setLoading, getService, setDanhSach } = objInit;

	const searchMultiModel = async (
		keyword: string,
		maDonVi?: string,
		condition?: Partial<ToChucNhanSu.INhanSu>,
	): Promise<ToChucNhanSu.INhanSu[]> => {
		setLoading(true);
		try {
			const filters: TFilter<ToChucNhanSu.INhanSu>[] = [];
			if (maDonVi) filters.push({ field: 'maDonVi', values: [maDonVi], operator: EOperatorType.INCLUDE });
			const payloads = [
				{
					page: 1,
					limit: 20,
					filters: [{ field: 'maCanBo', values: [keyword], operator: EOperatorType.CONTAIN }, ...filters],
					condition,
				},
				{
					page: 1,
					limit: 20,
					filters: [{ field: 'hoTen', values: [keyword], operator: EOperatorType.CONTAIN }, ...filters],
					condition,
				},
			];
			const responses = await Promise.allSettled(payloads.map((payload) => getService(payload, 'page')));
			const data = (
				responses.filter((item) => item.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse<any>>[]
			).map((item) => item.value.data?.data?.result);
			const flatData: ToChucNhanSu.INhanSu[] = data.flat();
			const uniqData = _.uniqBy(flatData, (item) => item.ssoId);
			setDanhSach(uniqData);

			return uniqData;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		searchMultiModel,
	};
};
