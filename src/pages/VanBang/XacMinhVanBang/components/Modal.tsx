import { colorTrangThaiXacMinh, EPhaseXacMinh } from '@/services/VanBang/constant';
import { Card, Col, Row, Space, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CongVanPhucDapPage from '../CongVanPhucDap';
import SinhVienXacMinhPage from '../SinhVienXacMinh';
import TraKetQuaPage from '../TraKetQua';
import FormXacMinhVanBang from './FormXacMinh';

const ModalXacMinhVanBang = (props: any) => {
	const { getData } = props;
	const { record, visibleForm, edit } = useModel('vbcc.xacminhvanbang');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		if (!visibleForm && !record?._id) {
			setCurrentStep(0);
		} else {
			if (record?.phaseXuLy === EPhaseXacMinh.YEU_CAU) {
				setCurrentStep(0);
			} else if (record?.phaseXuLy === EPhaseXacMinh.XAC_MINH) {
				setCurrentStep(1);
			} else if (record?.phaseXuLy === EPhaseXacMinh.PHUC_DAP) {
				setCurrentStep(2);
			} else if (record?.phaseXuLy === EPhaseXacMinh.KET_QUA || record?.phaseXuLy === EPhaseXacMinh.HOAN_THANH) {
				setCurrentStep(3);
			}
		}
	}, [visibleForm, record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={
				<Space>
					{(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'xác minh văn bằng '}
					{record?._id ? (
						<Tag color={colorTrangThaiXacMinh[record?.phaseXuLy as EPhaseXacMinh]}>{record?.phaseXuLy}</Tag>
					) : null}
				</Space>
			}
		>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={24} md={5} lg={5} xl={5}>
					<Steps
						current={currentStep}
						onChange={record?._id ? onChangeStep : undefined}
						progressDot
						direction='vertical'
						size='small'
					>
						<Steps.Step title='Yêu cầu xác minh' />
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
						<FormXacMinhVanBang afterAddNew={setCurrentStep} getData={getData} />
					) : currentStep === 1 ? (
						<SinhVienXacMinhPage
							isXacMinh
							size='small'
							afterAddNew={setCurrentStep}
							hideAdd
							hideImport
							getData={getData}
						/>
					) : currentStep === 2 ? (
						<CongVanPhucDapPage afterAddNew={setCurrentStep} getData={getData} />
					) : currentStep === 3 ? (
						<TraKetQuaPage afterAddNew={setCurrentStep} getData={getData} />
					) : null}
				</Col>
			</Row>
		</Card>
	);
};

export default ModalXacMinhVanBang;
