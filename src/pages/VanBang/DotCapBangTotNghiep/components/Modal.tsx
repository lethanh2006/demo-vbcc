import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import QuyetDinhTotNghiepPage from '../../QuyetDinhTotNghiep';
import Form from './Form';

const ModalKhaoSat = (props: any) => {
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
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Quyết định tốt nghiệp' disabled={!record?._id} />
				<Steps.Step title='Phụ lục văn bằng' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<Form afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<QuyetDinhTotNghiepPage isDotCapBang />
			) : currentStep === 2 ? (
				// <PhuLucVanBangPage isDotCapBang />
				<></>
			) : null}
		</>
	);
};

export default ModalKhaoSat;
