import PhuLucVanBangPage from '@/pages/VanBang/PhuLuc';
import { Button, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const ModalQuyetDinhTotNghiep = (props: any) => {
	const intl = useIntl();
	const { getData, yearSelect } = props;
	const { record, setVisibleForm } = useModel('vbcc.quyetdinhtotnghiep');
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.step2' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<Form afterAddNew={() => setCurrentStep(1)} getData={getData} yearSelect={yearSelect} />
			) : currentStep === 1 ? (
				<PhuLucVanBangPage isQuyetDinh getData={getData} />
			) : null}

			{currentStep !== 0 ? (
				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			) : null}
		</>
	);
};

export default ModalQuyetDinhTotNghiep;
