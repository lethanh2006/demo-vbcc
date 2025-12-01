import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { IColumn } from '@/components/Table/typing';
import { defaultElementBieuMau, ELoaiDuLieuBieuMau, ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import rules from '@/utils/rules';
import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectSoVanBang from '../../SoVanBang/components/Select';
import ModalYeuCauChinhSua from '../components/YeuCauChinhSua';
import FormSinhVienQuyetDinh from '../DanhSachSinhVien/components/Form';

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

const DuThaoSoVaoSoQuyetDinh = (props: {
	afterAddNew?: (val: number) => void;
	title?: 'Thông tin quyết định' | 'Danh sách dự thảo' | 'Quyết định đã duyệt';
}) => {
	const { afterAddNew, title } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record: recQuyetDinh,
		setVisibleForm: setVisibleQuyetDinh,
		trinhLanhDaoModel,
		xuLyDuThaoModel,
		getByIdModel,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const {
		getModel,
		sortPhuLucTamModel,
		formSubmiting,
		page,
		limit,
		putModel,
		deleteModel,
		handleEdit,
		visibleForm,
		setVisibleForm,
	} = useModel('vbcc.phulucvanbang');
	const { danhSach: dsSoVanBang } = useModel('vbcc.sovanbang');
	const [visibleChinhSua, setVisibleChinhSua] = useState(false);
	const [recEditInline, setRecEditInline] = useState<PhuLucVanBang.IRecord>();

	const disable =
		!!recQuyetDinh?._id &&
		(recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO ||
			recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.CHINH_THUC);

	const trinhLanhDao =
		recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.DU_THAO ||
		recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA;

	const canXuLyQuyetDinh =
		recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO ||
		recQuyetDinh?.trangThai === ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA;

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

	const onFinishSoVaoSo = (value: PhuLucVanBang.IRecord) => {
		if (recEditInline?.soVaoSoTamThoi !== value.soVaoSoTamThoi)
			putModel(recEditInline?._id ?? '', { soVaoSoTamThoi: value.soVaoSoTamThoi }, getData, true, false);
		setRecEditInline(undefined);
	};

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ (dự kiến)',
			dataIndex: 'soVaoSoTamThoi',
			width: 110,
			onCell: disable
				? undefined
				: (rec) => ({
						onClick: () => recEditInline?._id !== rec?._id && setRecEditInline(rec),
						className: 'hovered-cell',
					}),
			render: (val, rec) =>
				recEditInline?._id === rec?._id ? (
					<Form onFinish={onFinishSoVaoSo} form={form}>
						<Form.Item initialValue={val} name='soVaoSoTamThoi' rules={[...rules.required]} noStyle>
							<Input autoFocus onBlur={() => setRecEditInline(undefined)} />
						</Form.Item>
					</Form>
				) : (
					<span>{val}</span>
				),
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
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={disable}
						tooltip='Chỉnh sửa'
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEdit(rec)}
					/>

					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa phụ lục này?'
						placement='topRight'
					>
						<ButtonExtend disabled={disable} tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
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

			<div className='form-footer'>
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(1);
					}}
					icon={<ArrowLeftOutlined />}
				>
					Quay lại
				</Button>
				{title === 'Thông tin quyết định' ? (
					<Popconfirm
						onConfirm={() => trinhLanhDaoModel(recQuyetDinh?._id ?? '', getQuyetDinh)}
						title='Bạn có chắc chắn muốn trình lãnh đạo quyết định tốt nghiệp này?'
						placement='topRight'
					>
						<Button icon={<SendOutlined />} type='primary' disabled={!trinhLanhDao}>
							Trình lãnh đạo
						</Button>
					</Popconfirm>
				) : (
					<>
						<Popconfirm
							onConfirm={() =>
								xuLyDuThaoModel(
									recQuyetDinh?._id ?? '',
									{ trangThai: ETrangThaiQuyetDinhTotNghiep.CHINH_THUC },
									getQuyetDinh,
								).then(() => {
									if (afterAddNew) afterAddNew(3);
								})
							}
							title='Bạn có chắc chắn muốn duyệt định tốt nghiệp này?'
							placement='topRight'
						>
							<Button
								icon={<CheckCircleOutlined />}
								className='btn-success'
								type='primary'
								disabled={!canXuLyQuyetDinh}
							>
								Duyệt quyết định
							</Button>
						</Popconfirm>

						<Button
							className='btn-warning'
							type='primary'
							disabled={!canXuLyQuyetDinh}
							onClick={() => setVisibleChinhSua(true)}
							icon={<EditOutlined />}
						>
							Yêu cầu chỉnh sửa
						</Button>
					</>
				)}
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(3);
					}}
					icon={<ArrowRightOutlined />}
					disabled={recQuyetDinh?.trangThai !== ETrangThaiQuyetDinhTotNghiep.CHINH_THUC}
				>
					Tiếp theo
				</Button>
				<Button onClick={() => setVisibleQuyetDinh(false)} icon={<CloseCircleOutlined />} danger>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>

			<ModalYeuCauChinhSua visible={visibleChinhSua} setVisible={setVisibleChinhSua} getData={getQuyetDinh} />

			<Modal
				title='Chỉnh sửa thông tin sinh viên'
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={800}
			>
				<FormSinhVienQuyetDinh getData={getData} />
			</Modal>
		</>
	);
};

export default DuThaoSoVaoSoQuyetDinh;
