import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select học kỳ đưa vào FormItem
 */
const SelectHocKy = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: Partial<HocKy.IRecord>;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	selectLatest?: boolean;
	filters?: any;
	loadData?: boolean;
}) => {
	const {
		value,
		onChange,
		multiple,
		condition,
		allowClear,
		style,
		isSetRecord,
		selectMa,
		selectLatest,
		disabled,
		filters,
		loadData,
	} = props;

	const { danhSach, getAllModel, loading, record, setRecord } = useModel('daotao.hocky');

	useEffect(() => {
		if (loadData !== false) {
			getAllModel(undefined, { ma: -1 }, condition, filters).then((res) => {
				if (isSetRecord) {
					let hocKy: HocKy.IRecord | undefined;

					// 1. Ưu tiên theo record.ma
					if (record?.ma) {
						hocKy = res.find((i) => i.ma === record.ma) ?? res?.[0];
					}
					// 2. Nếu không có record.ma và có yêu cầu lấy latest
					else if (selectLatest) {
						hocKy = res?.[0];
					}
					// 3. Nếu không thì ưu tiên học kỳ hiện tại
					else {
						hocKy = res.find((i) => i.kyHienTai) ?? res?.[0];
					}

					setRecord(hocKy);
				}
			});
		}
	}, [JSON.stringify(condition), JSON.stringify(filters), loadData]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn kỳ học'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectHocKy;
