import React, { useEffect, useState } from 'react'
import { Upload, Button, message } from 'antd';
import styles from './index.module.css'
import { getMaterialist, deletMaterialist } from '../../../untils/content'
import { Pagination, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
export default function Index() {
    //页面第几页
    let [starts, setStart] = useState(1)
    //页面显示几条
    let [limits, setLimits] = useState(10)
    //素材数据
    let [listOss, setOsslist] = useState([])
    let [total, setToal] = useState(0)
    //分液器切换
    function onChange(page, pageSize) {
        console.log(page, pageSize)
        setStart(page)
        setLimits(pageSize)
    }


    //请求素材列表
    async function getListMAter(start, limit) {
        let res = await getMaterialist(start, limit)
        console.log(res);
        if (res.code === 20000) {
            setToal(res.data.total)
            setOsslist(res.data.rows)
        }
    }
    useEffect(() => {
        getListMAter(starts, limits)
    }, [starts, limits])
    //删除素材
    async function deletIMg(ids) {
        let res = await deletMaterialist(ids)
        console.log(res);
        if (res.code === 20000) {
            message.warning('删除成功')
            getListMAter(starts, limits)
        }
    }


    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('图片类型错误');
        }
        const isLt500K = file.size / 1024 / 1024 < 0.5;
        if (!isLt500K) {
            message.error('图片大小超过500k!');
        }
        return isJpgOrPng && isLt500K;
    };


    const props = {
        name: 'file',
        action: 'http://leju.bufan.cloud/lejuAdmin/material/uploadFileOssSave',
        headers: {
            token: localStorage.getItem('token'),
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
                message.success('上传成功')
                getListMAter(starts, limits)
            } else if (info.file.status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
                message.error('上传失败');
            }
        },
    };

    return (
        <div className={styles.box}>
            <div className={styles.title}>
                <Upload beforeUpload={beforeUpload} {...props}>
                    <Button type='primary'>点击上传素材</Button>
                </Upload>
                <div style={{ marginTop: '10px' }}>只能上传jpg/png文件,且不超过500kb</div>
            </div>
            <div className={styles.boxImgs}>
                {
                    listOss.length && listOss.map(item => {
                        return (
                            // <Col span={5} >
                            <div key={item.id} className={styles.itemCol}>
                                <div className={styles.titleCreat}>
                                    创建时间：{item.createTime}
                                </div>
                                <div className={styles.imgBox}>
                                    <img className={styles.imgs} src={item.ossUrl} alt="" />
                                </div>
                                <div style={{ padding: '0px 20px 30px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button onClick={() => deletIMg(item.id)} type="primary" danger>删除</Button>
                                </div>
                            </div>

                        )
                    })
                }

            </div>
            <div style={{ margin: '10px' }}>
                {
                    listOss.length && <ConfigProvider locale={zhCN}>
                        <Pagination
                            total={total}
                            showSizeChanger
                            showQuickJumper
                            onChange={onChange}
                            showTotal={(total) => `共 ${total} 条`}
                        />
                    </ConfigProvider>
                }
            </div>
        </div>
    )
}
