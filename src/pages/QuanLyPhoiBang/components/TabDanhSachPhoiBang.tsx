import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { ColorTrangThaiPhoiBang, ETrangThaiPhoiBang } from '@/services/VanBang/PhoiBang/constants';
import { PhoiBang } from '@/services/VanBang/PhoiBang/typing';
import { Tag } from 'antd';
import { useModel } from 'umi';

const TabDanhSachPhoiBang = () => {
	const { record } = useModel('vbcc.bieumauphoibang');
	const { getModel, page, limit } = useModel('vbcc.phoibang');

	const getData = () => {
		getModel(
			{
				idBieuMauPhoiBang: record?._id,
			},
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
		);
	};

	const columns: IColumn<PhoiBang.IRecord>[] = [
		{
			title: 'Số hiệu phôi',
			dataIndex: 'soHieuVanBang',
			align: 'center',
			width: 150,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 150,
			render: (text: string) => {
				if (!text) return null;
				const statuses = text.split(',').map((s) => s.trim() as ETrangThaiPhoiBang);
				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
						{statuses.map((status, index) => (
							<Tag key={index} color={ColorTrangThaiPhoiBang[status] || 'default'} style={{ margin: 0 }}>
								{status}
							</Tag>
						))}
					</div>
				);
			},
		},
	];
	return (
		<TableBase
			buttons={{ create: false }}
			dependencies={[page, limit, record?._id]}
			columns={columns}
			getData={getData}
			modelName='vbcc.phoibang'
		/>
	);
};

export default TabDanhSachPhoiBang;
