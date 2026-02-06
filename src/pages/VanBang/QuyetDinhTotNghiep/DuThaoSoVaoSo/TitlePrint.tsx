import { Col, Row, Typography } from 'antd';
import { useIntl } from 'umi';
import './style.less';

const { Title, Text } = Typography;

const TitlePrint = () => {
	const intl = useIntl();
	return (
		<div className='to-print'>
			<Row justify='center' className='title-print-wrapper'>
				<Col>
					<div className='title-print-content'>
						<Title level={4} className='title-main'>
							{intl.formatMessage({ id: 'qdtotnghiep.title.print' })}
						</Title>

						<Text className='title-sub'>{intl.formatMessage({ id: 'qdtotnghiep.title.print.sub' })}</Text>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default TitlePrint;
