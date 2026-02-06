import { Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel, useParams } from 'umi';
import PhuLucDetailView from '../PhuLuc/components/PhuLucDetailView';
import Footer from './Footer';
import Header from './Header';
import './style.less';

const ChiTietTraCuuVanBang = () => {
	const intl = useIntl();
	const { id } = useParams<{ id: string }>();
	const { chiTietPhuLucVanBanPublicModel, record, loading } = useModel('vbcc.phulucvanbang');

	useEffect(() => {
		document.title = `${intl.formatMessage({ id: 'menu.ChiTietVanBangPublic' })} - ` + APP_CONFIG_TITLE_VBCC;
	}, []);

	const getData = () => {
		if (id) chiTietPhuLucVanBanPublicModel(id);
	};

	useEffect(() => {
		getData();
	}, [id]);

	return (
		<>
			<Header subTitle={APP_CONFIG_TITLE_VBCC} />

			<Spin spinning={loading}>
				<div style={{ maxWidth: 1200, margin: 'auto', paddingTop: 30, paddingBottom: 30 }}>
					<div style={{ textAlign: 'center', fontSize: 22, marginBottom: 36 }}>
						<b>{intl.formatMessage({ id: 'tracuupublic.chitiet.title' })}</b>
					</div>

					{record?._id ? (
						<PhuLucDetailView isPublic />
					) : (
						<Empty
							description={intl.formatMessage({ id: 'tracuupublic.chitiet.empty' })}
							style={{ marginBottom: 32, marginTop: 32 }}
						/>
					)}
				</div>
			</Spin>
			<Footer />
		</>
	);
};

export default ChiTietTraCuuVanBang;
