import { Col, Row, Typography } from 'antd';
import './style.less';

const { Title, Text } = Typography;

const TitlePrint = () => {
	return (
		<div className='to-print'>
			<Row justify='center' className='title-print-wrapper'>
				<Col>
					<div className='title-print-content'>
						<Title level={4} className='title-main'>
							THÔNG TIN VỀ NỘI DUNG IN TRÊN PHÔI VĂN BẰNG ĐẠI HỌC
						</Title>

						<Text className='title-sub'>
							(Kèm theo hợp đồng số ...... /HĐ-HV/IB2025 ngày ...... tháng ...... năm ......)
						</Text>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default TitlePrint;
