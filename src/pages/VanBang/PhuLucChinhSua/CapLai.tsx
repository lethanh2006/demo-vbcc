import { useIntl } from 'umi';
import PhuLucChinhSuaPage from '.';

const YeCauCapLai = () => {
	const intl = useIntl();
	return <PhuLucChinhSuaPage title={intl.formatMessage({ id: 'xulydexuat.title.caplai' })} />;
};

export default YeCauCapLai;
