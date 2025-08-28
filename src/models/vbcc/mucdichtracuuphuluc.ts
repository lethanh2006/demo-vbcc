import useInitModel from '@/hooks/useInitModel';
import type { MucDichTraCuuPhuLuc } from '@/services/VanBang/MucDichTraCuuPhuLuc/typing';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<MucDichTraCuuPhuLuc.IRecord>('muc-dich-tra-cuu-phu-luc');

	const { formSubmiting, setFormSubmiting, putService, danhSach } = objInit;

	const updatethuTuModel = async (rec: MucDichTraCuuPhuLuc.IRecord, newIndex: number, getData: () => void) => {
		const oldIndex = danhSach.findIndex((item) => item._id === rec._id);
		if (oldIndex === newIndex) return; // Không thay đổi vị trí
		if (formSubmiting) return Promise.reject('Form is submitting');
		setFormSubmiting(true);

		try {
			const from = oldIndex < newIndex ? oldIndex : newIndex;
			const to = oldIndex < newIndex ? newIndex : oldIndex;
			const distance = oldIndex < newIndex ? -1 : 1;
			const updatedList: any = [];
			danhSach.forEach((item, index) => {
				if (index >= from && index <= to) {
					if (item._id === rec._id) updatedList.push({ _id: item._id, soThuTu: newIndex + 1 });
					else updatedList.push({ _id: item._id, soThuTu: (item.soThuTu ?? index) + distance });
				}
			});
			await Promise.all(updatedList.map((item: any) => putService(item._id, { soThuTu: item.soThuTu })));

			getData();
			message.success('Cập nhật thứ tự thành công');
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		updatethuTuModel,
	};
};
