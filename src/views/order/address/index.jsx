import React, { useEffect, useState } from 'react'
//导入css样式
import styles from './index.module.css'
//按需导入组件
import {Button,Space,Table,Modal,message,Switch,Input,Form,Cascader} from "antd"
//导入级联选择框数据
import {cityData} from './data.js'
//导入封装的网络请求
import {getaddress,deleteAddress,addAddress,defaultReceive,defaultSend,updateAddres} from '../../../untils/order'
//导入momont
import moment from 'moment'
export default function Address() {
    //列数据
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            render:(text,record,index)=>`${index+1}`,
            align:'center',
            width:60,
            fixed:'left'
          },
        {
          title: '地址名称',
          dataIndex: 'addressName',
          key: 'addressName',
          align:'center',
        },
        {
          title: '默认发货地址',
          dataIndex: 'sendStatus',
          key: 'sendStatus',
          align:'center',
          render:(text,record,index)=>(   
           <>
           默认发货地址:
           <Switch checked={record.sendStatus}  onChange={(checked)=>onSendStatus(record.sendStatus,record.id)} />
           </> 
           )
        },
        {
          title: '收货人姓名',
          dataIndex: 'name',
          key: 'name',
          align:'center',
        },
        {
            title: '收货人电话',
            dataIndex: 'phone',
            key: 'phone',
            align:'center',
          },
        {
            title: '收货人地址',
            dataIndex:'city',
            key: 'city',
            align:'center',
            render: (text,record) => {
                return text=record.province+" "+record.city+" "+record.region+" "+record.detailAddress 
            }
          },
          {
            title: '默认收货地址',
            dataIndex: 'receiveStatus',
            key: 'receiveStatus',
            align:'center',
            render:(text,record,index)=>(
              <>
              默认收货地址:
              <Switch  checked={record.receiveStatus} onChange={(checked)=>onReceiveStatus(record.receiveStatus,record.id)}  />
              </> 
              ) 
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align:'center',
          },
          {
            title: '操作',
            // dataIndex: 'Operation',
            key: 'Operation',
            align:'center',
            fixed: 'right',
            width: 120,
            render: (row, record) => {
                return <>
                <Button size='small' type="link"  onClick={() => editItem(row, record.key)}>编辑</Button>
                <Button size='small' type='text' danger onClick={() => removeItem(row, record.key)}>删除</Button> 
                </> 
                
            }
          },
      ];
      //地址列表数据
    const [addressList,setAddressList]=useState()
   //省市区数据
    const options=cityData 
    //新增弹框开关
    const [isModalOpen, setIsModalOpen] = useState(false);
     //新增地址的参数信息
    const AddressInfo={
      addressName:"",
      cityCode:"",
      detailAddress:"",
      id:"",
      modfiyTime:moment().format('YYYY-MM-DD HH:mm:ss'),
      name:"",
      phone:"",
      city:"",
      postCode:"",
      receiveStatus:0,
      sendStatus:0,
      province:"",
      region:"",
    }
    //获取级联选择框的值
    const onSelect = (value) => {
      // console.log(value);
    };
    //获取地址列表数据
        async function getAddressList(){
            let res=await getaddress()
            setAddressList(res.data.items)
            // console.log(res.data.items);
        }
    //设置默认发货状态
    const onSendStatus = async (checked,id) => {
      await defaultSend({checked,id})
      message.success('修改状态成功')
      //更新地址列表
      getAddressList()
    };
      //设置默认收货状态
    const onReceiveStatus = async (checked,id) => {
      await defaultReceive({checked,id})
      message.success('修改状态成功')
      // console.log(res);
      //更新地址列表
     getAddressList()
    };
    //点击删除数据 弹框
    const removeItem = (row, key) => {
        // console.log(row, key)
        Modal.confirm({
            title: '提示',
            content:"此操作将永久删除该文件，是否继续",
            cancelText:'取消',
            okText:'确定',
            onCancel:()=>{
              message.warning('取消删除')
            },
            onOk: async () => {
                setAddressList(addressList.filter(item => item.key !== key))
                //获取删除数据的网络请求
                await deleteAddress(row.id)
                // console.log(res); 
                message.success('删除成功!')
                //刷新列表数据
                getAddressList()
            }
        }) 
    }
    //暂存级联选择框的数据
    const [defCascader,setDefCascader]=useState()
    //点击编辑 弹框
    const editItem = (row, key)=>{ 
      setDefCascader([row.province,row.city,row.region])
      resetForm.setFieldsValue(row) 
      setTimeout(() => {
        setIsModalOpen(true); 
      }, 500);
     
      // console.log(row);
    }
    //点击新增按钮
    const addData = () => {
      setIsModalOpen(true);
      setDefCascader([])
    };
    //点击关闭modal弹框
    const handleCancel = () => {
      setIsModalOpen(false);
      //清空表单
      resetForm.resetFields()
    };
    //form组件调佣useForm
    const [resetForm]=Form.useForm()  
    //表单确定按钮 获取表单数据 // 发送请求，新增地址
    const onFinish =async (values) => {
      AddressInfo.addressName=values.addressName
      AddressInfo.postCode=values.postCode
      AddressInfo.phone=values.phone
      AddressInfo.province=values.receiveAddress[0]
      AddressInfo.city=values.receiveAddress[1]
      AddressInfo.region=values.receiveAddress[2]
      AddressInfo.detailAddress=values.detailAddress
      AddressInfo.name=values.name
      AddressInfo.id=values.id
      // console.log(AddressInfo);
      if(values.id){ 
        await updateAddres(AddressInfo)
        message.success('数据更新成功')
      }else{
       await addAddress(AddressInfo)
       message.success('新增数据成功')
      }
      //刷新列表数据
      getAddressList();
      //重置表单
      resetForm.resetFields()
      // 关闭弹框
      setIsModalOpen(false);
    };
    //表单校验错误时
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    //表单的取消按钮
    const formCancel=(value)=>{
      console.log(value);
      setIsModalOpen(false)
      message.warning('取消操作')
      //重置表单
      resetForm.resetFields()
    }
    useEffect(()=>{
        //渲染列表数据
        getAddressList()
    },[])
    return (
        <div className={styles.address}>
        <Space wrap>
            <div className={styles.header}>
                <Button type="primary" onClick={addData}>新增</Button>
            <Modal title="地址详情" open={isModalOpen} footer={null} onCancel={handleCancel} > 
            <Form form={resetForm}
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{receiveAddress:defCascader}}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="发货地址"
      name="addressName"
      rules={[
        {
          required: true,
          message: '发货地址不可以为空！',
        },
      ]}>
      <Input placeholder='发货地址'allowClear />
    </Form.Item>
    <Form.Item
      label="发货人姓名"
      name="name"
      rules={[
        {
         required:true,
         message:'发货人姓名不可为空'
      }
      ]}>
      <Input  placeholder='发货人姓名' allowClear />
    </Form.Item>
    <Form.Item
      label="发货人手机号"
      name="phone"
      rules={[
        {
          required: true,
          pattern: /^1[34578]\d{9}$/,
          message: '手机号格式错误！',
        },
      ]}
      >
      <Input placeholder='发货人手机号' allowClear />
    </Form.Item>
    <Form.Item
      label="邮政编码"
      name="postCode"
      rules={[
        {
        pattern:/^[0-9]*$/,
        message:'必须为数字'
      }
      ]}>
      <Input placeholder='邮政编码' allowClear />
    </Form.Item>
    <Form.Item
      label="收货地址"
      name="receiveAddress"
      rules={[
        {
         required:true,
         message:'收货地址不可为空'
      }
      ]}>
        {/* onChange:选择完成后的回调 (value)
       displayRender: 选择后展示的渲染函数	(label, selectedOptions) => ReactNode */}
      <Cascader  options={options} placeholder="请选择"
       onChange={onSelect}/>
    </Form.Item>
    <Form.Item
      label="详细地址"
      name="detailAddress">
      <Input  placeholder='详细地址' allowClear />
    </Form.Item>
    <Form.Item className={styles.fromBtn}
    name="id"
    > 
    <Space>
        <Button onClick={formCancel}>
          取消
        </Button>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
    </Space>
      </Form.Item>
  </Form>
      </Modal>
            </div>
  </Space>
  <Table bordered 
  columns={columns} 
  dataSource={addressList} 
  rowKey={record => record.id}    
  scroll={{ x: 1350,}} 
  style={{backgroundColor:"#fff"}}
  pagination={false}></Table>
        </div>
    )
}
