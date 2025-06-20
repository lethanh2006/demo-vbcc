import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNamHoc = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	hasDefault?: boolean;
	selectMa?: boolean;
	disabled?: boolean;
	loadData?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, disabled, hasDefault, selectMa, loadData } = props;
	const { danhSach, getAllModel, record, setRecord } = useModel('daotao.namhoc');
	const { record: recHocKy } = useModel('daotao.hocky');

	useEffect(() => {
		if (loadData !== false)
			getAllModel(undefined, { ma: -1 }).then((res) => {
				const namHoc1 = record?.ma ? res.find((i) => i.ma === record.ma) ?? res?.[0] : res?.[0];
				if (hasDefault && onChange) {
					const namHoc = recHocKy?.ma ? res.find((i) => i._id === recHocKy.namHocId) : namHoc1;
					onChange(selectMa ? namHoc?.ma : namHoc?._id);
					if (isSetRecord) setRecord(namHoc);
				} else if (isSetRecord) {
					setRecord(namHoc1);
				}
			});
	}, [loadData]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn năm học'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectNamHoc;
