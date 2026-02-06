import { primaryColor } from '@/services/base/constant';
import {
	colorTrangThaiQuyetDinhTotNghiep,
	EQuyetDinhStep,
	ETrangThaiQuyetDinhTotNghiep,
	nameTrangThaiQuyetDinhTotNghiep,
} from '@/services/VanBang/constant';
import { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import dayjs from '@/utils/dayjs';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Descriptions, Popover, Row, Space, Steps, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';

import PhuLucVanBangPage from '../../PhuLuc';
import DanhSachSinhVienQuyetDinh from '../DanhSachSinhVien';
import DuThaoSoVaoSoQuyetDinh from '../DuThaoSoVaoSo';
import Form from './Form';

const ModalQuyetDinhTotNghiep = (props: any) => {
	const intl = useIntl();
	const { getData, yearSelect, title, themMoiHoanThanh, setThemMoiHoanThanh } = props;
	const { record, edit, visibleForm } = useModel('vbcc.quyetdinhtotnghiep');

	const [currentStep, setCurrentStep] = useState<EQuyetDinhStep>(EQuyetDinhStep.THONG_TIN);

	const renderTrangThaiInfo = (rec: QuyetDinhTotNghiep.IRecord) => (
		<div style={{ fontSize: 12, maxWidth: 300, lineHeight: 1.45 }}>
			<div>
				<b>{intl.formatMessage({ id: 'qdtotnghiep.info.nguoitao' })}</b> {rec?.nguoiTao?.hoTen ?? '—'}
				<br />
				{rec?.nguoiTao?.thoiGian && <em>{dayjs(rec?.nguoiTao?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
			</div>

			<br />

			<div>
				<b>{intl.formatMessage({ id: 'qdtotnghiep.info.nguoixuly' })}</b> {rec?.nguoiXuLy?.hoTen ?? '—'}
				<br />
				{rec?.nguoiXuLy?.thoiGian && <em>{dayjs(rec?.nguoiXuLy?.thoiGian).format('HH:mm DD/MM/YYYY')}</em>}
			</div>

			<br />

			<div>
				<b>{intl.formatMessage({ id: 'qdtotnghiep.info.ghichuchinhsua' })}</b>
				<div style={{ whiteSpace: 'pre-wrap' }}>{rec?.ghiChuChinhSua || '—'}</div>
			</div>
		</div>
	);

	const visibleSteps = useMemo<EQuyetDinhStep[]>(() => {
		return [
			EQuyetDinhStep.THONG_TIN,

			!themMoiHoanThanh && EQuyetDinhStep.DANH_SACH_SV,
			!themMoiHoanThanh && EQuyetDinhStep.DU_THAO_SO,

			EQuyetDinhStep.PHU_LUC,
		].filter(Boolean) as EQuyetDinhStep[];
	}, [themMoiHoanThanh]);

	useEffect(() => {
		if (!visibleSteps.includes(currentStep)) {
			setCurrentStep(visibleSteps[0]);
		}
	}, [visibleSteps.join('|')]);

	useEffect(() => {
		if (!visibleForm) {
			getData();
			setThemMoiHoanThanh(false);
			return;
		}

		if (!record?._id) {
			setCurrentStep(EQuyetDinhStep.THONG_TIN);
			return;
		}

		switch (record?.trangThai) {
			case ETrangThaiQuyetDinhTotNghiep.DU_THAO:
			case ETrangThaiQuyetDinhTotNghiep.TRINH_DU_THAO:
				setCurrentStep(EQuyetDinhStep.DU_THAO_SO);
				break;

			case ETrangThaiQuyetDinhTotNghiep.HOAN_THANH:
			case ETrangThaiQuyetDinhTotNghiep.CHINH_THUC:
				setCurrentStep(EQuyetDinhStep.PHU_LUC);
				break;

			default:
				setCurrentStep(EQuyetDinhStep.THONG_TIN);
		}
	}, [visibleForm]);

	const currentStepIndex = visibleSteps.indexOf(currentStep);

	const onChangeStep = (index: number) => {
		setCurrentStep(visibleSteps[index]);
	};

	return (
		<Card
			title={
				<Space>
					{record?.trangThai === ETrangThaiQuyetDinhTotNghiep.CHINH_THUC ||
					record?.trangThai === ETrangThaiQuyetDinhTotNghiep.HOAN_THANH
						? intl.formatMessage({ id: 'qdtotnghiep.modal.title.thongtin' })
						: intl.formatMessage({ id: edit ? 'qdtotnghiep.modal.title.chinhsua' : 'qdtotnghiep.modal.title.themoi' })}

					{record?._id && (
						<Space wrap>
							<Tag color={colorTrangThaiQuyetDinhTotNghiep[record?.trangThai as ETrangThaiQuyetDinhTotNghiep]}>
								{nameTrangThaiQuyetDinhTotNghiep[record?.trangThai]}
							</Tag>

							<Popover placement='left' content={renderTrangThaiInfo(record)}>
								<InfoCircleOutlined style={{ cursor: 'pointer', color: primaryColor }} />
							</Popover>
						</Space>
					)}
				</Space>
			}
		>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={6}>
					<Steps
						current={currentStepIndex}
						onChange={record?._id ? onChangeStep : undefined}
						direction='vertical'
						size='small'
					>
						{visibleSteps.map((step) => {
							switch (step) {
								case EQuyetDinhStep.THONG_TIN:
									return (
										<Steps.Step
											key={step}
											title={intl.formatMessage({
												id: 'vanbang.quyetdinhtotnghiep.step1',
											})}
										/>
									);

								case EQuyetDinhStep.DANH_SACH_SV:
									return (
										<Steps.Step
											key={step}
											title={intl.formatMessage({ id: 'qdtotnghiep.step.danhsachsinhvien' })}
											disabled={!record?._id}
										/>
									);

								case EQuyetDinhStep.DU_THAO_SO:
									return (
										<Steps.Step
											key={step}
											title={intl.formatMessage({ id: 'qdtotnghiep.step.duthaoso' })}
											disabled={!record?._id}
										/>
									);

								case EQuyetDinhStep.PHU_LUC:
									return (
										<Steps.Step
											key={step}
											title={intl.formatMessage({
												id: 'vanbang.quyetdinhtotnghiep.step2',
											})}
											disabled={
												!themMoiHoanThanh &&
												(!record?._id ||
													![ETrangThaiQuyetDinhTotNghiep.CHINH_THUC, ETrangThaiQuyetDinhTotNghiep.HOAN_THANH].includes(
														record?.trangThai,
													))
											}
										/>
									);
							}
						})}
					</Steps>
				</Col>

				<Col xs={24} md={18}>
					{currentStep === EQuyetDinhStep.THONG_TIN && (
						<>
							{record?._id && (
								<Descriptions
									column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
									className='highlight'
									layout='vertical'
									colon={false}
									style={{ marginBottom: 12 }}
								>
									<Descriptions.Item label={intl.formatMessage({ id: 'qdtotnghiep.label.nguoitao' })}>
										{record?.nguoiTao?.hoTen ?? '--'}
									</Descriptions.Item>
									<Descriptions.Item label={intl.formatMessage({ id: 'qdtotnghiep.label.thoigiantao' })}>
										{record?.nguoiTao?.thoiGian ? dayjs(record?.nguoiTao?.thoiGian).format('HH:mm DD/MM/YYYY') : '--'}
									</Descriptions.Item>
									<Descriptions.Item label={intl.formatMessage({ id: 'qdtotnghiep.label.nguoixuly' })}>
										{record?.nguoiXuLy?.hoTen ?? '--'}
									</Descriptions.Item>
									<Descriptions.Item label={intl.formatMessage({ id: 'qdtotnghiep.label.thoigianxuly' })}>
										{record?.nguoiXuLy?.thoiGian ? dayjs(record?.nguoiXuLy?.thoiGian).format('HH:mm DD/MM/YYYY') : '--'}
									</Descriptions.Item>
									<Descriptions.Item label={intl.formatMessage({ id: 'qdtotnghiep.label.ghichuchinhsua' })} span={2}>
										{record?.ghiChuChinhSua ?? '--'}
									</Descriptions.Item>
								</Descriptions>
							)}

							<Form
								afterAddNew={setCurrentStep}
								getData={getData}
								yearSelect={yearSelect}
								themMoiHoanThanh={themMoiHoanThanh}
							/>
						</>
					)}

					{currentStep === EQuyetDinhStep.DANH_SACH_SV && <DanhSachSinhVienQuyetDinh afterAddNew={setCurrentStep} />}

					{currentStep === EQuyetDinhStep.DU_THAO_SO && (
						<DuThaoSoVaoSoQuyetDinh afterAddNew={setCurrentStep} title={title} />
					)}

					{currentStep === EQuyetDinhStep.PHU_LUC && (
						<PhuLucVanBangPage isQuyetDinh afterAddNew={setCurrentStep} title={title} themMoiHoanThanh />
					)}
				</Col>
			</Row>
		</Card>
	);
};

export default ModalQuyetDinhTotNghiep;
