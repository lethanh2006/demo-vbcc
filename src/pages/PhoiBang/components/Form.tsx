import { useEffect, useState } from 'react';
import { Card, Steps } from 'antd';
import { useIntl, useModel } from 'umi';
import TabBieuMauPhoiBang from './TabBieuMau';
import TabDanhSachPhoiBang from './TabDanhSach';
import TabLichSu from './TabLichSu';
import CardThongKe from './CardThongKe';

const FormQuanLyPhoiBang = () => {
    const { edit, isView, visibleForm, record } = useModel('vbcc.bieumauphoibang');
    const intl = useIntl();
    
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (visibleForm) {
            setCurrent(0);
        }
    }, [visibleForm]);

    const steps = [
        {
            title: intl.formatMessage({ id: 'phoibang.form.bieumau' }),
            content: <TabBieuMauPhoiBang />,
        },
        {
            title: intl.formatMessage({ id: 'phoibang.form.danhsach' }),
            content: <TabDanhSachPhoiBang />,
        },
        {
            title: intl.formatMessage({ id: 'phoibang.form.lichsu' }),
            content: <TabLichSu />,
        },
    ];

    return (
        <Card
            title={`${edit ? intl.formatMessage({ id: 'global.title.chinhsua' }) : isView ? intl.formatMessage({ id: 'global.button.chitiet' }) : intl.formatMessage({ id: 'global.title.themmoi' })} ${intl.formatMessage({ id: 'phoibang.text.phoibang' })}`}
        >
            {isView ? (
                <>
					{record?._id && (
						<div style={{ marginBottom: 24 }}>
							<CardThongKe bieuMauId={record._id} />
						</div>
					)}
                    <Steps 
                        current={current} 
						onChange={setCurrent}
                        items={steps.map((item, index) => ({ key: index, title: item.title }))} 
                        style={{ marginBottom: 24 }}
                    />

                    <div className="steps-content" style={{ minHeight: '200px' }}>
                        {steps[current].content}
                    </div>

                </>
            ) : (
                <TabBieuMauPhoiBang />
            )}
        </Card>
    );
};

export default FormQuanLyPhoiBang;