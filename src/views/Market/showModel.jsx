import React, { useEffect, useState } from 'react'
import { Button, ConfigProvider,  Pagination, Table, Select, Form, Input, Modal } from 'antd';
import styles from './index.module.css'
import zhCN from 'antd/locale/zh_CN';
import { productsSerch } from '../../untils/market'
import SecondModel from './secSHowmodel'
export default function ShowModel({ brandList, types, colseMod }) {
    //模态框打开状态
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);


    //页码
    const [pages, setPage] = useState(1)
    //每页显示
    const [limts, setLimt] = useState(10)
    //表格渲染所需数据
    const [productlis, setProduc] = useState([])
    //数据总条数
    const [totals, setTotal] = useState(0)
    //第二个模态框打开事件,传给子组件的状态
    const [typesSec, setTypes] = useState(0)
    //点击选择的单选按钮之后给子组件模态框传递的值
const [selectedRow,setRows]=useState({})
    //模态框打开事件
    const showModal = () => {
        setOpen(true);

    };
    useEffect(() => {
        getproduct(pages, limts)
    }, [pages, limts])
    useEffect(() => {
        if (types === 1) {
            showModal()
        } else {
            setOpen(false);
        }
    }, [types])
    //确认关闭模态框
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            //关闭模态框事件
            handleCancel()
            setConfirmLoading(false);
        }, 2000);
    };
    //模态框取消事件
    const handleCancel = () => {
        setOpen(false);
        colseMod()
    };

    //搜索按钮请求事件
    async function getproduct(start, limit, data) {
        const res = await productsSerch(start, limit, data)

        setTotal(res.data.total)
        res.data.rows.forEach((item, index) => {
            item.key = index + 1
            item.checkeds = false
        })
        setProduc(res.data.rows)
    }

    //搜索栏校验成功
    const onFinish = (values) => {

        for (const i in values) {
            if (values[i] === undefined) {
                delete values[i]
            }
        }

        getproduct(pages, limts, values)
    };
    //搜索栏校验失败
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };
    //搜索栏的select 的选择框
    const handleChange = (value) => {
        // console.log(`selected ${value}`);
    };
    //品牌列表
    const brandChange = (value) => {
        // console.log(`selected ${value}`);
    };

    const columns = [
        {
            title: '序号',
            fixed: 'left', width: 100, align: 'center',
            dataIndex: 'key',
            key: 'key',

        },
        {
            title: '商品图片',
            dataIndex: 'pic',
            width: 200, align: 'center',
            key: 'pic',
            render: (_, { pic }) => (
                <>
                    <span style={{ display: 'block', width: '160px', height: '160px', border: '1px' }}>
                        <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={pic} alt="" />
                    </span>
                </>
            ),
        },
        {
            title: '活动时间', width: 260, align: 'center',
            dataIndex: 'promotionStartTime',
            key: 'promotionStartTime',
            render: ((_, record) => (
                <>
                    <div>开始时间：{record.promotionStartTime}</div>
                    <div>结束时间：{record.promotionEndTime}</div>
                </>
            ))
        },
        {
            title: '商品名称',
            key: 'name', width: 200, align: 'center',
            dataIndex: 'name',
        },
        {
            title: '品牌名称',
            key: 'brandName', width: 100, align: 'center',
            dataIndex: 'brandName',
        },
        {
            title: '商品价格',
            key: 'price', width: 100, align: 'center',
            dataIndex: 'price',
        },
        {
            title: '商品类别',
            key: 'productCategoryName',
            dataIndex: 'productCategoryName', width: 100, align: 'center',
        },
        {
            title: '重量',
            key: 'weight', width: 260, align: 'center',
            dataIndex: 'weight',
        },

    ];

    //分页器改变事件
    const onChange = (page, pageSize) => {
        // console.log(page, pageSize);
        setPage(page)
        setLimt(pageSize)
    };

    //第二个模态框关闭事件
    function closeModel() {
        setTypes(0)
        // //同时刷新页面列表
        // colseMod()
    }
    //选择按钮
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          setRows(selectedRows)
            //设置第二个模态框显示状态
            setTypes(1)
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    return (
        <>
            <SecondModel   selectedRow={  selectedRow} closeModel={closeModel} typesSec={typesSec}></SecondModel>
            <Modal
                title="热销详情"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={1400}
                footer={null}
            >
                <div className={styles.serchbox}>
                    <div className={styles.serchtitle}>条件查询</div>
                    <div style={{ marginTop: '20px' }}>
                        <Form
                            name="basic"
                            labelCol={{
                                span:2,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}

                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <div style={{ display: 'flex',  }}>


                                <Form.Item
                                    name="name"
                                    labelCol={{
                                        span: 0,
                                    }}
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                >
                                    <Input placeholder='条件查询/模糊查询' />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{
                                        span: 0,
                                    }}
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                    name="productSn"

                                >
                                    <Input placeholder='商品货号' />
                                </Form.Item>
                                <Form.Item
                                    name="brandId"
                                >
                                    <Select
                                        allowClear={true}
                                        // defaultValue="品牌"
                                        placeholder='品牌'
                                        style={{
                                            width: 120,
                                        }}
                                        onChange={brandChange}
                                        options={brandList}
                                    />


                                </Form.Item>
                                <Form.Item

                                    name="publishStatus"

                                >

                                    <Select
                                        allowClear={true}
                                        // defaultValue=""
                                        style={{
                                            width: 120,
                                        }}
                                        placeholder='上架状态'
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: '0',
                                                label: '未上架',
                                            },
                                            {
                                                value: '1',
                                                label: '上架',
                                            }
                                        ]}
                                    />



                                </Form.Item>
                                <Form.Item

                                    name="verifyStatus"

                                >
                                    <Select
                                        allowClear={true}
                                        // defaultValue="品牌"
                                        placeholder='审核状态'
                                        style={{
                                            width: 120,
                                        }}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: '1',
                                                label: '审核',
                                            },
                                            {
                                                value: '0',
                                                label: '未审核',
                                            }
                                        ]}
                                    />

                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <div style={{ display: 'flex' }}>
                                        <Button style={{ marginRight: '10px' }} type='default' htmlType="reset"  >
                                            重置
                                        </Button>
                                        <Button type="primary" htmlType="submit">
                                            搜索
                                        </Button>
                                    </div>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className={styles.serchbox} style={{ marginTop: '30px' }}>
                    {
                        productlis.length && <Table bordered
                            size="middle"
                            rowSelection={{
                                type: 'radio',
                                columnTitle: '选择',
                                ...rowSelection,
                            }}
                            pagination={false}
                            scroll={{
                                x: 'calc(700px + 50%)',

                            }} columns={columns} dataSource={productlis} />
                    }
                </div>
                <ConfigProvider locale={zhCN}>

                    <Pagination
                        showSizeChanger={true}
                        pageSizeOptions={[5, 10, 15, 20]}
                        defaultCurrent={1}
                        total={totals}

                        showQuickJumper
                        onChange={onChange}
                        showTotal={(totals) => `共 ${totals} 条`}
                    />
                </ConfigProvider>
            </Modal>




        </>
    )
}
