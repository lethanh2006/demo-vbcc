import MyDatePicker from '@/components/MyDatePicker';
import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import { Button, Col, Form, Input, InputNumber, message, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTable = (props: { elements: BieuMauPhuLuc.TElement; onCancel: any; edit: boolean; record?: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { tableData, setTableData } = useModel('vbcc.phulucvanbang');

	useEffect(() => {
		if (props.record) {
			form.setFieldsValue(props.record);
		} else {
			form.resetFields();
		}
	}, [props.record]);

	const onFinish = (values: any) => {
		const dataList = [...(tableData?.[props.elements.headerName] ?? [])];

		if (props.edit && props.record?.index !== undefined) {
			dataList.splice(props.record.index, 1, values);
			message.success(intl.formatMessage({ id: 'formthongtin.success.updated' }));
		} else {
			dataList.push(values);
			message.success(intl.formatMessage({ id: 'formthongtin.success.added' }));
		}

		setTableData({ ...tableData, [props.elements.headerName]: dataList });
		props.onCancel();
	};

	return (
		<Form layout='vertical' form={form} onFinish={onFinish}>
			<Row gutter={[12, 0]}>
				{props?.elements?.cot?.map((element) => (
					<Col span={24} md={12} key={element.headerName}>
						<Form.Item label={element.headerName} name={element.headerName}>
							{element.type === ELoaiDuLieuBieuMau.Number ? (
								<InputNumber
									style={{ width: '100%' }}
									placeholder={`${intl.formatMessage({ id: 'formthongtin.placeholder.input' })} ${element.headerName}`}
								/>
							) : element.type === ELoaiDuLieuBieuMau.Date ? (
								<MyDatePicker />
							) : (
								<Input
									placeholder={`${intl.formatMessage({ id: 'formthongtin.placeholder.input' })} ${element.headerName}`}
								/>
							)}
						</Form.Item>
					</Col>
				))}
			</Row>

			<div className='form-footer' style={{ marginTop: 24 }}>
				<Button htmlType='submit' type='primary'>
					{props.edit
						? intl.formatMessage({ id: 'global.button.luulai' })
						: intl.formatMessage({ id: 'global.button.themmoi' })}
				</Button>
				<Button onClick={props.onCancel} style={{ marginLeft: 8 }}>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormTable;
