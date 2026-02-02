import DonutChart from '@/components/Chart/DonutChart';
import { EPhaseXacMinh } from '@/services/VanBang/constant';
import { XacMinhVanBang } from '@/services/VanBang/XacMinhVanBang/typing';
import { inputFormat } from '@/utils/utils';
import { Card } from 'antd';

const CardThongKeXacMinhVanBang = ({ chartData = [] }: { chartData?: XacMinhVanBang.IThongKeXacMinhVanBangNam[] }) => {
	const getSoLuong = (phase: string) => chartData.find((i) => i.phaseXuLy === phase)?.soLuong ?? 0;

	const yeuCauXacMinh = getSoLuong(EPhaseXacMinh.YEU_CAU);
	const xacMinhVanBang = getSoLuong(EPhaseXacMinh.XAC_MINH);
	const congVanPhucDap = getSoLuong(EPhaseXacMinh.PHUC_DAP);
	const traKetQua = getSoLuong(EPhaseXacMinh.KET_QUA);
	const hoanThanh = getSoLuong(EPhaseXacMinh.HOAN_THANH);

	const totalTiepNhan = yeuCauXacMinh + xacMinhVanBang + congVanPhucDap + traKetQua + hoanThanh;

	const dangXacMinh = xacMinhVanBang + congVanPhucDap + traKetQua;
	const choKyDuyet = traKetQua;

	const xAxis = ['Đã tiếp nhận', 'Đang xác minh', 'Chờ ký duyệt', 'Hoàn thành'];
	const yAxis = [[yeuCauXacMinh, dangXacMinh, choKyDuyet, hoanThanh]];

	const colors = ['#0047FF', '#9B29FF', '#FFAF0B', '#399500'];

	return (
		<Card className='card-thong-ke' title='Xác minh văn bằng' variant='borderless'>
			<div style={{ marginTop: 4 }}>
				<DonutChart
					xAxis={xAxis}
					yAxis={yAxis}
					colors={colors}
					yLabel={['Số lượng']}
					showTotal
					totalValue={totalTiepNhan}
					formatY={(val) => `${inputFormat(val)}`}
					otherOptions={{
						legend: { position: 'bottom' },
					}}
				/>
			</div>
		</Card>
	);
};

export default CardThongKeXacMinhVanBang;
