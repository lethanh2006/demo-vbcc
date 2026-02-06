import { ELoaiDuLieuBieuMau, loaiDuLieuBieuMau } from '@/services/VanBang/constant';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Space } from 'antd';
import { useIntl } from 'umi';

type CotBang = { headerName: string; type: ELoaiDuLieuBieuMau };

const CauHinhDinhDangBang = ({
	value = [],
	onChange,
	defaultColumns = [],
}: {
	value?: CotBang[];
	onChange?: (val: CotBang[]) => void;
	defaultColumns?: CotBang[];
}) => {
	const intl = useIntl();
	const handleChange = (index: number, field: keyof CotBang, val: any) => {
		const updated = [...value];
		updated[index][field] = val;
		onChange?.(updated);
	};

	const addCot = () => {
		onChange?.([...value, { headerName: '', type: ELoaiDuLieuBieuMau.Text }]);
	};

	const removeCot = (index: number) => {
		// Nếu là cột mặc định thì không cho xóa
		if (index < defaultColumns.length) return;
		const updated = [...value];
		updated.splice(index, 1);
		onChange?.(updated);
	};

	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			{value.map((cot, index) => {
				const isDefault = index < defaultColumns.length;
				return (
					// eslint-disable-next-line react/no-array-index-key
					<Row gutter={12} key={`custom-${index}`}>
						<Col span={12}>
							<Input
								placeholder={intl.formatMessage({ id: 'bieumau.form.cauhinh.cauhinhbang.tenhienthi' })}
								value={cot.headerName}
								disabled={isDefault}
								onChange={(e) => handleChange(index, 'headerName', e.target.value)}
							/>
						</Col>
						<Col span={isDefault ? 12 : 11}>
							<Select
								value={cot.type}
								style={{ width: '100%' }}
								disabled={isDefault}
								options={Object.values(ELoaiDuLieuBieuMau)
									.filter((type) => type !== ELoaiDuLieuBieuMau.Table)
									.map((type) => ({ label: loaiDuLieuBieuMau[type], value: type }))}
								onChange={(val) => handleChange(index, 'type', val)}
							/>
						</Col>
						{!isDefault ? (
							<Col span={1}>
								<Button type='link' icon={<DeleteOutlined />} onClick={() => removeCot(index)} danger />
							</Col>
						) : null}
					</Row>
				);
			})}

			<Button icon={<PlusOutlined />} className='add-column-button' onClick={addCot} type='dashed' block>
				{intl.formatMessage({ id: 'bieumau.form.cauhinh.cauhinhbang.themcot' })}
			</Button>
		</Space>
	);
};

export default CauHinhDinhDangBang;
