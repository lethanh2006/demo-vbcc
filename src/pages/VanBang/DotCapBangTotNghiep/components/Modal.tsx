import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewPhuLucQuyetDinh from '../../PhuLuc/components/ViewPhuLucQuyetDinh';
import ViewQuyetDinhTheoDot from '../../QuyetDinhTotNghiep/components/ViewQuyetDinhDot';
import Form from './Form';

const ModalDotCapBang = (props: any) => {
	const intl = useIntl();
	const { record } = useModel('vbcc.dotcapbangtotnghiep');
	const [currentStep, setCurrentStep] = useState<number>(0);

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
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title={intl.formatMessage({ id: 'dotcapbang.modal.step.thongtinchung' })} />
				<Steps.Step
					title={intl.formatMessage({ id: 'dotcapbang.modal.step.quyetdinhtotnghiep' })}
					disabled={!record?._id}
				/>
				<Steps.Step
					title={intl.formatMessage({ id: 'dotcapbang.modal.step.thongtinvanbang' })}
					disabled={!record?._id}
				/>
			</Steps>

			{currentStep === 0 ? (
				<Form afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<ViewQuyetDinhTheoDot isDotCapBang />
			) : currentStep === 2 ? (
				<ViewPhuLucQuyetDinh isDotCapBang />
			) : null}
		</>
	);
};

export default ModalDotCapBang;
