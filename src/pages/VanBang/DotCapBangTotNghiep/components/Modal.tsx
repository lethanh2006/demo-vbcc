import { Button, Card, message, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PhuLucVanBangPage from '../../PhuLuc';
import QuyetDinhTotNghiepPage from '../../QuyetDinhTotNghiep';
import Form from './Form';

const ModalDotCapBangTotNghiep = (props: any) => {
	const { title, getData } = props;
	const { record, edit, setVisibleForm } = useModel('vbcc.dotcapbangtotnghiep');
	const [currentStep, setCurrentStep] = useState(0);
	// const [selectedQuyetDinh, setSelectedQuyetDinh] = useState<string>();
	const [dotCapBangId = 'fromDotCapBangTotNghiepModal', setDotCapBangId] = useState(record?._id);

	useEffect(() => {
		setCurrentStep(0);
		if (record?._id) {
			setDotCapBangId(record._id);
		}
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		// Chỉ cho phép chuyển sang bước tiếp theo nếu đã có dotCapBangId
		if (step > 0 && !dotCapBangId) {
			message.warning('Vui lòng tạo đợt cấp bằng trước khi tiếp tục');
			return;
		}
		setCurrentStep(step);
	};

	const handleAfterAddNew = (newId: string) => {
		setDotCapBangId(newId);
		setCurrentStep(1);
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title='Thông tin chung' style={{ cursor: 'pointer' }} />
				<Steps.Step
					title='Quyết định tốt nghiệp'
					style={{ cursor: dotCapBangId ? 'pointer' : 'not-allowed' }}
					// onClick={() => setCurrentStep(1)}
					disabled={!record?._id}
				/>
				<Steps.Step
					title='Phụ lục văn bằng'
					style={{ cursor: dotCapBangId ? 'pointer' : 'not-allowed' }}
					// onClick={() => setCurrentStep(2)}
					disabled={!dotCapBangId}
				/>
			</Steps>

			{currentStep === 0 ? (
				<Form afterAddNew={handleAfterAddNew} getData={getData} />
			) : currentStep === 1 ? (
				<QuyetDinhTotNghiepPage dotCapBangId={dotCapBangId} />
			) : currentStep === 2 ? (
				<PhuLucVanBangPage dotCapBangId={dotCapBangId} />
			) : null}

			{currentStep !== 0 ? (
				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalDotCapBangTotNghiep;
