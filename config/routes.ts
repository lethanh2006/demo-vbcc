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
		access: 'accessFilter',
		maChucNang: 'van-bang-chung-chi|so-van-bang',
	},
	{
		name: 'QuyetDinhTotNghiep',
		path: 'quyet-dinh-tot-nghiep',
		icon: 'FileDoneOutlined',
		routes: [
			{
				name: 'ThongTinQuyetDinh',
				path: 'thong-tin-quyet-dinh',
				component: 'VanBang/QuyetDinhTotNghiep',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|quyet-dinh|tat-ca-quyet-dinh',
			},
			{
				name: 'DanhSachDuThao',
				path: 'danh-sach-du-thao',
				component: 'VanBang/QuyetDinhTotNghiep/DuThao.tsx',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|quyet-dinh|du-thao-can-duyet',
			},
			{
				name: 'QuyetDinhDaDuyet',
				path: 'quyet-dinh-da-duyet',
				component: 'VanBang/QuyetDinhTotNghiep/DaDuyet.tsx',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|quyet-dinh|quyet-dinh-da-duyet',
			},
			{
				name: 'QuyetDinhHoanThanh',
				path: 'quyet-dinh-hoan-thanh',
				component: 'VanBang/QuyetDinhTotNghiep/HoanThanh.tsx',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|quyet-dinh|quyet-dinh-da-duyet',
			},
		],
	},
	{
		name: 'PhuLucVanBang',
		path: 'phu-luc',
		component: 'VanBang/PhuLuc',
		icon: 'ProfileOutlined',
		access: 'accessFilter',
		maChucNang: 'van-bang-chung-chi|thong-tin-van-bang',
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
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|xu-ly-de-xuat|de-xuat-chinh-sua',
			},
			{
				name: 'YeuCauCapLai',
				path: 'yeu-cau-cap-lai',
				component: 'VanBang/PhuLucChinhSua/CapLai.tsx',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|xu-ly-de-xuat|de-xuat-cap-lai',
			},
			{
				name: 'YeuCauThuHoi',
				path: 'yeu-cau-thu-hoi',
				component: 'VanBang/PhuLucChinhSua/ThuHoi.tsx',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|xu-ly-de-xuat|de-xuat-thu-hoi',
			},
		],
	},
	{
		name: 'DotCapBangTotNghiep',
		path: 'dot-cap-bang',
		component: 'VanBang/CapPhatPhuLuc',
		icon: 'CalendarOutlined',
		access: 'accessFilter',
		maChucNang: 'van-bang-chung-chi|cap-phat-van-bang',
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
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|xac-minh-van-bang|tat-ca-yeu-cau',
			},
			{
				name: 'YeuCauXuLy',
				path: 'yeu-cau-xac-minh',
				component: 'VanBang/XacMinhVanBang/XuLy.tsx',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|xac-minh-van-bang|yeu-cau-dang-xu-ly',
			},
			{
				name: 'YeuCauTrinhKy',
				path: 'yeu-cau-can-duyet',
				component: 'VanBang/XacMinhVanBang/TrinhKy.tsx',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|xac-minh-van-bang|yeu-cau-cho-ky',
			},
			{
				name: 'YeuCauHoanThanh',
				path: 'yeu-cau-hoan-thanh',
				component: 'VanBang/XacMinhVanBang/HoanThanh.tsx',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|xac-minh-van-bang|yeu-cau-hoan-thanh',
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

	{
		name: 'ThongKe',
		path: '/thong-ke',
		icon: 'PieChartOutlined',
		component: 'BaoCaoThongKe',
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
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|danh-muc|nguoi-ky-van-bang',
			},
			{
				name: 'BieuMauPhuLuc',
				path: 'bieu-mau',
				component: 'DanhMuc/BieuMauPhuLuc',
				icon: 'FormOutlined',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|danh-muc|bieu-mau-phu-luc',
			},
			{
				name: 'MucDichTraCuuPhuLuc',
				path: 'muc-dich-tra-cuu-phu-luc',
				component: 'DanhMuc/MucDichTraCuuPhuLuc',
				icon: 'SearchOutlined',
				access: 'accessFilter',
				maChucNang: 'van-bang-chung-chi|danh-muc|muc-dich-tra-cuu-phu-luc',
			},
			{
				name: 'HinhThucDaoTao',
				path: 'hinh-thuc-dao-tao',
				component: 'DanhMuc/HinhThucDaoTao',
			},
			{
				name: 'TrinhDoTaoTao',
				path: 'trinh-do-dao-tao',
				component: 'DanhMuc/TrinhDoTaoTao',
			},
			{
				name: 'NganhDaoTao',
				path: 'nganh-dao-tao',
				component: 'DanhMuc/NganhDaoTao',
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
