import StatisticsCard from '@/components/StatisticsCard';
import { getThongKeBieuMau } from '@/services/VanBang/PhoiBang';
import { ColorTrangThaiPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

interface ICardThongKeProps {
	bieuMauId?: string;
}

const CardThongKe = ({ bieuMauId }: ICardThongKeProps) => {
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

				setThongKeBieuMau(data.thongKeLichSu ?? null);
				setThongKeTrangThai(data.thongKePhoiBang ?? []);
			})
			.catch((err) => console.log(err));
	}, [bieuMauId]);

	const allData = [];

	if (thongKeBieuMau) {
		allData.push(
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
			}
		);
	}

	if (thongKeTrangThai && thongKeTrangThai.length > 0) {
		const mappedData = thongKeTrangThai.map((item) => ({
			title: item.trangThai as string,
			value: item.soLuong,
			valueColor: ColorTrangThaiPhoiBang[item.trangThai as keyof typeof ColorTrangThaiPhoiBang],
		}));
		allData.push(...mappedData);
	}

	if (allData.length === 0) return null;

	return (
		<StatisticsCard
			title={intl.formatMessage({ id: 'phoibang.text.thongke' })}
			data={allData}
			colSpan={{ xs: 24, sm: 12, md: 8, xl: 6 }}
		/>
	);
};

export default CardThongKe;
