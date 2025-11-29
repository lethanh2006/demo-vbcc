import { ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import QuyetDinhTotNghiepPage from '.';

const QuyetDinhDaDuyetPage = () => {
	return <QuyetDinhTotNghiepPage trangThai={[ETrangThaiQuyetDinhTotNghiep.CHINH_THUC]} />;
};

export default QuyetDinhDaDuyetPage;
