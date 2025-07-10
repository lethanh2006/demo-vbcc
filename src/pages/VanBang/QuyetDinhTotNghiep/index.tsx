import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import type { QuyetDinhTotNghiep } from '@/services/VanBang/QuyetDinh/typing';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChonQuyetDinh from '../DotCapBangTotNghiep/components/ModalChonQuyetDinh';
import ModalQuyetDinhTotNghiep from './components/Modal';

type TProp = {
	dotCapBangId: string;
};

const QuyetDinhTotNghiepPage: React.FC<TProp> = ({ dotCapBangId }) => {
	const intl = useIntl();
	const { getModel, handleEdit, page, limit, deleteModel, setRecord, record, putModel } =
		useModel('vbcc.quyetdinhtotnghiep');
	const { record: recHocKy } = useModel('daotao.hocky');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [visibleModalChonQuyetDinh, setVisibleModalChonQuyetDinh] = useState<boolean>(false);

	const getData = () => {
		if (dotCapBangId) {
			getModel({ dotCapBangId });
		} else {
			getModel({ maHocKy: recHocKy?.ma });
		}
	};

	useEffect(() => {
		getData();
	}, [dotCapBangId, recHocKy?.ma, page, limit]); // Gọi getData khi các dependencies thay đổi

	const handleApply = () => {
		setVisibleModalChonQuyetDinh(true);
	};

	const onCell = (rec: QuyetDinhTotNghiep.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyetDinhTotNghiep.IRecord>[] = [
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
			width: 120,
			filterType: 'date',
			sortable: true,
			align: 'center',
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Biểu mẫu phụ lục',
			dataIndex: 'maBieuMau',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 250,
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
			width: 90,
			fixed: 'right',
			render: (rec: QuyetDinhTotNghiep.IRecord) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					{dotCapBangId ? (
						// Nếu có dotCapBangId, gọi hàm xóa khác
						<Popconfirm
							onConfirm={async () => {
								try {
									await putModel(rec?._id, {
										...rec,
										dotCapBangId: null,
									});
									console.log(rec);
									message.success('Đã gỡ quyết định khỏi đợt cấp bằng');
									// Gọi lại getModel trực tiếp với dotCapBangId hiện tại
									getModel({ dotCapBangId });
								} catch {
									message.error('Lỗi khi gỡ quyết định');
								}
							}}
							title='Bạn có chắc chắn muốn xóa quyết định này khỏi đợt cấp bằng?'
							placement='topRight'
						>
							<ButtonExtend tooltip='Gỡ khỏi đợt' danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					) : (
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, getData)}
							title='Bạn có chắc chắn muốn xóa quyết định tốt nghiệp này?'
							placement='topRight'
						>
							<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					)}
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				params={{ maHocKy: recHocKy?.ma }}
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='vbcc.quyetdinhtotnghiep'
				title={intl.formatMessage({ id: 'vanbang.quyetdinhtotnghiep.title' })}
				widthDrawer={1200}
				Form={ModalQuyetDinhTotNghiep}
				formProps={{ getData }}
				rowSelection
				deleteMany
				buttons={{ export: true }}
				otherButtons={
					dotCapBangId
						? [
								<Tooltip title='Thêm quyết định hiện có vào Đợt cấp bằng này' key='apply-tooltip'>
									<Button type='primary' icon={<PlusCircleOutlined />} onClick={handleApply}>
										Thêm quyết định
									</Button>
								</Tooltip>,
						  ]
						: []
				}
			>
				<FilterHocKy isSetHocKy style={{ width: 300, marginBottom: 12 }} allowClear />
			</TableBase>

			<ModalExpandable
				title='Chi tiết minh chứng'
				width={1000}
				visible={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.url ?? ''} />
			</ModalExpandable>

			{/* Modal chọn quyết định để thêm vào đợt cấp bằng */}
			{dotCapBangId && (
				<ModalChonQuyetDinh
					visible={visibleModalChonQuyetDinh}
					onCancel={() => setVisibleModalChonQuyetDinh(false)}
					dotCapBangId={dotCapBangId}
					onSuccess={() => {
						// Thêm timeout ngắn để đảm bảo server đã cập nhật dữ liệu
						setTimeout(() => {
							getModel({ dotCapBangId });
						}, 200);
					}}
				/>
			)}
		</>
	);
};

export default QuyetDinhTotNghiepPage;
