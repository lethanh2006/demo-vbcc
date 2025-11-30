import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowLeftOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Popconfirm, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SinhVienXacMinhPage from '../SinhVienXacMinh';

const TraKetQuaPage = (props: { afterAddNew?: (val: number) => void; getData?: () => void }) => {
	const { afterAddNew, getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, formSubmiting, visibleForm, setVisibleForm, nextStepXacMinhModel } = useModel('vbcc.xacminhvanbang');

	const isHoanThanh = record?.phaseXuLy === EPhaseXacMinh.HOAN_THANH;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = (values: XacMinhVanBang.IRecord) => {
		nextStepXacMinhModel(
			record?._id ?? '',
			{
				ghiChu: values.ghiChu,
				phaseXuLy: EPhaseXacMinh.HOAN_THANH,
			},
			getData,
		).then(() => setVisibleForm(false));
	};
	return (
		<>
			<SinhVienXacMinhPage isKetQua size='small' hideAdd hideImport />

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label='Ghi chú' name='ghiChu'>
							<Input.TextArea disabled={isHoanThanh} placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button
						onClick={() => {
							if (afterAddNew) afterAddNew(2);
						}}
						icon={<ArrowLeftOutlined />}
					>
						Quay lại
					</Button>

					<Popconfirm
						disabled={isHoanThanh}
						onConfirm={() => form.submit()}
						title='Xác nhận hoàn thành xác minh?'
						placement='topRight'
					>
						<Button disabled={isHoanThanh} loading={formSubmiting} type='primary' icon={<SaveOutlined />}>
							Hoàn thành
						</Button>
					</Popconfirm>

					<Button onClick={() => setVisibleForm(false)} icon={<CloseCircleOutlined />} danger>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</>
	);
};

export default TraKetQuaPage;
