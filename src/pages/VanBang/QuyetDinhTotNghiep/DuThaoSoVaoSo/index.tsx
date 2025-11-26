import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { defaultElementBieuMau, ELoaiDuLieuBieuMau, ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { Button, Checkbox, Col, Form, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectSoVanBang from '../../SoVanBang/components/Select';

const toCamel = (str: string) => {
	return str
		.replace(/Đ/g, 'D')
		.replace(/đ/g, 'd')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9\s]/g, '')
		.trim()
		.split(/\s+/)
		.map((word, index) => {
			const w = word.toLowerCase();
			if (index === 0) return w;
			return w.charAt(0).toUpperCase() + w.slice(1);
		})
		.join('');
};

const DuThaoSoVaoSoQuyetDinh = () => {
	const [form] = Form.useForm();
	const { record: recQuyetDinh, getByIdModel } = useModel('vbcc.quyetdinhtotnghiep');
	const { getModel, sortPhuLucTamModel, formSubmiting, page, limit } = useModel('vbcc.phulucvanbang');
	const { danhSach: dsSoVanBang } = useModel('vbcc.sovanbang');
	const disable =
		!!recQuyetDinh?._id &&
		(recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO ||
			recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.CHINH_THUC);

	//Get quyết định lấy số vào sổ
	const getQuyetDinh = () => {
		getByIdModel(recQuyetDinh?._id ?? '', true);
	};

	const getData = () => {
		if (recQuyetDinh?._id) {
			getModel({ idQuyetDinh: recQuyetDinh._id });
		}
	};

	useEffect(() => {
		form.setFieldsValue({
			idSoVanBang: recQuyetDinh?.idSoVanBang,
			soVaoSoHienTai: recQuyetDinh?.soVaoSoHienTai ?? recQuyetDinh?.soVanBang?.soVaoSoHienTai,
			ruleSortPhuLuc: recQuyetDinh?.ruleSortPhuLuc,
			sinhLaiToanBo: false,
		});
	}, [recQuyetDinh?.soVaoSoHienTai]);

	const onFinish = (values: any) => {
		sortPhuLucTamModel(recQuyetDinh?._id ?? '', values, () => {
			getData();
			getQuyetDinh();
		})
			.then()
			.catch((er) => console.log(er));
	};

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ (dự kiến)',
			dataIndex: 'soVaoSoTamThoi',
			width: 110,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			width: 120,
			filterType: 'string',
		},
	];

	return (
		<>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item label='Sổ văn bằng' name='idSoVanBang'>
							<SelectSoVanBang
								onChange={(val) => {
									const index = dsSoVanBang?.find((item) => item?._id === val);

									if (index?._id !== recQuyetDinh?.idSoVanBang) {
										form.setFieldsValue({
											soVaoSoHienTai: index?.soVaoSoHienTai,
										});
									}
								}}
								disabled={disable}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Số vào sổ hiện tại' name='soVaoSoHienTai'>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập số vào sổ' disabled={disable} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='sinhLaiToanBo'
							valuePropName='checked'
							extra='Nếu chọn, toàn bộ số vào sổ sẽ được sinh lại từ đầu, có thể thay đổi các số đã cấp trước đó.'
						>
							<Checkbox disabled={disable}>Sinh lại toàn bộ</Checkbox>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='ruleSortPhuLuc' label='Quy tắc sắp xếp phụ lục'>
							<Select
								mode='multiple'
								placeholder='Chọn phần tử'
								options={[
									...defaultElementBieuMau.map((item) => ({
										value: toCamel(item.headerName),
										label: item.headerName,
									})),

									...(recQuyetDinh?.bieuMau?.elements
										?.filter((item) => item?.type !== ELoaiDuLieuBieuMau.Table)
										.map((item) => ({
											value: toCamel(item.headerName),
											label: item.headerName,
										})) || []),
								]}
								disabled={disable}
								allowClear
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} type='primary' htmlType='submit' disabled={disable}>
						Sinh số
					</Button>
				</div>
			</Form>

			<div style={{ marginTop: 12 }}>
				<TableBase
					getData={getData}
					columns={columns}
					params={{ idQuyetDinh: recQuyetDinh?._id }}
					dependencies={[page, limit, recQuyetDinh?._id]}
					modelName='vbcc.phulucvanbang'
					buttons={{ create: false }}
					hideCard
				/>
			</div>
		</>
	);
};

export default DuThaoSoVaoSoQuyetDinh;
