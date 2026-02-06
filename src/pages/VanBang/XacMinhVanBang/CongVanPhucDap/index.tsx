import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowLeftOutlined, ArrowRightOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SinhVienXacMinhPage from '../SinhVienXacMinh';

const CongVanPhucDapPage = (props: { afterAddNew?: (val: number) => void; getData?: () => void }) => {
	const { afterAddNew, getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, formSubmiting, visibleForm, setVisibleForm, nextStepXacMinhModel, setRecord } =
		useModel('vbcc.xacminhvanbang');

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
				phaseXuLy: EPhaseXacMinh.KET_QUA,
			},
			getData,
		).then((rec) => {
			setRecord({ ...record, ...rec });
			if (afterAddNew) afterAddNew(3);
		});
	};

	return (
		<>
			<SinhVienXacMinhPage isCongVan size='small' hideAdd hideImport />

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'xacminhvanbang.congvan.label.ghichu' })} name='ghiChu'>
							<Input.TextArea
								disabled={isHoanThanh}
								placeholder={intl.formatMessage({ id: 'xacminhvanbang.congvan.placeholder.ghichu' })}
							/>
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
						{intl.formatMessage({ id: 'xacminhvanbang.congvan.button.quaylai' })}
					</Button>
					<Button
						disabled={!record?._id || ![EPhaseXacMinh.KET_QUA, EPhaseXacMinh.HOAN_THANH].includes(record?.phaseXuLy)}
						onClick={() => {
							if (afterAddNew) afterAddNew(4);
						}}
						icon={<ArrowRightOutlined />}
					>
						{intl.formatMessage({ id: 'xacminhvanbang.congvan.button.tieptuc' })}
					</Button>
					<Button
						disabled={record?.phaseXuLy === EPhaseXacMinh.KET_QUA || isHoanThanh}
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						icon={<FileDoneOutlined />}
					>
						{intl.formatMessage({ id: 'xacminhvanbang.congvan.button.xulycongvan' })}
					</Button>

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default CongVanPhucDapPage;
