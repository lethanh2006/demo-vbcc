import TableBase from '@/components/Table';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { IColumn } from '@/components/Table/typing';
import { ColorTrangThaiPhoiBang, ETrangThaiPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import dayjs from '@/utils/dayjs';
import { Button, Tag, message } from 'antd';
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useModel, useIntl } from 'umi';
import ModalNhapThongTinPhoiBang from './ModalNhapThongTin';
import ViewPhuLucVanBang from '@/pages/VanBang/PhuLuc/components/ViewRender';

interface IOption {
	label: string;
	value: string | number;
}

const TabDanhSachPhoiBang = () => {
	const {
		record,
		setVisibleForm,
		setModalConfig,
	} = useModel('vbcc.bieumauphoibang');
	const { getModel: getPhoiBang, page, limit } = useModel('vbcc.phoibang');
	const { getOneModel: getOnePhuLuc, setRecord: setRecordPhuLuc, visibleForm, setVisibleForm: setVisiblePhuLucForm } = useModel('vbcc.phulucvanbang');
	const intl = useIntl();

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
			render: (text: string, record: PhoiBang.IRecord) => {
				if (record?.trangThai?.includes(ETrangThaiPhoiBang.DA_SU_DUNG)) {
					return (
						<a
							onClick={async () => {
								setRecordPhuLuc(undefined);
								setVisiblePhuLucForm(true);
								try {
									const student = await getOnePhuLuc({ soHieuVanBang: text });
									if (!student) {
										setVisiblePhuLucForm(false);
										message.warning(intl.formatMessage({ id: 'phoibang.message.khongtimthaysinhvien' }));
									}
								} catch (error) {
									setVisiblePhuLucForm(false);
									message.error(intl.formatMessage({ id: 'phoibang.message.loilaythongtin' }));
								}
							}}
						>
							{text}
						</a>
					);
				}
				return text;
			},
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
							<Tag key={index} color={ColorTrangThaiPhoiBang[status] || 'red'} style={{ margin: 0 }}>
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
			sortable: true,
			render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '',
		},
		{
			title: intl.formatMessage({ id: 'phoibang.column.ngaycapnhat' }),
			dataIndex: 'updatedAt',
			align: 'center',
			width: 150,
			sorter: true,
			render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY HH:mm') : '',
		},
		{
			title: intl.formatMessage({ id: 'phoibang.column.ghichu' }),
			dataIndex: 'ghiChu',
			align: 'left',
			width: 200,
		},
	];

	const handleCapMoi = () => {
		setModalConfig({ visible: true, type: 'CAP_MOI', activeRecord: record });
	};

	const handleHuy = () => {
		setModalConfig({ visible: true, type: 'HUY', activeRecord: record });
	};

	return (
		<div>
			<TableBase
				hideCard
				buttons={{ create: false }}
				otherButtons={[
					<Button key="capmoi" type='primary' icon={<PlusOutlined />} onClick={handleCapMoi}>
						{intl.formatMessage({ id: 'phoibang.button.capmoibieumauphoi' })}
					</Button>,
					<Button key="huy" type='primary' danger icon={<CloseCircleOutlined />} onClick={handleHuy}>
						{intl.formatMessage({ id: 'phoibang.button.huybieumauphoi' })}
					</Button>,
				]}
				dependencies={[page, limit, record?._id]}
				columns={columns}
				getData={getData}
				modelName='vbcc.phoibang'
			/>

			<div className='form-footer' style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({ id: 'phoibang.button.dong' })}
				</Button>
			</div>

			<ModalNhapThongTinPhoiBang />

			<ModalExpandable
				title={intl.formatMessage({ id: 'sovanbang.phuluc.modal.xem' })}
				open={visibleForm}
				onCancel={() => setVisiblePhuLucForm(false)}
				footer={null}
				width={1000}
			>
				<ViewPhuLucVanBang />
			</ModalExpandable>
		</div>
	);
};

export default TabDanhSachPhoiBang;
