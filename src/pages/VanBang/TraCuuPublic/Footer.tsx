import { primaryColor, unitName } from '@/services/base/constant';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import './style.less';

const Footer = () => {
	return (
		<footer
			style={{
				background: `linear-gradient(135deg, ${primaryColor} 0%, #1a3e7a 100%)`,
				color: 'white',
				padding: '40px 0 20px',
				borderTop: '1px solid rgba(255, 255, 255, 0.1)',
			}}
		>
			<div
				style={{
					maxWidth: 1200,
					margin: '0 auto',
					padding: '0 20px',
				}}
			>
				<Row gutter={[30, 30]}>
					<Col xs={24} md={12}>
						<div style={{ marginBottom: '24px' }}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '12px',
									marginBottom: '16px',
								}}
							>
								<img
									src='/logo.png'
									alt='Logo'
									style={{
										width: '60px',
										height: 'auto',
										filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
									}}
								/>
								<h3
									style={{
										fontSize: '20px',
										fontWeight: '600',
										margin: 0,
										color: '#fff',
									}}
								>
									{unitName.toUpperCase()}
								</h3>
							</div>

							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '12px',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'flex-start' }}>
									<EnvironmentOutlined
										style={{
											marginRight: '12px',
											fontSize: '18px',
											marginTop: '2px',
											flexShrink: 0,
										}}
									/>
									<span>182 Lê Duẩn - Thành phố Vinh - Tỉnh Nghệ An</span>
								</div>

								<div style={{ display: 'flex', alignItems: 'center' }}>
									<PhoneOutlined
										style={{
											marginRight: '12px',
											fontSize: '18px',
											flexShrink: 0,
										}}
									/>
									<span>Điện thoại: (0238) 3855 452</span>
								</div>

								<div style={{ display: 'flex', alignItems: 'center' }}>
									<MailOutlined
										style={{
											marginRight: '12px',
											fontSize: '18px',
											flexShrink: 0,
										}}
									/>
									<span>Email: dhvinh@vinhuni.edu.vn</span>
								</div>
							</div>
						</div>

						<div
							style={{
								background: 'rgba(255, 255, 255, 0.1)',
								borderRadius: '8px',
								padding: '16px',
								backdropFilter: 'blur(5px)',
							}}
						>
							<h4
								style={{
									fontSize: '16px',
									fontWeight: '600',
									marginBottom: '12px',
									color: '#fff',
								}}
							>
								Phòng Đào tạo
							</h4>
							<p style={{ marginBottom: '8px' }}>
								<EnvironmentOutlined style={{ marginRight: '8px' }} />
								Tầng 1 Nhà A1, 182 Lê Duẩn, TP. Vinh
							</p>
							<p style={{ marginBottom: '0' }}>
								<PhoneOutlined style={{ marginRight: '8px' }} />
								Điện thoại: (0238) 3855 452 (máy lẻ 203)
							</p>
						</div>
					</Col>

					<Col xs={24} md={12}>
						<div
							style={{
								height: '280px',
								borderRadius: '8px',
								overflow: 'hidden',
								boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
								border: '1px solid rgba(255, 255, 255, 0.2)',
							}}
						>
							<iframe
								src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.1048508214276!2d105.69253772543162!3d18.659290332461474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139cddf0bf20f23%3A0x86154b56a284fa6d!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBWaW5o!5e0!3m2!1svi!2s!4v1758022274592!5m2!1svi!2s'
								width='100%'
								height='100%'
								style={{ border: 0 }}
								allowFullScreen
								loading='lazy'
								title={`Bản đồ ${unitName.toUpperCase()}`}
							/>
						</div>

						<div
							style={{
								marginTop: '20px',
								textAlign: 'center',
								padding: '12px',
								background: 'rgba(0, 0, 0, 0.1)',
								borderRadius: '8px',
							}}
						>
							<p style={{ marginBottom: '4px', fontSize: '14px' }}>
								<strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6 (7h30 - 11h30, 13h30 - 17h00)
							</p>
						</div>
					</Col>
				</Row>

				<div
					style={{
						textAlign: 'center',
						marginTop: '40px',
						paddingTop: '20px',
						borderTop: '1px solid rgba(255, 255, 255, 0.1)',
						fontSize: '14px',
					}}
				>
					<p style={{ marginBottom: '8px' }}>
						<strong>
							© {new Date().getFullYear()} Bản quyền thuộc về {unitName.toUpperCase()}
						</strong>
					</p>
					<p style={{ marginBottom: 0, opacity: 0.8 }}>
						Phát triển bởi Phòng Công nghệ Thông tin - {unitName.toUpperCase()}
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
