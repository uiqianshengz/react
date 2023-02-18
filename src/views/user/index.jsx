import React, { useEffect, useState } from 'react'
import { findMembersByPage } from '../../untils/user'
import styles from './index.module.css'

import { Table, Pagination, ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN'



const columns = [
  {
    title: '序号',
    width: 50,
    dataIndex: 'key',
    align: 'center',
    key: 'key',
    fixed: 'left',
  },
  {
    title: '用户名',
    width: 200,
    align: 'center',
    dataIndex: 'username',
    key: 'key',
  },
  {
    title: '头像',
    width: 200,
    align: 'center',
    dataIndex: 'icon',
    key: 'key',
    render: (_, { icon }) => (
      <div className={styles.noImg}>
        {icon ? <img style={{ width: "60px", height: "60px", borderRadius: "50%" }} src={icon} alt="" /> : <div></div>}
      </div>
    )
  },
  {
    title: '昵称',
    width: 150,
    align: 'center',
    dataIndex: 'nickname',
    key: 'key',
  },
  {
    title: '真实姓名',
    width: 150,
    align: 'center',
    dataIndex: 'realname',
    key: 'key',
  },
  {
    title: '性别',
    width: 150,
    align: 'center',
    dataIndex: 'sex',
    key: 'key',
  },
  {
    title: '电话',
    width: 150,
    align: 'center',
    dataIndex: 'phone',
    key: 'key',
  },
  {
    title: '邮箱',
    width: 150,
    align: 'center',
    dataIndex: 'email',
    key: 'key',
  },
  {
    title: '生日',
    width: 150,
    align: 'center',
    dataIndex: 'birthday',
    key: 'key',
  },
  {
    title: '注册时间',
    width: 80,
    align: 'center',
    dataIndex: 'createTime',
    key: 'key',
  }
];


export default function User() {

  // 全部数据的条数
  const [total, setTotal] = useState(0)
  // 当前页面的数据
  const [pageData, setPageData] = useState([])
  // 页码             ---     默认为 1
  const [pageNum, setPageNum] = useState(1)
  // 每页数据条数      ---    默认为 10
  const [pageSize, setPageSize] = useState(10)

  // 获取注册用户列表数据
  const getAllUser = async () => {
    let res = await findMembersByPage(pageNum, pageSize)
    setTotal(res.data.total)
    res.data.rows.forEach((item, index) => {
      item.key = index + 1
      if (item.sex === null) {
        item.sex = "保密"
      } else {
        item.sex = item.sex ? "男" : "女"
      }
    })
    setPageData(res.data.rows)
  }

  // 一进入页面  以及 页码 和 每页数据条数 变动时获取当前页面数据
  useEffect(() => {
    getAllUser()
  }, [pageNum, pageSize])

  return (
    <div className={styles.userBody}>
      <div className={styles.header}>
        注册用户列表
      </div>
      <div className={styles.tableContainer}>
        <Table bordered
          columns={columns}
          dataSource={pageData}
          scroll={{
            x: 1300,
          }}
          pagination={false}
          style={{ marginBottom: "15px" }}
        />

        <ConfigProvider locale={zh_CN}>
          <Pagination
            total={total}
            current={pageNum}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 30, 50]}
            onChange={(page, pageSize) => {
              setPageNum(page)
              setPageSize(pageSize)
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
          />
        </ConfigProvider>
      </div>
    </div>
  )
}