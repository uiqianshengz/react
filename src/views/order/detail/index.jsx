import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Steps, Form, Button, Input, Table, Select, Row, Col, Tag } from 'antd'
//导入请求
import { getOrderDetail,confirmSend,reqCloseOrder} from '../../../untils/order'
import { useLocation } from 'react-router-dom'
export default function Detail() {
  //拿到地址栏中的动态参数
  // const {pathname}=useLocation()
  // console.log(useLocation().search.split('?id=',));
  let detailId = useLocation().search.split('?id=',)
  // 获取动态的商品id
  // const detailId=pathname.split('/').slice(-1).toString()
  // console.log(detailId[1]);
  //获取到的订单信息
  const [DetailList, setDetailList] = useState({})
  //获取订单中的商品信息
  const [orderItems, setOrderItems] = useState()
  // 获取订单详情数据
  async function getDetailData() {
    let { data } = await getOrderDetail(detailId[1])
    console.log(data.orderDetail);
    setDetailList(data.orderDetail.orderBase)
    setOrderItems(data.orderDetail.orderItems)
  }
  //订单总金额
    // let [OrderTotalPrice,setTotalPrice]=useState(0)
  //实际金额
  // let [realPrice,setRealPrice]=useState(0)
  //促销金额
  // let [promotionPrice,setPromotion]=useState()
  
 /*useEffect(()=>{ 
   if(orderItems){
     orderItems.forEach(item => {
      OrderTotalPrice+=item.totalPrice
      // promotionPrice+=item.promotionAmount
      realPrice+=item.realAmount*item.productQuantity
    console.log(item.giftGrowth);
   console.log(item.giftIntegration); 
 });
   }
   setTotalPrice(OrderTotalPrice)
   setRealPrice(realPrice)
  //  setPromotion(promotionPrice)
 },[orderItems])   */
  //订单状态
  const [status, setStatus] = useState('')
  //tag标签的颜色
  const [tagColor, setTagColor] = useState("")
  //tag标签里文字的颜色
  const [textColor, setTextColor] = useState('')
  useEffect(() => {
    switch (DetailList.status) {
      case 0:
        setStatus('待付款')
        setTagColor('#f56c6c')
        break;
      case 1:
        setStatus('待发货')
        setTagColor('#e6a23c')
        break;
      case 2:
        setStatus('已发货')
        setTagColor('#ecf5ff')
        setTextColor('#409eff')
        break;
      case 3:
        setStatus('已完成')
        setTagColor('#409eff')
        break;
      case 4:
        setStatus('已关闭')
        setTagColor('#909399')
        break;
      case 5:
        setStatus('无效订单')
        setTagColor('#f4f4f5')
        setTextColor('#909399')
        break;
      default:
        break;
    }
  }, [DetailList])
  //表格中的数据信息
  const colData = [
    {
      title: '商品名称',
      dataIndex: "productName",
      align: "center",
      key: '1',
    },
    {
      title: '商品图片',
      dataIndex: "productPic",
      align: "center",
      key: '2',
      render: (text, record) => {
        return <img src={record.productPic} alt="" style={{ width: "100px", hieght: '100px' }} />
      }
    },
    {
      title: '是否退货',
      dataIndex: "isReturn",
      align: "center",
      key: '3',
      render: (text, record) => {
        return record.isReturn ? text = "是" : text = "否"
      }
    },
    {
      title: '品牌',
      dataIndex: "productBrand",
      align: "center",
      key: '4',
    },
    {
      title: '价格',
      dataIndex: "productPrice",
      align: "center",
      key: '4',
    },
    {
      title: '商品数量',
      dataIndex: "productQuantity",
      align: "center",
      key: '5',
    },
    {
      title: '小计',
      dataIndex: "totalPrice",
      align: "center",
      key: '7',
      fixed: "right"
    },
  ]

  // 定死的物流信息
  const deliverCol=[
    {
      title:'时间',
      dataIndex:'time',
      width:200
    },
    {
      title:'状态',
      dataIndex:'status',
    },
    {
      title:'备注',
      dataIndex:'note',
    },
  ]
  const deliverData=[
    {
      key: '1',
      time: '2022-03-06 21:16:58',
      status: "深圳市横岗速递营销部已收件",
      note: '揽投员姓名：钟定基;联系电话：13883838888',
    },
    {
      key: '2',
      time: '2015-03-07 14:25:00',
      status: "离开深圳市 发往广州市",
      note: '',
    },
    {
      key: '3',
      time: '2015-03-08 00:17:00',
      status: "到达广东速递物流公司广航中心处理中心（经转）",
      note: '',
    },
    {
      key: '4',
      time: '2015-03-08 01:15:00',
      status: "离开广州市 发往北京市（经转）",
      note: '',
    },
    {
      key: '5',
      time: '2015-03-09 09:01:00',
      status: "到达北京黄村转运站处理中心（经转）",
      note: '',
    },
    
    {
      key: '6',
      time: '2015-03-09 18:39:00',
      status: "离开北京市 发往呼和浩特市（经转）",
      note: '',
    },
    {
      key: '7',
      time: '2015-03-09 18:39:00',
      status: "到达 呼和浩特市 处理中心",
      note: '',
    },
    {
      key: '8',
      time: '2015-03-11 09:53:48',
      status: "呼和浩特市邮政速递物流分公司金川揽投部安排投递",
      note: '投递员姓名：安长虹;联系电话：18047140142',
    },
  ]

  //表单确定按钮 确认发货
  const onFinish =async (values) => {
   await confirmSend({
      orderId:detailId[1],deliverySn:values.deliverySn,deliveryCompany:values.deliveryCompany})
    //刷新列表
    getDetailData()
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  //选择器数据变化
  const handleChange = () => {
  }
  //关闭订单按钮
  const closeOrder=async ()=>{
    await reqCloseOrder(detailId[1])
    getDetailData()
  }
  //监听更新页面数据
  useEffect(() => {
    getDetailData()
  }, [])

  return (<>
    {DetailList && orderItems &&
      <div className={styles.detailBox}>
        <div className={styles.detailHeader}>
          <Steps
            current={DetailList.status}
            items={[
              {
                title: '待付款',
                description: DetailList.createTime,
              },
              {
                title: '待发货',
                description: DetailList.paymentTime,
              },
              {
                title: '已发货',
                description: DetailList.deliveryTime,
              },
              {
                title: '已完成',
                description: DetailList.receiveTime,
              },
              {
                title: '已关闭',
                description: DetailList.finishTime,
              },
            ]} />
        </div>
        <div className={styles.messageShow}>
          <h2>订单信息: <Tag color={tagColor} style={{ color: textColor,marginLeft:"6px" }}>  {status}</Tag></h2>
          <div className={styles.messageDetail}>
            <div className={styles.item}>
              <span>订单金额:</span>
              <span style={{ color: "#ff0000" }}>{DetailList.totalAmount}</span>
            </div>
            <div className={styles.item}>
              <span>订单编号:</span>
              <span>{DetailList.orderSn}</span>
            </div>
            <div className={styles.item}>
              <span>用户账号:</span>
              <span>{DetailList.memberUsername}</span>
            </div>
            <div className={styles.item}>
              <span>备注:</span>
              <span>{DetailList.totalAmount}</span>
            </div>
            <div className={styles.item}>
              <span>下单时间:</span>
              <span>{DetailList.createTime}</span>
            </div>
            <div className={styles.item}>
              <span>付款时间:</span>
              <span>{DetailList.paymentTime}</span>
            </div>
            <div className={styles.item}>
              <span>发货时间:</span>
              <span>{DetailList.deliveryTime}</span>
            </div>
            <div className={styles.item}>
              <span>收货时间:</span>
              <span>{DetailList.receiveTime}</span>
            </div>
          </div>
        </div>
        <div className={styles.messageShow}>
          <h2>收货人信息:</h2>
          <div className={styles.messageDetail}>
            <div className={styles.item}>
              <span>收货人:</span>
              <span>{DetailList.receiverName}</span>
            </div>
            <div className={styles.item}>
              <span>用户姓名:</span>
              <span>{DetailList.orderSn}</span>
            </div>
            <div className={styles.item}>
              <span>手机号码:</span>
              <span>{DetailList.receiverPhone}</span>
            </div>
            <div className={styles.item}>
              <span>邮政编码:</span>
              <span>{DetailList.note}</span>
            </div>
            <div className={styles.item}>
              <span>地市:</span>
              <span>{DetailList.receiverProvince + DetailList.receiverCity}</span>
            </div>
            <div className={styles.item}>
              <span>详细地址:</span>
              <span>{DetailList.receiverDetailAddress}</span>
            </div>
          </div>
        </div>
        <div className={styles.messageShow}>
          <h2>商品信息:</h2>
          <Table bordered
            columns={colData}
            dataSource={orderItems}
            rowKey={record => record.id}
            scroll={{ x: 1450, y: 800 }}
            style={{ backgroundColor: "#fff" }}
            pagination={false}
          ></Table>
        </div>
        <div className={styles.messageShow}>
          <h2>费用信息:</h2>
          <div className={styles.messageDetail}>
            <div className={styles.item}>
              <span>运费金额:</span>
              <span style={{ color: "#ff0000" }}>{DetailList.freightAmount?DetailList.freightAmount:0}</span>
            </div>
            <div className={styles.item}>
              <span>订单总金额:</span>
              <span style={{ color: "#ff0000" }}>{DetailList.totalAmount}</span>
            </div>
            <div className={styles.item}>
              <span>实际金额:</span>
              <span style={{ color: "#ff0000" }}>{DetailList.totalAmount-DetailList.discountAmount}</span>
            </div>
            <div className={styles.item}>
              <span>促销优化金额:</span>
              <span style={{ color: "#ff0000" }}>{DetailList.discountAmount?DetailList.discountAmount:0}</span>
            </div>
            <div className={styles.item}>
        {/* 判断一下订单状态是不是待发货 */}
              {DetailList.status===1 && orderItems &&
                <Form
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  style={{
                    width: 800,
                  }}
                >
                  <Row >
                    <Col span={12}>
                      <Form.Item
                        label="物流公司"
                        name="deliveryCompany"
                        rules={[
                          {
                            required: true,
                            message: '请选择物流公司',
                          },
                        ]}
                      >
                        <Select
                          style={{
                            width: 200,
                          }}
                          placeholder="请选择物流公司"
                          onChange={handleChange}
                          options={[
                            {
                              value: '顺丰快递',
                              label: '顺丰快递',
                            },
                            {
                              value: '圆通快递',
                              label: '圆通快递',
                            },
                            {
                              value: '中通快递',
                              label: '中通快递',
                            },
                            {
                              value: '中国邮政',
                              label: '中国邮政',
                            },
                            {
                              value: '申通快递',
                              label: '申通快递',
                            },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="物流单号"
                        name="deliverySn"
                        rules={[
                          {
                            required: true,
                            message: '请输入物流单号',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    wrapperCol={{
                      offset: 14,
                      span: 16,
                    }}
                  >
                    <Button type="primary" htmlType="submit" style={{ marginTop: "40px" }}>
                      确认发货
                    </Button>
                  </Form.Item>
                </Form>
              } </div>
          </div>
        </div>
        <div className={styles.messageShow}>
          {/* 判断订单状态 */}
          {(DetailList.status===2 || DetailList.status===4 || DetailList.status===5) &&
          <>
            <h2>物流信息:
              <span style={{ color: "#808080", marginRight: "5px" }}>{DetailList.deliveryCompany}</span><span style={{ color: '#808080' }}>[{DetailList.deliverySn}]</span></h2>
            <div className={styles.messageDetail}>
              <Table bordered
                columns={deliverCol}
                dataSource={deliverData}
                rowKey={record => record.key}
                scroll={{ x: 1150, }}
                style={{ backgroundColor: "#fff" }}
                pagination={false}
              ></Table>
            </div> 
            </>
          }
        </div>
          {DetailList.status===3 &&
            <Form.Item
            wrapperCol={{
              offset: 10,
              span: 16,
            }}
          >
          <Button type="primary" onClick={closeOrder}>
            关闭订单
          </Button>
          </Form.Item>
          }
      </div>
    }


  </>
  )
}
