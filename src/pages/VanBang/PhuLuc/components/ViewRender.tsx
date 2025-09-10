import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const ViewPhuLucVanBang = () => {
	const intl = useIntl();
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
				<Descriptions.Item label='Số hiệu văn bằng'>{record?.soHieuVanBang ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Số vào sổ bằng'>{record?.soVaoSoBang ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái cấp bằng'>
					{record?.kichHoat ? <Tag color='green'>Đã cấp bằng</Tag> : <Tag color='red'>Chưa cấp bằng</Tag>}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày cấp bằng'>
					{record?.ngayCapPhuLuc ? dayjs(record?.ngayCapPhuLuc).format('DD/MM/YYYY') : ''}
				</Descriptions.Item>
			</Descriptions>

			<Divider orientation='left'>Thông tin phụ lục</Divider>

			<Descriptions bordered column={2} size='small'>
				{record?.templateData?.map((item: any, index: number) => {
					if (item.type === ELoaiDuLieuBieuMau.Table) return null;
					return (
						// eslint-disable-next-line react/no-array-index-key
						<Descriptions.Item label={item.headerName} key={index}>
							{renderField(item)}
						</Descriptions.Item>
					);
				})}
			</Descriptions>

			{record?.templateData
				?.filter((item: any) => item.type === ELoaiDuLieuBieuMau.Table)
				?.map((item: any, index: number) => {
					const columns: IColumn<any>[] =
						item?.cot?.map((i: any) => ({
							title: i.headerName,
							dataIndex: i.headerName,
							width: 120,
						})) ?? [];

					return (
						// eslint-disable-next-line react/no-array-index-key
						<div key={index}>
							<Divider orientation='left'>{item.headerName}</Divider>
							<TableStaticData
								otherProps={{ pagination: false }}
								addStt
								size='small'
								columns={columns}
								data={item?.value ?? []}
							/>
						</div>
					);
				})}

			<div className='form-footer' style={{ marginTop: 24 }}>
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
