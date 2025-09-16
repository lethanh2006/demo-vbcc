import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd/es/date-picker';
import locale from 'antd/es/date-picker/locale/vi_VN';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const MyDatePicker = (
	props: Omit<DatePickerProps<Dayjs>, 'onChange' | 'value'> & {
		/**
		 * Format hiển thị, mặc định: DD/MM/YYYY
		 */
		format?: string;
		pickerStyle?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
		showTime?:
			| boolean
			| {
					format?: string;
					showNow?: boolean;
					showHour?: boolean;
					showMinute?: boolean;
					showSecond?: boolean;
					use12Hours?: boolean;
					hourStep?: number;
					minuteStep?: number;
					secondStep?: number;
			  };
		allowClear?: boolean;
		disabled?: boolean;

		/**
		 * Format lưu lại, mặc định: ISOString
		 */
		saveFormat?: string;

		disabledDate?: (cur: Dayjs | null) => boolean;
		onChange?: (arg: string | null, date?: Dayjs | null) => any;
		value?: string | Dayjs | null;
	},
) => {
	const format = props?.format ?? 'DD/MM/YYYY';
	const { saveFormat, pickerStyle, disabledDate, showTime, allowClear, disabled } = props;

	let dateValue: Dayjs | null = null;
	if (props.value) {
		if (typeof props.value === 'string') {
			const d = dayjs(props.value, saveFormat || undefined);
			dateValue = d.isValid() ? d : null;
		} else {
			dateValue = props.value as Dayjs;
		}
	}

	const handleChange = (value: Dayjs | null) => {
		if (props.onChange) {
			if (value) {
				props.onChange(saveFormat ? value.format(saveFormat) : value.toISOString(), value);
			} else {
				props.onChange(null, null);
			}
		}
	};

	return (
		<DatePicker
			style={{ width: '100%' }}
			{...props}
			format={format}
			picker={pickerStyle}
			locale={locale}
			value={dateValue}
			onChange={handleChange}
			disabledDate={disabledDate}
			showTime={showTime}
			allowClear={allowClear}
			disabled={disabled}
		/>
	);
};

export default MyDatePicker;
