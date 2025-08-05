import MyDatePicker from '@/components/MyDatePicker';
import SelectHinhThuc from '@/pages/DaoTao/CoSo/HinhThucDaoTao/components/Select';
import SelectTrinhDo from '@/pages/DaoTao/CoSo/TrinhDo/components/Select';
import type { SoVanBang } from '@/services/VanBang/SoVanBang/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SoVanBangForm = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('vbcc.sovanbang');

	// Dùng để lấy danh sách trình độ và hình thức đào tạo từ model khác
	const { danhSach: dsTrinhDo } = useModel('daotao.trinhdo');
	const { danhSach: dsHinhThuc } = useModel('daotao.hinhthucdaotao');
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: SoVanBang.IRecord) => {
		const submitData = {
			...values,
			namHanhChinh: moment(values.namHanhChinh).format('YYYY'),
		};

		if (edit) {
			putModel(record?._id ?? '', submitData).catch((er) => console.log(er));
		} else {
			postModel(submitData).catch((er) => console.log(er));
		}
	};

	const handleValuesChange = (changedValues: any, allValues: any) => {
		const { namHanhChinh, maTrinhDoDaoTao, maHinhThucDaoTao } = allValues;

		if (!edit) {
			const isRelevantChange = Object.keys(changedValues).some((key) =>
				['namHanhChinh', 'maTrinhDoDaoTao', 'maHinhThucDaoTao'].includes(key),
			);

			if (isRelevantChange) {
				const year = moment(namHanhChinh).format('YYYY');
				const maTrinhDo = String(maTrinhDoDaoTao || '');
				const maHinhThuc = String(maHinhThucDaoTao || '');

				const trinhDo = dsTrinhDo.find((x) => x.ma === maTrinhDo);
				const hinhThuc = dsHinhThuc.find((x) => x.ma === maHinhThuc);

				debugger;
				if (year && trinhDo?.ten && hinhThuc?.ten) {
					const tenSo = `Sổ văn bằng ${trinhDo.ten} - ${hinhThuc.ten} năm ${year}`;

					const currentTen = form.getFieldValue('ten') || '';
					const shouldUpdate = !currentTen || currentTen.startsWith('Sổ văn bằng');

					if (shouldUpdate) {
						form.setFieldsValue({ ten: tenSo });
					}
				}
			}
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${props.title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical' onValuesChange={handleValuesChange}>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item
							name='ten'
							label='Tên sổ văn bằng'
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
							extra='Tên sẽ được gợi ý tự động theo trình độ, hình thức đào tạo và năm hành chính'
						>
							<Input placeholder='Nhập tên sổ' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='soVaoSoFormat'
							label='Định dạng số vào sổ'
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='VD: DHCQ/{0}' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='namHanhChinh' label='Năm hành chính' rules={[...rules.required]}>
							<MyDatePicker pickerStyle='year' placeholder='Năm' format='YYYY' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='maTrinhDoDaoTao' label='Trình độ đào tạo' rules={[...rules.required]}>
							<SelectTrinhDo selectMa />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='maHinhThucDaoTao' label='Hình thức đào tạo' rules={[...rules.required]}>
							<SelectHinhThuc selectMa hideAll />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='moTa' label='Mô tả' rules={[...rules.text, ...rules.length(200)]}>
							<Input.TextArea placeholder='Nhập mô tả' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default SoVanBangForm;
