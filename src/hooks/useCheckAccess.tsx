import { useModel } from 'umi';

export const ShowAllVanBang = (code: string = 'van-bang-chung-chi|quan-tri-vien'): boolean => {
	const { initialState } = useModel('@@initialState');
	const scopes = initialState?.authorizedPermissions?.flatMap((item) => item.scopes);

	return scopes?.includes(code) || false;
};

const useCheckAccess = (code: string): boolean => {
	const { initialState } = useModel('@@initialState');
	const scopes = initialState?.authorizedPermissions?.flatMap((item) => item.scopes);

	return scopes?.includes(code) || false;
};

export default useCheckAccess;
