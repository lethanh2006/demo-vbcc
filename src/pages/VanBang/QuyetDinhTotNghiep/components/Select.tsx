import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectQuyetDinhTotNghiep = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<QuyetDinhTotNghiep.IRecord>;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, placeholder, disabled, hasDefault, style, isSetRecord, condition } =
		props;
	const { danhSach, getAllModel } = useModel('vbcc.quyetdinhtotnghiep');

	useEffect(() => {
		getAllModel(isSetRecord, undefined, condition).then((data) => {
			// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
			// Thì chọn phần tử đầu tiên
			if (hasDefault && data.length === 1 && !!onChange) onChange(data[0]._id);
		});
	}, [JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.soQuyetDinh,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'qdtotnghiep.select.quyetdinh' })}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectQuyetDinhTotNghiep;
