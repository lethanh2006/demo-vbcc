import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { IColumn } from '@/components/Table/typing';
import FormQuanLyPhoiBang from '@/pages/PhoiBang/components/Form';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import { CloseCircleOutlined, DeleteOutlined, EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Dropdown } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalNhapThongTinPhoiBang from './components/ModalNhapThongTin';

const QuanLyPhoiBangPage = () => {
	const intl = useIntl();
	const { page, limit, formSubmiting, postYeuCauCapMoiModel, postYeuCauHuyBieuMauModel, getModel, deleteModel, handleEdit, setEdit, setIsView, setRecord, setVisibleForm } =
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

	const handleRowClick = (rec: PhoiBang.IBieuMauPhoiBang) => {
		setRecord(rec);
		setEdit(true);
		setIsView(true);
		setVisibleForm(true);
	};

	const onCell = (record: PhoiBang.IBieuMauPhoiBang) => {
		return {
			onClick: () => {
				handleRowClick(record);
			},
			style: { cursor: 'pointer' },
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
		} catch (_) { }
	};

	const columns: IColumn<PhoiBang.IBieuMauPhoiBang>[] = [
		{
			title: intl.formatMessage({ id: 'phoibang.column.ten' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			className: 'force-left-align',
			onCell,
			render: (text) => text || '-',
		},
		{
			title: intl.formatMessage({ id: 'phoibang.column.dinhdangsohieu' }),
			dataIndex: 'dinhDangSoHieu',
			width: 150,
			filterType: 'string',
			sortable: true,
			className: 'force-left-align',
			onCell,
		},
		// {
		// 	title: 'Ngày nhập',
		// 	dataIndex: 'ngayNhap',
		// 	width: 150,
		// 	render: (text) => dayjs(text).format('DD/MM/YYYY'),
		// },
		{
			title: intl.formatMessage({ id: 'phoibang.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 200,
			filterType: 'string',
			sortable: true,
			className: 'force-left-align',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'phoibang.column.thaotac' }),
			align: 'center',
			width: 80,
			render: (text, record) => {
				const menuItems = [
					// {
					//     key: 'view',
					//     icon: <EyeOutlined />,
					//     label: 'Xem chi tiết',
					//     onClick: () => handleView(record),
					// },
					{
						key: 'capMoi',
						icon: <PlusOutlined />,
						label: intl.formatMessage({ id: 'phoibang.button.capmoiphoi' }),
						disabled: formSubmiting,
						onClick: () => handleCapMoi(record),
					},
					{
						key: 'edit',
						icon: <EditOutlined />,
						label: intl.formatMessage({ id: 'phoibang.button.chinhsua' }),
						disabled: formSubmiting,
						onClick: () => handleEdit(record),
					},
					{
						key: 'huy',
						icon: <CloseCircleOutlined />,
						label: intl.formatMessage({ id: 'phoibang.button.huyphoi' }),
						danger: true,
						disabled: formSubmiting,
						onClick: () => handleHuy(record),
					},
					{
						key: 'delete',
						icon: <DeleteOutlined />,
						label: intl.formatMessage({ id: 'phoibang.button.xoa' }),
						danger: true,
						disabled: formSubmiting,
						onClick: () => deleteModel(record._id!),
					},
				];

				return (
					<>
						<Dropdown
							menu={{ items: menuItems }}
							trigger={['hover']}
							placement="bottomLeft"
						>
							<ButtonExtend type='link' icon={<MenuOutlined />} />
						</Dropdown>

					</>
				);
			},
		},
	];

	return (
		<>
			<Card title={intl.formatMessage({ id: 'phoibang.title' })}>
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
				title={modalConfig.type === 'CAP_MOI' ? intl.formatMessage({ id: 'phoibang.modal.capmoi.title' }) : intl.formatMessage({ id: 'phoibang.modal.huy.title' })}
				submiting={formSubmiting}
				type={modalConfig.type}
			/>
		</>
	);
};

export default QuanLyPhoiBangPage;
