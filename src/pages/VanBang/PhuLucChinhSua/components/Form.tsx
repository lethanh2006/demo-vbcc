import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { ELoaiDuLieuBieuMau } from '@/services/VanBang/constant';
import { ETrangThaiYeuCauVanBang } from '@/services/VanBang/LichSuVanBang/constant';
import { LichSuVanBang } from '@/services/VanBang/LichSuVanBang/typing';
import { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { CheckCircleOutlined, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Row, Space, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalXuLyPhuLuc from './XuLy';

const { Title, Text } = Typography;

const FormPhuLucChinhSua = (props: { data?: LichSuVanBang.IRecord; getData?: () => void }) => {
	const { data, getData } = props;
	const { token } = theme.useToken();

	const { record, setVisibleForm } = useModel('vbcc.lichsuvanbang');
	const { settings } = useModel('tienich.caidat');
	const { INFO_TENANT: settingVbcc } = settings;
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: ETrangThaiYeuCauVanBang;
	}>();

	const recLichSu = data ?? record;

	const original =
		(recLichSu?.trangThai === ETrangThaiYeuCauVanBang.CHO_XAC_NHAN
			? recLichSu?.phuLucVanBang
			: recLichSu?.thongTinPhuLucTruocKhiChinhSua) || ({} as PhuLucVanBang.IRecord);

	const updated = recLichSu?.thongTinCapNhatCapLai || ({} as PhuLucVanBang.IRecord);

	const fields = [
		{ key: 'hoTen', label: 'Họ và tên' },
		{ key: 'maSinhVien', label: 'Mã người học' },
		{ key: 'ngaySinh', label: 'Ngày sinh' },
		{ key: 'cmtCccd', label: 'Số CMND/CCCD' },
		{ key: 'soVaoSoBang', label: 'Số vào sổ cấp bằng' },
		{ key: 'bookEntryNumberFormat', label: 'Số vào sổ (Tiếng Anh)' },
		{ key: 'soHieuVanBang', label: 'Số hiệu văn bằng' },
		{ key: 'trinhDoDaoTao', label: 'Trình độ đào tạo' },
		{ key: 'hinhThucDaoTao', label: 'Hình thức đào tạo' },
		{ key: 'nganhDaoTao', label: 'Ngành đào tạo' },
		!settingVbcc?.require_IPFS && {
			key: 'urlIpfs',
			label: 'Tập tin văn bằng (file scan)',
		},
	].filter(Boolean) as { key: keyof PhuLucVanBang.IRecord; label: string }[];

	const isChanged = (k: keyof PhuLucVanBang.IRecord): boolean => {
		return String(original[k] ?? '') !== String(updated[k] ?? '');
	};

	const formatDate = (date?: string | Date) => (date ? dayjs(date).format('DD/MM/YYYY') : '—');

	const renderValue = (key: keyof PhuLucVanBang.IRecord, value: any) =>
		key === 'ngaySinh' ? formatDate(value) : value || '—';

	const isTemplateDataChanged = (headerName: string, type: string): boolean => {
		const orig = original.templateData?.find((i) => i.headerName === headerName && i.type === type);
		const upd = updated.templateData?.find((i) => i.headerName === headerName && i.type === type);

		if (!orig && !upd) return false;
		if (!orig || !upd) return true;

		if (type === ELoaiDuLieuBieuMau.Table) {
			return JSON.stringify(orig.value ?? []) !== JSON.stringify(upd.value ?? []);
		}
		return String(orig.value ?? '') !== String(upd.value ?? '');
	};

	const renderComparedValue = (key: keyof PhuLucVanBang.IRecord) => {
		const changed = isChanged(key);
		const originalValue = renderValue(key, original[key]);
		const updatedValue = renderValue(key, updated[key]);

		if (!changed) {
			return updatedValue;
		}

		return (
			<Space direction='vertical' size={2} style={{ width: '100%' }}>
				<Space>
					<Text delete type='danger' style={{ fontSize: '0.9em' }}>
						{originalValue}
					</Text>
				</Space>
				<Space>
					<Text strong type='success'>
						{updatedValue}
					</Text>
				</Space>
			</Space>
		);
	};

	const renderComparedTemplateValue = (headerName: string, type: string) => {
		const changed = isTemplateDataChanged(headerName, type);

		const orig = original.templateData?.find((i) => i.headerName === headerName && i.type === type);
		const upd = updated.templateData?.find((i) => i.headerName === headerName && i.type === type);

		const renderTemplateItemValue = (value: any, itemType: string) => {
			if (itemType === 'Date') return value && dayjs(value).format('DD/MM/YYYY');
			if (itemType === 'Number') return value ?? '—';
			if (typeof value === 'object') return JSON.stringify(value);
			return value || '—';
		};

		const originalValue = renderTemplateItemValue(orig?.value, type);
		const updatedValue = renderTemplateItemValue(upd?.value, type);

		if (!changed) {
			return <Text type='secondary'>{updatedValue}</Text>;
		}

		return (
			<Space direction='vertical' size={2} style={{ width: '100%' }}>
				<Space>
					<Text delete type='danger' style={{ fontSize: '0.9em' }}>
						{originalValue}
					</Text>
				</Space>
				<Space>
					<Text strong type='success'>
						{updatedValue}
					</Text>
				</Space>
			</Space>
		);
	};

	const renderComparedTable = (headerName: string) => {
		const changed = isTemplateDataChanged(headerName, ELoaiDuLieuBieuMau.Table);

		const orig = original.templateData?.find((i) => i.headerName === headerName && i.type === ELoaiDuLieuBieuMau.Table);
		const upd = updated.templateData?.find((i) => i.headerName === headerName && i.type === ELoaiDuLieuBieuMau.Table);

		const columns =
			upd?.cot?.map((c) => ({
				title: c.headerName,
				dataIndex: c.headerName,
				width: c.type === ELoaiDuLieuBieuMau.Text ? 200 : 140,
				render: (val: any) => (c.type === ELoaiDuLieuBieuMau.Text ? <ExpandText>{val}</ExpandText> : val || '—'),
			})) ?? [];

		const tableTitle = (
			<Space size={10}>
				<Title level={5} style={{ margin: 0 }}>
					{headerName}
				</Title>
			</Space>
		);

		return (
			<div
				style={{
					marginBottom: 24,
					padding: token.padding,
					border: `1px solid ${token.colorBorderSecondary}`,
					borderRadius: token.borderRadius,
				}}
			>
				<Title
					level={4}
					style={{
						marginBottom: token.margin,
						color: token.colorPrimary,
						display: 'flex',
						alignItems: 'center',
						gap: 8,
					}}
				>
					{tableTitle}
				</Title>

				{changed && (
					<Row gutter={[16, 16]}>
						<Col span={24} md={12}>
							<TableStaticData
								addStt
								size='small'
								columns={columns}
								data={(orig?.value as any) ?? []}
								hasTotal={true}
								otherButtons={[
									<Text strong type='danger' style={{ marginBottom: 8, display: 'block' }}>
										<EditOutlined /> Dữ liệu Gốc
									</Text>,
								]}
							/>
						</Col>
						<Col span={24} md={12}>
							<TableStaticData
								addStt
								size='small'
								columns={columns}
								data={(upd?.value as any) ?? []}
								hasTotal={true}
								otherButtons={[
									<Text strong type='success' style={{ marginBottom: 8, display: 'block' }}>
										<CheckCircleOutlined /> Dữ liệu Cập Nhật
									</Text>,
								]}
							/>
						</Col>
					</Row>
				)}

				{!changed && (
					<>
						<Text strong style={{ marginBottom: 8, display: 'block' }}>
							<CheckCircleOutlined /> Dữ liệu Hiện Tại (Không đổi)
						</Text>
						<TableStaticData addStt size='small' columns={columns} data={(upd?.value as any) ?? []} hasTotal={true} />
					</>
				)}
			</div>
		);
	};

	const textTemplateItems = updated.templateData?.filter((i) => i.type !== ELoaiDuLieuBieuMau.Table);
	const tableTemplateItems = updated.templateData?.filter((i) => i.type === ELoaiDuLieuBieuMau.Table);

	return (
		<>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Title level={5}>Thông tin cơ bản</Title>
					<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }} bordered size='small'>
						{fields.map((f) => (
							<Descriptions.Item key={f.key} label={f.label}>
								{renderComparedValue(f.key)}
							</Descriptions.Item>
						))}
					</Descriptions>
				</Col>

				<Col span={24}>
					<Title level={5}>Thông tin phụ lục</Title>

					{textTemplateItems?.length ? (
						<>
							<Descriptions column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 2, xs: 1 }} bordered size='small'>
								{textTemplateItems.map((item) => (
									<Descriptions.Item key={item.headerName} label={item.headerName}>
										{renderComparedTemplateValue(item.headerName, item.type ?? ELoaiDuLieuBieuMau.Text)}
									</Descriptions.Item>
								))}
							</Descriptions>
						</>
					) : null}
				</Col>

				<Col span={24}>
					{tableTemplateItems?.length ? (
						<>
							<Space direction='vertical' style={{ width: '100%' }} size='small'>
								{tableTemplateItems.map((item) => (
									<div key={item.headerName}>{renderComparedTable(item.headerName)}</div>
								))}
							</Space>
						</>
					) : null}
				</Col>
			</Row>
			{!data?._id ? (
				<div className='form-footer'>
					<Button
						disabled={record?.trangThai !== ETrangThaiYeuCauVanBang.CHO_XAC_NHAN}
						onClick={() => {
							setTrangThai({ title: 'Chấp nhận đề xuất', trangThai: ETrangThaiYeuCauVanBang.DA_DUYET });
							setVisibleXuLy(true);
						}}
						type='primary'
						className='btn-success'
						icon={<CheckOutlined />}
					>
						Chấp nhận
					</Button>
					<Button
						disabled={record?.trangThai !== ETrangThaiYeuCauVanBang.CHO_XAC_NHAN}
						onClick={() => {
							setTrangThai({ title: 'Từ chối đề xuất', trangThai: ETrangThaiYeuCauVanBang.KHONG_DUYET });
							setVisibleXuLy(true);
						}}
						type='primary'
						className='btn-error'
						icon={<CloseOutlined />}
					>
						Từ chối
					</Button>
					<Button onClick={() => setVisibleForm(false)} type='default'>
						Đóng
					</Button>
				</div>
			) : null}

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

export default FormPhuLucChinhSua;
