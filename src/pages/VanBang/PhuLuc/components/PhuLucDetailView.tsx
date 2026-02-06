import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiTotNghiep,
	ELoaiDuLieuBieuMau,
	ETrangThaiCapBang,
	nameTrangThaiTotNghiep,
} from '@/services/VanBang/constant';
import dayjs from '@/utils/dayjs';
import { Col, Descriptions, Divider, Row, Space, Tag } from 'antd';
import React from 'react';
import { useIntl, useModel } from 'umi';

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
	const intl = useIntl();
	const { record: recQuyetDinh } = useModel('vbcc.quyetdinhtotnghiep');
	const { record } = useModel('vbcc.phulucvanbang');
	if (!record) return null;

	return (
		<Row gutter={[12, 12]}>
			{isPublic && (
				<Col span={24}>
					<div className='vbcc-verified'>
						<img src='/images/success.svg' alt='' width={32} height={32} />
						<span>{intl.formatMessage({ id: 'viewdetail.phuluc.public.verified' })}</span>
					</div>
				</Col>
			)}

			<Col span={24}>
				<Divider orientation='left'>{intl.formatMessage({ id: 'viewdetail.phuluc.section.thongtinvb' })}</Divider>
				<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} bordered size='small'>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.hoten' })}>
						{record?.hoTen ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.manguoihoc' })}>
						{record?.maSinhVien ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.ngaysinh' })}>
						{record?.ngaySinh ? dayjs(record?.ngaySinh).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.gioitinh' })}>
						{record?.gioiTinh ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.quoctich' })}>
						{record?.quocTich ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.cccd' })}>
						{record?.cmtCccd ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.trinhdo' })}>
						{record?.thongTinTrinhDoDaoTao?.ten ?? record?.trinhDoDaoTao}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.hinhthuc' })}>
						{record?.thongTinHinhThucDaoTao?.ten ?? record?.hinhThucDaoTao}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.nganh' })}>
						{record?.thongTinNganhDaoTao?.ten ?? record?.nganhDaoTao}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.namtotnghiep' })}>
						{record?.namTotNghiep ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.sovaoso' })}>
						{record?.soVaoSoBang ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.sohieuvb' })}>
						{record?.soHieuVanBang ?? '--'}
					</Descriptions.Item>

					{!isPublic && (
						<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.trangthaiphatbang' })}>
							<Space>
								<Tag color={colorTrangThaiTotNghiep[record?.trangThai as ETrangThaiCapBang]}>
									{nameTrangThaiTotNghiep[record?.trangThai as ETrangThaiCapBang]}
								</Tag>
								{record?.trangThai === ETrangThaiCapBang.DA_CAP_BANG &&
									record?.ngayCapPhuLuc &&
									`${dayjs(record.ngayCapPhuLuc).format('DD/MM/YYYY')}`}
							</Space>
						</Descriptions.Item>
					)}
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.sovaoso.en' })}>
						{record?.bookEntryNumberFormat ?? '--'}
					</Descriptions.Item>
				</Descriptions>
			</Col>

			<Col span={24}>
				<Divider orientation='left'>{intl.formatMessage({ id: 'viewdetail.phuluc.section.thongtinqd' })}</Divider>
				<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} bordered size='small'>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.soquyetdinh' })}>
						{record?.quyetDinh?.soQuyetDinh ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.ngaybanhanh' })}>
						{record?.quyetDinh?.ngayBanHanh ? dayjs(record?.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.noidungtrichyeu' })} span={2}>
						{record?.quyetDinh?.noiDung ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'viewdetail.phuluc.desc.taptin' })} span={2}>
						{record?.quyetDinh?.url ? (
							<a href={record.quyetDinh?.url} target='_blank' rel='noreferrer'>
								{intl.formatMessage({ id: 'viewdetail.phuluc.text.xemchitiet' })}
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
								<Divider orientation='left'>
									{intl.formatMessage({ id: 'viewdetail.phuluc.section.thongtinphuluc' })}
								</Divider>
								<Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} size='small'>
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
					<Divider orientation='left'>{intl.formatMessage({ id: 'viewdetail.phuluc.section.filevb' })}</Divider>

					<div style={{ height: 650 }}>
						<PreviewFile file={record?.fileVanBang} />
					</div>
				</Col>
			)}

			{record?.urlIpfs && (
				<Col span={24}>
					<div className='vbcc-urlIpfs'>
						<Divider orientation='left'>{intl.formatMessage({ id: 'viewdetail.phuluc.section.fileipfs' })}</Divider>
						<PreviewFile file={record?.urlIpfs} />
					</div>
				</Col>
			)}

			{record?.signature && (
				<Col span={24}>
					<div className='vbcc-signature'>
						<img src='/images/tick.svg' alt='' width={24} height={24} />
						<span style={{ fontWeight: 600 }}>{intl.formatMessage({ id: 'viewdetail.phuluc.signature.success' })}</span>
						<a
							href={`https://jwt.io/#debugger-io?token=${record?.signature}`}
							target='_blank'
							className='text-primary'
							rel='noreferrer'
						>
							{intl.formatMessage({ id: 'viewdetail.phuluc.signature.check' })}
						</a>
					</div>
				</Col>
			)}
		</Row>
	);
};

export default PhuLucDetailView;
