import { EOperatorType } from '@/components/Table/constant';
import {
	colorLoaiYeuCauVangBang,
	ELoaiYeuCauVangBang,
	ETrangThaiYeuCauVanBang,
} from '@/services/VanBang/LichSuVanBang/constant';
import type { CollapseProps } from 'antd';
import { Button, Collapse, Empty, Spin, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormPhuLucChinhSua from '../../PhuLucChinhSua/components/Form';
import PhuLucDetailView from './PhuLucDetailView';

const ViewPhuLucVanBang = (props: { hasPrint?: boolean; hideFooter?: boolean }) => {
	const intl = useIntl();
	const { record, setVisibleForm, setDataToSignOrPush, setVisiblePrint, loading } = useModel('vbcc.phulucvanbang');
	const { getAllModel, loading: loadingLS, danhSach } = useModel('vbcc.lichsuvanbang');
	const { hasPrint = true, hideFooter = false } = props;

	const handlePrintOne = (rec?: any) => {
		if (!rec) return;
		setDataToSignOrPush([rec]);
		setVisiblePrint(true);
	};

	useEffect(() => {
		if (record?._id) {
			getAllModel(
				undefined,
				undefined,
				{
					phuLucVanBangId: record?._id,
					trangThai: ETrangThaiYeuCauVanBang.DA_DUYET,
				},
				[
					{
						active: true,
						field: 'loai',
						operator: EOperatorType.NOT_INCLUDE,
						values: [ELoaiYeuCauVangBang.THU_HOI],
					},
				],
			);
		}
	}, []);

	const items: CollapseProps['items'] = (() => {
		const countMap: Record<string, number> = {};

		return danhSach?.map((item) => {
			const loai = item.loai as ELoaiYeuCauVangBang;
			countMap[loai] = (countMap[loai] || 0) + 1;
			const lan = countMap[loai];

			return {
				key: item._id,
				label: (
					<b>
						Lịch sử <Tag color={colorLoaiYeuCauVangBang[loai]}>{loai}</Tag> lần {lan}
					</b>
				),
				children: <FormPhuLucChinhSua data={item} />,
			};
		});
	})();

	return (
		<>
			<Spin spinning={loading || loadingLS}>
				{record?._id ? (
					<>
						{danhSach?.length ? <Collapse items={items} /> : null}
						<PhuLucDetailView />
					</>
				) : (
					<Empty description='Thông tin văn bằng không tồn tại' />
				)}
			</Spin>

			{hideFooter ? null : (
				<div className='form-footer'>
					{/* {hasPrint && record && (
					<Button type='primary' icon={<FilePdfOutlined />} onClick={() => handlePrintOne(record)}>
						In phụ lục
					</Button>
				)} */}

					<Button onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
					</Button>
				</div>
			)}
		</>
	);
};

export default ViewPhuLucVanBang;
