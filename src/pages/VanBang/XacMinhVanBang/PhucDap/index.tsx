import { buildUpLoadFile } from '@/services/uploadFile';
import { ELoaiPhucDap, ETrangThaiXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowLeftOutlined, CloseCircleOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormPhucDap from './Form';

const PhucDapPage = (props: { afterAddNew?: (val: number) => void }) => {
	const { afterAddNew } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, formSubmiting, putModel, setFormSubmiting, visibleForm, setVisibleForm } =
		useModel('vbcc.xacminhvanbang');
	const [trangThai, setTrangThai] = useState<ETrangThaiXacMinh>(ETrangThaiXacMinh.CHO_XU_LY);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				...record,
				loaiPhucDap: record?.loaiPhucDap ?? ELoaiPhucDap.VAN_BAN_GIAY,
			});
		}
	}, [visibleForm]);

	const onFinish = async (values: XacMinhVanBang.IRecord) => {
		values.trangThaiXacMinh = trangThai;
		setFormSubmiting(true);
		const filePhucDap = await buildUpLoadFile(values, 'filePhucDap');
		values.filePhucDap = filePhucDap;
		setFormSubmiting(false);

		putModel(record?._id ?? '', values)
			.then(() => setVisibleForm(false))
			.catch((err) => console.log(err));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<FormPhucDap form={form} />

			<div className='form-footer'>
				<Button
					onClick={() => {
						if (afterAddNew) afterAddNew(1);
					}}
					icon={<ArrowLeftOutlined />}
				>
					Quay lại
				</Button>
				<Button
					loading={formSubmiting}
					type='primary'
					onClick={() => {
						setTrangThai(ETrangThaiXacMinh.DANG_XAC_MINH);
						form.submit();
					}}
					icon={<SearchOutlined />}
				>
					Tiến hành xác minh
				</Button>
				<Button
					loading={formSubmiting}
					type='primary'
					onClick={() => {
						setTrangThai(ETrangThaiXacMinh.TRA_KET_QUA);
						form.submit();
					}}
					className='btn-success'
					icon={<SendOutlined />}
				>
					Trả kết quả
				</Button>
				<Button onClick={() => setVisibleForm(false)} icon={<CloseCircleOutlined />} danger>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>
		</Form>
	);
};

export default PhucDapPage;
