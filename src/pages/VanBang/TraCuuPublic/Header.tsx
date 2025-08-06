import { primaryColor, unitName } from '@/services/base/constant';

const Header = (props: { subTitle?: string }) => {
	const { subTitle = '' } = props;

	return (
		<header className='header-vbcc' style={{ background: primaryColor }}>
			<div className='container'>
				<div className='logo-section'>
					<img className='logo' src='/logo.png' alt='logo' />
					<div className='divider' />
				</div>

				<div className='title-section'>
					<h1>{unitName.toUpperCase()}</h1>
					{subTitle && <p>{subTitle.toUpperCase()}</p>}
				</div>
			</div>
		</header>
	);
};

export default Header;
