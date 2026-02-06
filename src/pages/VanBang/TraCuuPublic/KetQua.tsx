import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useIntl, useModel } from 'umi';

const KetQuaVanBang = () => {
	const intl = useIntl();
	const { formSubmiting, thongTinTraCuu } = useModel('vbcc.phulucvanbang');

	const columns: IColumn<PhuLucVanBang.IThongTinTraCuu>[] = [
		{
			title: intl.formatMessage({ id: 'tracuupublic.ketqua.column.sovaoso' }),
			width: 120,
			render: (val, rec) => rec?.DuLieu?.soVaoSoBang,
		},
		{
			title: intl.formatMessage({ id: 'tracuupublic.ketqua.column.sohieuvanbang' }),
			width: 150,
			render: (val, rec) => rec?.DuLieu?.soHieuVanBang,
		},
		{
			title: intl.formatMessage({ id: 'tracuupublic.ketqua.column.hoten' }),
			width: 160,
			render: (val, rec) => rec?.DuLieu?.hoTen,
		},
		{
			title: intl.formatMessage({ id: 'tracuupublic.ketqua.column.ngaysinh' }),
			align: 'center',
			width: 100,
			render: (val, rec) => rec?.DuLieu?.ngaySinh && moment(rec?.DuLieu?.ngaySinh).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'tracuupublic.ketqua.column.manguoihoc' }),
			width: 120,
			render: (val, rec) => rec?.DuLieu?.maSinhVien,
		},
		// {
		// 	title: 'Tập tin',
		// 	align: 'center',
		// 	width: 120,
		// 	render: (val, rec) =>
		// 		rec?.DuLieu?.urlIpfs ? (
		// 			<a href={rec?.DuLieu?.urlIpfs} target='_blank' rel='noreferrer'>
		// 				Xem chi tiết
		// 			</a>
		// 		) : (
		// 			<i>(Chưa upload)</i>
		// 		),
		// },
		{
			title: intl.formatMessage({ id: 'tracuupublic.ketqua.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					disabled={!rec?.DuLieu?.idVanBang}
					tooltip={
						!rec?.DuLieu?.idVanBang
							? intl.formatMessage({ id: 'tracuupublic.ketqua.tooltip.chuacothongtin' })
							: intl.formatMessage({ id: 'tracuupublic.ketqua.tooltip.chitiet' })
					}
					type='link'
					icon={<EyeOutlined />}
					onClick={() => window.open(`/tra-cuu-van-bang/chi-tiet/${rec?.DuLieu?._id}`, '_blank')}
				/>
			),
		},
	];

	return (
		<div style={{ padding: 12 }}>
			{!!thongTinTraCuu?.Error ? (
				<div style={{ margin: 'auto' }}>
					<i style={{ color: 'red' }}>{intl.formatMessage({ id: 'tracuupublic.ketqua.error' })}</i>
				</div>
			) : (
				<TableStaticData
					loading={formSubmiting}
					columns={columns}
					data={thongTinTraCuu ?? []}
					addStt
					hasTotal
					otherProps={{
						scroll: { y: 380 },
						pagination: false,
					}}
				/>
			)}
		</div>
	);
};

export default KetQuaVanBang;
