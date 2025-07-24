import { Button, Col, Input, Row, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

type CotTranscript = { ma: string; headerName: string };

const CauHinhBangDiemSinhVien = ({
	value = [],
	onChange,
	disabled,
}: {
	value?: CotTranscript[];
	onChange?: (val: CotTranscript[]) => void;
	disabled?: boolean;
}) => {
	const handleChange = (index: number, field: keyof CotTranscript, val: string) => {
		if (disabled) return;
		const updated = [...value];
		updated[index][field] = val;
		onChange?.(updated);
	};

	const addCot = () => {
		onChange?.([...value, { ma: '', headerName: '' }]);
	};

	const removeCot = (index: number) => {
		const updated = [...value];
		updated.splice(index, 1);
		onChange?.(updated);
	};

	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			{value.map((cot, index) => (
				<Row gutter={12} key={index}>
					<Col span={10}>
						<Input placeholder='Mã cột' value={cot.ma} onChange={(e) => handleChange(index, 'ma', e.target.value)} />
					</Col>
					<Col span={10}>
						<Input
							placeholder='Tên hiển thị'
							value={cot.headerName}
							onChange={(e) => handleChange(index, 'headerName', e.target.value)}
						/>
					</Col>
					<Col span={4}>
						<Button type='link' icon={<DeleteOutlined />} onClick={() => removeCot(index)} danger />
					</Col>
				</Row>
			))}
			<Button icon={<PlusOutlined />} style={{ width: '86%', marginRight: 30 }} onClick={addCot} type='dashed' block>
				Thêm cột bảng điểm
			</Button>
		</Space>
	);
};

export default CauHinhBangDiemSinhVien;
