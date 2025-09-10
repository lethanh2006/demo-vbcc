import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { Button } from 'antd';
import { useIntl, useModel } from 'umi';

const PreviewIPFS = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { record } = useModel('vbcc.phulucvanbang');

	return (
		<ModalExpandable
			title='Chi tiết tập tin văn bằng'
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={1000}
		>
			<PreviewFile file={record?.urlIpfs ?? ''} />

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</ModalExpandable>
	);
};

export default PreviewIPFS;
