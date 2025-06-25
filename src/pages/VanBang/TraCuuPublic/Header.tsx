import { coQuanChuQuan, primaryColor, unitName } from '@/services/base/constant';

const Header = (props: { subTitle?: string }) => {
	const { subTitle = '' } = props;

	return (
		<div
			style={{
				boxShadow: 'rgba(43, 83, 135, 0.08) 0px 3px 8px 0px',
				padding: '10px 0px',
			}}
		>
			<div
				style={{
					maxWidth: 1200,
					margin: 'auto',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ flexShrink: 0 }}>
					<img style={{ width: 70 }} src='/logo.png' alt='logo' />
				</div>

				<div style={{ textAlign: 'center', flex: 1 }}>
					<b style={{ fontSize: 'calc(1vw + 7px)', color: 'rgb(17, 94, 171)' }}>{coQuanChuQuan.toUpperCase()}</b> <br />
					<b style={{ fontSize: 'calc(1vw + 7px)', color: primaryColor }}> {unitName.toUpperCase()}</b>
					<h3 style={{ fontSize: 'calc(0.9vw + 6px)', color: primaryColor }}>{subTitle?.toUpperCase()}</h3>
				</div>
			</div>
		</div>
	);
};

export default Header;
