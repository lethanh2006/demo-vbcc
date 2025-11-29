import { ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import QuyetDinhTotNghiepPage from '.';

const QuyetDinhDuThaoPage = () => {
	return (
		<QuyetDinhTotNghiepPage
			trangThai={[ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO, ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA]}
		/>
	);
};

export default QuyetDinhDuThaoPage;
