import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectHocKy from './SelectHocKy';
import SelectNamHoc from '../NamHoc/Select';

const FilterHocKy = (props: {
	width?: number;
	isSetHocKy?: boolean;
	allowClear?: boolean;
	hideExpand?: boolean;
	children?: React.ReactNode;
	childrenMinus?: React.ReactNode;
	style?: React.CSSProperties;
	selectLatest?: boolean;
}) => {
	const { record: recHocKy, danhSach: danhSachHocKy, setRecord: setHocKy } = useModel('daotao.hocky');
	const [namHocId, setNamHocId] = useState<string>();
	const [visibleOption, setVisibleOption] = useState(false);
	const [allHocKy, setAllHocKy] = useState(false);
	const width = props.width ?? 250;

	return (
		<div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', ...props.style }}>
			{visibleOption ? (
				<>
					<Tooltip title='Ẩn bộ lọc'>
						<Button icon={<MinusOutlined />} onClick={() => setVisibleOption(false)} type='dashed' />
					</Tooltip>
					<SelectNamHoc
						style={{ width: 200 }}
						allowClear
						value={namHocId}
						onChange={(val) => setNamHocId(val)}
						hasDefault
					/>
					<Checkbox checked={allHocKy} onChange={(e) => setAllHocKy(e.target.checked)}>
						Hiển thị các học kỳ đã ẩn
					</Checkbox>
				</>
			) : !props.hideExpand ? (
				<Tooltip title='Mở rộng bộ lọc'>
					<Button icon={<PlusOutlined />} onClick={() => setVisibleOption(true)} type='dashed' />
				</Tooltip>
			) : null}

			<SelectHocKy
				style={{ width }}
				allowClear={props.allowClear}
				condition={{ namHocId, active: allHocKy ? undefined : true }}
				value={recHocKy?._id}
				onChange={(val) => setHocKy(danhSachHocKy.find((item) => item._id === val))}
				isSetRecord={props.isSetHocKy && (!!namHocId || !recHocKy?._id)}
				selectLatest={props.selectLatest}
			/>

			{visibleOption ? props.childrenMinus : null}

			{props.children}
		</div>
	);
};

export default FilterHocKy;
