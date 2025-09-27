import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import dayjs from '@/utils/dayjs';
import { Col, Descriptions, Divider, Row, Space, Tag } from 'antd';
import React from 'react';
import { useModel } from 'umi';

interface Props {
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

const PhuLucDetailView: React.FC<Props> = ({ isPublic = false }) => {
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { record } = useModel('vbcc.phulucvanbang');
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
				<Divider orientation='left'>Thông tin văn bằng</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered>
					<Descriptions.Item label='Họ tên'>{record?.hoTen ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Mã sinh viên'>{record?.maSinhVien ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Ngày sinh'>
						{record?.ngaySinh ? dayjs(record?.ngaySinh).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label='Số vào sổ'>{record?.soVaoSoBang ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Số hiệu văn bằng'>{record?.soHieuVanBang ?? '--'}</Descriptions.Item>

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
				<Divider orientation='left'>Thông tin quyết định</Divider>
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

			{(() => {
				const templateElements = recQuyetDinh?.bieuMau?.elements ?? [];
				const dataElements = record?.templateData ?? [];

				const elements = templateElements
					? templateElements.map((e) => ({
							...e,
							value: dataElements.find((d) => d.headerName === e.headerName)?.value,
						}))
					: dataElements;
				const valuedElements = elements
					?.filter((item) => item.type !== ELoaiDuLieuBieuMau.Table)
					?.filter((item) => !!item.value);

				return (
					<>
						{!!valuedElements.length && (
							<Col span={24}>
								<Divider orientation='left'>Thông tin phụ lục</Divider>
								<Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} size='small'>
									{valuedElements?.map((item, index) => (
										<Descriptions.Item label={item.headerName} key={index}>
											{renderField(item)}
										</Descriptions.Item>
									))}
								</Descriptions>
							</Col>
						)}

						{elements
							?.filter((item) => item.type === ELoaiDuLieuBieuMau.Table)
							?.map((item, index) => {
								const columns: IColumn<any>[] =
									item?.cot?.map((i) => ({
										title: i.headerName,
										dataIndex: i.headerName,
										width: i.type === ELoaiDuLieuBieuMau.Text ? 150 : 120,
										render: (val) => (i.type === ELoaiDuLieuBieuMau.Text ? <ExpandText>{val}</ExpandText> : val),
									})) ?? [];

								if (!!item.value && Array.isArray(item.value) && !!item.value.length)
									return (
										<Col span={24} key={index}>
											<Divider orientation='left'>{item.headerName}</Divider>
											<TableStaticData
												addStt
												hasTotal
												size='small'
												columns={columns}
												data={(item?.value as any) ?? []}
											/>
										</Col>
									);
								return null;
							})}
					</>
				);
			})()}

			{!!record?.fileVanBang && (
				<Col span={24}>
					<Divider orientation='left'>Tệp tin văn bằng</Divider>

					<div style={{ height: 650 }}>
						<PreviewFile file={record?.fileVanBang} />
					</div>
				</Col>
			)}

			{record?.urlIpfs && (
				<Col span={24}>
					<div className='vbcc-urlIpfs'>
						<Divider orientation='left'>Tệp tin IPFS</Divider>
						<PreviewFile file={record?.urlIpfs} />
					</div>
				</Col>
			)}

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
		</Row>
	);
};

export default PhuLucDetailView;
