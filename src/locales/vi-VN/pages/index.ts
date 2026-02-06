import capphatvanbang from './capphatvanbang';
import dotcapbang from './dotcapbang';
import login from './login';
import quyetdinhtotnghiep from './quyetdinhtotnghiep';
import sovanbang from './sovanbang';
import thongke from './thongke';
import thongtinvanbang from './thongtinvanbang';
import tracuupublic from './tracuupublic';
import trangchu from './trangchu';
import xacminhvanbang from './xacminhvanbang';
import xulydexuat from './xulydexuat';

export default {
	...login,
	...trangchu,
	...sovanbang,
	...quyetdinhtotnghiep,
	...thongtinvanbang,
	...xulydexuat,
	...capphatvanbang,
	...xacminhvanbang,
	...thongke,
	...tracuupublic,
	...dotcapbang,

	'pages.trangchu.title': 'PHÂN HỆ VĂN VẰNG CHỨNG CHỈ',
	'pages.trangchu.subtitle': 'HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH',
	'pages.gioithieu.title': 'GIỚI THIỆU',
	'pages.gioithieu.subtitle': 'HỆ THỐNG PHẦN MỀM CHỈ ĐẠO, ĐIỀU HÀNH',
};
