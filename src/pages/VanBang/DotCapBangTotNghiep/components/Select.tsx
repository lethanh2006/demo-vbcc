import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectDotCapBangTotNghiep = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	hasDefault?: boolean;
	style?: React.CSSProperties;
}) => {
	const { value, onChange, multiple, allowClear, hasDefault, style } = props;
	const intl = useIntl();
	const { danhSach, getAllModel } = useModel('vbcc.dotcapbangtotnghiep');

	useEffect(() => {
		getAllModel().then((data) => {
			// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
			// Thì chọn phần tử đầu tiên
			if (hasDefault && !!onChange) onChange(data?.[0]?._id);
		});
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'dotcapbang.select.placeholder' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectDotCapBangTotNghiep;
