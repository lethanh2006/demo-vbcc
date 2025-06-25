import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import PhuLucVanBangPage from '../../PhuLuc';
import Form from './Form';

const ModalQuyetDinhTotNghiep = (props: any) => {
	const intl = useIntl();
	const { title, getData } = props;
	const { record, edit, setVisibleForm } = useModel('vbcc.quyetdinhtotnghiep');
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
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
				<Form afterAddNew={() => setCurrentStep(1)} getData={getData} />
			) : currentStep === 1 ? (
				<PhuLucVanBangPage isQuyetDinh />
			) : null}

			{currentStep !== 0 ? (
				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalQuyetDinhTotNghiep;
