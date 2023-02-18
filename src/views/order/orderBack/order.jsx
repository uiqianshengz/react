import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { returnOredrDetail } from '../../../untils/order'
import styles from './index.module.css'
import { Button, Table } from 'antd'
// 待处理部分底部需要的同意退货的组件
import Imputnum from './compents/formInput'
import Recived from './compents/recivegood'

export default function Order() {
    //获取路由中的参数
    const [search, setsearch] = useSearchParams()
    const routerId = search.get('id')
    const [orderDetail, setDetail] = useState({})
    //订单明细请求的函数
    async function getdetatil(id) {
        let res = await returnOredrDetail(id)
        // console.log(res);
        if (res.code === 20000) {
            let sss = res.data.orderReturnApply
            sss.key = sss.id
            // console.log(sss);
            sss.productAttr = JSON.parse(sss.productAttr)
            //处理属性的显示
            for (let i in sss.productAttr) {

                sss.productAttr[i] = `${sss.productAttr[i].key}:${sss.productAttr[i].value}/`
            }
            setDetail(sss)
        }
    }
    //订单明细请求
    useEffect(() => {
        getdetatil(routerId)
    }, [routerId])

    const columns = [
        {
            title: '商品图片',
            width: 150,
            align: 'center',
            dataIndex: 'productPic',
            key: 'productPic',
            render: (_, record) => {
                return <div style={{ width: '80%', height: '80%' }}> <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={record.productPic} alt="" /></div>
            }

        },
        {
            title: '商品描述',
            width: 200, align: 'center',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '商品价格', align: 'center',
            dataIndex: 'productPrice',
            key: 'productPrice',
        },
        {
            title: '商品属性', align: 'center',
            dataIndex: 'productAttr',
            key: 'productAttr',
        },
        {
            title: '商品数量', align: 'center',
            dataIndex: 'productCount',
            key: 'productCount',
        },
        {
            title: '商品总计', align: 'center',
            dataIndex: 'returnAmount',
            key: 'returnAmount',
        }
    ];


    return (
        <div className={styles.boxorder}>

            {/* //订单信息头部 */}
            <div className={styles.ordercontent}>
                <div style={{ display: 'flex' }}>
                    <span style={{ fontWeight: 'bolder', marginRight: '10px', fontSize: '18px' }}> 订单信息</span>
                    <span>
                        {
                            (() => {
                                switch (orderDetail.status) {
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
                    </span>
                </div>

                {/* //订单信息 */}
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ marginRight: '10px' }}>订单编号：{orderDetail.orderSn}</span>
                        <span style={{ marginRight: '10px' }}>
                            <Link to={{
                                pathname: '/home/order/detail',
                                search: `?id=${orderDetail.orderId}`,

                            }} >查询订单信息</Link>
                        </span>
                        <span style={{ marginRight: '10px' }}>退单人姓名:{orderDetail.returnName}</span>
                    </div>
                    <div>
                        退单理由：{orderDetail.reason}
                    </div>
                    <div>
                        退单描述:{orderDetail.description}
                    </div>
                </div>
                <div>
                    申请时间:{orderDetail.createTime}
                </div>
                {/* 退单详情 */}
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '18px' }}> 退单图片:</div>
                    {/* proofPics */}
                    {
                        orderDetail.proofPics && orderDetail.proofPics.split(',').map((item, index) => {
                            return (<div key={item} style={{ width: '80px', height: '80px', marginRight: '18px' }}>
                                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={item} alt="" />
                            </div>)
                        })
                    }
                </div>
            </div>
            {/* //中间表格部分 */}
            <div className={styles.ordercontent}>
                <div style={{ fontWeight: 'bolder', marginRight: '10px', fontSize: '18px' }}>退单信息</div>
                <div>
                    {
                        orderDetail.key && <Table
                            columns={columns}
                            bordered

                            rowKey='key'
                            pagination={false}
                            dataSource={[orderDetail]}
                            scroll={{
                                x: 1300,
                            }}
                        />
                    }

                </div>
                <div style={{ fontWeight: 'bolder', marginRight: '10px', fontSize: '18px' }}>用户信息</div>
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '40px', width: '270px' }}>
                        联系人:{orderDetail.returnName}
                    </div>
                    <div>
                        联系电话:{orderDetail.returnPhone
                        }
                    </div>
                </div>
            </div>
            <div className={styles.ordercontent}>
                <div style={{ fontWeight: 'bolder', marginRight: '10px', fontSize: '18px' }}>退费信息:</div>
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '40px' }}>
                        <span>退单金额:</span><span style={{ color: 'red' }}>{orderDetail.returnAmount}</span>
                    </div>
                    <div >
                        <span>运费金额:</span><span style={{ color: 'red' }}>0</span>
                    </div>
                </div>
                {/* //如果订单状态是待处理需要显示 处理人*/}
                {orderDetail.status === 0 &&
                    <div style={{ display: 'flex' }}>
                        <Imputnum getdetatil={getdetatil} orderDetail={orderDetail} ></Imputnum>
                    </div>
                }
            </div>

            {/* //如果是已完成或者是已拒绝显示 */}
            {
                (orderDetail.status === 1 || orderDetail.status === 3) && <div className={styles.ordercontent}>
                    <div style={{ fontWeight: 'bolder', marginRight: '10px', fontSize: '18px' }}>处理结果</div>
                    <div style={{ display: 'flex'}}>
                        <div style={{ marginRight: '150px' }}>
                            处理人:{orderDetail.handleMan}
                        </div>
                        <div style={{ marginRight: '150px' }}>
                            处理备注:{orderDetail.handleNote}
                        </div>
                        <div>
                            处理时间:{orderDetail.handleTime}
                        </div>
                    </div>
                    {orderDetail.status === 1 && <div>
                        {/* //订单同意退货在收货时的收货人备注组件 */}
                        <Recived getdetatil={getdetatil} orderDetail={orderDetail}></Recived>
                    </div>}
                </div>
            }

            {/* /如果状态是已完成需要显示 */}
            {
                orderDetail.status === 2 && <div className={styles.ordercontent}>
                    <div style={{ fontWeight: 'bolder', marginRight: '10px', fontSize: '18px' }}>收货信息:</div>
                    <div style={{ display: 'flex'}}>
                        <div style={{ marginRight: '150px' }}>
                            退单收货人:{orderDetail.receiveMan}
                        </div>
                        <div style={{ marginRight: '150px' }}>
                            退单收货备注:{orderDetail.receiveNote}
                        </div>
                        <div >
                            退单收货时间:{orderDetail.receiveTime}
                        </div>
                    </div>
                </div>
            }

        </div >
    )
}
