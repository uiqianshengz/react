import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { deleteRole, getlimitPage, getRoleInfo } from '../../../untils/auth'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Table, Pagination, Modal, message, ConfigProvider } from 'antd';
import Adduser from './adduser';
import zh_CN from 'antd/es/locale/zh_CN'
const { confirm } = Modal;
// -----------------------------------------------------------------------函数部分
export default function Role() {
  // const data = [ ];
  let [roleList, setRolist] = useState([])
  let [pages, setPage] = useState(1)
  let [pageSizes, setSize] = useState(10)
  let [totals, setTotal] = useState(0)
  let [edits, setEdits] = useState(0)
  let [rolesInfo, setInfo] = useState({})
  async function getlimtPages() {
    let res = await getlimitPage(pages, pageSizes)
    // console.log(res);
    if (res.code === 20000) {
      // console.log(pages, 'pages', res.data.rows.length)
      if (res.data.rows.length === 0 && pages > 1) {
        setPage(pages - 1)
      }
      const data = res.data.rows
      setTotal(res.data.total)
      data.forEach((item, index) => {
        item.key = index + 1
        item.tags = ['编辑', '删除']
      });
      // console.log(data);
      setRolist(data)
    }
  }
  useEffect(() => {
    getlimtPages()
  }, [pages, pageSizes])

  const onChange = (pageNumber, pageSize) => {
    setPage(pageNumber)
    setSize(pageSize)
  };
  async function getRoldfsdffo(ids) {
    let res = await getRoleInfo(ids)
    // console.log(res)
    if (res.code === 20000) {
      setInfo(res.data.role)
      setTyps(1)
      setEdits('编辑')
    }
  }
  async function deletRoleIte(ids) {
    let res = await deleteRole(ids)
    if (res.code === 20000) {
      getlimtPages()
      message.success('删除成功')
    }
  }

  let editRole = (val) => {
    // console.log(val);
    getRoldfsdffo(val.id)



  }
  let deletRole = (val) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '是否删除该角色',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deletRoleIte(val.id)
      },
      onCancel() {
        message.info('取消删除')
      },
    });

  }


  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      with: "5%",

    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      with: "15%",
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      with: "15%",
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      with: "35%",
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime',
      with: "15%",
    },
    {
      title: '操作',
      key: 'tags',
      with: "20%",
      dataIndex: 'tags',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => editRole(record)} style={{ backgroundColor: '#87d068', fontSize: '12px', color: 'white', marginRight: '5px' }}>
            {record.tags[0]}
          </Button>
          <Button onClick={() => deletRole(record)} style={{ fontSize: '12px' }} size="small">
            {record.tags[1]}
          </Button>
        </>
      ),
    }
  ];

  //新增菜单按钮控制
  let [typets, setTyps] = useState(0)
  const handlerchicks = () => {
    setEdits('新增')
    setTyps(1)

  }
  const handlerchanges = () => {
    setTyps(0)
    getlimtPages()
  }

  //--------------------------------------------------------------------标签结构部分
  return (
    <div className={styles.box}>
      <div className={styles.content}>
        {/* ---------------------------------------------------------------新增按钮 ---------------------------------------------- */}
        <div className={styles.btnbox}>
          <Button onClick={handlerchicks} style={{ fontSize: '12px' }} type="primary" size='small'>新增</Button>
        </div>
        {/* ---------------------------------------------------------------表格部分-------------------------------------------------- */}
        <div>
          <Table bordered style={{ fontSize: '12px', fontWeight: 'normal' }} pagination={false} columns={columns} dataSource={roleList} />

        </div>
        <div className={styles.pagInations}>
          <ConfigProvider locale={zh_CN}>
            <Pagination
              current={pages}
              defaultPageSize={pageSizes}
              // defaultCurrent={pages}
              showSizeChanger
              showQuickJumper
              total={totals}
              showTotal={(total) => `共 ${total} 条`}
              onChange={onChange} />
          </ConfigProvider>
        </div>
      </div>
      <Adduser rolesInfo={rolesInfo} edits={edits} changetyps={handlerchanges} addMenus={typets}></Adduser>
    </div>
  )
}
