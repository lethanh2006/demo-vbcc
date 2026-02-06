import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getChiTietLuotTraCuu } from '@/services/VanBang/PhuLucVanBang';
import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { genExcelFile } from '@/utils/utils';
import { Button, Descriptions, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ModalTongLuotTraCuu = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record: recSoVanBang } = useModel('vbcc.sovanbang');
	const { visibleForm, setVisibleForm } = useModel('vbcc.phulucvanbang');
	const [data, setData] = useState<PhuLucVanBang.IChiTietTraCuu[]>([]);
	const [loading, setLoading] = useState(false);
	const allMucDichs = Array.from(new Set(data.flatMap((item) => Object.keys(item.mucDich))));

	useEffect(() => {
		if (visibleForm && recHocKy?.ma && recSoVanBang?._id) {
			setLoading(true);
			getChiTietLuotTraCuu(recHocKy?.ma, recSoVanBang?._id)
				.then((res) => setData(res?.data || []))
				.finally(() => setLoading(false));
		}
	}, [visibleForm]);

	const columns: IColumn<PhuLucVanBang.IChiTietTraCuu>[] = [
		{
			title: intl.formatMessage({ id: 'trangchu.tonghop.modaltracuu.soquyetdinh' }),
			dataIndex: 'soQuyetDinh',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'trangchu.tonghop.modaltracuu.tongtracuu' }),
			dataIndex: 'tongTraCuu',
			align: 'center',
			width: 120,
		},
		...allMucDichs.map((mucDich) => ({
			title: mucDich,
			dataIndex: ['mucDich', mucDich] as any,
			width: 120,
		})),
	];

	const handleExport = () => {
		const header = [
			intl.formatMessage({ id: 'trangchu.tonghop.modaltracuu.soquyetdinh' }),
			intl.formatMessage({ id: 'trangchu.tonghop.modaltracuu.tongtracuu' }),
			...allMucDichs,
		];
		const rows = data.map((item) => [
			item.soQuyetDinh,
			item.tongTraCuu,
			...allMucDichs.map((muc) => item.mucDich[muc] || 0),
		]);
		genExcelFile([header, ...rows], `TraCuu_${recHocKy?.ma}_${recSoVanBang?.ten}.xlsx`, 'ChiTietTraCuu');
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'trangchu.tonghop.modaltracuu.chitietluottracuu' })}
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			width={900}
			footer={[
				<Button key='export' type='primary' onClick={handleExport} disabled={!data.length}>
					{intl.formatMessage({ id: 'trangchu.tonghop.modaltracuu.xuatdulieu' })}
				</Button>,
				<Button key='close' onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>,
			]}
		>
			<Descriptions
				colon={false}
				layout='vertical'
				className='highlight'
				style={{ marginBottom: 12 }}
				column={{ xs: 1, sm: 1, md: 2 }}
			>
				<Descriptions.Item label={intl.formatMessage({ id: 'trangchu.tonghop.modaltracuu.hocky' })}>
					{recHocKy?.ten ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'trangchu.tonghop.modaltracuu.sovanbang' })}>
					{recSoVanBang?.ten ?? '--'}
				</Descriptions.Item>
			</Descriptions>

			<TableStaticData columns={columns} data={data} loading={loading} addStt hasTotal />
		</Modal>
	);
};

export default ModalTongLuotTraCuu;
