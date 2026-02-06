import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { IColumn } from '@/components/Table/typing';
import {
	colorLoaiYeuCauVangBang,
	colorTrangThaiYeuCauVanBang,
	ELoaiYeuCauVangBang,
	ETrangThaiYeuCauVanBang,
	nameLoaiYeuCauVangBang,
} from '@/services/VanBang/LichSuVanBang/constant';
import { LichSuVanBang } from '@/services/VanBang/LichSuVanBang/typing';
import dayjs from '@/utils/dayjs';
import { CheckOutlined, CloseOutlined, FileTextOutlined, ProfileOutlined } from '@ant-design/icons';
import { Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ModalXuLyPhuLuc from './components/XuLy';

const PhuLucChinhSuaPage = (props: { title: string }) => {
	const intl = useIntl();
	const { title } = props;
	const { getModel, page, limit, setRecord, handleView } = useModel('vbcc.lichsuvanbang');
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('1');

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: ETrangThaiYeuCauVanBang;
	}>();

	const getData = () => {
		const filters: any[] = [];

		if (title === 'Đề xuất chỉnh sửa') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.CHINH_SUA],
				operator: EOperatorType.INCLUDE,
			});
		}
		if (title === 'Đề xuất cấp lại') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.CAP_LAI],
				operator: EOperatorType.INCLUDE,
			});
		}
		if (title === 'Đề xuất thu hồi') {
			filters.push({
				active: true,
				field: 'loai',
				values: [ELoaiYeuCauVangBang.THU_HOI],
				operator: EOperatorType.INCLUDE,
			});
		}

		if (activeKey === '1') {
			filters.push({
				active: true,
				field: 'trangThai',
				values: [ETrangThaiYeuCauVanBang.CHO_XAC_NHAN],
				operator: EOperatorType.INCLUDE,
			});
		}

		if (activeKey === '2') {
			filters.push({
				active: true,
				field: 'trangThai',
				values: [ETrangThaiYeuCauVanBang.DA_DUYET, ETrangThaiYeuCauVanBang.KHONG_DUYET],
				operator: EOperatorType.INCLUDE,
			});
		}

		getModel(undefined, filters);
	};

	const onCell = (rec: LichSuVanBang.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LichSuVanBang.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'xulydexuat.column.phulucgoc' }),
			dataIndex: 'phuLucVanBangId',
			width: 250,
			render: (val, rec) =>
				[
					rec?.phuLucVanBang?.soVaoSoBang,
					rec?.phuLucVanBang?.soHieuVanBang,
					rec?.phuLucVanBang?.hoTen,
					rec?.phuLucVanBang?.ngaySinh,
					rec?.phuLucVanBang?.maSinhVien,
				]
					.filter(Boolean)
					.join(' | '),
			onCell: title !== intl.formatMessage({ id: 'xulydexuat.title.thuhoi' }) ? onCell : undefined,
		},
		{
			title: intl.formatMessage({ id: 'xulydexuat.column.thoigianyeucau' }),
			dataIndex: 'thoiGianYeuCau',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'datetime',
			sortable: true,
			onCell: title !== intl.formatMessage({ id: 'xulydexuat.title.thuhoi' }) ? onCell : undefined,
		},
		{
			title: intl.formatMessage({ id: 'xulydexuat.column.thoigianxuly' }),
			dataIndex: 'thoiGianXacNhan',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'datetime',
			sortable: true,
			onCell: title !== intl.formatMessage({ id: 'xulydexuat.title.thuhoi' }) ? onCell : undefined,
		},
		{
			title: intl.formatMessage({ id: 'xulydexuat.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'xulydexuat.column.dexuat' }),
			dataIndex: 'loai',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorLoaiYeuCauVangBang[val as ELoaiYeuCauVangBang]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ELoaiYeuCauVangBang),
			onCell: title !== intl.formatMessage({ id: 'xulydexuat.title.thuhoi' }) ? onCell : undefined,
		},
		{
			title: intl.formatMessage({ id: 'xulydexuat.column.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={colorTrangThaiYeuCauVanBang[val as ETrangThaiYeuCauVanBang]}>
					{nameLoaiYeuCauVangBang[val as ETrangThaiYeuCauVanBang]}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values([ETrangThaiYeuCauVanBang.DA_DUYET, ETrangThaiYeuCauVanBang.KHONG_DUYET]).map(
				(item) => ({
					value: item,
					label: nameLoaiYeuCauVangBang[item],
				}),
			),
			fixed: 'right',
			onCell: title !== intl.formatMessage({ id: 'xulydexuat.title.thuhoi' }) ? onCell : undefined,
			hide: activeKey === '1',
		},
		{
			title: intl.formatMessage({ id: 'xulydexuat.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => {
				const isChoXacNhan = rec?.trangThai === ETrangThaiYeuCauVanBang.CHO_XAC_NHAN;

				return (
					<>
						<ButtonExtend
							disabled={!isChoXacNhan}
							onClick={() => {
								setRecord(rec);
								setTrangThai({
									title: intl.formatMessage({ id: 'xulydexuat.modal.title.chapnhandexuat' }),
									trangThai: ETrangThaiYeuCauVanBang.DA_DUYET,
								});
								setVisibleXuLy(true);
							}}
							tooltip={intl.formatMessage({ id: 'xulydexuat.action.chapnhan' })}
							className='btn-success'
							type='link'
							icon={<CheckOutlined />}
						/>

						<ButtonExtend
							disabled={!isChoXacNhan}
							onClick={() => {
								setRecord(rec);
								setTrangThai({
									title: intl.formatMessage({ id: 'xulydexuat.modal.title.tuchoidexuat' }),
									trangThai: ETrangThaiYeuCauVanBang.KHONG_DUYET,
								});
								setVisibleXuLy(true);
							}}
							tooltip={intl.formatMessage({ id: 'xulydexuat.action.tuchoi' })}
							danger
							type='link'
							icon={<CloseOutlined />}
						/>
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
				dependencies={[page, limit, title, activeKey]}
				modelName='vbcc.lichsuvanbang'
				title={title}
				buttons={{
					create: false,
				}}
				Form={Form}
				formProps={{ getData }}
				widthDrawer={1200}
				modalTitle={intl.formatMessage({ id: 'xulydexuat.modal.chitiet' })}
				showModalTitle
			>
				<Tabs accessKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
					<Tabs.TabPane
						key={'1'}
						tab={intl.formatMessage({ id: 'xulydexuat.tab.chuaxuly' })}
						icon={<FileTextOutlined />}
					/>
					<Tabs.TabPane
						key={'2'}
						tab={intl.formatMessage({ id: 'xulydexuat.tab.lichsuxuly' })}
						icon={<ProfileOutlined />}
					/>
				</Tabs>
			</TableBase>

			<ModalXuLyPhuLuc
				visible={visibleXuLy}
				setVisible={setVisibleXuLy}
				title={trangThai?.title ?? ''}
				trangThai={trangThai?.trangThai ?? ETrangThaiYeuCauVanBang.CHO_XAC_NHAN}
				getData={getData}
			/>
		</>
	);
};

export default PhuLucChinhSuaPage;
