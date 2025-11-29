import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CloseCircleOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Alert, Button, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import ViewPhuLucVanBang from '../../PhuLuc/components/ViewRender';

const ThongTinPhuLucXacMinh = (props: { afterAddNew?: (val: number) => void }) => {
	const intl = useIntl();
	const { afterAddNew } = props;
	const { record, setVisibleForm } = useModel('vbcc.xacminhvanbang');
	const { getByIdModel, loading } = useModel('vbcc.phulucvanbang');

	useEffect(() => {
		if (record?.phuLucId) {
			getByIdModel(record.phuLucId);
		}
	}, [record?.phuLucId]);

	return (
		<>
			{record?.phuLucId ? (
				<Spin spinning={loading}>
					<ViewPhuLucVanBang hasPrint={false} />
				</Spin>
			) : (
				<Alert
					message='Không có thông tin phục lục trên hệ thống'
					type='warning'
					showIcon
					icon={<ExclamationCircleOutlined />}
				/>
			)}

			<div className='form-footer'>
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(0);
					}}
					icon={<ArrowLeftOutlined />}
				>
					Quay lại
				</Button>
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(2);
					}}
					icon={<ArrowRightOutlined />}
				>
					Tiếp theo
				</Button>
				<Button onClick={() => setVisibleForm(false)} icon={<CloseCircleOutlined />} danger>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>
		</>
	);
};

export default ThongTinPhuLucXacMinh;
