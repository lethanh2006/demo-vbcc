import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import _ from 'lodash';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectMucDichTraCuuPublic = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	size?: any;
}) => {
	const { value, onChange, multiple, allowClear, hasDefault, style, size } = props;
	const { danhSach, getAllModel } = useModel('vbcc.mucdichtracuuphuluc');

	useEffect(() => {
		getAllModel(undefined, undefined, undefined, undefined, 'public/many').then((data) => {
			// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
			// Thì chọn phần tử đầu tiên
			if (hasDefault && !!onChange) onChange(data?.[0]?._id);
		});
	}, []);

	return (
		<Select
			size={size}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={_.orderBy(danhSach, 'thuTu')
				?.filter((item) => item?.active === true)
				.map((item) => ({
					key: item._id,
					value: item._id,
					label: `${item.ten}`,
				}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn mục đích tra cứu phụ lục'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectMucDichTraCuuPublic;
