import React, { useState, useEffect } from 'react'
import { Modal, Radio } from 'antd';
import Menus from './menus'
import Btns from './btns'
import TopMenus from './topmenu'

export default function Resetmenu({ menulists,addMenus, changetyps }) {
    //
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);

    //父组件传递参数调用子组件事件
    let [adds, setRadd] = useState(0)
    setTimeout(() => {
        setRadd(addMenus)
    })
    useEffect(() => {
        if (adds === 1) {
            showModal()

        }
    }, [adds])

    let [formVal, setFormVal] = useState({})

    const showModal = () => {
        // console.log('showModal');
        setOpen(true);
        setFormVal({
            alwaysshow: false,
            component: "",
            hidden: false,
            icon: "el-icon-menu",
            level: 0,
            test: "name",
            meta: [],
            path: "",
            sort: 0,
            pid: "0",
            title: "未命名",
            type: 1
        })

    };
    //表单提交成功按钮
    const handleOk = () => {
        //加载loading....
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setRadd(0)
            changetyps()
            setConfirmLoading(false);

        }, 1000);
    };
    //表单提交取消按钮
    const handleCancel = () => {
        setTimeout(() => {
            setRadd(0)
            changetyps()
        })
        setOpen(false);
    };
    //模态框菜单选项
    const [value, setValue] = useState('topmenu');
    const onChange = (e) => {
        // console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <div>
            <Modal
                title="编辑"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
            >
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={"topmenu"}>顶级目录</Radio>
                    <Radio value={"menu"}>菜单按钮</Radio>
                    <Radio value={"butn"}>按钮</Radio>
                </Radio.Group>
                <div style={{marginTop:'20px'}}>

                    {value &&
                        (() => {
                            switch (value) {
                                case "topmenu":
                                    return <TopMenus formsVal={formVal} makeSure={handleOk} makeCanle={handleCancel} />

                                case "menu":
                                    return <Menus menulists={menulists} makeSure={handleOk} makeCanle={handleCancel} />


                                case "butn":
                                    return <Btns menulists={menulists} makeSure={handleOk} makeCanle={handleCancel} />


                                default: break
                            }


                        })()}
                </div>
            </Modal>
        </div>
    )
}
