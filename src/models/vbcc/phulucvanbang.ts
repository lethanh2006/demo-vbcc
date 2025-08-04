import { ShowAllVanBang } from '@/hooks/useCheckAccess';
import useInitModel from '@/hooks/useInitModel';
import {
	importPhuLucVanBang,
	putUpdateIpfs,
	traCuuPhuLucVanBan,
	updBlockchain,
} from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { preIPFS } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const showAllVanBang = ShowAllVanBang();

	const objInit = useInitModel<PhuLucVanBang.IRecord>(showAllVanBang ? 'phu-luc-van-bang' : 'phu-luc-van-bang/don-vi');
	const { formSubmiting, setFormSubmiting } = objInit;
	const [dataToSignOrPush, setDataToSignOrPush] = useState<PhuLucVanBang.IRecord[]>([]);
	const [visibleSign, setVisibleSign] = useState<boolean>(false);
	const [visiblePush, setVisiblePush] = useState<boolean>(false);
	const [visiblePrint, setVisiblePrint] = useState<boolean>(false);
	const [thongTinTraCuu, setThongTinTraCuu] = useState<PhuLucVanBang.IThongTinTraCuu[] | any>();
	const [tableData, setTableData] = useState<any>();

	const uploadFolderModel = async (
		idQuyetDinh: string,
		payload: PhuLucVanBang.TUploadFolder[],
	): Promise<PhuLucVanBang.TUploadFolder[]> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			const dataToUpdate = payload.map((i) => ({ ...i, urlIpfs: preIPFS + i.idVanBangIPFS }));
			const res = await putUpdateIpfs(idQuyetDinh, dataToUpdate);

			const dsHopLe = res?.data?.data?.filter((item: any) => item?.success)?.length ?? 0;
			message.success('Tải lên thành công ' + dsHopLe + '/' + payload.length);

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const updateSignatureModel = async (payload: PhuLucVanBang.TUpdateSignature[]) => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			// const res = await updSignature(payload);

			// const dsHopLe = res?.data?.data?.filter((item: any) => item?.success)?.length ?? 0;
			// message.success('Cập nhật thành công ' + dsHopLe + '/' + payload.length);

			// return res.data?.data;
			return [];
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const pushBlockchainModel = async (payload: PhuLucVanBang.IRecord[]) => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			const res = await updBlockchain({ listIdVanBang: payload.map((vb) => vb._id) });

			const dsHopLe = res?.data?.data?.filter((item: any) => item?.success)?.length ?? 0;
			message.success('Tải lên thành công ' + dsHopLe + '/' + payload.length);

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const importPhuLucVanBangModel = async (payload: { quyetDinhId: string; file: Blob }) => {
		if (formSubmiting) return;
		setFormSubmiting(true);

		try {
			const res = await importPhuLucVanBang(payload);
			message.success('Import thành công');

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const traCuuPhuLucVanBanModel = async (payload: {
		hoTen?: string;
		ngaySinh?: Date;
		maSinhVien?: string;
		soVaoSoBang?: string;
		soHieuVanBang?: string;
	}) => {
		if (formSubmiting) return;
		setFormSubmiting(true);

		try {
			const res = await traCuuPhuLucVanBan(payload);
			setThongTinTraCuu(res.data?.data?.result);

			return res.data?.result;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		dataToSignOrPush,
		setDataToSignOrPush,
		visibleSign,
		setVisibleSign,
		visiblePush,
		setVisiblePush,
		visiblePrint,
		setVisiblePrint,
		uploadFolderModel,
		updateSignatureModel,
		pushBlockchainModel,
		importPhuLucVanBangModel,
		traCuuPhuLucVanBanModel,
		thongTinTraCuu,
		tableData,
		setTableData,
	};
};
