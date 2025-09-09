import type { BieuMauPhuLuc } from '@/services/VanBang/BieuMauPhuLuc/typing';
import { useState } from 'react';

export default () => {
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<BieuMauPhuLuc.TFileBieuMau>();
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const handleEdit = (rec?: BieuMauPhuLuc.TFileBieuMau) => {
		if (rec) setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};
	const handleView = (rec?: BieuMauPhuLuc.TFileBieuMau) => {
		if (rec) setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	return {
		visibleForm,
		setVisibleForm,
		record,
		setRecord,
		edit,
		setEdit,
		handleEdit,
		isView,
		setIsView,
		handleView,
		formSubmiting,
		setFormSubmiting,
	};
};
