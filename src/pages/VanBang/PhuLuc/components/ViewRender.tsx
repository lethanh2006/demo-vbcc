import { Button, Empty, Spin } from 'antd';
import { useIntl, useModel } from 'umi';
import PhuLucDetailView from './PhuLucDetailView';

const ViewPhuLucVanBang = (props: { hasPrint?: boolean; hideFooter?: boolean }) => {
	const intl = useIntl();
	const { record, setVisibleForm, setDataToSignOrPush, setVisiblePrint, loading } = useModel('vbcc.phulucvanbang');
	const { hasPrint = true, hideFooter = false } = props;

	const handlePrintOne = (rec?: any) => {
		if (!rec) return;
		setDataToSignOrPush([rec]);
		setVisiblePrint(true);
	};

	return (
		<>
			<Spin spinning={loading}>
				{record?._id ? <PhuLucDetailView /> : <Empty description='Thông tin văn bằng không tồn tại' />}
			</Spin>

			{hideFooter ? null : (
				<div className='form-footer'>
					{/* {hasPrint && record && (
					<Button type='primary' icon={<FilePdfOutlined />} onClick={() => handlePrintOne(record)}>
						In phụ lục
					</Button>
				)} */}

					<Button onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
					</Button>
				</div>
			)}
		</>
	);
};

export default ViewPhuLucVanBang;
