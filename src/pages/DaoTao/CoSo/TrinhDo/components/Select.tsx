import { initTrinhDo } from '@/utils/constants';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTrinhDo = (props: {
	value?: string | string[];
	onChange?: (id?: string | string[] | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, hasDefault, style, selectMa, disabled } = props;
	const { danhSach, getAllModel, loading, record, setRecord } = useModel('daotao.trinhdo');

	useEffect(() => {
		if (!danhSach.length)
			getAllModel().then((data) => {
				if (!record?.ma && hasDefault) setRecord(data.find((item) => item.ma === initTrinhDo));
			});
		else if (!record?.ma && hasDefault) setRecord(danhSach.find((item) => item.ma === initTrinhDo));
	}, []);

	return (
		<Select
			disabled={disabled}
			value={value}
			loading={loading}
			allowClear={allowClear}
			onChange={onChange}
			mode={multiple ? 'multiple' : undefined}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten ?? item.dmTrinhDo?.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn trình độ đào tạo'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectTrinhDo;
