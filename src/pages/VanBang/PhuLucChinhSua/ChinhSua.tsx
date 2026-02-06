import { useIntl } from 'umi';
import PhuLucChinhSuaPage from '.';

const YeuCauChinhSua = () => {
	const intl = useIntl();
	return <PhuLucChinhSuaPage title={intl.formatMessage({ id: 'xulydexuat.title.chinhsua' })} />;
};

export default YeuCauChinhSua;
