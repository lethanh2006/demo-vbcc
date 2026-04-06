import { Card, Tabs } from 'antd';
import { useIntl, useModel } from 'umi';
import TabBieuMauPhoiBang from './TabBieuMauPhoiBang';
import TabDanhSachPhoiBang from './TabDanhSachPhoiBang';
import TabLichSu from './TabLichSu';

const FormQuanLyPhoiBang = () => {
	const { edit, isView } = useModel('vbcc.bieumauphoibang');
	const intl = useIntl();

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'global.title.chinhsua' }) : isView ? 'Chi tiết' : intl.formatMessage({ id: 'global.title.themmoi' })} phôi bằng `}
		>
			{isView ? (
				<Tabs
					defaultActiveKey='1'
					items={[
						{
							key: '1',
							label: 'Biểu mẫu phôi bằng',
							children: <TabBieuMauPhoiBang />,
						},
						{
							key: '2',
							label: 'Danh sách phôi bằng',
							children: <TabDanhSachPhoiBang />,
						},
						{
							key: '3',
							label: 'Lịch sử',
							children: <TabLichSu />,
						},
					]}
				/>
			) : (
				<TabBieuMauPhoiBang />
			)}
		</Card>
	);
};

export default FormQuanLyPhoiBang;
