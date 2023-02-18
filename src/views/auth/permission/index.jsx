import React, { useEffect, useState, } from 'react'
import styles from './index.module.css'
import { Button } from 'antd';
import { Table } from 'antd';
import { getMenulist } from '../../../untils/auth'
import Resetmenu from './resetmenu';
import Addmenu from './addmenuu';
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'title',
    fixed: 'left',
    key: 'title',
    whith: 150
  },

  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
  },
  {
    title: '等级',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
  },
  {
    title: '权限标识',
    dataIndex: 'permissionValue',
    key: 'permissionValue',
  },
  {
    title: '路由',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '组建路径',
    dataIndex: 'component',
    key: 'component',
  }
  ,
  {
    title: '是否可用',
    dataIndex: 'status',
    key: 'status',
  }
  ,
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }
];

export default function Permission() {



  //初始化表单按钮控制
  let [typet, setTyp] = useState(0)
  const handlerchick = () => {
    setTyp(1)
  }
  const handlerchange = () => {
    setTyp(0)
  }
  const handlerrash = () => {
    // console.log('t')
    getList()
  }

  //新增菜单按钮控制
  let [typets, setTyps] = useState(0)
  const handlerchicks = () => {
    setTyps(1)
  }
  const handlerchanges = () => {
    setTyps(0)

  }
  //表格数据
  let [menulists, setMulist] = useState([])

  async function getList() {
    let res = await getMenulist()
    if (res.code === 20000) {
      setMulist(res.data.menus)
    }
  }
  useEffect(() => {
    getList()
  }, [typets])
  return (
    <div className={styles.box}>
      <div className={styles.content}>
        {/* ---------------------------------------------------------------新增按钮 ---------------------------------------------- */}
        <div className={styles.btnbox}>
          <Button onClick={handlerchick} style={{ fontSize: '12px', backgroundColor: '#e6a23c', color: 'white', marginRight: '30px' }} size='small'>初始化菜单</Button>
          <Button onClick={handlerchicks} style={{ fontSize: '12px' }} type="primary" size='small'>新增菜单</Button>
        </div>
        <div>
          <Table bordered
            columns={columns}
            pagination={false}
            scroll={{
              x: 1500,
              y: 800,
            }}
            rowKey="id"
            dataSource={menulists}
          />
        </div>
        <Resetmenu rashlist={handlerrash} menst={menulists} changetyp={handlerchange} resetMenu={typet}></Resetmenu>
        <Addmenu menulists={menulists} changetyps={handlerchanges} addMenus={typets}></Addmenu>
      </div>
    </div>
  )
}
