import React, { useEffect, useState } from 'react';

import { Button, Form, Input, InputNumber, message } from 'antd';

import { agreeReturn, rejectReturng } from '../../../../untils/order'
export default function FormInput({ orderDetail, getdetatil }) {

    const [form] = Form.useForm();
    const [returnAmount] = useState(orderDetail.returnAmount)
    //同意退单请求函数
    async function agreeReturns(id, data) {
        const res = await agreeReturn(id, data)
        console.log(res);
        if (res.code === 20000) {
            message.success('同意退款成功')
            //刷新当前也信息
            getdetatil(orderDetail.id)
        }
    }
    //拒绝退单请求函数
    async function rejcetOrede(id, data) {
        const res = await rejectReturng(id, data)
        // console.log(res);
        if (res.code === 20000) {
            message.warning('已拒绝退单')
            //刷新当前也信息
            getdetatil(orderDetail.id)
        }
    }
    //点击拒绝时赋予标志字段
    let rejd = ''
    function rejectReturn(val) {
        rejd = val
    }
    const onFinish = (values) => {
        // console.log('Success:', values);
        values.id = orderDetail.id
        //判断是拒绝退单还是同意退单
        if (rejd === 'reject') {
            // console.log('reject');
            rejcetOrede(orderDetail.id, values)
        } else {
            agreeReturns(orderDetail.id, values)
        }
        // 

    };
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
        message.error('请填写表单关键字段')
    };

    return (
        <div >
            <Form
                name="basic"
                labelCol={{
                    span: 12,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}

                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div style={{ display: 'flex' }}>
                    <Form.Item
                        label="退单金额"
                        name="returnAmount"
                        labelCol={{
                            span: 12,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        rules={[
                            {


                                required: true,
                                message: '请输入退单金额!',
                            },
                        ]}
                    >
                        <InputNumber max={returnAmount} min='0' />
                    </Form.Item>
                    <Form.Item

                        label="处理人"
                        name="handleMan"
                        rules={[
                            {
                                required: true,
                                message: '请输入处理人!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item

                        label="处理备注"
                        name="handleNote"
                        rules={[
                            {
                                required: true,
                                message: '请输入退单备注!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                </div>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button style={{ width: "150px", marginRight: '10px' }} type="primary" htmlType="submit">
                        同意退款
                    </Button>
                    <Button onClick={() => rejectReturn('reject')} htmlType="submit" style={{ width: "150px" }}>
                        拒绝退款
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
