export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: 'user/Login',
			},
		],
	},

	// GROUP TITLE
	// {
	// 	name: 'DashboardGroup',
	// 	path: '/__group__/dashboard',
	// 	disabled: true,
	// },

	///////////////////////////////////

	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: 'TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: 'TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		name: 'SoVanBang',
		path: '/so-van-bang',
		component: 'VanBang/SoVanBang',
		icon: 'FileTextOutlined',
	},
	{
		name: 'QuyetDinhTotNghiep',
		path: 'quyet-din-tot-nghiep',
		icon: 'FileDoneOutlined',
		routes: [
			{
				name: 'ThongTinQuyetDinh',
				path: 'thong-tin-quyet-dinh',
				component: 'VanBang/QuyetDinhTotNghiep',
			},
			{
				name: 'DanhSachDuThao',
				path: 'danh-sach-du-thao',
				component: 'VanBang/QuyetDinhTotNghiep/DuThao.tsx',
			},
			{
				name: 'QuyetDinhDaDuyet',
				path: 'quyet-dinh-da-duyet',
				component: 'VanBang/QuyetDinhTotNghiep/DaDuyet.tsx',
			},
		],
	},
	{
		name: 'PhuLucVanBang',
		path: 'phu-luc',
		component: 'VanBang/PhuLuc',
		icon: 'ProfileOutlined',
	},
	{
		name: 'PhuLucYeuCau',
		path: 'phu-luc-yeu-cau',
		icon: 'ProfileOutlined',
		routes: [
			{
				name: 'YeuCauChinhSua',
				path: 'yeu-cau-chinh-sua',
				component: 'VanBang/PhuLucChinhSua/ChinhSua.tsx',
			},
			{
				name: 'YeuCauCapLai',
				path: 'yeu-cau-cap-lai',
				component: 'VanBang/PhuLucChinhSua/CapLai.tsx',
			},
			{
				name: 'YeuCauThuHoi',
				path: 'yeu-cau-thu-hoi',
				component: 'VanBang/PhuLucChinhSua/ThuHoi.tsx',
			},
		],
	},
	{
		name: 'DotCapBangTotNghiep',
		path: 'dot-cap-bang',
		component: 'VanBang/DotCapBangTotNghiep',
		icon: 'CalendarOutlined',
	},
	{
		name: 'XacMinhVanBang',
		path: 'xac-minh-van-bang',
		icon: 'InfoCircleOutlined',
		routes: [
			{
				name: 'ThongTinYeuCau',
				path: 'thong-tin-yeu-cau',
				component: 'VanBang/XacMinhVanBang',
			},
			{
				name: 'YeuCauXuLy',
				path: 'yeu-cau-xac-minh',
				component: 'VanBang/XacMinhVanBang/XuLy.tsx',
			},
			{
				name: 'YeuCauTrinhKy',
				path: 'yeu-cau-can-duyet',
				component: 'VanBang/XacMinhVanBang/TrinhKy.tsx',
			},
			{
				name: 'YeuCauHoanThanh',
				path: 'yeu-cau-hoan-thanh',
				component: 'VanBang/XacMinhVanBang/HoanThanh.tsx',
			},
		],
	},

	{
		name: 'TraCuuVanBangPublic',
		path: '/tra-cuu-van-bang',
		component: 'VanBang/TraCuuPublic',
		layout: false,
		hideInMenu: true,
	},

	{
		name: 'ChiTietVanBangPublic',
		path: '/tra-cuu-van-bang/chi-tiet/:id',
		component: 'VanBang/TraCuuPublic/ChiTiet.tsx',
		layout: false,
		hideInMenu: true,
	},

	// DANH MUC HE THONG
	{
		name: 'DanhMuc',
		path: '/danh-muc',
		icon: 'copy',
		routes: [
			{
				name: 'NguoiKy',
				path: 'nguoi-ky',
				component: 'DanhMuc/NguoiKy',
				icon: 'UserOutlined',
				// access: 'accessFilter',
				// maChucNang: 'van-bang-chung-chi|quan-tri-vien',
			},
			{
				name: 'BieuMauPhuLuc',
				path: 'bieu-mau',
				component: 'DanhMuc/BieuMauPhuLuc',
				icon: 'FormOutlined',
			},
			{
				name: 'MucDichTraCuuPhuLuc',
				path: 'muc-dich-tra-cuu-phu-luc',
				component: 'DanhMuc/MucDichTraCuuPhuLuc',
				icon: 'SearchOutlined',
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: 'subscribe',
				exact: true,
				component: 'ThongBao/Subscribe',
			},
			{
				path: 'check',
				exact: true,
				component: 'ThongBao/Check',
			},
			{
				path: '',
				exact: true,
				component: 'ThongBao/NotifOneSignal',
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
		component: 'exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: 'exception/DangCapNhat',
		layout: false,
	},
	{
		path: '/*',
		component: 'exception/404',
		layout: false,
	},
];
