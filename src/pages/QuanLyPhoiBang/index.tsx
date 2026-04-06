import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { IColumn } from '@/components/Table/typing';
import FormQuanLyPhoiBang from '@/pages/QuanLyPhoiBang/components/Form';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import { DeleteOutlined, EyeOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Popover, Space } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalNhapThongTinPhoiBang from './components/ModalNhapThongTinPhoiBang';

const QuanLyPhoiBangPage = () => {
	const { page, limit, handleView, formSubmiting, postYeuCauCapMoiModel, postYeuCauHuyBieuMauModel, getModel } =
		useModel('vbcc.bieumauphoibang');
	const { getModel: getLichSu } = useModel('vbcc.lichsuphoibang');
	const { getModel: getPhoiBang } = useModel('vbcc.phoibang');

	const [modalConfig, setModalConfig] = useState<{
		visible: boolean;
		type?: 'CAP_MOI' | 'HUY';
		activeRecord?: PhoiBang.IBieuMauPhoiBang;
	}>({
		visible: false,
	});

	const onCell = (record: PhoiBang.IBieuMauPhoiBang) => {
		return {
			onClick: () => {
				handleView(record);
			},
		};
	};

	const handleCapMoi = (record: PhoiBang.IBieuMauPhoiBang) => {
		setModalConfig({ visible: true, type: 'CAP_MOI', activeRecord: record });
	};

	const handleHuy = (record: PhoiBang.IBieuMauPhoiBang) => {
		setModalConfig({ visible: true, type: 'HUY', activeRecord: record });
	};

	const handleModalSubmit = async (values: any) => {
		const payload = {
			id: modalConfig.activeRecord?._id,
			dinhDangSoHieu: modalConfig.activeRecord?.dinhDangSoHieu,
			soBatDau: values.startNumber,
			soKetThuc: values.endNumber,
			ngayNhap: values.ngayNhap,
			ghiChu: modalConfig.activeRecord?.ghiChu,
		};

		try {
			if (modalConfig.type === 'CAP_MOI') {
				await postYeuCauCapMoiModel(payload, getModel).then(() => {
					getLichSu();
					getPhoiBang();
				});
			} else if (modalConfig.type === 'HUY') {
				await postYeuCauHuyBieuMauModel(payload, getModel).then(() => {
					getLichSu();
					getPhoiBang();
				});
			}
			setModalConfig({ visible: false, type: undefined, activeRecord: undefined });
		} catch (_) {}
	};

	const columns: IColumn<PhoiBang.IBieuMauPhoiBang>[] = [
		{
			title: 'Tên biểu mẫu',
			dataIndex: 'ten',
			align: 'center',
			width: 150,
			onCell,
			render: (text) => text || '-',
		},
		{
			title: 'Định dạng số hiệu',
			dataIndex: 'dinhDangSoHieu',
			align: 'center',
			width: 150,
			onCell,
		},
		// {
		// 	title: 'Ngày nhập',
		// 	dataIndex: 'ngayNhap',
		// 	width: 150,
		// 	render: (text) => dayjs(text).format('DD/MM/YYYY'),
		// },
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 200,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			render: (text, record) => {
				return (
					<>
						<Popover
							trigger={'hover'}
							content={
								<Space size={'small'}>
									{/* Xem chi tiết */}
									<ButtonExtend
										tooltip={'Xem chi tiết biểu mẫu'}
										icon={<EyeOutlined />}
										type='link'
										onClick={() => {
											handleView(record);
										}}
									/>
									{/* cấp mới */}
									<ButtonExtend
										tooltip={'Cấp mới biểu mẫu'}
										loading={formSubmiting}
										icon={<PlusOutlined />}
										type='link'
										onClick={() => {
											handleCapMoi(record);
										}}
									/>
									{/* hủy */}
									<ButtonExtend
										tooltip={'Hủy biểu mẫu'}
										loading={formSubmiting}
										icon={<DeleteOutlined />}
										type='link'
										onClick={() => {
											handleHuy(record);
										}}
									/>
								</Space>
							}
						>
							<ButtonExtend type='link' icon={<MenuOutlined />} />
						</Popover>
					</>
				);
			},
		},
	];

	return (
		<>
			<Card title='Quản lý biểu mẫu phôi bằng'>
				<TableBase
					columns={columns}
					Form={FormQuanLyPhoiBang}
					hideCard
					widthDrawer={800}
					dependencies={[page, limit]}
					modelName='vbcc.bieumauphoibang'
				/>
			</Card>
			<ModalNhapThongTinPhoiBang
				visible={modalConfig.visible}
				onCancel={() => setModalConfig({ visible: false })}
				onOk={handleModalSubmit}
				title={modalConfig.type === 'CAP_MOI' ? 'Cấp mới biểu mẫu phôi bằng' : 'Hủy biểu mẫu phôi bằng'}
				submiting={formSubmiting}
			/>
		</>
	);
};

export default QuanLyPhoiBangPage;
