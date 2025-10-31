import { Modal, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import ModalSinhSo from './ModalCauHinhSinhSo';
import ModalDraftThuTuVaoSo from './ModalDraftThuTuVaoSo';

interface Props {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	getData?: () => void;
}

const ModalSinhSoVaoSoTong: React.FC<Props> = ({ visible, setVisible, getData }) => {
	const intl = useIntl();
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [configData, setConfigData] = useState<any>(null);

	useEffect(() => {
		if (!visible) {
			setCurrentStep(0);
			setConfigData(null);
			[];
		}
	}, [visible]);

	const handleNext = (values: any, draftList: any[]) => {
		setConfigData(values);
		draftList;
		setCurrentStep(1);
	};

	const handleBack = () => {
		setCurrentStep(0);
	};

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			title='Sinh số vào sổ quyết định'
			footer={null}
			width={800}
		>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18 }}
				onChange={currentStep === 0 ? undefined : setCurrentStep}
			>
				<Steps.Step title='Cấu hình sinh số' />
				<Steps.Step title='Xem trước thứ tự vào sổ' disabled={!configData} />
			</Steps>

			{currentStep === 0 ? (
				<ModalSinhSo onNext={handleNext} onCancel={() => setVisible(false)} />
			) : (
				<ModalDraftThuTuVaoSo
					data={configData}
					onBack={handleBack}
					onDone={() => {
						getData?.();
						setVisible(false);
					}}
				/>
			)}
		</Modal>
	);
};

export default ModalSinhSoVaoSoTong;
