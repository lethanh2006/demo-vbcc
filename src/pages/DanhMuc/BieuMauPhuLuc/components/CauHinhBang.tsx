import { ELoaiDuLieuBieuMau, loaiDuLieuBieuMau } from '@/services/VanBang/constant';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Space } from 'antd';

type CotBang = { headerName: string; type: ELoaiDuLieuBieuMau };

const CauHinhDinhDangBang = ({ value = [], onChange }: { value?: CotBang[]; onChange?: (val: CotBang[]) => void }) => {
	const handleChange = (index: number, field: keyof CotBang, val: any) => {
		const updated = [...value];
		updated[index][field] = val;
		onChange?.(updated);
	};

	const addCot = () => {
		onChange?.([...value, { headerName: '', type: ELoaiDuLieuBieuMau.Text }]);
	};

	const removeCot = (index: number) => {
		const updated = [...value];
		updated.splice(index, 1);
		onChange?.(updated);
	};

	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			{value.map((cot, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<Row gutter={12} key={`custom-${index}`}>
					<Col span={12}>
						<Input
							placeholder='Tên hiển thị'
							value={cot.headerName}
							onChange={(e) => handleChange(index, 'headerName', e.target.value)}
						/>
					</Col>
					<Col span={11}>
						<Select
							value={cot.type}
							style={{ width: '100%' }}
							options={Object.values(ELoaiDuLieuBieuMau)
								.filter((type) => type !== ELoaiDuLieuBieuMau.Table)
								.map((type) => ({ label: loaiDuLieuBieuMau[type], value: type }))}
							onChange={(val) => handleChange(index, 'type', val)}
						/>
					</Col>
					<Col span={1}>
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
