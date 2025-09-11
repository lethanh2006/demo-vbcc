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
			const tempDanhSach = [...danhSach];
			const [movedItem] = tempDanhSach.splice(oldIndex, 1);
			tempDanhSach.splice(newIndex, 0, movedItem);

			const updatedList: { _id: string; soThuTu: number }[] = tempDanhSach.map((item, index) => ({
				_id: item._id,
				soThuTu: index + 1,
			}));
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
