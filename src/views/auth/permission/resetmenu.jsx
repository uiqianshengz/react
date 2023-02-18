import React, { useState, useEffect } from 'react'
import { Modal, Alert, Tree, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './index.module.css'
import { rashMenulist } from '../../../untils/auth'
export default function Resetmenu({ rashlist, menst, resetMenu, changetyp }) {
    //父组件传递参数控制子组件对话框弹出
    let [reset, setRest] = useState(0)
    setTimeout(() => {
        setRest(resetMenu)
    })
    useEffect(() => {
        if (reset === 1) {
            showModal()
        }
    }, [reset])
    //字段添加key值
    const addKey = (arr) => arr.map(item => ({
        ...item,
        key: item.id,
        children: item.children ? addKey(item.children) : [] // 这里要判断原数据有没有子级如果没有判断会报错
    }))
    const result = addKey(menst)

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    // console.log('menst',menst);

    let changMenuList = (val) => val.map(item => {
        return ({
            icon: item.icon,
            label: item.title,
            meta: item.meta,
            name: item.name,
            path: item.path,
            title: item.title,
            children: item.children.map(item1 => ({
                icon: item1.icon,
                label: item1.title,
                meta: item1.meta,
                name: item1.name,
                path: item1.path,
                title: item1.title,
            }))
        })
    })
    let list = changMenuList(menst)

    async function postlist() {
        // console.log(list);
        setConfirmLoading(true);
        let res = await rashMenulist(list)
        if (res.code === 20000) {

            setOpen(false);
            setConfirmLoading(false);
            setRest(0)
            changetyp()
            rashlist()
            message.success('初始化成功')

        }
    }
    const handleOk = () => {
        postlist()

    };
    const handleCancel = () => {
        setTimeout(() => {
            setRest(0)
            changetyp()
        })
        setOpen(false);
    };
    return (
        <div>
            <Modal
                title="初始化的菜单列表"
                cancelText='取消'
                okText="确定"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Alert message="请谨慎操作! 初始化菜单会覆盖之前记录!" type="warning" showIcon />
                <div className={styles.treelist} >
                    <Tree
                        switcherIcon={<DownOutlined />}
                        treeData={result}
                    />
                </div>
            </Modal>
        </div>
    )
}
