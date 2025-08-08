import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectQuyetDinhTotNghiepDot = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, disabled, style, isSetRecord } = props;
	const { record: recDot } = useModel('vbcc.dotcapbangtotnghiep');
	const { dsAllQuyeDinh, setDsAllQuyetDinh, getAllModel } = useModel('vbcc.quyetdinhtotnghiep');

	useEffect(() => {
		if (recDot?._id)
			getAllModel(isSetRecord, undefined, { dotCapBangId: recDot?._id }, undefined, undefined, false)
				.then((res) => setDsAllQuyetDinh(res))
				.catch((err) => console.log(err));
	}, [recDot?._id]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={dsAllQuyeDinh.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.soQuyetDinh,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn quyết định tốt nghiệp'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectQuyetDinhTotNghiepDot;
