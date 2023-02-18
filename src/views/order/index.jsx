import React, { useEffect, useState } from 'react'
import  { useNavigate } from "react-router-dom"
//导入css样式
import styles from './index.module.css'
//按需导入组件
import { Button, Space, Table,  Input, Form,  Select, Tag, Pagination, ConfigProvider,Col, Row, } from "antd"
//导入网络请求
import { getOrderData, } from '../../untils/order'
//icon图标
import { createFromIconfontCN,AlipayOutlined} from '@ant-design/icons'
//导入语言包
import zh_CN from 'antd/es/locale/zh_CN'
export default function Order() {
  //导入icon图标链接
  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3885033_y82y15l4o8.js',
  });
  //引入useForm
  const [searchForm] = Form.useForm();
  //表格中的列数据
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => `${index + 1}`,
      align: 'center',
      fixed: 'left',
      width: 60
    },
    {
      title: '订单编号',
      dataIndex: 'orderSn',
      key: 'orderSn',
      align: 'center',
      width: 200
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
      key: 'payType',
      align: 'center',
      render: (text, record) => {
        if (record.payType === 1) {
          return <Tag color="#108ee9" className={styles.tag}>
            {/* <IconFont style={{ fontSize: '24px', lineHeight: '32px' }} type='icon-zhifubao1'></IconFont> */}
            <AlipayOutlined  style={{ fontSize: '20px'}}/>
          </Tag>
        } else if (record.payType === 2) {
          return <Tag color="#87d068" className={styles.tag}>
            <IconFont style={{ fontSize: '24px', lineHeight: '32px' }} type='icon-weixin1'></IconFont>
          </Tag>
        } else {
          return <Tag color="#909399" className={styles.tag}>未支付</Tag>
        }
      }
    },  
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text, record) => {
        switch (record.status) {
          case 0:
            return <Tag color="#f56c6c" className={styles.tag}>待付款</Tag>
          case 1:
            return <Tag color="#e6a23c" className={styles.tag}>待发货</Tag>
          case 2:
            return <Tag color="#ecf5ff" className={styles.tag} style={{ color: "#409eff" }}>已发货</Tag>
          case 3:
            return <Tag color="#409eff" className={styles.tag}>已完成</Tag>
          case 4:
            return <Tag color="#909399" className={styles.tag}>已关闭</Tag>
          case 5:
            return <Tag color="#f4f4f5" className={styles.tag} style={{ color: "#909399", width: "70px" }}>无效订单</Tag>
          default:
        }
      }
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: 200
    },
    {
      title: '用户账号',
      dataIndex: 'memberUsername',
      key: 'memberUsername',
      align: 'center',
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      key: 'orderType',
      align: 'center',
      render: (text, record) => {
        if (!record.orderType) {
          return <Tag color="green">正常订单</Tag>
        } else {
          <Tag color="red">秒杀订单</Tag>
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      align: 'center',
    },
    {
      title: '操作',
      // dataIndex: 'Operation',
      key: 'Operation',
      align: 'center',
      fixed: 'right',
      render: (row, record) => {
        return <>
          <Button size='small' type="primary" className={styles.tag} style={{width:"90%"}} onClick={()=>checkOrder(record.id)}><IconFont type='icon-yanjing' style={{color:"#fff",fontSize:"18px"}}></IconFont> 查看订单</Button>
        </>
      }
    },
  ];
  //储存列表数据
  const [orderList, setOrderList] = useState([])
  //列表渲染的每页的数据数
  const [pageNum, setPageNum] = useState(10)
  //列表渲染时的页数
  const [page, setPage] = useState(1)
  //数据总条数
  const [dataTotal, setDataTotal] = useState()
  //获取订单列表数据
  async function getOrderList(selData) {
    let res = await getOrderData(page, pageNum,selData)
    console.log(res);
    setOrderList(res.data.rows)
    setDataTotal(res.data.total)
  }
  //点击搜索数据 表单的数据值
  const onFinish = (values) => {
    // values.orderSn=values.orderSn.trim();
    if(values.orderType==="正常订单"){
      values.orderType=null
    }else if(values.orderType==="秒杀订单"){
      values.orderType=1
    }
    switch(values.payType){
      case "微信": 
        values.payType=2
        break;
      case "支付宝":
      values.payType=1
      break;
      case "未支付":
        values.payType=0
        break;
        default:
    }
    switch(values.status){
      case "待付款":
        values.status = 0
        break;
      case "待发货":
        values.status = 1
        break;
      case "已发货":
        values.status = 2
        break;
      case "已完成":
        values.status = 3
        break;
      case "已关闭":
          values.status=4
        break;
      case "无效订单":
      values.status=5
      break;
      default:
    }
    console.log(values);
    getOrderList(values)
  };
  //点击重置选择器按钮
  const resetData = () => {
    //重置表单
    searchForm.resetFields()
    // setSelData({})
    //刷新列表
    getOrderList()
  }
  //分页pagesize变化
  const changePageSize = (page, pageSize) => {
    console.log(page, pageSize);
    //保存分布器中的数据
    setPage(page)
    setPageNum(pageSize)
  }
  //点击查看订单数据
  //跳转路由
  const navigate=useNavigate()
  const checkOrder=(id)=>{
    // console.log(id);
    navigate(`/home/order/detail?id=${id}`)
  }
  useEffect(() => {
    //渲染列表数据 
    getOrderList()
    //数组里的值变化时会自动刷新
  }, [page, pageNum,])
  return (
    <div className={styles.orderBox}>
      <div className={styles.header}>
        <p>条件查询</p>
        <Form className={styles.inquiryList} form={searchForm} onFinish={onFinish}>
          <Row 
          // gutter上下左右边距
          gutter={[16,24]}>
            <Col span={6}>
            <Form.Item 
          label="订单编号：" 
          name="orderSn"> 
          <Input placeholder="请填写订单编号" allowClear/>
          </Form.Item>
          </Col>
          <Col span={6}>
          <Form.Item 
          label="订单类型：" 
          name="orderType">
            <Select allowClear
              placeholder="订单类型"
              options={[
                {
                  value: '正常订单',
                  label: '正常订单',
                  key: 0,
                },
                {
                  value: '秒杀订单',
                  label: '秒杀订单',
                  key: 1
                },
              ]} /> 
          </Form.Item>
          </Col>
          <Col span={6}>
          <Form.Item label="支付方式" name="payType">
            <Select allowClear
              placeholder="支付方式"
              options={[
                {
                  value: '未支付',
                  label: '未支付', 
                  key:0,
                },
                {
                  value: '支付宝',
                  label: '支付宝',
                  key:1,
                },
                {
                  value: '微信',
                  label: '微信',
                },
              ]} />
          </Form.Item>
          </Col>
          <Col span={6}>
          <Form.Item label="订单状态" name="status">
            <Select allowClear
              placeholder="订单状态"
              options={[
                {
                  value: '待付款',
                  label: '待付款',
                },
                {
                  value: '待发货',
                  label: '待发货',
                },
                {
                  value: '已发货',
                  label: '已发货',
                },
                {
                  value: '已完成',
                  label: '已完成',
                },
                {
                  value: '已关闭',
                  label: '已关闭',
                },
                {
                  value: '无效订单',
                  label: '无效订单',
                },
              ]} />
          </Form.Item> 
          </Col>
          </Row>
          <Form.Item className={styles.footer} >
            <Space>
            <Button type="primary" htmlType="submit">搜索</Button>
              <Button onClick={resetData}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Table bordered
        columns={columns}
        dataSource={orderList}
        rowKey={record => record.id}
        scroll={{ x: 1450, y: 800 }}
        style={{ backgroundColor: "#fff" }}
        pagination={false}>
        </Table>
      <ConfigProvider locale={zh_CN}>
        <Pagination
          total={dataTotal}
          current={page}
          defaultPageSize={pageNum}
          //是否显示页面数据较少内容
          showLessItems={true}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={['5', '10', '15', '20']}
          showTotal={(total) => `共 ${total}条`}
          onChange={changePageSize}
        />
      </ConfigProvider>

    </div>
  )
}
