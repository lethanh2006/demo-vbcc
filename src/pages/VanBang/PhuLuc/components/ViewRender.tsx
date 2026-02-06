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
import ViewCapMoiPhuLuc from '../../PhuLucChinhSua/components/CapMoi';
import FormPhuLucChinhSua from '../../PhuLucChinhSua/components/Form';
import PhuLucDetailView from './PhuLucDetailView';

const ViewPhuLucVanBang = (props: { hasPrint?: boolean; hideFooter?: boolean }) => {
	const intl = useIntl();
	const { record, setVisibleForm, setDataToSignOrPush, setVisiblePrint, loading } = useModel('vbcc.phulucvanbang');
	const { getAllModel, loading: loadingLS, danhSach, setDanhSach } = useModel('vbcc.lichsuvanbang');
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
				{
					updatedAt: 1,
				},
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
		} else {
			setDanhSach([]);
		}
	}, [record?._id]);

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
						{intl.formatMessage({ id: 'thongtinvb.viewrender.lichsu' })}{' '}
						<Tag color={colorLoaiYeuCauVangBang[loai]}>{loai}</Tag>{' '}
						{intl.formatMessage({ id: 'thongtinvb.viewrender.lan' })} {lan}
					</b>
				),
				children:
					loai === ELoaiYeuCauVangBang.CAP_MOI ? <ViewCapMoiPhuLuc data={item} /> : <FormPhuLucChinhSua data={item} />,
			};
		});
	})();

	return (
		<>
			<Spin spinning={loading || loadingLS}>
				{record?._id ? (
					<>
						<PhuLucDetailView />
						{danhSach?.length ? (
							<div style={{ marginTop: 12 }}>
								<Collapse items={items} />
							</div>
						) : null}
					</>
				) : (
					<Empty description={intl.formatMessage({ id: 'thongtinvb.viewrender.empty' })} />
				)}
			</Spin>

			{hideFooter ? null : (
				<div className='form-footer'>
					{/* {hasPrint && record && (
					<Button type='primary' icon={<FilePdfOutlined />} onClick={() => handlePrintOne(record)}>
						In thông tin văn bằng
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
