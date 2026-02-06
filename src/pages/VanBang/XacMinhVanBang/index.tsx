import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiXacMinh, ELoaiPhucDap, EPhaseXacMinh, nameTrangThaiXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Popconfirm, Spin, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewPhuLucVanBang from '../PhuLuc/components/ViewRender';
import ModalXacMinhVanBang from './components/Modal';
import ModalCaiDatXacMinh from './components/ModalCaiDat';

const XacMinhVanBangPage = (props: { title?: string }) => {
	const intl = useIntl();
	const { title } = props;
	const { getModel, page, limit, deleteModel, handleEdit, record, setRecord } = useModel('vbcc.xacminhvanbang');
	const { visibleForm, setVisibleForm, loading } = useModel('vbcc.phulucvanbang');

	const [isFormBieuMauVisible, setIsFormBieuMauVisible] = useState(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const onCell = (rec: XacMinhVanBang.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const trangThai =
		title === intl.formatMessage({ id: 'xacminhvanbang.title.yeucaudangxuly' })
			? [EPhaseXacMinh.XAC_MINH, EPhaseXacMinh.PHUC_DAP, EPhaseXacMinh.KET_QUA]
			: title === intl.formatMessage({ id: 'xacminhvanbang.title.yeucauchoky' })
				? [EPhaseXacMinh.KET_QUA]
				: title === intl.formatMessage({ id: 'xacminhvanbang.title.yeucauhoanthanh' })
					? [EPhaseXacMinh.HOAN_THANH]
					: null;

	const getData = () => {
		getModel(
			undefined,
			trangThai
				? [
						{
							active: true,
							field: 'phaseXuLy',
							operator: EOperatorType.INCLUDE,
							values: trangThai,
						},
					]
				: undefined,
		);
	};

	const columns: IColumn<XacMinhVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.nguoiyeucau' }),
			dataIndex: 'nguoiYeuCau',
			filterType: 'string',
			width: 160,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.loaiphucdap' }),
			dataIndex: 'loaiPhucDap',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiPhucDap),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.donvi' }),
			dataIndex: 'tenDonVi',
			filterType: 'string',
			width: 180,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.sdt' }),
			dataIndex: 'soDienThoai',
			filterType: 'string',
			width: 120,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.email' }),
			dataIndex: 'email',
			filterType: 'string',
			width: 180,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.ngaygui' }),
			dataIndex: 'ngayGuiYeuCau',
			filterType: 'date',
			render: (val: Date) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			width: 120,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.mucdichxacminh' }),
			dataIndex: 'mucDichXacMinh',
			filterType: 'string',
			width: 200,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.ketquaphucdap' }),
			dataIndex: 'urlFilePhucDapChung',
			width: 120,
			render: (val, rec) =>
				val?.length && (
					<a
						onClick={() => {
							setRecord(rec);
							setVisibleFormFile(true);
						}}
					>
						{intl.formatMessage({ id: 'xacminhvanbang.link.viewdetail' })}
					</a>
				),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.trangthai' }),
			dataIndex: 'phaseXuLy',
			width: 150,
			align: 'center',
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(trangThai ?? EPhaseXacMinh).map((item) => ({
				value: item,
				label: nameTrangThaiXacMinh[item],
			})),
			onCell,
			render: (val: EPhaseXacMinh) => <Tag color={colorTrangThaiXacMinh[val]}>{nameTrangThaiXacMinh[val]}</Tag>,
		},
		{
			title: intl.formatMessage({ id: 'xacminhvanbang.column.thaotac' }),
			width: 90,
			fixed: 'right',
			align: 'center',
			render: (_, record) => {
				const isHoanThanh = record?.phaseXuLy === EPhaseXacMinh.HOAN_THANH;
				return (
					<>
						<ButtonExtend
							disabled={isHoanThanh}
							tooltip={intl.formatMessage({ id: 'xacminhvanbang.action.chinhsua' })}
							onClick={() => handleEdit(record)}
							type='link'
							icon={<EditOutlined />}
						/>

						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title={intl.formatMessage({ id: 'xacminhvanbang.confirm.delete' })}
							placement='topRight'
						>
							<ButtonExtend
								disabled={isHoanThanh}
								tooltip={intl.formatMessage({ id: 'xacminhvanbang.action.xoa' })}
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				modelName={'vbcc.xacminhvanbang'}
				Form={ModalXacMinhVanBang}
				formProps={{ getData }}
				widthDrawer={1200}
				dependencies={[page, limit]}
				title={title ?? intl.formatMessage({ id: 'xacminhvanbang.title.tatcayeucau' })}
				extra={[
					<ButtonExtend
						key='add'
						type='link'
						onClick={() => setIsFormBieuMauVisible(true)}
						icon={<SettingOutlined />}
						tooltip={intl.formatMessage({ id: 'xacminhvanbang.action.bieumau' })}
					/>,
				]}
			>
				{/* <StatXacMinhVanBang /> */}
			</TableBase>

			<ModalExpandable
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				title={intl.formatMessage({ id: 'xacminhvanbang.modal.chitietvanbang' })}
				width={1000}
				footer={null}
			>
				<Spin spinning={loading}>
					<ViewPhuLucVanBang hasPrint={false} />
				</Spin>
			</ModalExpandable>

			<ModalCaiDatXacMinh visible={isFormBieuMauVisible} onClose={() => setIsFormBieuMauVisible(false)} />

			<ModalExpandable
				title={intl.formatMessage({ id: 'xacminhvanbang.modal.chitiettaptin' })}
				width={1000}
				open={visibleFormFile}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.urlFilePhucDapChung ?? []} />
			</ModalExpandable>
		</>
	);
};

export default XacMinhVanBangPage;
