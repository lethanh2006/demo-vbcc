import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Popconfirm, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SinhVienXacMinhPage from '../SinhVienXacMinh';

const TraKetQuaPage = (props: { afterAddNew?: (val: number) => void; getData?: () => void }) => {
	const { afterAddNew, getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, formSubmiting, visibleForm, setVisibleForm, nextStepXacMinhModel, setFormSubmiting } =
		useModel('vbcc.xacminhvanbang');

	const isHoanThanh = record?.phaseXuLy === EPhaseXacMinh.HOAN_THANH;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: XacMinhVanBang.IRecord) => {
		setFormSubmiting(true);
		const urlFilePhucDapChung = await buildUpLoadMultiFile(values, 'urlFilePhucDapChung');
		values.urlFilePhucDapChung = urlFilePhucDapChung;
		setFormSubmiting(false);

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
						<Form.Item
							label={intl.formatMessage({ id: 'xacminhvanbang.traketqua.label.ketquaphucdap' })}
							name='urlFilePhucDapChung'
						>
							<UploadFile maxCount={5} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'xacminhvanbang.traketqua.label.ghichu' })} name='ghiChu'>
							<Input.TextArea
								disabled={isHoanThanh}
								placeholder={intl.formatMessage({ id: 'xacminhvanbang.traketqua.placeholder.ghichu' })}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button
						onClick={() => {
							if (afterAddNew) afterAddNew(3);
						}}
						icon={<ArrowLeftOutlined />}
					>
						{intl.formatMessage({ id: 'xacminhvanbang.traketqua.button.quaylai' })}
					</Button>

					<Popconfirm
						disabled={isHoanThanh}
						onConfirm={() => form.submit()}
						title={intl.formatMessage({ id: 'xacminhvanbang.traketqua.confirm.hoanthanh' })}
						placement='topRight'
					>
						<Button disabled={isHoanThanh} loading={formSubmiting} type='primary' icon={<SaveOutlined />}>
							{intl.formatMessage({ id: 'xacminhvanbang.traketqua.button.hoanthanh' })}
						</Button>
					</Popconfirm>

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default TraKetQuaPage;
