import { useIntl } from 'umi';
import PhuLucChinhSuaPage from '.';

const YeuCauThuHoi = () => {
	const intl = useIntl();
	return <PhuLucChinhSuaPage title={intl.formatMessage({ id: 'xulydexuat.title.thuhoi' })} />;
};

export default YeuCauThuHoi;
