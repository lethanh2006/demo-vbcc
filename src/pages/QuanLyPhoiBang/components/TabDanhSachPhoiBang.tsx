import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { ColorTrangThaiPhoiBang, ETrangThaiPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import dayjs from '@/utils/dayjs';
import { Button, Tag } from 'antd';
import { useState } from 'react';
import { useModel, useIntl } from 'umi';
import ModalNhapThongTinPhoiBang from './ModalNhapThongTinPhoiBang';

interface IOption {
	label: string;
	value: string | number;
}

const TabDanhSachPhoiBang = () => {
	const {
		record,
		setVisibleForm,
		setIsView,
		postYeuCauCapMoiModel,
		postYeuCauHuyBieuMauModel,
		getModel: getBieuMauModel,
	} = useModel('vbcc.bieumauphoibang');
	const { getModel: getPhoiBang, page, limit } = useModel('vbcc.phoibang');
	const { getModel: getLichSu } = useModel('vbcc.lichsuphoibang');
	const intl = useIntl();

	const [modalConfig, setModalConfig] = useState<{ visible: boolean; type?: 'CAP_MOI' | 'HUY' }>({
		visible: false,
	});
	const [submiting, setSubmiting] = useState(false);

	const getData = () => {
		getPhoiBang(
			{
				idBieuMauPhoiBang: record?._id,
			},
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
		);
	};

	const mapEnumToOptions = <T extends Record<string, string | number>>(enumObj: T): IOption[] => {
		return Object.values(enumObj).map((value) => ({
			label: value.toString(),
			value: value,
		}));
	};

	const columns: IColumn<PhoiBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'phoibang.column.sohieuphoi' }),
			dataIndex: 'soHieuVanBang',
			align: 'center',
			filterType: 'string',
			sortable: true,
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'phoibang.column.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			filterType: 'select',
			filterData: mapEnumToOptions(ETrangThaiPhoiBang),
			sortable: true,
			width: 150,
			render: (text: string) => {
				if (!text) return null;
				const statuses = text.split(',').map((s) => s.trim() as ETrangThaiPhoiBang);
				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
						{statuses.map((status, index) => (
							<Tag key={index} color={ColorTrangThaiPhoiBang[status] || 'default'} style={{ margin: 0 }}>
								{status}
							</Tag>
						))}
					</div>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'phoibang.column.ngaytao' }),
			dataIndex: 'createdAt',
			align: 'center',
			width: 150,
			render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '',
		},
		{
			title: intl.formatMessage({ id: 'phoibang.column.ngaycapnhat' }),
			dataIndex: 'updatedAt',
			align: 'center',
			width: 150,
			render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '',
		},
	];

	const handleCapMoi = () => {
		setModalConfig({ visible: true, type: 'CAP_MOI' });
	};

	const handleHuy = () => {
		setModalConfig({ visible: true, type: 'HUY' });
	};

	const handleModalSubmit = async (values: any) => {
		try {
			setSubmiting(true);

			const payload = {
				id: record?._id,
				dinhDangSoHieu: record?.dinhDangSoHieu,
				soBatDau: values?.startNumber,
				soKetThuc: values?.endNumber,
				ngayNhap: values?.ngayNhap,
				ghiChu: record?.ghiChu,
				ten: record?.ten,
			};

			if (modalConfig.type === 'CAP_MOI') {
				if (postYeuCauCapMoiModel) {
					await postYeuCauCapMoiModel(payload, getBieuMauModel).then(() => {
						if (getLichSu) getLichSu();
						if (getPhoiBang) getPhoiBang();
						if (setVisibleForm) setVisibleForm(false);
						if (setIsView) setIsView(false);
					});
				}
			} else if (modalConfig.type === 'HUY') {
				if (postYeuCauHuyBieuMauModel) {
					await postYeuCauHuyBieuMauModel(payload, getBieuMauModel).then(() => {
						if (getLichSu) getLichSu();
						if (getPhoiBang) getPhoiBang();
						if (setVisibleForm) setVisibleForm(false);
						if (setIsView) setIsView(false);
					});
				}
			}
			setModalConfig({ visible: false, type: undefined });
		} catch (error) {
			console.log(error);
		} finally {
			setSubmiting(false);
		}
	};

	return (
		<div>
			<TableBase
				hideCard
				buttons={{ create: false }}
				dependencies={[page, limit, record?._id]}
				columns={columns}
				getData={getData}
				modelName='vbcc.phoibang'
			/>
			
			<div className='form-footer' style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
				<Button type='primary' onClick={handleCapMoi}>
					{intl.formatMessage({ id: 'phoibang.button.capmoibieumauphoi' })}
				</Button>
				<Button type='primary' onClick={handleHuy}>
					{intl.formatMessage({ id: 'phoibang.button.huybieumauphoi' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({ id: 'phoibang.button.dong' })}
				</Button>
			</div>

			<ModalNhapThongTinPhoiBang
				visible={modalConfig.visible}
				type={modalConfig.type}
				title={modalConfig.type === 'CAP_MOI' ? intl.formatMessage({ id: 'phoibang.button.capmoibieumauphoi' }) : intl.formatMessage({ id: 'phoibang.button.huybieumauphoi' })}
				onCancel={() => setModalConfig({ visible: false, type: undefined })}
				onOk={handleModalSubmit}
				submiting={submiting}
			/>
		</div>
	);
};

export default TabDanhSachPhoiBang;
