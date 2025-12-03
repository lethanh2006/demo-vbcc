import { primaryColor } from '@/services/base/constant';
import { colorTrangThaiQuyetDinhTotNghiep, ETrangThaiQuyetDinhTotNghiep } from '@/services/VanBang/constant';
import { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import dayjs from '@/utils/dayjs';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Descriptions, Popover, Row, Space, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import PhuLucVanBangPage from '../../PhuLuc';
import DanhSachSinhVienQuyetDinh from '../DanhSachSinhVien';
import DuThaoSoVaoSoQuyetDinh from '../DuThaoSoVaoSo';
import Form from './Form';

const renderTrangThaiInfo = (rec: QuyetDinhTotNghiep.IRecord) => (
	<div style={{ fontSize: 12, maxWidth: 300, lineHeight: 1.45 }}>
		<div>
			<b>Người tạo:</b> {rec?.nguoiTao?.hoTen ?? '—'}
			<br />
			{rec?.nguoiTao?.thoiGian && <em>{dayjs(rec?.nguoiTao?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
		</div>

		<br />

		<div>
			<b>Người xử lý:</b> {rec?.nguoiXuLy?.hoTen ?? '—'}
			<br />
			{rec?.nguoiXuLy?.thoiGian && <em>{dayjs(rec?.nguoiXuLy?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
		</div>

		<br />

		<div>
			<b>Ghi chú chỉnh sửa:</b>
			<div style={{ whiteSpace: 'pre-wrap' }}>{rec?.ghiChuChinhSua || '—'}</div>
		</div>
	</div>
);

const ModalQuyetDinhTotNghiep = (props: any) => {
	const intl = useIntl();
	const { getData, yearSelect, title } = props;
	const { record, edit, visibleForm } = useModel('vbcc.quyetdinhtotnghiep');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		if (!visibleForm) {
			getData();
			return;
		}

		if (!record?._id) {
			setCurrentStep(0);
			return;
		}

		switch (record?.trangThai) {
			case ETrangThaiQuyetDinhTotNghiep.DU_THAO:
			case ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO:
				setCurrentStep(2);
				break;
			case ETrangThaiQuyetDinhTotNghiep.CHINH_THUC:
				setCurrentStep(3);
				break;
		}
	}, [visibleForm]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={
				<Space>
					{(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'quyết định '}
					{record?._id ? (
						<Space wrap>
							<Tag color={colorTrangThaiQuyetDinhTotNghiep[record?.trangThai as ETrangThaiQuyetDinhTotNghiep]}>
								{record?.trangThai}
							</Tag>
							<Popover placement='left' content={renderTrangThaiInfo(record)}>
								<InfoCircleOutlined style={{ cursor: 'pointer', color: primaryColor }} />
							</Popover>
						</Space>
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
							disabled={
								!record?._id ||
								(record?.trangThai !== ETrangThaiQuyetDinhTotNghiep.CHINH_THUC &&
									record?.trangThai !== ETrangThaiQuyetDinhTotNghiep.HOAN_THANH)
							}
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
						<DuThaoSoVaoSoQuyetDinh afterAddNew={setCurrentStep} title={title} />
					) : currentStep === 3 ? (
						<PhuLucVanBangPage isQuyetDinh afterAddNew={setCurrentStep} title={title} />
					) : null}
				</Col>
			</Row>
		</Card>
	);
};

export default ModalQuyetDinhTotNghiep;
