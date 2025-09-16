import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider } from 'antd';
import moment from 'moment';
import { useIntl, useModel } from 'umi';

const ViewPhuLucVanBang = () => {
	const intl = useIntl();
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { record, setVisibleForm, setDataToSignOrPush, setVisiblePrint } = useModel('vbcc.phulucvanbang');

	const renderField = (item: any) => {
		if (item.type === 'Date') {
			return item.value ? dayjs(item.value).format('DD/MM/YYYY') : '---';
		}
		if (item.type === 'Number') {
			return item.value ?? '---';
		}
		if (typeof item.value === 'object') {
			return JSON.stringify(item.value);
		}
		return item.value || '---';
	};

	const handlePrintOne = (rec?: PhuLucVanBang.IRecord) => {
		if (!rec) return;
		setDataToSignOrPush([rec]);
		setVisiblePrint(true);
	};

	return (
		<Card title='Chi tiết phụ lục văn bằng' style={{ padding: 0 }}>
			<Divider orientation='left'>Thông tin văn bằng</Divider>

			<Descriptions bordered column={2} size='small'>
				<Descriptions.Item label='Họ tên'>{record?.hoTen ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Mã sinh viên'>{record?.maSinhVien ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{record?.ngaySinh ? dayjs(record?.ngaySinh).format('DD/MM/YYYY') : ''}
				</Descriptions.Item>
				<Descriptions.Item label='Số vào sổ bằng'>{record?.soVaoSoBang ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Số hiệu văn bằng'>{record?.soHieuVanBang ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Số quyết định'>{record?.quyetDinh?.soQuyetDinh ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Ngày quyết định'>
					{record?.quyetDinh?.ngayBanHanh ? moment(record?.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : ''}
				</Descriptions.Item>
			</Descriptions>

			<Divider orientation='left'>Thông tin phụ lục</Divider>

			{(() => {
				const templateElements = recQuyetDinh?.bieuMau?.elements ?? [];
				const dataElements = record?.templateData ?? [];

				const elements = templateElements
					? templateElements.map((e: any) => ({
							...e,
							value: dataElements.find((d: any) => d.headerName === e.headerName)?.value,
						}))
					: dataElements;

				return (
					<>
						<Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} size='small'>
							{elements
								?.filter((item: any) => item.type !== ELoaiDuLieuBieuMau.Table)
								?.filter((item: any) => !!item.value)
								?.map((item: any, index: number) => (
									<Descriptions.Item label={item.headerName} key={index}>
										{renderField(item)}
									</Descriptions.Item>
								))}
						</Descriptions>

						{elements
							?.filter((item: any) => item.type === ELoaiDuLieuBieuMau.Table)
							?.map((item: any, index: number) => {
								const columns: IColumn<any>[] =
									item?.cot?.map((i: any) => ({
										title: i.headerName,
										dataIndex: i.headerName,
										width: 120,
									})) ?? [];

								return (
									<div key={index}>
										<Divider orientation='left'>{item.headerName}</Divider>
										<TableStaticData addStt hasTotal size='small' columns={columns} data={item?.value ?? []} />
									</div>
								);
							})}
					</>
				);
			})()}

			<div className='form-footer'>
				<Button type='primary' icon={<FilePdfOutlined />} onClick={() => handlePrintOne(record)}>
					In phụ lục
				</Button>

				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
				</Button>
			</div>
		</Card>
	);
};

export default ViewPhuLucVanBang;
