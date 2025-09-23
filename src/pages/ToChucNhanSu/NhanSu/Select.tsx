import { EOperatorType } from '@/components/Table/constant';
import { ETrangThaiChinhSuaNhanSu } from '@/services/ToChucNhanSu/constant';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SelectNhanSuDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	placeholder?: string;
	maDonVi?: string;
	disabled?: boolean;
	condition?: Partial<ToChucNhanSu.INhanSu>;
	style?: React.CSSProperties;
	isView?: boolean;
	allowClear?: boolean;
}): any => {
	const { value, onChange, multiple, placeholder, maDonVi, disabled, condition, style, allowClear } = props;
	const { danhSach, getModel, loading, searchMultiModel } = useModel('tochucnhansu.nhansu');
	const [keyword, setKeyword] = useState<string>();

	useEffect(() => {
		const cond = { ...condition, trangThaiChinhSua: ETrangThaiChinhSuaNhanSu.DUYET_DANG_AP_DUNG };

		if (keyword) searchMultiModel(keyword, maDonVi, cond);
		else {
			// Nếu trong danh sách đã có 1 giá trị trong `value` rồi thì ko get lại data nữa
			// Nhưng `có thể` bug khi lần đầu render
			const gotData = danhSach.some((item) =>
				Array.isArray(value) ? value.includes(item.ssoId) : value === item.ssoId,
			);
			getModel(
				cond,
				value && !gotData
					? [
							{
								active: true,
								field: 'ssoId',
								values: Array.isArray(value) ? value : [value],
								operator: EOperatorType.INCLUDE,
							},
					  ]
					: !!maDonVi
					? [{ active: true, field: 'maDonVi', values: [maDonVi], operator: EOperatorType.INCLUDE }]
					: undefined,
				undefined,
				1,
				20,
			);
		}
	}, [keyword, value, JSON.stringify(condition)]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setKeyword(val);
	}, 800);

	const dataView = danhSach.find((item) => item.ssoId === value);

	return props.isView ? (
		`${dataView?.hoDem ?? ''} ${dataView?.ten ?? ''} - ${dataView?.maCanBo ?? ''}`
	) : (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			onSearch={(val) => searchDebounceSinhVien(val)}
			loading={loading}
			notFoundContent={
				loading ? (
					<Spin spinning={true} tip='Đang tìm kiếm...' style={{ width: '100%', margin: 10 }} />
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu, hãy thử nhập từ khóa khác!' />
				)
			}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item.ssoId,
				label: `${item.hoDem ?? ''} ${item.ten ?? ''} - ${item.maCanBo ?? ''} - ${item.donViChinh?.ten ?? ''}`,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder || 'Chọn cán bộ, giảng viên (tìm kiếm theo họ tên hoặc mã nhân sự)'}
			style={{ width: '100%', ...style }}
			showArrow
			allowClear={allowClear}
		/>
	);
};

export default SelectNhanSuDebounce;
