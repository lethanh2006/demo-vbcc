import bieumau from './bieumau';
import hinhthuc from './hinhthuc';
import mucdich from './mucdich';
import nganh from './nganh';
import nguoiky from './nguoiky';
import trinhdo from './trinhdo';

export default {
	...nguoiky,
	...bieumau,
	...mucdich,
	...hinhthuc,
	...trinhdo,
	...nganh,
};
