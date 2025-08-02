import { Button, Col, Input, Row, Select, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ELoaiDuLieuBieuMau, loaiDuLieuBieuMau } from '@/services/VanBang/constant';

type CotBang = { ma: string; headerName: string; type: ELoaiDuLieuBieuMau };

const CauHinhDinhDangBang = ({ value = [], onChange }: { value?: CotBang[]; onChange?: (val: CotBang[]) => void }) => {
	const handleChange = (index: number, field: keyof CotBang, val: any) => {
		const updated = [...value];
		updated[index][field] = val;
		onChange?.(updated);
	};

	const addCot = () => {
		onChange?.([...value, { ma: '', headerName: '', type: ELoaiDuLieuBieuMau.Text }]);
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
					<Col span={6}>
						<Input placeholder='Mã cột' value={cot.ma} onChange={(e) => handleChange(index, 'ma', e.target.value)} />
					</Col>
					<Col span={8}>
						<Input
							placeholder='Tên hiển thị'
							value={cot.headerName}
							onChange={(e) => handleChange(index, 'headerName', e.target.value)}
						/>
					</Col>
					<Col span={8}>
						<Select
							value={cot.type}
							style={{ width: '100%' }}
							options={Object.values(ELoaiDuLieuBieuMau)
								.filter((type) => type !== ELoaiDuLieuBieuMau.Table)
								.map((type) => ({ label: loaiDuLieuBieuMau[type], value: type }))}
							onChange={(val) => handleChange(index, 'type', val)}
						/>
					</Col>
					<Col span={2}>
						<Button type='link' icon={<DeleteOutlined />} onClick={() => removeCot(index)} danger />
					</Col>
				</Row>
			))}
			<Button icon={<PlusOutlined />} className='add-column-button' onClick={addCot} type='dashed' block>
				Thêm cột
			</Button>
		</Space>
	);
};

export default CauHinhDinhDangBang;
