import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNguoiKyVanBang = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	hasDefault?: boolean;
	style?: React.CSSProperties;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, hasDefault, style } = props;
	const { danhSach, getAllModel } = useModel('vbcc.nguoiky');

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
				label: `${item.hoTen} - ${item.chucVu ?? ''}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'nguoiky.select' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectNguoiKyVanBang;
