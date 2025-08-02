import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectBieuMauPhuLuc = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, hasDefault, style, selectMa, disabled } = props;
	const { danhSach, getAllModel } = useModel('vbcc.bieumauphuluc');

	useEffect(() => {
		getAllModel().then((data) => {
			// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
			// Thì chọn phần tử đầu tiên
			if (hasDefault && !!onChange) onChange(selectMa ? data?.[0]?.ma : data?.[0]?._id);
		});
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			disabled={disabled}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} - ${item.ma}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn biểu mẫu phụ lục'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectBieuMauPhuLuc;
