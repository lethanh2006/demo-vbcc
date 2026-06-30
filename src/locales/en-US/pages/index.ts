import capphatvanbang from './capphatvanbang';
import danhmuc from './danhmuc';
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
import quanlyphoivanbang from './phoivanbang';

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
	...danhmuc,
	...quanlyphoivanbang,

	'pages.trangchu.title': 'DOCUMENT MANAGEMENT',
	'pages.trangchu.subtitle': 'COMMAND AND CONTROL SOFTWARE SYSTEM',
	'pages.gioithieu.title': 'ABOUT',
	'pages.gioithieu.subtitle': 'COMMAND AND CONTROL SOFTWARE SYSTEM',
};
