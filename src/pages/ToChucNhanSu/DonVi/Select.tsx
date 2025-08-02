import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDonVi = (props: {
	value?: string;
	onChange?: (val: string, option: any) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	allowClear?: boolean;
	placeholder?: string;
	fieldValue?: any;
}) => {
	const { value, onChange, multiple, disabled, style, allowClear, placeholder, fieldValue } = props;
	const { danhSach, getAllModel, loading } = useModel('tochucnhansu.donvi');

	useEffect(() => {
		getAllModel();
	}, []);

	return (
		<Select
			loading={loading}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item: any) => ({
				key: item._id,
				value: fieldValue ? item?.[fieldValue] : item.maDonVi,
				label: `${item.ten || item?.tenDonVi} (${item.maDonVi ?? ''})`,
				rawData: item,
			}))}
			showSearch
			showArrow
			optionFilterProp='label'
			placeholder={placeholder || 'Chọn đơn vị'}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectDonVi;
