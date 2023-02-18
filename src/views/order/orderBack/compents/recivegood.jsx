import React from 'react';

import { Button, Form, Input, message } from 'antd';

import { receiveReturng } from '../../../../untils/order'
export default function FormInput({ orderDetail, getdetatil }) {

    // const [form] = Form.useForm();

    async function receiveReturngs(id, data) {
        const res = await receiveReturng(id, data)
        // console.log(res);
        if (res.code === 20000) {
            message.success('确认收到退货')
            getdetatil(orderDetail.id)
        }
    }
    //表单校验完成
    function onFinish(values) {

        values.id = orderDetail.id;
        // console.log('Success:', values);
        receiveReturngs(orderDetail.id, values)
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('请填写表单关键字段')
    };

    return (
        <div >
            <Form
                name="basic"
                // labelCol={{
                //     span: 12,
                // }}
                // wrapperCol={{
                //     span: 16,
                // }}
                style={{
                    maxWidth: 1200,
                }}

                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div style={{ display: 'flex' }}>

                    <Form.Item
                        label="收货人"
                        name="receiveMan"
                        rules={[
                            {
                                required: true,
                                message: '请输入收货人!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="收货备注"
                        name="receiveNote"
                        rules={[
                            {
                                required: true,
                                message: '请输入收货备注!',
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
                        确认收货
                    </Button>

                </Form.Item>
            </Form>
        </div>
    )
}
