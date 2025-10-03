import { primaryColor, unitName } from '@/services/base/constant';

const Header = (props: { subTitle?: string }) => {
	const { subTitle = '' } = props;

	return (
		<header
			style={{
				background: `linear-gradient(135deg, ${primaryColor} 0%, #2a6fd6 100%)`,
				padding: '12px 0',
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
				position: 'sticky',
				top: 0,
				zIndex: 100,
				borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
			}}
		>
			<div
				style={{
					maxWidth: 1200,
					margin: '0 auto',
					display: 'flex',
					alignItems: 'center',
					padding: '0 20px',
				}}
			>
				<div
					style={{
						flexShrink: 0,
						display: 'flex',
						alignItems: 'center',
						gap: '16px',
					}}
				>
					<img
						style={{
							width: '70px',
							height: 'auto',
							objectFit: 'contain',
							filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
						}}
						src='/logo-white.png'
						alt='logo'
					/>

					<div
						style={{
							height: '40px',
							width: '1px',
							background: 'rgba(255, 255, 255, 0.2)',
						}}
					/>
				</div>

				<div
					style={{
						marginLeft: '20px',
						textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
					}}
				>
					<h1
						style={{
							fontSize: 'calc(1vw + 12px)',
							fontWeight: 700,
							margin: 0,
							lineHeight: 1.2,
							color: '#ffffffe8',
						}}
					>
						{unitName.toUpperCase()}
					</h1>
					{subTitle && (
						<p
							style={{
								color: '#ffffffe8',
								fontSize: 'calc(0.8vw + 8px)',
								margin: '4px 0 0',
								opacity: 0.9,
								fontWeight: 500,
							}}
						>
							{subTitle.toUpperCase()}
						</p>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
