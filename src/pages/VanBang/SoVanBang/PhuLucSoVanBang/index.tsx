import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETagColor } from '@/services/base/constant';
import {
	colorTrangThaiBlc,
	colorTrangThaiTotNghiep,
	ETrangThaiBlockchain,
	ETrangThaiCapBang,
	nameTrangThaiTotNghiep,
} from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, EditOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Descriptions, Popover, Segmented, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import PreviewIPFS from '../../PhuLuc/components/Preview';
import ViewPhuLucVanBang from '../../PhuLuc/components/ViewRender';
import SelectQuyetDinhTotNghiep from '../../QuyetDinhTotNghiep/components/Select';

const PhuLucSoVanBangPage = () => {
	const intl = useIntl();
	const { record: recSoVanBang, getAllModel, loading } = useModel('vbcc.sovanbang');
	const { page, limit, getModel, setRecord, isView, edit, handleView, record } = useModel('vbcc.phulucvanbang');
	const { settings } = useModel('tienich.caidat');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [type, setType] = useState<string>('1');
	const [danhSach, setDanhSach] = useState<any[]>([]);

	const { INFO_TENANT: settingVbcc } = settings;

	const getData = () => {
		if (recSoVanBang?._id && type)
			type === '3'
				? getAllModel(
						undefined,
						undefined,
						undefined,
						undefined,
						`${recSoVanBang?._id}/unassigned-so-vao-so`,
						false,
					).then((res) =>
						setDanhSach(
							res.map((item: any) => ({
								soVaoSoBang: item,
							})),
						),
					)
				: getModel(
						undefined,
						undefined,
						type === '2' ? { soThuTuImport: 1 } : undefined,
						undefined,
						undefined,
						type === '1'
							? `chinh-thuc/so-van-bang/${recSoVanBang?._id}`
							: `chua-chinh-thuc/so-van-bang/${recSoVanBang?._id}`,
					);
	};

	useEffect(() => {
		getData();
	}, [type]);

	const onCell = (rec: PhuLucVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ',
			dataIndex: type === '1' ? 'soVaoSoBang' : 'soVaoSoTamThoi',
			filterType: 'string',
			width: 120,
			onCell,
			sortable: true,
		},
		{
			title: 'Số hiệu VB',
			dataIndex: 'soHieuVanBang',
			filterType: 'string',
			width: 120,
			sortable: true,
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
			onCell,
			filterType: 'customselect',
			filterCustomSelect: <SelectQuyetDinhTotNghiep />,
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
			title: 'Trạng thái phát bằng',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (_: any, record: PhuLucVanBang.IRecord) => {
				const trangThai = (
					<Tag color={colorTrangThaiTotNghiep[_ as ETrangThaiCapBang]}>
						{nameTrangThaiTotNghiep[_ as ETrangThaiCapBang]}
					</Tag>
				);

				const ngayCap = record?.ngayCapPhuLuc ? `${dayjs(record.ngayCapPhuLuc).format('DD/MM/YYYY')}` : null;

				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<div>{trangThai}</div>
						{record?.trangThai === ETrangThaiCapBang.DA_CAP_BANG && ngayCap && (
							<div style={{ fontSize: 12 }}>{ngayCap}</div>
						)}
					</div>
				);
			},
			filterData: Object.values(ETrangThaiCapBang).map((item) => ({
				value: item,
				label: nameTrangThaiTotNghiep[item as ETrangThaiCapBang],
			})),
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

	const columns3: IColumn<PhuLucVanBang.IRecord>[] = [
		{
			title: 'Số vào sổ',
			dataIndex: 'soVaoSoBang',
			filterType: 'string',
			width: 120,
			onCell,
			render: (val, rec) => val ?? rec?.soVaoSoTamThoi,
			sortable: true,
		},
		{
			title: 'Số hiệu VB',
			width: 120,
			render: (val, rec) => <i>Không có thông tin</i>,
		},
		{
			title: 'Họ tên',
			width: 160,
			render: (val, rec) => <i>Không có thông tin</i>,
		},
		{
			title: 'Ngày sinh',
			width: 100,
			render: (val, rec) => <i>Không có thông tin</i>,
		},
		{
			title: 'Mã người học',
			width: 120,
			render: (val, rec) => <i>Không có thông tin</i>,
		},
		{
			title: 'Quyết định',
			width: 140,
			render: (val, rec) => <i>Không có thông tin</i>,
		},
		{
			title: 'Trạng thái phát bằng',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color='blue'>Chưa phát bằng</Tag>,
		},
	];

	if (type === '3')
		return (
			<TableStaticData
				columns={columns3}
				data={danhSach ?? []}
				loading={loading}
				addStt
				hasTotal
				onReload={getData}
				otherButtons={[
					<Segmented
						value={type}
						onChange={(key) => setType(key)}
						options={[
							{ value: '1', label: 'Chính thức' },
							{ value: '2', label: 'Dự thảo' },
							{ value: '3', label: 'Giữ số' },
						]}
					/>,
				]}
			/>
		);

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recSoVanBang?._id, type]}
				modelName='vbcc.phulucvanbang'
				title={intl.formatMessage({ id: 'vanbang.phulucvanbang.title' })}
				widthDrawer={1000}
				modalTitle={
					isView
						? 'Xem chi tiết thông tin văn bằng'
						: edit
							? 'Cập nhật thông tin văn bằng'
							: 'Thêm mới thông tin văn bằng'
				}
				Form={ViewPhuLucVanBang}
				buttons={{
					create: false,
				}}
				hideCard
				showModalTitle
				otherButtons={[
					<Segmented
						value={type}
						onChange={(key) => setType(key)}
						options={[
							{ value: '1', label: 'Chính thức' },
							{ value: '2', label: 'Dự thảo' },
							{ value: '3', label: 'Giữ số' },
						]}
					/>,
				]}
			/>

			{settingVbcc?.require_IPFS && <PreviewIPFS visible={visibleModal} setVisible={setVisibleModal} />}

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

export default PhuLucSoVanBangPage;
