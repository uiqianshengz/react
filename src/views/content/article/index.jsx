import React, { useEffect, useState } from 'react'
import {Form,Select,Row,Col,Input, Button,Table,Space,ConfigProvider,Pagination, Tag, Switch,message,Popconfirm,Modal} from 'antd'
import styles from './index.module.css'
import {getArticle,changeStatus,delArtData} from '../../../untils/content'
import zh_CN from 'antd/es/locale/zh_CN'
//路由跳转
import { useNavigate } from 'react-router-dom'


export default function Article() {
const [searchForm]=Form.useForm()
//文章列表数据
const [articleData,setArticleData]=useState([])
//数据总条数
const [articleTotal,setArticleTotal]=useState()
//页数
const [page,setPage]=useState(1)
//每页数据量
const [pageSize,setPageSize]=useState(10)
//表格数据
const ArtColumns=[
  {
    title:'#',
    dataIndex:'index',
    render:(text,record,index)=>{
      return text=`${index+1}`
    },
    fixed:"left",
    width:100,
    align:'center'
  },
  {
    title:'文章标题',
    dataIndex:'title',
    align:'center'
  },
  {
    title:'展示图片',
    dataIndex:'coverImg',
    render:(_,record)=>{
      return  <img src={record.coverImg} alt="" style={{width:"100px",height:'100px'}}/>
      
    },
    align:'center'
  },
  {
    title:'添加时间',
    dataIndex:'createTime',
    align:'center'
  
  },
  {
    title:'文章作者',
    dataIndex:'author',
    align:'center'
  
  },
  {
    title:'文章是否展示',
    dataIndex:'isShow',
    render:(_,record)=>{
      return <>
       <Switch checked={record.isShow} onChange={()=>ShowChange(record)} />
      </>
    },
    align:'center'
  },
  {
    title:'内容',
    dataIndex:'editorType',
    render:(_,record)=>{
      return <Tag color="#ecf5ff" style={{color:"#409eff"}} className={styles.tag}> {record.editorType?"markdown":'富文本框'}</Tag>
    },
    align:'center'
   
  },
  {
    title:'操作',
    dataIndex:'opeartion',
    render:(_,record)=>(
      <>
        <Button type="link" onClick={()=>addArticle(record)} >编辑文章</Button>
        <Button danger type="link" onClick={() => delArticle(record.id)}>删除</Button>
      </>
    ),
    align:'center'
  },
]
//获取列表数据
async function getArticleList(selData){
  let {data}=await getArticle(page,pageSize,selData)
  console.log(data);
  setArticleData(data.rows)
  setArticleTotal(data.total)
}
//搜索的确定事件
const onFinish=(values)=>{
  if(values.editorType){
     values.editorType==="富文本"?values.editorType=0:values.editorType=1
  }
//  console.log(values);
//根据搜索关键词刷新列表
  getArticleList(values)
}
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
//重置表单
const onReset=()=>{
  searchForm.resetFields()
}
//新增事件 跳转路由
const navigate=useNavigate()
const addArticle=(values)=>{
  //判断id是否存在来跳转不同路由
  // console.log(values.id);
 if(values.id){
  navigate(`/home/content/addArticle?id=${values.id}`)
  }else{
    navigate('/home/content/addArticle')
  } 
}
//删除事件
const delArticle=(id)=>{
  // console.log(id);
  Modal.confirm({
    title: '提示',
    content:"此操作将永久删除该文件，是否继续",
    cancelText:'取消',
    okText:'确定',
    onCancel:()=>{
      message.warning('取消删除')
    },
    onOk: async () => {
        setArticleData(articleData.filter(item => item.id !== id))
        //获取删除数据的网络请求
       let res= await delArtData(id)
       if(res.code===20000){
         message.success('删除成功!')
        //刷新列表
        getArticleList()
       }       
    }
}) 
}
//开关变化
const ShowChange=async (data)=>{
  if(data.isShow){
    data.isShow=0
  }else{
    data.isShow=1
  }
    let res=await changeStatus(data)
  // console.log(res);
  if(res.code===20000){
    message.success("更新状态成功")
    //更新列表
        getArticleList()
  }else{
    message.error("更新状态失败")
  }
}
//分页器变化
const changePageSize=(page,pageSize)=>{
  setPage(page)
  setPageSize(pageSize)
}
useEffect(()=>{
  getArticleList()
},[page,pageSize])
  return (
    <div className={styles.ArticleBox}>
    <div className={styles.header}>
      <p>条件查询</p>
      <Form className={styles.inquiryList} form={searchForm} onFinish={onFinish}  onFinishFailed={onFinishFailed}>
        <Row 
        gutter={[16,24]}>
          <Col span={8}>
          <Form.Item 
        label="作者" 
        name="author"> 
        <Input placeholder="作者" allowClear/>
        </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item 
        label="标题：" 
        name="title">
        <Input placeholder="标题" allowClear/>
        </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item label="编辑类型" name="editorType">
          <Select allowClear
            placeholder="编辑类型"
            options={[
              {
                value: '富文本',
                label: '富文本', 
              },
              {
                value: 'MarkDown',
                label: 'MarkDown',
              },
            ]} />
        </Form.Item>
        </Col>
        </Row>
        <Form.Item className={styles.footer} >
          <Space>
          <Button htmlType="button" onClick={onReset} >重置</Button>
          <Button type="primary" htmlType="submit" >搜索</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
    <div className={styles.bottom}>
    
    <div className={styles.btn}>
          <Button type="primary" onClick={addArticle}>
            新增
          </Button>
        </div>
    <Table bordered
      columns={ArtColumns}
      dataSource={articleData}
      rowKey={record => record.id}
      scroll={{ x: 1450, y: 800 }}
      style={{ backgroundColor: "#fff" }}
      pagination={false}>
      </Table></div>
     <ConfigProvider locale={zh_CN}>
      <Pagination
        total={articleTotal}
        current={page}
        defaultPageSize={pageSize}
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
