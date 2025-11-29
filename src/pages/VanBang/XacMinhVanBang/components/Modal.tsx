import dayjs from '@/utils/dayjs';
import { Col, Descriptions, Row, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PhucDapPage from '../PhucDap';
import FormXacMinhVanBang from './FormXacMinh';
import ThongTinPhuLucXacMinh from './ThongTinPhuLuc';

const ModalXacMinhVanBang = () => {
	const { record, visibleForm } = useModel('vbcc.xacminhvanbang');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		if (!visibleForm) {
			setCurrentStep(0);
		}
	}, [visibleForm]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} sm={24} md={6} lg={6} xl={6}>
				<Steps
					current={currentStep}
					onChange={record?._id ? onChangeStep : undefined}
					progressDot
					direction='vertical'
					size='small'
				>
					<Steps.Step title='Thông tin chung' />
					<Steps.Step title='Thông tin hệ thống' disabled={!record?._id} />
					<Steps.Step title='Phúc đáp' disabled={!record?._id} />
				</Steps>
			</Col>
			<Col xs={24} sm={24} md={18} lg={18} xl={18}>
				{currentStep === 0 ? (
					<>
						{record?._id ? (
							<Descriptions
								style={{
									marginBottom: 12,
								}}
								column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
								className='highlight'
								layout='vertical'
								colon={false}
							>
								<Descriptions.Item label='Người tạo'>{record?.nguoiTao?.hoTen ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Thời gian tạo'>
									{record?.nguoiTao?.thoiGian ? dayjs(record?.nguoiTao?.thoiGian).format('HH:mm DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Người xử lý'>{record?.nguoiXuLy?.hoTen ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Thời gian xử lý'>
									{record?.nguoiXuLy?.thoiGian ? dayjs(record?.nguoiXuLy?.thoiGian).format('HH:mm DD/MM/YYYY') : '--'}
								</Descriptions.Item>
								<Descriptions.Item label='Loại phúc đáp'>{record?.loaiPhucDap ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='File phúc đáp'>
									{record?.filePhucDap ? (
										<a href={record?.filePhucDap} target='_blank' rel='noreferrer'>
											Chi tiết
										</a>
									) : (
										'—'
									)}
								</Descriptions.Item>
								<Descriptions.Item label='Nội dung phúc đáp' span={2}>
									{record?.noiDungPhucDap ?? '--'}
								</Descriptions.Item>
							</Descriptions>
						) : null}
						<FormXacMinhVanBang afterAddNew={setCurrentStep} />
					</>
				) : currentStep === 1 ? (
					<ThongTinPhuLucXacMinh afterAddNew={setCurrentStep} />
				) : currentStep === 2 ? (
					<PhucDapPage afterAddNew={setCurrentStep} />
				) : null}
			</Col>
		</Row>
	);
};

export default ModalXacMinhVanBang;
