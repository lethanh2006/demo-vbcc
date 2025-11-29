import { colorTrangThaiQuyetDinhTotNghiep, ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import dayjs from '@/utils/dayjs';
import { Card, Col, Descriptions, Row, Space, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import PhuLucVanBangPage from '../../PhuLuc';
import DanhSachSinhVienQuyetDinh from '../DanhSachSinhVien';
import DuThaoSoVaoSoQuyetDinh from '../DuThaoSoVaoSo';
import Form from './Form';

const ModalQuyetDinhTotNghiep = (props: any) => {
	const intl = useIntl();
	const { getData, yearSelect, trangThai } = props;
	const { record, edit, visibleForm } = useModel('vbcc.quyetdinhtotnghiep');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		if (!visibleForm) {
			getData();
		} else {
			if (trangThai?.includes(ETrangThaiQuyetDinhTotNghiep.CHINH_THUC)) {
				setCurrentStep(3);
			} else if (trangThai?.length) {
				setCurrentStep(2);
			}
		}
	}, [visibleForm, trangThai]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={
				<Space>
					{(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'quyết định '}
					{record?._id ? (
						<Tag color={colorTrangThaiQuyetDinhTotNghiep[record?.trangThai as ETrangThaiQuyetDinhTotNghiep]}>
							{record?.trangThai}
						</Tag>
					) : null}
				</Space>
			}
		>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={24} md={6} lg={6} xl={6}>
					<Steps
						current={currentStep}
						onChange={record?._id ? onChangeStep : undefined}
						progressDot
						direction='vertical'
						size='small'
					>
						<Steps.Step title={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.step1' })} />
						<Steps.Step title={'Danh sách sinh viên'} disabled={!record?._id} />
						<Steps.Step title={'Dự thảo số vào sổ'} disabled={!record?._id} />
						<Steps.Step
							title={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.step2' })}
							disabled={!record?._id || record?.trangThai !== ETrangThaiQuyetDinhTotNghiep.CHINH_THUC}
						/>
					</Steps>
				</Col>
				<Col xs={24} sm={24} md={18} lg={18} xl={18}>
					{currentStep === 0 ? (
						<>
							{record?._id ? (
								<Descriptions
									style={{
										marginBottom: 12,
									}}
									column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
									className='highlight'
									layout='vertical'
									colon={false}
								>
									<Descriptions.Item label='Người tạo'>{record?.nguoiTao?.hoTen ?? '--'}</Descriptions.Item>
									<Descriptions.Item label='Thời gian tạo'>
										{record?.nguoiTao?.thoiGian ? dayjs(record?.nguoiTao?.thoiGian).format('HH:mm DD/MM/YYYY') : '--'}
									</Descriptions.Item>
									<Descriptions.Item label='Người xử lý'>{record?.nguoiXuLy?.hoTen ?? '--'}</Descriptions.Item>
									<Descriptions.Item label='Thời gian xử lý'>
										{record?.nguoiXuLy?.thoiGian ? dayjs(record?.nguoiXuLy?.thoiGian).format('HH:mm DD/MM/YYYY') : '--'}
									</Descriptions.Item>
									<Descriptions.Item label='Ghi chú chỉnh sửa' span={2}>
										{record?.ghiChuChinhSua ?? '--'}
									</Descriptions.Item>
								</Descriptions>
							) : null}

							<Form afterAddNew={setCurrentStep} getData={getData} yearSelect={yearSelect} />
						</>
					) : currentStep === 1 ? (
						<DanhSachSinhVienQuyetDinh afterAddNew={setCurrentStep} />
					) : currentStep === 2 ? (
						<DuThaoSoVaoSoQuyetDinh afterAddNew={setCurrentStep} trangThai={trangThai} />
					) : currentStep === 3 ? (
						<PhuLucVanBangPage isQuyetDinh afterAddNew={setCurrentStep} />
					) : null}
				</Col>
			</Row>
		</Card>
	);
};

export default ModalQuyetDinhTotNghiep;
