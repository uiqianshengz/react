import React, { useEffect, useState } from 'react'
import { message, Radio } from 'antd';
import { InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { addMeunlist } from '../../../untils/auth'
export default function Menus({ makeSure, makeCanle }) {
    // console.log(Form)
    let [form] = Form.useForm()
    //form表单初始数据
    let [formValus, setVal] = useState({})
    //表单布局
    const layout = {
        labelCol: {
            span: 10,
        },
        wrapperCol: {
            span: 16,
        },
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

    async function addMenus(data) {
        let res = await addMeunlist(data)
        // console.log(res)
        if (res.code === 20000) {
            message.success('添加成功')
        }
    }
    //表单校验成功
    const onFinish = (values) => {
        console.log('Success:', values);
        //删除user字段
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
            values.meta = {}
        }
        values = {
            ...formValus,
            ...values
        }

        addMenus(values)


        //成功后调用父组件关闭模态框事件
        makeSure()
        //重置表单
        form.resetFields();

    };
    //表单校验失败
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };
    //表单重置
    const onReset = () => {
        makeCanle()
        form.resetFields();
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
        <div style={{ marginTop: "10px" }}>

            <Form
                form={form}
                {...layout}
                name="basic"
                labelCol={{
                    span: 5,
                }}
                wrapperCol={{
                    span: 20,
                }}

                style={{
                    maxWidth: 900,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="路由名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '请输入路由名称,并且是英文字母组成!',
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
                        style={{ width: '200px' }}
                        label="是否展开"
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
