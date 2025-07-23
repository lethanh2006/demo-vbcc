import ButtonExtend from '@/components/Table/ButtonExtend';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import {
	ELoaiDuLieuBieuMau,
	allowElementBieuMau,
	defaultColumnsByType,
	defaultElementBieuMau,
	loaiDuLieuBieuMau,
} from '@/services/VanBang/constant';
import rules from '@/utils/rules';
import { DeleteOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Col, Form, Row, Select } from 'antd';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd';
import CauHinhDinhDangBang from './CauHinhBang';
import CauHinhBangDiemSinhVien from './TranscriptTable';

const ElementBieuMauFormItem = (props: {
	value?: BieuMauPhuLuc.TElement[];
	onChange?: (val: BieuMauPhuLuc.TElement[]) => void;
}) => {
	const { onChange } = props;
	const elements = props.value ?? [];
	const [searchoptions, setSearchOptions] = useState<{ value: string }[]>(
		allowElementBieuMau.map((item) => ({
			value: item.headerName,
		})),
	);

	const addElement = () => {
		const temp = elements.slice();
		temp.push({ headerName: '', type: ELoaiDuLieuBieuMau.Text });
		if (onChange) onChange(temp);
	};

	const removeElement = async (index: number) => {
		const temp = elements.slice();
		temp?.splice(index, 1);
		if (onChange) onChange(temp);
	};

	const onDragEnd = (result: DropResult) => {
		const { destination, source } = result;
		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		const temp = elements.slice();
		const sourceElement = elements[source.index];

		temp.splice(source.index, 1); // remove form source index
		temp.splice(destination.index, 0, sourceElement); // Insert that element into destination index
		if (onChange) onChange(temp);
	};

	const onSearchHeader = (searchText: string) => {
		setSearchOptions(
			allowElementBieuMau
				.filter((item) => item.headerName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
				.map((item) => ({
					value: item.headerName,
				})),
		);
	};

	const onSelectHeader = (data: string) => {
		// TODO: onSelectHeader
		// const ele = Object.values(allowElementBieuMau).find((item) => item.headerName === data);
	};

	const renderElement = (index: number, isDefault: boolean, providedItem?: any) => (
		<Row gutter={12} key={index}>
			<Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
				{providedItem && (
					<div {...providedItem.dragHandleProps} style={{ width: '100%', textAlign: 'center' }}>
						<MenuOutlined />
					</div>
				)}
			</Col>
			<Col span={14}>
				<Form.Item
					label={
						`Phần tử ${index + (!isDefault ? defaultElementBieuMau.length : 0) + 1}` + (isDefault ? ' (mặc định)' : '')
					}
					name={isDefault ? undefined : ['elements', index, 'headerName']}
					rules={[...rules.required, ...rules.text, ...rules.length(100)]}
				>
					<AutoComplete
						disabled={isDefault}
						placeholder='Nhập tên phần tử'
						value={isDefault ? defaultElementBieuMau[index].headerName : undefined}
						options={searchoptions}
						onSearch={onSearchHeader}
						onSelect={onSelectHeader}
					/>
				</Form.Item>
			</Col>
			<Col span={8}>
				<Form.Item
					label='Kiểu dữ liệu'
					name={isDefault ? undefined : ['elements', index, 'type']}
					rules={[...rules.required]}
				>
					<Select
						disabled={isDefault}
						options={Object.values(ELoaiDuLieuBieuMau).map((item) => ({
							key: item,
							value: item,
							label: loaiDuLieuBieuMau[item],
						}))}
						value={isDefault ? defaultElementBieuMau[index].type ?? ELoaiDuLieuBieuMau.Text : undefined}
						//  mặc định render ra bảng điểm
						onChange={(val) => {
							if (onChange) {
								const temp = elements.slice();
								temp[index].type = val;
								if (val === ELoaiDuLieuBieuMau.Transcript) {
									temp[index].cot = defaultColumnsByType[ELoaiDuLieuBieuMau.Transcript];
								} else {
									delete temp[index].cot;
								}
								onChange(temp);
							}
						}}
					/>
				</Form.Item>
			</Col>
			<Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				{!isDefault ? (
					<ButtonExtend
						disabled={isDefault}
						onClick={() => removeElement(index)}
						icon={<DeleteOutlined />}
						type='link'
						danger
					/>
				) : null}
			</Col>
			{/* Kiểu dữ liệu bảng */}
			<Col span={24}>
				{!isDefault && (
					<Form.Item
						noStyle
						shouldUpdate={(prev, curr) => prev.elements?.[index]?.type !== curr.elements?.[index]?.type}
					>
						{({ getFieldValue }) => {
							const selectedType = getFieldValue(['elements', index, 'type']);

							if (selectedType === ELoaiDuLieuBieuMau.Table) {
								return (
									<Col span={24}>
										<Form.Item
											label='Cấu hình bảng'
											style={{ width: '86%', marginLeft: 70 }}
											name={['elements', index, 'cot']}
											rules={[{ required: true, message: 'Vui lòng cấu hình các cột của bảng' }]}
										>
											<CauHinhDinhDangBang />
										</Form.Item>
									</Col>
								);
							}

							return null;
						}}
					</Form.Item>
				)}
			</Col>
			{/* Bảng điểm sinh viên */}
			<Col span={24}>
				{!isDefault && (
					<Form.Item
						noStyle
						shouldUpdate={(prev, curr) => prev.elements?.[index]?.type !== curr.elements?.[index]?.type}
					>
						{({ getFieldValue }) => {
							const selectedType = getFieldValue(['elements', index, 'type']);

							if (selectedType === ELoaiDuLieuBieuMau.Transcript) {
								return (
									<Col span={24}>
										<Form.Item
											label='Cấu hình bảng điểm sinh viên'
											style={{ width: '95%', marginLeft: 70 }}
											name={['elements', index, 'cot']}
											rules={[{ required: true, message: 'Vui lòng cấu hình các cột của bảng' }]}
										>
											<CauHinhBangDiemSinhVien />
										</Form.Item>
									</Col>
								);
							}

							return null;
						}}
					</Form.Item>
				)}
			</Col>
		</Row>
	);

	return (
		<>
			{defaultElementBieuMau.map((name, index) => renderElement(index, true))}

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='template'>
					{(provided) => (
						<div ref={provided?.innerRef} {...provided?.droppableProps}>
							{elements?.map((element, index: number) => (
								// eslint-disable-next-line react/no-array-index-key
								<Draggable draggableId={index.toString()} index={index} key={index}>
									{(providedItem) => (
										<div {...providedItem.draggableProps} ref={providedItem.innerRef}>
											{renderElement(index, false, providedItem)}
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<Row>
				<Col span={22} push={1}>
					<ButtonExtend notHideText type='dashed' onClick={addElement} icon={<PlusOutlined />} block>
						Thêm phần tử
					</ButtonExtend>
				</Col>
			</Row>
		</>
	);
};

export default ElementBieuMauFormItem;
