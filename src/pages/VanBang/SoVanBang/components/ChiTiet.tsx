import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PhuLucSoVanBangPage from '../PhuLucSoVanBang';
import SoVanBangForm from './Form';

const ChiTietSoVanBang = () => {
	const { visibleForm } = useModel('vbcc.sovanbang');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		if (!visibleForm) setCurrentStep(0);
	}, [visibleForm]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={onChangeStep}
			>
				<Steps.Step title='Sổ văn bằng' />
				<Steps.Step title='Thông tin văn bằng' />
			</Steps>

			{currentStep === 0 ? <SoVanBangForm /> : <PhuLucSoVanBangPage />}
		</>
	);
};

export default ChiTietSoVanBang;
