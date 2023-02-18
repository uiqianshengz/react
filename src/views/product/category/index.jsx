import React, { useEffect, useState } from 'react'
import { getCateData } from '../../../untils/product'
import { Table } from 'antd';
import styles from './index.module.css'
export default function Cate() {
    //表格的列数据
    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            fixed: "left",
        },
        {
            title: 'icon',
            dataIndex: 'icon',
            render: (_, record) => {
                return <img src={record.icon} alt="" style={{ width: '60px', height: '60px' }} />
            }
        },
        {
            title: '分类名字',
            dataIndex: 'keywords',
        },
        {
            title: '排序',
            dataIndex: 'sort',
        },
        {
            title: '显示状态',
            dataIndex: 'showStatus',
            render:(text,record)=>{
              return  record.showStatus?text='显示':text="不显示"
            }
        },
        {
            title: '导航栏展示',
            dataIndex: 'navStatus',
            render:(text,record)=>{
                return record.navStatus?text="展示":text='不展示'
            }

        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
        },
    ];
    //获取分类列表
    const [cateList, setCateList] = useState([])
    const [navData,setNavData]=useState([])
    //导航栏列表
    async function getCateList() {
        let res = await getCateData()
        console.log(res.data.items);
        // console.log("child",res.data.items[1].children[0]);
        let dataList = res.data.items.map((item) => {
            item.category['children']=item.children  
            return item.category
        })
        setCateList(dataList)
        // console.log("data", dataList);
        //导航栏数据
      let navData0=dataList.filter(item=>item.name==="乐居")[0].children
    //   console.log(navData0);
        setNavData(navData0)    
    }

    useEffect(() => {
        getCateList()
    }, [])
    return (
        <div className={styles.cateBox}>
            <div className={styles.cateHeader}>
                <p>分类管理</p>
            </div>
            <div className={styles.brand}>
                <h3 >乐居分类：</h3>
                <div className={styles.brandList}>
                    {navData.map((item) => {
                       return( <div key={item.id} className={styles.item}>
                        <p className={styles.title}>{item.name}</p>
                        <div  style={{padding:"20px"}}>
                            <img src={item.icon} alt=""  style={{width:'250px',height:'300px'}}/> 
                        </div>
                        </div>)
                    })}
                </div>
            </div>
            <h3 >全部分类：</h3>
            <Table bordered
                columns={columns}
                dataSource={cateList} 
                rowKey={(record)=>( record.id)}
                pagination={false}
                scroll={{ x: 1350}} 
                expandRowByClick={true}/>
        </div>
    )
}
