import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Cascader, InputNumber, message, } from 'antd';
import { addMeuns } from '../../../untils/auth'
export default function Menus({ menulists, makeSure, makeCanle }) {
    //从表单引入
    const { TextArea } = Input;
    // console.log(Form)
    let [form] = Form.useForm()
    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 20,
        },
    };


    let [menuList, setMenuList] = useState({})
    //点开获取级联选择框的数据
    useEffect(() => {
        // getPageId()
        //调用对获取的权限列表处理，只取级联选择器需要的字段
        let casterList = getlistMenu(menulists)
        if (casterList) {
            //上述最后一层带有空字段，去除 并且添加disable属性
            let castet = deleLastChildren(casterList)
            //如果不是最后一级，其他级都能选中或者添加
            castet.forEach(item => {

                if (!item.children) {
                    item.disabled = false
                    item.children = []
                } else {
                    item.children.forEach(ietm2 => {
                        ietm2.disabled = false
                        ietm2.children = []
                    })
                }
                // console.log(item);
            }
            )
            setMenuList(castet)
        }
    }, [makeSure])

    //对获取的权限列表处理，只取级联选择器需要的字段
    let getlistMenu = (arr) => arr.map(item => {
        return ({
            value: item.id,
            label: item.title,
            children: item.children ? getlistMenu(item.children) : []
        }
        )
    })
    //删除最后一层children是空数据的那个字段
    function deleLastChildren(data) {
        // console.log(data);
        data.forEach(item => {
            if (item.children && item.children.length > 0) {
                item = deleLastChildren(item.children);
            } else {
                item.disabled = true;
                delete item.children;
            }
            return item
        });
        return data
    }
    //添加按钮菜单调用事件
    async function addbtnMenu(val) {
        let res = await addMeuns(val)
        if (res.code === 20000) {
            message.success('添加成功')
            //成功后调用关闭
            makeSure()
            form.resetFields();
        }
    }

    //表单校验成功
    const onFinish = (values) => {
        // console.log('Success:', values);
        //设置固定字符类型
        values.type = 2
        values.pid = values.pid[values.pid.length - 1]
        // console.log('Success:', values);

        //调用添加接口
        addbtnMenu(values)

    };
    //表单校验失败
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    //表单重置
    const onReset = () => {
        makeCanle()
        form.resetFields();
    };
    return (
        <div>

            <Form
                form={form}
                {...layout}
                name="basic"
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 26,
                }}

                style={{
                    maxWidth: 800,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {
                    menuList.length && <Form.Item
                        label="上级菜单"
                        name="pid"
                        rules={[
                            {
                                required: true,
                                message: '页面id不能为空',
                            },
                        ]}
                    >
                        <Cascader
                            options={menuList}
                            placeholder='请选择'
                            changeOnSelect
                        />
                    </Form.Item>
                }
                <Form.Item

                    label="按钮名称"
                    name="title"

                    rules={[
                        {
                            required: true,
                            message: '输入按钮名称,如新增',
                        },
                    ]}
                >
                    <Input placeholder='输入按钮名称,如新增' />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Item
                        label="层级"
                        name="level"
                        initialValue={0}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 15,
                        }}

                    >
                        <InputNumber></InputNumber>
                    </Form.Item>
                    <Form.Item
                        label="排序"
                        initialValue={0}
                        name="sort"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 15,
                        }}

                    >
                        <InputNumber></InputNumber>
                    </Form.Item>
                </div>
                <Form.Item
                    label="权限标识"
                    name="permissionValue"
                    rules={[
                        {
                            required: true,
                            message: '请输入权限表示',
                        },
                    ]}
                >
                    <TextArea placeholder='按钮权限标识,比如: productList.list' rows={4} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        ...layout.wrapperCol,
                        offset: 17,
                        span: 50
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <Button style={{ marginRight: "10px" }} onClick={onReset}>
                            取消
                        </Button>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}
