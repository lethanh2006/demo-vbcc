import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import SelectBieuMauPhuLuc from '@/pages/DanhMuc/BieuMauPhuLuc/components/Select';
import { getQuyetDinhTheoDotCapBang, loaiBoQuyetDinhKhoiDotCapBang } from '@/services/VanBang/PhuLucVanBang';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import dayjs from '@/utils/dayjs';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChonQuyetDinh from '../../DotCapBangTotNghiep/components/ModalChonQuyetDinh';
import SelectSoVanBang from '../../SoVanBang/components/Select';
import ModalQuyetDinhTotNghiep from './Modal';

const ViewQuyetDinhTheoDot = (props: { isDotCapBang?: boolean }) => {
	const { isDotCapBang: isdotCapBang = false } = props;
	const intl = useIntl();
	const { record: recDotCapBang } = useModel('vbcc.dotcapbangtotnghiep');
	const { handleEdit, page, limit, setRecord, record, setDanhSach } = useModel('vbcc.quyetdinhtotnghiep');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [visibleModalChonQuyetDinh, setVisibleModalChonQuyetDinh] = useState<boolean>(false);

	const getData = async () => {
		if (!isdotCapBang || !recDotCapBang?._id) return;
		const res = await getQuyetDinhTheoDotCapBang(recDotCapBang._id);
		setDanhSach?.(Array.isArray(res?.data) ? res?.data : []);
	};

	const handleApply = () => {
		setVisibleModalChonQuyetDinh(true);
	};

	const onCell = (rec: QuyetDinhTotNghiep.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const deleQuyetDinhDot = (rec: QuyetDinhTotNghiep.IRecord) => {
		if (!recDotCapBang?._id) return;
		loaiBoQuyetDinhKhoiDotCapBang(recDotCapBang._id, [rec._id])
			.then(() => {
				message.success('Loại bỏ quyết định khỏi đợt cấp bằng thành công');
				return getData();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const columns: IColumn<QuyetDinhTotNghiep.IRecord>[] = [
		{
			title: 'Năm hành chính',
			dataIndex: 'nam',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Số quyết định',
			dataIndex: 'soQuyetDinh',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Ngày ký',
			dataIndex: 'ngayBanHanh',
			width: 100,
			filterType: 'date',
			sortable: true,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'idSoVanBang',
			width: 180,
			render: (val, rec) => rec?.soVanBang?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectSoVanBang multiple />,
			onCell,
		},
		{
			title: 'Biểu mẫu phụ lục',
			dataIndex: 'maBieuMau',
			width: 150,
			render: (val, rec) => rec?.bieuMau?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectBieuMauPhuLuc multiple selectMa />,
			onCell,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 160,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Đính kèm',
			dataIndex: 'url',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val && (
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
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: QuyetDinhTotNghiep.IRecord) => (
				<>
					<Popconfirm
						onConfirm={() => deleQuyetDinhDot(rec)}
						title='Bạn có chắc chắn muốn loại bỏ quyết định tốt nghiệp này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='loại bỏ quyết định' danger type='link' icon={<CloseOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				deleteMany={true}
				dependencies={[page, limit, recDotCapBang?._id]}
				modelName='vbcc.quyetdinhtotnghiep'
				title={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.title' })}
				widthDrawer={1200}
				Form={ModalQuyetDinhTotNghiep}
				formProps={{ getData }}
				rowSelection
				buttons={{ create: isdotCapBang ? false : true, export: true }}
				otherButtons={
					isdotCapBang
						? [
								<Tooltip title='Thêm quyết định hiện có vào đợt cấp bằng này' key='apply-tooltip'>
									<Button type='primary' icon={<PlusCircleOutlined />} onClick={handleApply}>
										Thêm quyết định
									</Button>
								</Tooltip>,
							]
						: []
				}
				hideCard
				showModalTitle
			/>

			<ModalExpandable
				title='Chi tiết minh chứng'
				width={1000}
				open={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.url ?? ''} />
			</ModalExpandable>

			<ModalChonQuyetDinh
				visible={visibleModalChonQuyetDinh}
				onCancel={() => setVisibleModalChonQuyetDinh(false)}
				getData={getData}
			/>
		</>
	);
};

export default ViewQuyetDinhTheoDot;
