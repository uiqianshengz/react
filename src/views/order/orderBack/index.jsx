import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'
import { Button, ConfigProvider, Form, Input, } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Space, Table } from 'antd';
import { Select, Pagination } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { returnOrder, allOrder } from '../../../untils/order'

export default function Index() {
    const [form] = Form.useForm()
    //表格渲染所需渲染的数据
    const [returnOrd, setOrde] = useState({})
    //分页当前第几页
    const [pagenum, setPAges] = useState(1)
    //当前分页显示初始10条
    const [limits, setLimits] = useState(10)
    //分页器的总条数
    const [totals, settotals] = useState(0)
    const [vaLues, setVaLues] = useState([])
    //表格结构
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            fixed: 'left',
            align: 'center',
            width:80
        },
        {
            title: '订单编号',
            dataIndex: 'orderSn',
            width: 200, align: 'center',
            key: 'orderSn',
        },
        {
            title: '退单状态',
            dataIndex: 'status', align: 'center',
            key: 'status',
            width: 200, align: 'center',
            render: (_, record) => (
                <>
                    {
                        (() => {
                            switch (record.status) {
                                case 0:
                                    return <Button size='small' type="primary" danger>待处理</Button>
                                case 1:
                                    return <Button size='small' style={{ backgroundColor: '#e6a23c', borderColor: '#e6a23c', color: '#fff' }}>退货中</Button>

                                case 2:
                                    return <Button size='small' style={{ backgroundColor: '#ecf5ff', borderColor: '#d9ecff', color: '#409eff' }} >已完成</Button>

                                case 3:
                                    return <Button size='small' style={{ backgroundColor: '#f4f4f5', borderColor: '#e9e9eb', color: '#909399' }} >已拒绝</Button>
                                default:
                                    break;
                            }
                        })()
                    }
                </>
            ),
        },
        {
            title: '描述',
            width: 200,
            dataIndex: 'description', align: 'center',
            key: 'description',
        },
        {
            title: '退单原因', width: 200,
            dataIndex: 'reason', align: 'center',
            key: 'reason',
        },
        {
            title: '商品名称', width: 200,
            dataIndex: 'productName', align: 'center',
            key: 'productName',
        },
        {
            title: '商品属性', width: 200,
            dataIndex: 'productAttr', align: 'center',
            key: 'productAttr',
        },
        {
            title: '商家备注', width: 200,
            dataIndex: 'handleNote', align: 'center',
            key: 'handleNote',
        },
        {
            title: '添加时间', width: 200,
            dataIndex: 'createTime', align: 'center',
            key: 'createTime',
        },

        {
            title: 'Action',
            key: 'action',
            width: 150,
            fixed: 'right', align: 'center',
            render: (_, record) => (
                <Space style={{ width: '100%' }}>
                    <Button type="primary" onClick={() => gotoOrder(record)} icon={<EyeOutlined />} block>查看订单</Button>
                </Space>
            ),
        },
    ];
//查看订单跳转页面
    const navigate = useNavigate()
    function gotoOrder(val) {
        // console.log(val);
        navigate(`/home/order/returnbackdetail?id=${val.id}`)
    }


    //表格初始数据加载
    async function getAllreturn(pages, limt) {
        let res = await allOrder(pages, limt)
        // console.log(res);
        if (res.code === 20000) {
            settotals(res.data.total)
            //对数据处理成表格需要的格式
            changeData(res.data.rows)
        }
    }

    //页面初始加载表格数据
    useEffect(() => {
        //如果是搜索按钮
        if (vaLues.length !== 0) {
            getRetunOrd(vaLues, pagenum, limits)
        } else {
            getAllreturn(pagenum, limits)
        }
    }, [pagenum, limits])




    //处理表格所需的格式
    function changeData(val) {
        // console.log(1111,val);
        const arr = val.map((item, index) => {
            // console.log(12233,item.productAttr);
            return item = {
                key: index + 1,
                id: item.id,
                createTime: item.createTime,
                description: item.description,
                handleNote: item.handleNote,
                orderSn: item.orderSn,
                productAttr: item.productAttr&&(JSON.parse(item.productAttr)).map((items, index) => <span key={index} style={{ marginRight: "5px" }}>{items.key}:{items.value}</span>),
                productName: item.productName,
                reason: item.reason,
                status: item.status,
            }

        }
        )
        // console.log(2222, arr);

        setOrde(arr)
    }


    //搜索请求列表的函数
    async function getRetunOrd(val, pages, limt) {
        let res = await returnOrder(val, pages, limt)
        console.log(res);
        if (res.code === 20000) {
            settotals(res.data.total)
            //对数据处理成表格需要的格式
            changeData(res.data.rows)

        }
    }
    //搜索表单校验成功之后的
    const onFinish = (values) => {
        for (let i in values) {
            if (values[i]===undefined) {
                
                values[i] = ''
            }
        }
        // console.log('Success:', values);
        setVaLues(values)
        getRetunOrd(values, pagenum, limits)
    };
    //搜索表单校验失败之后
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };
    //分页器切换
    const onChange = (page, pageSize) => {
        // console.log('Page: ', page, pageSize);
        setPAges(page)
        setLimits(pageSize)
    };
    const onShowSizeChange = (current, pageSize) => {
        // console.log(111111, current, pageSize);
    };
    const onRest = () => {
        form.resetFields()
        getAllreturn(pagenum, limits)
    }



    return (
        <div className={styles.box}>
            {/* //顶部搜索部分 */}
            <div className={styles.content}>
                <div>条件查询</div>
                <div className={styles.topContent}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: '100%',
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div style={{ display: 'flex' }}>
                            <Form.Item
                                style={{ marginRight: '20px' }}
                                label="订单编号"
                                name="orderSn"
                                rules={[
                                    {
                                        pattern: /^[0-9]*$/,
                                        message: '请输入订单编号!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="退单状态"
                                name="status"

                            >
                                <Select

                                    style={{ width: 120 }}
                                    // onChange={handleChange}
                                    options={[
                                        { value: 0, label: '待处理' },
                                        { value: 1, label: '退货中' },
                                        { value: 2, label: '已完成' },
                                        { value: 3, label: '已拒绝' },
                                    ]}
                                />
                            </Form.Item>



                        </div>

                        <Form.Item
                            wrapperCol={{
                                offset: 18,
                                span: 30,
                            }}
                        >
                            <Button style={{ marginRight: '10px' }} onClick={onRest}>
                                重置
                            </Button>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>

                </div>
            </div>
            {/* 内容部分 */}
            <div>
                {
                    returnOrd.length && <Table pagination={false} rowKey="id" bordered columns={columns} scroll={{ x: 'calc(700px + 50%)' }} dataSource={returnOrd} />

                }
                <ConfigProvider locale={zhCN}>

                    <Pagination
                        showSizeChanger={true}
                        pageSizeOptions={[5, 10, 15, 20]}
                        defaultCurrent={1}
                        total={totals}
                        onShowSizeChange={onShowSizeChange}
                        showQuickJumper
                        onChange={onChange}
                        showTotal={(totals) => `共 ${totals} 条`}
                    />
                </ConfigProvider>
            </div>


        </div>
    )
}
