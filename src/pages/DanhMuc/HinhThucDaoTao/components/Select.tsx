import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHinhThucDaoTao = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<HinhThucDaoTao.IRecord>;
	disabled?: boolean;
	selectMa?: boolean;
	selectTen?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled, selectMa, selectTen } = props;
	const { danhSach, getAllModel } = useModel('danhmuc.hinhthucdaotao');
	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, condition);
	}, [JSON.stringify(condition)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : selectTen ? item.ten : item._id,
				label: [item.ten, item.ma].filter(Boolean).join(' - '),
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'hinhthuc.select' })}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectHinhThucDaoTao;
