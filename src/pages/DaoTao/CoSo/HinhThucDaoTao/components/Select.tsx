import { initHinhThuc } from '@/utils/constants';
import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHinhThuc = (props: {
	value?: string | string[];
	onChange?: (id?: string | string[] | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	selectMa?: boolean;
	hasDefault?: boolean;
	disabled?: boolean;
	hideAll?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, style, selectMa, hasDefault, disabled, hideAll } = props;
	const { danhSach, getAllModel, loading, record, setRecord } = useModel('daotao.hinhthucdaotao');
	const dataHienThi =
		hasDefault || hideAll ? danhSach : [{ _id: null, ten: 'Tất cả hình thức đào tạo', ma: null }, ...danhSach];

	useEffect(() => {
		if (!danhSach.length)
			getAllModel().then((data) => {
				if (!record?.ma && hasDefault) setRecord(data.find((item) => item.ma === initHinhThuc));
			});
		else if (!record?.ma && hasDefault) setRecord(danhSach.find((item) => item.ma === initHinhThuc));
	}, []);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value || null}
			loading={loading}
			onChange={onChange}
			options={dataHienThi.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item?.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn hình thức đào tạo'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectHinhThuc;
