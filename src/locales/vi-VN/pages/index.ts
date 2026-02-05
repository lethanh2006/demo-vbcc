import danhmuc from './danhmuc';
import login from './login';
import vanbang from './vanbang';

export default {
	...login,
	...vanbang,
	...danhmuc,

	'pages.trangchu.title': 'PHÂN HỆ VĂN VẰNG CHỨNG CHỈ',
	'pages.trangchu.subtitle': 'HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH',
	'pages.gioithieu.title': 'GIỚI THIỆU',
	'pages.gioithieu.subtitle': 'HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH',
};
