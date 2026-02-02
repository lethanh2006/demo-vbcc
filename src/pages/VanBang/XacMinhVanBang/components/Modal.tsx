import { colorTrangThaiXacMinh, EPhaseXacMinh, nameTrangThaiXacMinh } from '@/services/VanBang/constant';
import { Card, Col, Row, Space, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CongVanPhucDapPage from '../CongVanPhucDap';
import SinhVienXacMinhPage from '../SinhVienXacMinh';
import TraKetQuaPage from '../TraKetQua';
import FormXacMinhVanBang from './FormXacMinh';

const ModalXacMinhVanBang = (props: any) => {
	const { getData } = props;
	const { record, visibleForm, edit, getByIdModel } = useModel('vbcc.xacminhvanbang');
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

		switch (record?.phaseXuLy) {
			case EPhaseXacMinh.YEU_CAU:
				setCurrentStep(0);
			case EPhaseXacMinh.XAC_MINH:
				setCurrentStep(1);
				break;
			case EPhaseXacMinh.PHUC_DAP:
				setCurrentStep(3);
				break;
			case EPhaseXacMinh.KET_QUA:
			case EPhaseXacMinh.HOAN_THANH:
				setCurrentStep(4);
				break;
		}
	}, [visibleForm]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	const getRecXacMinh = () => {
		if (record?._id) {
			getByIdModel(record?._id, true);
		}
	};

	return (
		<Card
			title={
				<Space>
					{(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'xác minh văn bằng '}
					{record?._id ? (
						<Tag color={colorTrangThaiXacMinh[record?.phaseXuLy as EPhaseXacMinh]}>
							{nameTrangThaiXacMinh[record?.phaseXuLy]}
						</Tag>
					) : null}
				</Space>
			}
		>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={24} md={5} lg={5} xl={5}>
					<Steps
						current={currentStep}
						onChange={record?._id ? onChangeStep : undefined}
						direction='vertical'
						size='small'
					>
						<Steps.Step title='Yêu cầu xác minh' />
						<Steps.Step title='Thông tin tra cứu' disabled={!record?._id} />
						<Steps.Step
							title='Xác minh văn bằng'
							disabled={
								!record?._id ||
								![
									EPhaseXacMinh.XAC_MINH,
									EPhaseXacMinh.PHUC_DAP,
									EPhaseXacMinh.KET_QUA,
									EPhaseXacMinh.HOAN_THANH,
								].includes(record?.phaseXuLy)
							}
						/>
						<Steps.Step
							title='Công văn phúc đáp'
							disabled={
								!record?._id ||
								![EPhaseXacMinh.PHUC_DAP, EPhaseXacMinh.KET_QUA, EPhaseXacMinh.HOAN_THANH].includes(record?.phaseXuLy)
							}
						/>
						<Steps.Step
							title='Trả kết quả'
							disabled={!record?._id || ![EPhaseXacMinh.KET_QUA, EPhaseXacMinh.HOAN_THANH].includes(record?.phaseXuLy)}
						/>
					</Steps>
				</Col>
				<Col xs={24} sm={24} md={19} lg={19} xl={19}>
					{currentStep === 0 ? (
						<FormXacMinhVanBang afterAddNew={setCurrentStep} />
					) : currentStep === 1 ? (
						<SinhVienXacMinhPage isYeuCau size='small' afterAddNew={setCurrentStep} getData={getRecXacMinh} />
					) : currentStep === 2 ? (
						<SinhVienXacMinhPage
							isXacMinh
							hideAdd
							hideImport
							size='small'
							afterAddNew={setCurrentStep}
							getData={getRecXacMinh}
						/>
					) : currentStep === 3 ? (
						<CongVanPhucDapPage afterAddNew={setCurrentStep} getData={getRecXacMinh} />
					) : currentStep === 4 ? (
						<TraKetQuaPage afterAddNew={setCurrentStep} getData={getRecXacMinh} />
					) : null}
				</Col>
			</Row>
		</Card>
	);
};

export default ModalXacMinhVanBang;
