import React, { useEffect } from 'react'
import { Modal, Space } from 'antd';
import { useState } from 'react';
import { Button, InputNumber, Form, Input, message } from 'antd';
import { DatePicker } from 'antd';
import { addBrand } from '../../untils/market'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN';

export default function SecSHowmodel({ typesSec, closeModel, selectedRow }) {

    const [open, setOpen] = useState(false);
    const [form] = Form.useForm()
    //模态框显示
    const showModal = () => {
        setOpen(true);
    };
    useEffect(() => {
        if (typesSec === 1) {
            showModal()
        } else {
            setOpen(false);
        }
    }, [typesSec])
    //模态框确认挂壁
    const handleOk = () => {

        closeModel()
        setOpen(false);
    };
    //模态框关闭
    const handleCancel = () => {
        // console.log('Clicked cancel button');
        setOpen(false);
        //还原最开始的模态框状态
        closeModel()
    };

    const [startTime, setstartTime] = useState('')
    const [endTime, setendTime] = useState('')
    //日期选择开始日期
    const stratChange = (value, dateString) => {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
        setstartTime(dateString)
    };
    const onOk = (value) => {
        // console.log('onOk: ', value);
    };
    //结束时间改变事件
    const endChange = (value, dateString) => {
        setendTime(dateString)
    };
    const endOk = (value) => {

    };

    async function addBrandlist(data) {
        let res = await addBrand(data)
        console.log(res);
        if (res.code === 20000) {
            message.success('添加成功')
            handleOk()
            form.resetFields()
        }
    }


    //表单校验
    const onFinish = (values) => {
        delete values.pic
        values.productId = selectedRow[0].id
        values.promotionStartTime = startTime
        values.promotionEndTime = endTime
        //判断结束时间和开始时间是否错误
        let str = Number(values.promotionStartTime.split('-').join('').split(' ').join('').split(':').join(''))
        let str2 = Number(values.promotionEndTime.split('-').join('').split(' ').join('').split(':').join(''))
        if (str2 < str) return message.error('时间选择错误')
        for (const i in values) {
            if (values[i] === undefined || values[i] === '') {
                delete values[i]
            }
        }
        // console.log('Success:', values);
        addBrandlist(values)

    };
    const onFinishFailed = (errorInfo) => {
        message.error('表单校验错误')
        // console.log('Failed:', errorInfo);
    };
    //取消按钮
    function cancelHandle() {
        form.resetFields()
        handleCancel()
    }
    return (
        <div>
            <Modal

                title="编辑限时活动"
                open={open}
                onOk={handleOk}
                width={650}
                onCancel={handleCancel}
                footer={null}

            >{

                    selectedRow.length && <Form
                        name="basic"
                        form={form}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        labelWrap
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div style={{ fontSize: '40px', display: 'flex', margin: '40px 0' }}>
                            <Space style={{ marginRight: '30px' }}> <span style={{ fontWeight: 'bold' }}>商品价格：</span>{selectedRow[0].originalPrice}</Space>
                            <Space><span style={{ fontWeight: 'bold' }}> 商品名称：</span>{selectedRow[0].name}</Space>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', fontWeight: 'bold' }}>

                            <div>

                                <Form.Item
                                    label="促销价格"
                                    name="promotionPrice"
                                >
                                    <InputNumber min={0} />
                                </Form.Item>
                                <ConfigProvider locale={zhCN}>
                                    <Form.Item
                                        label="开始时间"
                                        name="promotionStartTime"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择日期',
                                            },
                                        ]}
                                    >


                                        <DatePicker showTime onChange={stratChange} onOk={onOk} />

                                    </Form.Item>
                                </ConfigProvider>
                                <Form.Item
                                    label="活动限购数量:"
                                    name="promotionPerLimit"
                                    rules={[
                                        {
                                            pattern: /^[0-9]*$/,
                                            message: '请输入数字',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div >

                                <Form.Item
                                    label="排序"
                                    name="sort"
                                >
                                    <InputNumber min={1} max={10} />

                                </Form.Item>
                                <ConfigProvider locale={zhCN}>
                                    <Form.Item
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择日期',
                                            },
                                        ]}
                                        label="结束时间"
                                        name="promotionEndTime"
                                    >
                                        <DatePicker showTime onChange={endChange} onOk={endOk} />

                                    </Form.Item>
                                </ConfigProvider>
                                <Form.Item
                                    label="商品图片"


                                >
                                    <div style={{ width: '100px', height: '100px' }}>
                                        <img style={{ width: '70%', height: '70%' }} src={selectedRow[0].pic} alt="" />
                                    </div>
                                </Form.Item>

                            </div>

                        </div>
                        <Form.Item
                            wrapperCol={{
                                offset: 16,
                                span: 16,
                            }}
                            labelCol={{
                                span: 12,
                            }}

                        >

                            <Button onClick={cancelHandle} style={{ marginRight: "30px" }} >
                                取消
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>

                        </Form.Item>
                    </Form>
                }
            </Modal>
        </div>
    )
}
