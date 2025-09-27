import { Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel, useParams } from 'umi';
import Footer from './Footer';
import Header from './Header';
import PhuLucDetailView from './PhuLucDetailView';
import './style.less';

const ChiTietTraCuuVanBang = () => {
	const { id } = useParams<{ id: string }>();
	const { chiTietPhuLucVanBanPublicModel, record, loading } = useModel('vbcc.phulucvanbang');

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
						<b>Chi tiết thông tin văn bằng</b>
					</div>

					{record?._id ? (
						<PhuLucDetailView record={record} isPublic />
					) : (
						<Empty description='Không có thông tin sinh viên' style={{ marginBottom: 32, marginTop: 32 }} />
					)}
				</div>
			</Spin>
			<Footer />
		</>
	);
};

export default ChiTietTraCuuVanBang;
