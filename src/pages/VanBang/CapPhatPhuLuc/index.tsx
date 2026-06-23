import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { IColumn } from '@/components/Table/typing';
import { ETagColor } from '@/services/base/constant';
import {
	colorTrangThaiBlc,
	colorTrangThaiTotNghiep,
	ETrangThaiBlockchain,
	ETrangThaiCapBang,
	ETrangThaiQuyetDinhTotNghiep,
	nameTrangThaiTotNghiep,
} from '@/services/VanBang/constant';
import { exportXacNhanCapBangTotNghiep } from '@/services/VanBang/PhuLucVanBang';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { getFilenameHeader } from '@/utils/utils';
import {
	CheckCircleOutlined,
	CheckOutlined,
	DownloadOutlined,
	EditOutlined,
	InfoCircleOutlined,
	SettingOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Descriptions, Popover, Space, Tag } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import PreviewIPFS from '../PhuLuc/components/Preview';
import ViewPhuLucVanBang from '../PhuLuc/components/ViewRender';
import SelectQuyetDinhTotNghiep from '../QuyetDinhTotNghiep/components/Select';
import ModalCaiDatCapPhatPhuLuc from './ModalCaiDat';
import ModalXuLyCapBang from './XuLy';

const CapPhatPhuLucPage = () => {
	const intl = useIntl();
	const {
		record: recQuyetDinh,
		danhSach: danhsachQuyetDinh,
		setRecord: setQuyetDinh,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const { page, limit, getModel, setRecord, handleView, record } = useModel('vbcc.phulucvanbang');
	const { settings } = useModel('tienich.caidat');
	const { INFO_TENANT: settingVbcc } = settings;
	const [yearSelect, setYearSelect] = useState<any>();
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [visibleCaiDat, setVisibleCaiDat] = useState<boolean>(false);
	const [loadingExportId, setLoadingExportId] = useState<string>();

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: ETrangThaiCapBang;
	}>();

	const getData = () => {
		// if (recQuyetDinh?._id)
		getModel(
			{
				idQuyetDinh: recQuyetDinh?._id,
			},
			[
				{
					active: true,
					field: 'soVaoSoBang',
					operator: EOperatorType.NOT_NULL,
				},
			],
		);
	};

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const handleDownloadBieuMau = (rec: PhuLucVanBang.IRecord) => {
		if (!rec?._id) return;

		setLoadingExportId(rec._id);
		exportXacNhanCapBangTotNghiep(rec._id)
			.then((res) => fileDownload(res.data, getFilenameHeader(res)))
			.finally(() => setLoadingExportId(undefined));
	};

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.sovaoso' }),
			dataIndex: 'soVaoSoBang',
			filterType: 'string',
			width: 120,
			onCell,
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.sohieuvb' }),
			dataIndex: 'soHieuVanBang',
			filterType: 'string',
			width: 120,
			onCell,
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.hoten' }),
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.ngaysinh' }),
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.manguoihoc' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.quyetdinh' }),
			dataIndex: 'idQuyetDinh',
			width: 140,
			render: (val, rec) => (
				<>
					{rec.quyetDinh?.soQuyetDinh ?? ''},{' '}
					{rec.quyetDinh?.ngayBanHanh ? dayjs(rec.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : ''}
				</>
			),
			hide: !!recQuyetDinh?._id,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.taptin' }),
			dataIndex: 'urlIpfs',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<a
						onClick={(e) => {
							e.preventDefault();
							setRecord(rec);
							setVisibleModal(true);
						}}
					>
						{intl.formatMessage({ id: 'capphatvanbang.link.viewdetail' })}
					</a>
				) : (
					<i>({intl.formatMessage({ id: 'capphatvanbang.tag.chuaupload' })})</i>
				),
			hide: !settingVbcc?.require_IPFS,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.vanbang' }),
			width: 120,
			children: [
				{
					title: intl.formatMessage({ id: 'capphatvanbang.column.vanbang.taptin' }),
					dataIndex: 'fileVanBang',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						!val ? (
							<Tag color='red'>{intl.formatMessage({ id: 'capphatvanbang.tag.chuatrinhky' })}</Tag>
						) : (
							<a
								onClick={(e) => {
									e.preventDefault();
									setRecord(rec);
									setVisibleFormFile(true);
								}}
							>
								{intl.formatMessage({ id: 'capphatvanbang.link.viewdetail' })}
							</a>
						),
				},
				{
					title: intl.formatMessage({ id: 'capphatvanbang.column.vanbang.kyso' }),
					dataIndex: 'daKy',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>{intl.formatMessage({ id: 'capphatvanbang.tag.daky' })}</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label={intl.formatMessage({ id: 'capphatvanbang.popover.nguoiky' })}>
													{rec?.nguoiKy?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label={intl.formatMessage({ id: 'capphatvanbang.popover.thoigianky' })}>
													{rec?.thoiGianKy ? dayjs(rec?.thoiGianKy).format('HH:mm DD/MM/YYYY') : '--'}
												</Descriptions.Item>
											</Descriptions>
										</div>
									}
								>
									<InfoCircleOutlined />
								</Popover>
							</Space>
						) : (
							<Tag color='orange'>{intl.formatMessage({ id: 'capphatvanbang.tag.chuaky' })}</Tag>
						),
				},
				{
					title: intl.formatMessage({ id: 'capphatvanbang.column.vanbang.dongdau' }),
					dataIndex: 'daDongDau',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>{intl.formatMessage({ id: 'capphatvanbang.tag.dadongdau' })}</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label={intl.formatMessage({ id: 'capphatvanbang.popover.nguoidongdau' })}>
													{rec?.nguoiDongGiau?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label={intl.formatMessage({ id: 'capphatvanbang.popover.thoigiandongdau' })}>
													{rec?.thoiGianDongGiau ? dayjs(rec?.thoiGianDongGiau).format('HH:mm DD/MM/YYYY') : '--'}
												</Descriptions.Item>
											</Descriptions>
										</div>
									}
								>
									<InfoCircleOutlined />
								</Popover>
							</Space>
						) : (
							<Tag color='orange'>{intl.formatMessage({ id: 'capphatvanbang.tag.chuadongdau' })}</Tag>
						),
				},
			],
			hide: !settingVbcc?.require_diploma_signature,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.trangthaiphatbang' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={colorTrangThaiTotNghiep[val as ETrangThaiCapBang]}>
					{nameTrangThaiTotNghiep[val as ETrangThaiCapBang]}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiCapBang).map((item) => ({
				value: item,
				label: nameTrangThaiTotNghiep[item as ETrangThaiCapBang],
			})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.kysothongtin' }),
			dataIndex: 'signature',
			align: 'center',
			width: 80,
			render: (val) => (
				<Tag color={!!val ? ETagColor.GREEN : ETagColor.RED}>
					{intl.formatMessage({ id: !!val ? 'capphatvanbang.tag.daky' : 'capphatvanbang.tag.chuaky' })}
				</Tag>
			),
			hide: !settingVbcc?.require_signature,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.blockchain' }),
			dataIndex: 'createdBlockchain',
			align: 'center',
			width: 180,
			filterType: 'select',
			filterData: Object.values(ETrangThaiBlockchain).map((item) => ({ label: item, value: item })),
			render: (val: ETrangThaiBlockchain) => (
				<div style={{ color: colorTrangThaiBlc[val] }}>
					<Space>
						{val === ETrangThaiBlockchain.DA_LUU ? (
							<CheckCircleOutlined />
						) : val === ETrangThaiBlockchain.CHUA_CAP_NHAT ? (
							<EditOutlined />
						) : (
							<WarningOutlined />
						)}{' '}
						{val}
					</Space>
				</div>
			),
			hide: !settingVbcc?.blockChain,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.thoigiancapbang' }),
			dataIndex: 'ngayCapPhuLuc',
			align: 'center',
			width: 100,
			render: (val, rec) => rec?.trangThai === ETrangThaiCapBang.DA_CAP_BANG && val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.ghichucapbang' }),
			dataIndex: 'ghiChuCapBang',
			width: 200,
			render: (val) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'capphatvanbang.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => {
				return (
					<>
						<ButtonExtend
							disabled={rec?.trangThai === ETrangThaiCapBang.DA_CAP_BANG}
							onClick={() => {
								setRecord(rec);
								setTrangThai({
									title: intl.formatMessage({ id: 'capphatvanbang.modal.title.capphatvanbang' }),
									trangThai: ETrangThaiCapBang.DA_CAP_BANG,
								});
								setVisibleXuLy(true);
							}}
							tooltip={intl.formatMessage({ id: 'capphatvanbang.action.daphatbang' })}
							className='btn-success'
							type='link'
							icon={<CheckOutlined />}
						/>

						<ButtonExtend
							onClick={() => handleDownloadBieuMau(rec)}
							tooltip={intl.formatMessage({ id: 'capphatvanbang.action.taibieumauxacnhan' })}
							type='link'
							icon={<DownloadOutlined />}
							loading={loadingExportId === rec._id}
						/>

						{/* <ButtonExtend
							disabled={rec?.trangThai === ETrangThaiCapBang.CHO_CAP_BANG}
							onClick={() => {
								setRecord(rec);
								setTrangThai({
									title: intl.formatMessage({ id: 'capphatvanbang.modal.title.chuaphatvanbang' }),
									trangThai: ETrangThaiCapBang.CHO_CAP_BANG,
								});
								setVisibleXuLy(true);
							}}
							tooltip={intl.formatMessage({ id: 'capphatvanbang.action.chuaphatbang' })}
							danger
							type='link'
							icon={<CloseOutlined />}
						/> */}
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
				params={{ idQuyetDinh: recQuyetDinh?._id }}
				dependencies={[page, limit, recQuyetDinh?._id]}
				modelName='vbcc.phulucvanbang'
				title={intl.formatMessage({ id: 'capphatvanbang.title' })}
				widthDrawer={1000}
				modalTitle={intl.formatMessage({ id: 'capphatvanbang.modal.detail' })}
				Form={ViewPhuLucVanBang}
				buttons={{
					create: false,
				}}
				showModalTitle
				cardExtra={[
					<ButtonExtend
						icon={<SettingOutlined />}
						tooltip={intl.formatMessage({ id: 'capphatvanbang.action.caidat' })}
						onClick={() => setVisibleCaiDat(true)}
					/>,
				]}
			>
				<Space wrap style={{ marginBottom: 12 }}>
					<MyDatePicker
						style={{ width: 150 }}
						value={yearSelect}
						pickerStyle='year'
						placeholder={intl.formatMessage({ id: 'capphatvanbang.placeholder.chonnamhanhchinh' })}
						format='YYYY'
						onChange={(val) => {
							if (val) {
								setYearSelect(dayjs(val));
							} else {
								setYearSelect(null);
							}
						}}
						allowClear
					/>

					<SelectQuyetDinhTotNghiep
						allowClear
						condition={
							yearSelect
								? { nam: dayjs(yearSelect).format('YYYY'), trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }
								: { trangThai: ETrangThaiQuyetDinhTotNghiep.HOAN_THANH }
						}
						style={{ width: 250 }}
						value={recQuyetDinh?._id}
						onChange={(val) => setQuyetDinh(danhsachQuyetDinh?.find((item) => item._id === val))}
						// isSetRecord
					/>
				</Space>
			</TableBase>

			{settingVbcc?.require_IPFS && (
				<>
					<PreviewIPFS visible={visibleModal} setVisible={setVisibleModal} />
				</>
			)}

			<ModalExpandable
				title={intl.formatMessage({ id: 'capphatvanbang.modal.chitiet' })}
				width={1000}
				open={visibleFormFile}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.fileVanBang ?? ''} />
			</ModalExpandable>

			<ModalXuLyCapBang
				visible={visibleXuLy}
				setVisible={setVisibleXuLy}
				title={trangThai?.title ?? ''}
				trangThai={trangThai?.trangThai}
				getData={getData}
			/>

			<ModalCaiDatCapPhatPhuLuc visible={visibleCaiDat} onClose={() => setVisibleCaiDat(false)} />
		</>
	);
};

export default CapPhatPhuLucPage;
