import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import dayjs from '@/utils/dayjs';
import { Descriptions, Modal } from 'antd';
import React from 'react';

interface Props {
	visible: boolean;
	onClose: () => void;
	record: PhuLucVanBang.IRecord | null;
}

const ViewDetailPhuLuc: React.FC<Props> = ({ visible, onClose, record }) => {
	return (
		<Modal title='Chi tiết thông tin phụ lục văn bằng' open={visible} onCancel={onClose} footer={null} width={600}>
			{record ? (
				<Descriptions column={1} bordered>
					<Descriptions.Item label='Số hiệu văn bằng'>{record.soHieuVanBang || '---'}</Descriptions.Item>
					<Descriptions.Item label='Số vào sổ'>{record.soVaoSoBang || '---'}</Descriptions.Item>
					<Descriptions.Item label='Họ tên'>{record.hoTen || '---'}</Descriptions.Item>
					<Descriptions.Item label='Ngày sinh'>
						{record.ngaySinh ? dayjs(record.ngaySinh).format('DD/MM/YYYY') : '---'}
					</Descriptions.Item>
					<Descriptions.Item label='Mã sinh viên'>{record.maSinhVien || '---'}</Descriptions.Item>
				</Descriptions>
			) : (
				<div>Không tìm thấy dữ liệu phụ lục văn bằng!</div>
			)}
		</Modal>
	);
};

export default ViewDetailPhuLuc;
