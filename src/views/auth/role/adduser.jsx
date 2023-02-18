import React, { useState, useEffect, useMemo, memo } from 'react'
import { Modal, Button, Form, Input, Tree, Checkbox, message } from 'antd';
import { getMenulist, addRole, changeRoleInfo } from '../../../untils/auth'

let Resetmenu = memo(({ edits, rolesInfo, addMenus, changetyps }) => {

    const [form] = Form.useForm();
    //父组件传递参数控制子组件对话框弹出
    let [reset, setRest] = useState(0)
    setTimeout(() => {
        setRest(addMenus)
    })
    useEffect(() => {
        if (edits === '编辑') {
            form.setFieldsValue({
                roleName: rolesInfo.roleName,
                roleCode: rolesInfo.roleCode,
                remark: rolesInfo.remark,
                permissionIds: rolesInfo.permissionIds
            })
            setSelect(rolesInfo.permissionIds)
        }
    }, [reset])
    useEffect(() => {
        if (reset === 1) {
            // rolesInfo
            showModal()
        }
    }, [reset])
    let [lists, setMenu] = useState([])
    let [menulists, setMenulist] = useState([])

    async function getMenulists() {
        let res = await getMenulist()
        // console.log(res);
        if (res.code === 20000) {
            setMenu(res.data.menus)
        }
    }
    useEffect(() => {
        let TreeReault = getTreelist(lists)
        const newTreeData = treeDone(TreeReault);
        setMenulist(newTreeData)
        // console.log(1111, newTreeData);
    }, [lists])

    let getTreelist = (val) => val.map(item => {
        return ({
            title: item.title,
            key: item.id,
            children: item.children ? getTreelist(item.children) : []
        })
    })
    // const newTreeData = treeDone(treeData);
    function treeDone(data) {
        data.forEach(item => {
            if (item.children && item.children.length > 0) {
                item = treeDone(item.children);
            } else {
                delete item.children;
            }
            return item
        });
        return data
    }
    //选中的key
    let [selectORed, setSelect] = useState([])
    //节点前的复选框点
    const [selectedKeys, setSelectedKeys] = useState([]);
    //节点全部展开控制组件
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    //全部展开/收起
    const [isExpandAll, setAutoExpandAll] = useState([]);
    //得到菜单一维数组
    let listdd = []
    let allKey = (arr) => {
        return arr.map(item => {
            listdd.push(item.key)
            if (item.children) {
                allKey(item.children)
            }
        }
        )
    }
    allKey(menulists)
    const data = useMemo(() => {
        getMenulists()
    }, [])
    //展开复选框点击事件
    const onChange = (e) => {
        // console.log(e.target.checked);
        e.target.checked ? setAutoExpandAll(listdd) : setAutoExpandAll([])
    };
    //全选按钮
    let [checkedVal, setCheck] = useState(false)
    const allpick = (e) => {
        setCheck(e.target.checked)
        // console.log(e.target.checked);
        e.target.checked ? setSelect(listdd) : setSelect([])

    };
    //节点展开事件点击按钮
    const onExpand = (expandedKeysValue) => {
        // console.log('onExpand', expandedKeysValue);
        setAutoExpandParent(false);
        setAutoExpandAll(expandedKeysValue)
    };
    //选中按钮电视事件
    const onCheck = (checkedKeysValue) => {
        // console.log('onCheck', checkedKeysValue);
        setSelect(checkedKeysValue)
    };
    //点击节点文字事件
    const onSelect = (selectedKeysValue, info) => {
        // console.log('onSelect', info);
        setAutoExpandAll(selectedKeysValue)
        setSelectedKeys(selectedKeysValue);
    };

    //对话框打开关闭的特效
    // const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };


    //form 布局
    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 20,
        },
    };
    //新增角色
    async function addRolelist(val) {
        const res = await addRole(val)
        // console.log(res);
        if (res === 20000) {
            message.success('新增成功')
        }
    }
    //更改角色信息
    async function changess(val) {
        let res = await changeRoleInfo(val)
        if (res.code === 20000) {
            message.success('修改成功')
        }
    }
    //表单校验完成
    const onFinish = (values) => {
        values.permissionIds = selectORed
        for (const i in values) {
            if (!values[i]) {
                values[i] = ''
            }
        }
        // console.log(values);
        if (edits === '编辑') {
            // console.log(1235)
            let rrr = {
                ...rolesInfo,
                ...values
            }
            changess(rrr)

        } else {
            addRolelist(values)
        }

        // "id": "string",

        //请求成功后调用关闭框
        handleOk()
    };
    //表单校验失败事件
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);

    };

    const onReset = () => {
        form.resetFields();
        setSelect([])
        setCheck(false)
    };
    //对话框确定事件
    const handleOk = () => {
        // setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setRest(0)
            changetyps()
            onReset()
            // setConfirmLoading(false);
        }, 1000);
    };
    //对话框取消关闭事件
    const handleCancel = () => {
        console.log('Clicked cancel button');
        onReset()
        setTimeout(() => {
            setRest(0)
            changetyps()
        })
        setOpen(false);
    };

    return (
        <div>
            <Modal
                title="初始化的菜单列表"
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    {...layout}
                    form={form}
                    name="nest-messages"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    style={{
                        maxWidth: 600,
                    }}

                >
                    <Form.Item
                        name='roleName'
                        label="角色名称"
                        rules={[{ required: true, message: '请输入名字' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='roleCode'
                        label="角色编码"

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name='remark' label="角色描述">
                        <Input.TextArea />
                    </Form.Item>
                    <Checkbox onChange={onChange}>展开/收起</Checkbox>
                    <Checkbox checked={checkedVal} onChange={allpick}>选中/取消全选</Checkbox>
                    <Form.Item
                        name='permissionIds'
                        label="选择菜单"

                    >

                        <Tree
                            checkable
                            onExpand={onExpand}
                            autoExpandParent={autoExpandParent}
                            onCheck={onCheck}
                            //设置的是展开所有节点
                            expandedKeys={isExpandAll}
                            checkedKeys={selectORed}
                            onSelect={onSelect}
                            blockNode={true}
                            selectedKeys={selectedKeys}
                            treeData={menulists}
                        />
                    </Form.Item>


                    <Form.Item
                        wrapperCol={{
                            ...layout.wrapperCol,
                            offset: 17,
                            span: 50
                        }}
                    >
                        <div style={{ display: 'flex' }}>
                            <Button style={{ marginRight: "10px" }} onClick={handleCancel}>
                               取消
                            </Button>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
})
export default Resetmenu 