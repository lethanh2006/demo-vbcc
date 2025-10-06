import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { useIntl, useModel } from 'umi';
import PhuLucDetailView from './PhuLucDetailView';

const ViewPhuLucVanBang = (props: { hasPrint?: boolean }) => {
	const intl = useIntl();
	const { record, setVisibleForm, setDataToSignOrPush, setVisiblePrint } = useModel('vbcc.phulucvanbang');
	const { hasPrint = true } = props;

	const handlePrintOne = (rec?: any) => {
		if (!rec) return;
		setDataToSignOrPush([rec]);
		setVisiblePrint(true);
	};

	return (
		<Card title='Chi tiết phụ lục văn bằng'>
			<PhuLucDetailView />

			<div className='form-footer'>
				{hasPrint && record && (
					<Button type='primary' icon={<FilePdfOutlined />} onClick={() => handlePrintOne(record)}>
						In phụ lục
					</Button>
				)}

				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
				</Button>
			</div>
		</Card>
	);
};

export default ViewPhuLucVanBang;
