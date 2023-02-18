import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Button, message, Space } from 'antd';
import { Table } from 'antd';
import { recommendList, delRecommend, allBrand } from '../../untils/market'
import ShowModel from './showModel'
export default function Index() {
  //获取营销列表
  const [recommen, setrecommen] = useState([])
  //请求函数
  async function getrecommendList() {
    const { data } = await recommendList()
    data.items.forEach((item, index) => {
      item.key = index + 1
    })
    setrecommen(data.items)
    // console.log(data.items);
  }
  useEffect(() => {
    getrecommendList()
    //新增按钮里的品牌选择框
    getAllbrand()
  }, [])


  //删除的请求函数
  async function deleReco(ids) {
    let res = await delRecommend(ids)
    if (res.code === 20000) {
      message.warning('删除成功')
      //刷新页面
      getrecommendList()
    }
  }
  //删除按钮点击事件
  function deletRecom(ids) {
    deleReco(ids)
  }

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
          <span style={{ display: 'block', width: '80%', height: '80%', border: '1px' }}>
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
      title: '是否过期', width: 100, align: 'center',
      key: 'publishStatus',
      dataIndex: 'publishStatus',
      render: (_, { publishStatus }) => {
        switch (publishStatus) {
          case 0:
            return <span>否</span>;
          case 1:
            return <span>过期</span>

          default:
            break;
        }
      }
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
      title: '创建时间',
      key: 'createTime', width: 260, align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100, align: 'center',
      key: '操作',
      render: (_, record) => (
        <Space size="middle">
          <span onClick={() => deletRecom(record.recommendId)} style={{ color: 'red' }}>删除</span>
        </Space>
      ),
    },
  ];
  //给子组件的模态框状态
  const [types, setType] = useState(0)
  //点击新增切换模态框状态为打开
  function showMod() {
    setType(1)
  }

  //品牌列表请求事件
  const [brandList, setBrandList] = useState()
  async function getAllbrand() {
    const res = await allBrand()
    // console.log(res);
    if (res.code === 20000) {
      // setBrandList()
      setBrandList(res.data.items.map(item => item = {
        value: item.id,
        label: item.name,
      },))

    }
  }
  //关闭模态框子组件调取事件
  function colseMod() {
    setType(0)
    //刷新列表
    getrecommendList()
  }
  return (
    <div className={styles.boxmarke}>
      <div className={styles.boxcontent}>
        <div className={styles.btnbox}>
          <Button onClick={showMod} style={{ fontSize: '12px' }} type="primary" size='small' >新增</Button>
          <ShowModel brandList={brandList} colseMod={colseMod} types={types}></ShowModel>
        </div>
        <div style={{ marginTop: '20px' }}>
          {
            recommen.length && <Table bordered
              size="middle"
              scroll={{
                x: 'calc(700px + 50%)',

              }} columns={columns} dataSource={recommen} />
          }

        </div>
      </div>
    </div>
  )
}
