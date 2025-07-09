export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	{
		name: 'SoVanBang',
		path: '/so-van-bang',
		component: './VanBang/SoVanBang',
		icon: 'FileTextOutlined',
	},

	{
		name: 'QuyetDinhTotNghiep',
		path: './quyet-dinh',
		component: 'VanBang/QuyetDinhTotNghiep',
		icon: 'FileDoneOutlined',
	},
	{
<<<<<<< HEAD
		name: 'MucDichTraCuuPhuLuc',
		path: './muc-dich-tra-cuu-phu-luc',
		component: 'VanBang/MucDichTraCuuPhuLuc',
		icon: 'SearchOutlined',
=======
		name: 'DotCapBangTotNghiep',
		path: './dot-cap-bang',
		component: 'VanBang/DotCapBangTotNghiep',
		icon: 'CalendarOutlined',
>>>>>>> main
	},
	{
		name: 'PhuLucVanBang',
		path: './phu-luc',
		component: 'VanBang/PhuLuc',
		icon: 'ProfileOutlined',
	},
	{
		name: 'BieuMauPhuLuc',
		path: './bieu-mau',
		component: 'VanBang/BieuMauPhuLuc',
		icon: 'FormOutlined',
	},
	{
		name: 'NguoiKy',
		path: './nguoi-ky',
		component: 'VanBang/NguoiKy',
		icon: 'UserOutlined',
		access: 'accessFilter',
		maChucNang: 'van-bang-chung-chi|quan-tri-vien',
	},
	{
		name: 'TraCuuVanBangPublic',
		path: '/tra-cuu-van-bang',
		component: './VanBang/TraCuuPublic',
		layout: false,
		hideInMenu: true,
	},

	{
		name: 'ChiTietVanBangPublic',
		path: '/tra-cuu-van-bang/chi-tiet/:id',
		component: './VanBang/TraCuuPublic/ChiTiet.tsx',
		layout: false,
		hideInMenu: true,
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
