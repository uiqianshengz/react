import React from 'react'
import { Button, message, Steps, theme } from 'antd';
import { useState } from 'react';

import styles from './index.module.css'

import DetailForm from './detailCop/detailForm';
import DetailForm1 from './detailCop/detailForm1';
import DetailForm2 from './detailCop/detailForm2';

// 对应页面的数据
const steps = [
    {
        key: 1,
        title: '基本信息',
        content: '第一页的内容'
    },
    {
        key: 2,
        title: '添加库存信息',
        content: '第二页的内容'
    },
    {
        key: 3,
        title: '添加移动端详情',
        content: '第三页的内容'
    },
];


export default function Detail() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    // 下一步的点击事件
    const next = () => {
        setCurrent(current + 1);
    };
    // 上一步的点击事件
    const prev = () => {
        // setCurrent(current - 1);
        setPage(page - 1)
    };
    const items = steps.map((item) => ({
        key: item.key,
        title: item.title,
    }));

    const [page, setPage] = useState(0)
    const [formData, setFormData] = useState({})

    const changeData = (num, data) => {
        setPage(num)
        setFormData({ ...formData, ...data })
    }

    return (
        <>
            <Steps labelPlacement="vertical" current={page} items={items} className={styles.header} />

            <div className={styles.detailBody}>
                {page === 0 && (
                    <DetailForm page={page} changePage={(num, data) => changeData(num, data)}></DetailForm>
                )}
                {page === 1 && (
                    <DetailForm1 page={page} changePage={(num, data) => changeData(num, data)} goBack={() => prev()}></DetailForm1>
                )}
                {page === 2 && (
                    <DetailForm2 goBack={() => prev()}></DetailForm2>
                )}


                {/* 上一步 下一步 */}
                <div
                    style={{
                        marginTop: 24,
                    }}
                >
                    {current === steps.length - 2 && (
                        <Button type="primary" onClick={() => next()}>
                            下一步,填写移动端详情
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            提交
                        </Button>
                    )}

                </div>
            </div>
        </>
    )
}
