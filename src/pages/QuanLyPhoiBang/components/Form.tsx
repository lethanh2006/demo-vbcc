import { useState } from 'react';
import { Card, Steps } from 'antd';
import { useIntl, useModel } from 'umi';
import TabBieuMauPhoiBang from './TabBieuMauPhoiBang';
import TabDanhSachPhoiBang from './TabDanhSachPhoiBang';
import TabLichSu from './TabLichSu';

const FormQuanLyPhoiBang = () => {
    const { edit, isView } = useModel('vbcc.bieumauphoibang');
    const intl = useIntl();
    
    const [current, setCurrent] = useState(0);

    const steps = [
        {
            title: 'Biểu mẫu phôi bằng',
            content: <TabBieuMauPhoiBang />,
        },
        {
            title: 'Danh sách phôi bằng',
            content: <TabDanhSachPhoiBang />,
        },
        {
            title: 'Lịch sử',
            content: <TabLichSu />,
        },
    ];

    return (
        <Card
            title={`${edit ? intl.formatMessage({ id: 'global.title.chinhsua' }) : isView ? 'Chi tiết' : intl.formatMessage({ id: 'global.title.themmoi' })} phôi bằng `}
        >
            {isView ? (
                <>
                    <Steps 
                        current={current} 
						onChange={setCurrent}
                        items={steps.map(item => ({ title: item.title }))} 
                        style={{ marginBottom: 24 }}
                    />

                    <div className="steps-content" style={{ minHeight: '200px', marginBottom: 24 }}>
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