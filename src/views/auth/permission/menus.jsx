import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Cascader, Space, Radio, InputNumber, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { addMeuns } from '../../../untils/auth'
export default function Menus({ menulists, makeSure, makeCanle }) {
    // console.log(Form)
    let [form] = Form.useForm()
    //form表单初始数据
    let [formValus, setVal] = useState({})
    //所有的权限列表
    let [menuList, setMenuList] = useState({})
    //点开获取级联选择框的数据
    useEffect(() => {
        // getPageId()
        //调用对获取的权限列表处理，只取级联选择器需要的字段
        let casterList = getlistMenu(menulists)
        if (casterList) {
            //上述最后一层带有空字段，去除 并且添加disable属性
            let castet = deleLastChildren(casterList)
            // console.log(castet)
            castet.forEach(item => {
                if (!item.children) {
                    item.disabled = false
                    item.children = []
                }
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


    //表单布局
    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 20,
        },
    };
    async function addMenus(val) {
        let res = await addMeuns(val)
        // console.log(res)
        if (res.code === 20000) message.success('添加成功')
    }
    //表单校验成功
    const onFinish = (values) => {
        // console.log('Success:', values);
        //删除usrer字段
        delete values.usrer
        //meta数组转成json对象
        let obj = {}
        if (values.meta.length) {
            function arrToObj(arr) {
                arr.forEach(item => {
                    obj[item.titel] = item.icon
                })
                return obj
            }
            const obj1 = arrToObj(values.meta)
            values.meta = JSON.stringify(obj1)
        } else {
            values.meta = JSON.stringify({ '未命名': '' })
        }
        // console.log(values.pid.length);
        //处理前是数组，需要取最后一层的id
        values.pid = values.pid[values.pid.length - 1]
        //表单当前数据
        values = {
            //页面初始数据
            ...formValus,
            //表单当前填写的数据，，，两者合并
            ...values
        }
        // console.log(values)

        //提交添加菜单请求
        addMenus(values)
        //成功后调用关闭
        makeSure()
        form.resetFields();
    };
    //表单校验失败
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
        message.error('请注意表单验证')
    };
    //表单重置
    const onReset = () => {
        makeCanle()
        form.resetFields();
    };
    //是否隐藏的复选框
    const [hidenval, setHiden] = useState(1);
    const hideChange = (e) => {
        // console.log('radio checked', e.target.value);
        setHiden(e.target.value);
    };
    //是否展开按钮
    const [expendVal, setExpval] = useState(1);
    const expendhadler = (e) => {
        // console.log('radio checked', e.target.value);
        setExpval(e.target.value);
    };
    //渲染表单初始数据
    useEffect(() => {

        setVal({
            alwaysshow: false,
            component: "",
            hidden: false,
            icon: "el-icon-menu",
            level: 0,
            test: "name",
            meta: [],
            path: "",
            sort: 0,
            redirect: '',
            pid: "0",
            title: "未命名",
            type: 1
        })
        //表单赋值
        form.setFieldsValue({
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
            redirect: '',
            title: "未命名",
            type: 1
        })
    }, [makeSure])
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
                            // onChange={onChange}
                            changeOnSelect
                        />
                    </Form.Item>
                }

                <Form.Item
                    label="路由名称"
                    name="name"
                    rules={[
                        {
                            required: true,

                            message: '请输入路由名称!',
                        },
                    ]}
                >
                    <Input placeholder='前端路由name,唯一' />
                </Form.Item>

                <Form.Item

                    label="路径"
                    name="path"
                    rules={[
                        {
                            required: true,
                            pattern: /^[a-z]+$/,
                            message: '请输入路径!,并且是英文字母组成',
                        },
                    ]}
                >
                    <Input placeholder='前端路由路径,忽略父节点path' />
                </Form.Item>
                <Form.Item
                    label="组建路径"
                    name="component"
                    rules={[
                        {
                            required: true,
                            pattern: /^[@][/][v][i][e][w][s][/]/,
                            message: '请输入组件路径，以@/views/',
                        },
                    ]}
                >
                    <Input placeholder='前端路由组件路径,例如@/views/fool/index' />
                </Form.Item>

                <Form.Item
                    label="重定向"
                    name="redirect"

                >
                    <Input placeholder='redirect属性' />
                </Form.Item>

                <Form.Item
                    label="排序"
                    name="sort"
                >
                    <InputNumber></InputNumber>
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Item
                        label="是否隐藏"
                        name="hidden"
                        style={{ width: '200px' }}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                    >
                        <Radio.Group initialValues={true} onChange={hideChange} value={hidenval}>
                            <Radio value={false}>否</Radio>
                            <Radio value={true}>是</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="是否展开"
                        style={{ width: '200px' }}
                        name="alwaysshow"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 15,
                        }}
                    >

                        <Radio.Group initialValues={true} onChange={expendhadler} value={expendVal}>
                            <Radio value={false}>否</Radio>
                            <Radio value={true}>是</Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>
                <Form.Item
                    label="meta属性"
                    name="usrer"
                >
                    <Form.List name="meta">
                        {(fields, { add, remove }) => (
                            <>

                                {fields.map(({ key, name, ...restField }) => (
                                    <Space
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            marginBottom: 8,
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'titel']}

                                        >
                                            <Input placeholder="meta的key,比如title" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'icon']}

                                        >
                                            <Input placeholder="meta的值,比如商品管理" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>

                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                </Button>
                            </>
                        )}
                    </Form.List>
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
