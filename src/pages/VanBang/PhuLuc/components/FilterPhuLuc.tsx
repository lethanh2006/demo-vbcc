import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import { ETagColor } from '@/services/base/constant';
import { colorTrangThaiBlc, ETrangThaiBlockchain } from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, EditOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Descriptions, Popover, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalUploadFolder from './ModalUploadFolder';
import PreviewIPFS from './Preview';

const FilterPhuLuc = (props: { getData?: any }) => {
	const intl = useIntl();
	const { getData } = props;
	const { settings } = useModel('tienich.caidat');
	const { page, limit, record, getModel, setRecord, handleView } = useModel('vbcc.phulucvanbang');
	const {
		record: recQuyetDinh,
		danhSach: danhsachQuyetDinh,
		setRecord: setQuyetDinh,
	} = useModel('vbcc.quyetdinhtotnghiep');
	const { INFO_TENANT: settingVbcc } = settings;
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [showUpload, setShowUpload] = useState(false);

	// set lại quyết định sau khi sinh số vào sổ
	useEffect(() => {
		setQuyetDinh(danhsachQuyetDinh?.find((item) => item?._id === recQuyetDinh?._id));
	}, [JSON.stringify(danhsachQuyetDinh)]);

	useEffect(() => {
		if (recQuyetDinh?._id) {
			getModel({ idQuyetDinh: recQuyetDinh?._id });
		}
	}, [recQuyetDinh?._id, page, limit]);

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ',
			dataIndex: 'soVaoSoBang',
			filterType: 'string',
			width: 120,
			onCell,
		},
		{
			title: 'Số hiệu VB',
			dataIndex: 'soHieuVanBang',
			filterType: 'string',
			width: 120,
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 100,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Mã người học',
			dataIndex: 'maSinhVien',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Quyết định',
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
			title: 'Tập tin',
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
						Xem chi tiết
					</a>
				) : (
					<i>(Chưa upload)</i>
				),
			hide: !settingVbcc?.require_IPFS,
		},
		{
			title: 'Văn bằng',
			width: 120,
			children: [
				{
					title: 'Tập tin',
					dataIndex: 'fileVanBang',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						!val ? (
							<Tag color='red'>Chưa trình ký</Tag>
						) : (
							<a
								onClick={(e) => {
									e.preventDefault();
									setRecord(rec);
									setVisibleFormFile(true);
								}}
							>
								Xem chi tiết
							</a>
						),
				},
				{
					title: 'Ký số',
					dataIndex: 'daKy',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>Đã ký</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Người ký'>{rec?.nguoiKy?.hoTen ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Thời gian ký'>
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
							<Tag color='orange'>Chưa ký</Tag>
						),
				},
				{
					title: 'Đóng dấu',
					dataIndex: 'daDongDau',
					align: 'center',
					width: 120,
					render: (val, rec) =>
						val ? (
							<Space>
								<Tag color='green'>Đã đóng dấu</Tag>
								<Popover
									content={
										<div style={{ maxWidth: 300 }}>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Người đóng dấu'>
													{rec?.nguoiDongGiau?.hoTen ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Thời gian đóng dấu'>
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
							<Tag color='orange'>Chưa đóng dấu</Tag>
						),
				},
			],
			hide: !settingVbcc?.require_diploma_signature,
		},
		{
			title: 'Cấp bằng',
			dataIndex: 'kichHoat',
			align: 'center',
			width: 120,
			render: (_: any, record: PhuLucVanBang.IRecord) => {
				const trangThai = record?.kichHoat ? (
					<Tag color='green'>Đã cấp bằng</Tag>
				) : (
					<Tag color='red'>Chưa cấp bằng</Tag>
				);

				const ngayCap = record?.ngayCapPhuLuc ? `Ngày: ${dayjs(record.ngayCapPhuLuc).format('DD/MM/YYYY')}` : null;

				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<div>{trangThai}</div>
						{ngayCap && <div>{ngayCap}</div>}
					</div>
				);
			},
			filterType: 'select',
			filterData: [
				{ value: true as any, label: 'Đã cấp bằng' },
				{ value: false, label: 'Chưa cấp bằng' },
			],
			onCell,
		},
		{
			title: 'Ký số thông tin',
			dataIndex: 'signature',
			align: 'center',
			width: 80,
			render: (val) => <Tag color={!!val ? ETagColor.GREEN : ETagColor.RED}>{!!val ? 'Đã ký' : 'Chưa ký'}</Tag>,
			hide: !settingVbcc?.require_signature,
			onCell,
		},
		{
			title: 'Blockchain',
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
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				params={{ idQuyetDinh: recQuyetDinh?._id }}
				dependencies={[page, limit, recQuyetDinh?._id]}
				modelName='vbcc.phulucvanbang'
				title={intl.formatMessage({ id: 'vanbang.phulucvanbang.title' })}
				hideCard
				rowSelection
				buttons={{ create: false }}
			></TableBase>

			{settingVbcc?.require_IPFS && (
				<>
					<ModalUploadFolder visible={showUpload} setVisible={setShowUpload} getData={getData} />

					<PreviewIPFS visible={visibleModal} setVisible={setVisibleModal} />
				</>
			)}

			<ModalExpandable
				title='Chi tiết tệp tin'
				width={1000}
				open={visibleFormFile}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.fileVanBang ?? ''} />
			</ModalExpandable>
		</>
	);
};

export default FilterPhuLuc;
