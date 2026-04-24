import StatisticsCard from '@/components/StatisticsCard';
import { getThongKeBieuMau } from '@/services/VanBang/PhoiBang';
import { ColorTrangThaiPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

export type TCardThongKeVariant = 'bieu-mau' | 'danh-sach';

interface ICardThongKeProps {
	bieuMauId?: string;
	variant: TCardThongKeVariant;
}

const CardThongKe = ({ bieuMauId, variant }: ICardThongKeProps) => {
	const intl = useIntl();
	const [thongKeBieuMau, setThongKeBieuMau] = useState<PhoiBang.IThongKeBieuMau | null>(null);
	const [thongKeTrangThai, setThongKeTrangThai] = useState<PhoiBang.IThongKeTrangThai[]>([]);

	useEffect(() => {
		if (!bieuMauId) {
			setThongKeBieuMau(null);
			setThongKeTrangThai([]);
			return;
		}

		getThongKeBieuMau(bieuMauId)
			.then((res) => {
				const data: {
					thongKeLichSu?: PhoiBang.IThongKeBieuMau;
					thongKePhoiBang?: PhoiBang.IThongKeTrangThai[];
				} = res?.data?.data || res?.data || {};

				if (variant === 'bieu-mau') {
					setThongKeBieuMau(data.thongKeLichSu ?? null);
				} else {
					setThongKeTrangThai(data.thongKePhoiBang ?? []);
				}
			})
			.catch((err) => console.log(err));
	}, [bieuMauId, variant]);

	if (variant === 'bieu-mau') {
		if (!thongKeBieuMau) return null;

		return (
			<StatisticsCard
				title={intl.formatMessage({ id: 'phoibang.text.thongke' })}
				data={[
					{
						title: intl.formatMessage({ id: 'phoibang.text.solancapmoi' }),
						value: thongKeBieuMau.soLanCapMoi || 0,
						valueColor: '#52c41a',
					},
					{
						title: intl.formatMessage({ id: 'phoibang.text.solandahuy' }),
						value: thongKeBieuMau.soLanHuy || 0,
						valueColor: '#ff4d4f',
					},
					{
						title: intl.formatMessage({ id: 'phoibang.text.solanthatlac' }),
						value: thongKeBieuMau.soLanThatLac || 0,
						valueColor: '#faad14',
					},
				]}
			/>
		);
	}
    
	if (!thongKeTrangThai || thongKeTrangThai.length === 0) return null;

	const mappedData = thongKeTrangThai.map((item) => ({
		title: item.trangThai as string,
		value: item.soLuong,
		valueColor: ColorTrangThaiPhoiBang[item.trangThai as keyof typeof ColorTrangThaiPhoiBang],
	}));

	return (
		<StatisticsCard
			title={intl.formatMessage({ id: 'phoibang.text.thongketrangthai' })}
			data={mappedData}
			colSpan={{ xs: 24, sm: 12, md: 6 }}
		/>
	);
};

export default CardThongKe;
