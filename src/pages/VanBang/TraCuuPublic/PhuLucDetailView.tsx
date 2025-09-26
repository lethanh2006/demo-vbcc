import PreviewFile from '@/components/PreviewFile';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import dayjs from '@/utils/dayjs';
import { Col, Descriptions, Divider, Row, Space, Tag } from 'antd';
import React from 'react';

interface Props {
	record: any;
	isPublic?: boolean;
}

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

const PhuLucDetailView: React.FC<Props> = ({ record, isPublic = false }) => {
	if (!record) return null;

	return (
		<Row gutter={[12, 12]}>
			{isPublic && (
				<Col span={24}>
					<div className='vbcc-verified'>
						<img src='/images/success.svg' alt='' width={32} height={32} />
						<span>Thông tin đã được xác thực!</span>
					</div>
				</Col>
			)}

			<Col span={24}>
				<Divider>Thông tin văn bằng</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered>
					<Descriptions.Item label='Số vào sổ'>{record?.soVaoSoBang ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Số hiệu văn bằng'>{record?.soHieuVanBang ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Họ tên'>{record?.hoTen ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Ngày sinh'>
						{record?.ngaySinh ? dayjs(record?.ngaySinh).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label='Mã sinh viên'>{record?.maSinhVien ?? '--'}</Descriptions.Item>
					{!isPublic && record?.kichHoat !== undefined && (
						<Descriptions.Item label='Cấp bằng'>
							<Space>
								<Tag color={record?.kichHoat ? 'green' : 'red'}>
									{record?.kichHoat ? 'Đã cấp bằng' : 'Chưa cấp bằng'}
								</Tag>
								{record?.kichHoat &&
									record?.ngayCapPhuLuc &&
									`Ngày: ${dayjs(record.ngayCapPhuLuc).format('DD/MM/YYYY')}`}
							</Space>
						</Descriptions.Item>
					)}
				</Descriptions>
			</Col>

			<Col span={24}>
				<Divider>Thông tin quyết định</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered>
					<Descriptions.Item label='Số quyết định'>{record?.quyetDinh?.soQuyetDinh ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Ngày ban hành'>
						{record?.quyetDinh?.ngayBanHanh ? dayjs(record?.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label='Nội dung trích yếu' span={2}>
						{record?.quyetDinh?.noiDung ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label='Tập tin đính kèm' span={2}>
						{record?.quyetDinh?.url ? (
							<a href={record.quyetDinh?.url} target='_blank' rel='noreferrer'>
								Xem chi tiết
							</a>
						) : (
							'--'
						)}
					</Descriptions.Item>
				</Descriptions>
			</Col>

			<Col span={24}>
				<Divider>Thông tin phụ lục</Divider>
				{(() => {
					const elements = record?.templateData ?? [];

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
											<Divider>{item.headerName}</Divider>
											<TableStaticData addStt hasTotal size='small' columns={columns} data={item?.value ?? []} />
										</div>
									);
								})}
						</>
					);
				})()}
			</Col>

			{record?.signature && (
				<Col span={24}>
					<div className='vbcc-signature'>
						<img src='/images/tick.svg' alt='' width={24} height={24} />
						<span style={{ fontWeight: 600 }}>Thông tin văn bằng đã được ký số:</span>
						<a
							href={`https://jwt.io/#debugger-io?token=${record?.signature}`}
							target='_blank'
							className='text-primary'
							rel='noreferrer'
						>
							Kiểm tra chữ ký số (JWS)
						</a>
					</div>
				</Col>
			)}

			{record?.urlIpfs && (
				<Col span={24}>
					<div className='vbcc-urlIpfs'>
						<h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>File văn bằng</h4>
						<PreviewFile file={record?.urlIpfs} />
					</div>
				</Col>
			)}
		</Row>
	);
};

export default PhuLucDetailView;
