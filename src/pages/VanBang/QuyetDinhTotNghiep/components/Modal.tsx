import ButtonExtend from '@/components/Table/ButtonExtend';
import { colorTrangThaiQuyetDinhTotNghiep, ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import { Button, Card, Popconfirm, Space, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import PhuLucVanBangPage from '../../PhuLuc';
import DanhSachSinhVienQuyetDinh from '../DanhSachSinhVien';
import DuThaoSoVaoSoQuyetDinh from '../DuThaoSoVaoSo';
import Form from './Form';
import ModalYeuCauChinhSua from './YeuCauChinhSua';

const ModalQuyetDinhTotNghiep = (props: any) => {
	const intl = useIntl();
	const { getData, yearSelect, duyetQuyetDinh } = props;
	const { record, setVisibleForm, edit, visibleForm, trinhLanhDaoModel, xuLyDuThaoModel } =
		useModel('vbcc.quyetdinhtotnghiep');
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [visibleChinhSua, setVisibleChinhSua] = useState(false);

	useEffect(() => {
		if (!visibleForm) {
			setCurrentStep(0);
		}
	}, [visibleForm]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	const trinhLanhDao =
		record?.trangThai === ETrangThaiQuyetDinhTotNghiep.DU_THAO ||
		record?.trangThai === ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA;

	const canXuLyQuyetDinh =
		record?.trangThai === ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO ||
		record?.trangThai === ETrangThaiQuyetDinhTotNghiep.YEU_CAU_CHINH_SUA;

	return (
		<Card
			title={
				<Space>
					{(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'quyết định '}
					<Tag color={colorTrangThaiQuyetDinhTotNghiep[record?.trangThai as ETrangThaiQuyetDinhTotNghiep]}>
						{record?.trangThai}
					</Tag>
				</Space>
			}
		>
			<Steps
				style={{ marginBottom: 12, paddingTop: 0 }}
				current={currentStep}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.step1' })} />
				<Steps.Step title={'Danh sách sinh viên'} disabled={!record?._id} />
				<Steps.Step title={'Dự thảo số vào sổ'} disabled={!record?._id} />
				{record?.trangThai === ETrangThaiQuyetDinhTotNghiep.CHINH_THUC && (
					<Steps.Step title={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.step2' })} disabled={!record?._id} />
				)}
			</Steps>

			{currentStep === 0 ? (
				<Form afterAddNew={() => setCurrentStep(1)} getData={getData} yearSelect={yearSelect} />
			) : currentStep === 1 ? (
				<DanhSachSinhVienQuyetDinh />
			) : currentStep === 2 ? (
				<DuThaoSoVaoSoQuyetDinh />
			) : currentStep === 3 ? (
				<PhuLucVanBangPage isQuyetDinh />
			) : null}

			{currentStep !== 0 ? (
				<div className='form-footer'>
					{currentStep === 2 ? (
						duyetQuyetDinh ? (
							<>
								<Popconfirm
									onConfirm={() =>
										xuLyDuThaoModel(
											record?._id ?? '',
											{ trangThai: ETrangThaiQuyetDinhTotNghiep.CHINH_THUC },
											getData,
										).then(() => setVisibleForm(false))
									}
									title='Bạn có chắc chắn muốn duyệt định tốt nghiệp này?'
									placement='topRight'
								>
									<ButtonExtend className='btn-success' type='primary' disabled={!canXuLyQuyetDinh}>
										Duyệt quyết định
									</ButtonExtend>
								</Popconfirm>

								<ButtonExtend
									className='btn-warning'
									type='primary'
									disabled={!canXuLyQuyetDinh}
									onClick={() => setVisibleChinhSua(true)}
								>
									Yêu cầu chỉnh sửa
								</ButtonExtend>
							</>
						) : (
							<Popconfirm
								onConfirm={() => trinhLanhDaoModel(record?._id ?? '', getData).then(() => setVisibleForm)}
								title='Bạn có chắc chắn muốn trình lãnh đạo quyết định tốt nghiệp này?'
								placement='topRight'
							>
								<ButtonExtend type='primary' disabled={!trinhLanhDao}>
									Trình lãnh đạo
								</ButtonExtend>
							</Popconfirm>
						)
					) : null}
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			) : null}

			<ModalYeuCauChinhSua
				visible={visibleChinhSua}
				setVisible={setVisibleChinhSua}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>
		</Card>
	);
};

export default ModalQuyetDinhTotNghiep;
