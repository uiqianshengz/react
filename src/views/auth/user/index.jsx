
import { Button, Col, Form, Input, Row, Table, Pagination, ConfigProvider, Modal, Upload, message, Avatar,  Space, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { UserOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import zh_CN from 'antd/es/locale/zh_CN'
//导入css
import styles from './index.module.css'
//导入请求
import { getUsersData, getrolelist, addUserInfo, removeUser, updateUser } from '../../../untils/auth'

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你只能上传 JPG/PNG 文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(' 图片大小不得大于2MB!');
  }
  return isJpgOrPng && isLt2M;
};
export default function User() {
 
  //处理上传时的状态使展示上传后的预览图片能顺利进行
 /*  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.file
  } */

  const [form] = Form.useForm()
  const [addForm] = Form.useForm()
  //用户数据
  let [userData, setUserData] = useState([])
  //获取角色列表数据
  const [roleData, setRoleData] = useState([])
  //数据总条数
  let [userNum, setUserNum] = useState()
  let [page, setPage] = useState(1)
  let [pageNum, setPageNum] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flag, setFlag] = useState(true)
   //设置图片头
   const [upImgHeader] = useState({
    token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
  })
  //图片加载
  const [loading, setLoading] = useState(false);
  //图片url
  const [imageUrl, setImageUrl] = useState();
  //图片上传
  const userImgChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <Avatar size="large" icon={<UserOutlined />} />}
    </div>
  )
  //表格数据
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => `${index + 1}`,
      width: 60,
      align: "center",
      fixed: 'left',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'name',
      align: "center",
      fixed: 'left',
    },
    {
      title: '昵称',
      dataIndex: 'nick_name',
    },
    {
      title: '头像',
      dataIndex: 'salt',
      render: (_, record) => {
        return <img src={record.salt} alt="" style={{ width: "120px", height: '80px' }} />
      },
      align: "center"
    },
    {
      title: '角色',
      dataIndex: 'roles',
      align: "center"
    },
    {
      title: '添加时间',
      dataIndex: 'create_time',
      align: "center"
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: "center",
      render: (_, record) => {
        return <>
          <Space>
            <Button type="primary" onClick={() => editUser(record)}>编辑</Button>
            <Button type="primary" danger onClick={() => deleteUser(record.id)}>删除</Button>
          </Space>
        </>
      }
    },
  ]
  //发送请求 获取账号管理列表数据
  async function getUserList(selData) {
    let { data } = await getUsersData(page, pageNum,selData)
    setUserData(data.rows)
    setUserNum(data.total);
    console.log(data);
  }
  /* let arr = ["刘备","关羽","张飞","赵云","马超","黄忠"];
 let obj = {};
  // 将数组转化为对象
 Object.keys
 作用：遍历对象
 返回结果：返回对象中每一项key的数组
 for (let i in arr) {
      obj[i] = arr[i];
      console.log(obj);
  };  
   const newObj = Object.keys(obj).map(val => ({
         label: obj[val],
         value: obj[val]
  }));
 console.log(newObj) */
  async function getroleData() {
    let { data } = await getrolelist()
    // 得到新数组
    data.items.map((item) => {
      return roleData.push({
        label: item.roleName,
        value: item.id
      })
    })
    //  console.log(roleData);
    setRoleData(roleData)
    /* //数组去重 
    let arrData = Array.from(new Set(arrData1))
    // console.log(arrData);
    // 数组转对象
    let objData = {}
    for (let i in arrData) {
      objData[i] = arrData[i]
    }
    setSelUser(Object.keys(objData).map(val => ({
      label: objData[val],
      value: objData[val]
    }))) */
    // console.log("seluser", selUser);
  }
  //搜索的查询按钮
  const onFinish = (values) => {
    message.error('暂时查不了')
   /*  const userQueryVo={
      "nickName":values.nick_name,
      "username":values.username
    } */
    // console.log(userQueryVo);
  /*   let aa= userData.filter((item)=>{
      return item.nick_name.indexOf(values.nick_name)>=0
    })
    console.log("aa",aa);*/ 
  }
  //搜索的重置按钮
  const onReset = () => {
    form.resetFields()
  }
  //点击编辑用户数据
  const editUser = (record) => {
    setFlag(false)
    record.roles ? record.roles = record.roles.split(',') : record.roles = record.roles
    console.log(record);
    //更改表单中的name属性
    addForm.setFieldsValue({
      "id": record.id,
      "nickName": record.nick_name,
      "roleIds": record.roles,
      "password": record.password,
      "username": record.username,
      "salt":record.salt
    })
    setImageUrl(record.salt)
    setIsModalOpen(true)
  }
  //点击新增用户按钮
  const addUser = () => {
    setFlag(true)
    setIsModalOpen(true);
  }
  //删除用户数据
  const deleteUser = (id) => {
    Modal.confirm({
      title: '提示',
      content: "此操作将永久删除该用户，是否继续",
      cancelText: '取消',
      okText: '确定',
      onCancel: () => {
        message.warning('取消删除')
      },
      onOk: async () => {
        setUserData(userData.filter(item => item.id !== id))
        //获取删除数据的网络请求
        let res = await removeUser(id)
        if (res.code === 2000) {
          //  console.log(res); 
          message.success('删除成功!')
          //刷新列表数据
          getUserList()
        }
      }
    })
  }
  //modal的取消按钮
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //级联选择框的变化
  const handleChange = () => {

  }
  //取消新增
  const addCancel = () => {
    //重置表单
    addForm.resetFields()
    //图片链接为空
    setImageUrl('')
    //关闭弹框
    setIsModalOpen(false)
  }
  //新增账号请求
  const addSubmit =async  (values) => {
    //图像上传问题
    // console.log(values);
    if(values.salt && values.salt.file.response.code===20000){
     values.salt=values.salt.file.response.data.fileUrl
    }
    try {
        /* // flat多维转一维
        values.roleIds= values.roleIds instanceof Array ? values.roleIds.flat():(values.roleIds=values.roleIds.split(","))  */
      if (values.id) {
        await updateUser(values)
      } else {
        await addUserInfo(values)
        //清空表单
        addForm.resetFields()
        setImageUrl('')
      }
      //关闭弹框
      setIsModalOpen(false)
      //刷新列表
      getUserList()
    } catch (error) {
      message.error(error.message)
    } 
  }
  //分页器
  const changePageSize = (page, pageSize) => {
    setPage(page)
    setPageNum(pageSize)
  }
  useEffect(() => {
    getroleData()
    getUserList()
  }, [page, pageNum])
  return (
    <div className={styles.Userbox}>
      <div className={styles.header}>
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}>
          <Row>
            <Space size="large">
              <Form.Item
                name="nick_name"
                label={<label style={{ color: "#606266", fontWeight: "bolder" }}>昵称</label>}>
                <Input placeholder="昵称模糊搜索" allowClear />
              </Form.Item>
              <Form.Item
                name="username"
                label={<label style={{ color: "#606266", fontWeight: "bolder" }}>用户名</label>}>
                <Input placeholder="用户名模糊搜索" allowClear />
              </Form.Item>
            </Space>
          </Row>
          <Form.Item className={styles.formBtn}>
            <Space>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.bottom}>
        <div className={styles.btn}>
          <Button type="primary" onClick={addUser}>
            新增
          </Button>
        </div>
        <Table bordered
          columns={columns}
          dataSource={userData}
          rowKey={record => record.id}
          scroll={{ x: 1350, }}
          style={{ backgroundColor: "#fff" }}
          pagination={false}></Table>
        <ConfigProvider locale={zh_CN}>
          <Pagination
            current={page}
            total={userNum}
            pageSizeOptions={["5", "10", "15", "20"]}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共${total}条`}
            onChange={changePageSize}
          />
        </ConfigProvider>
      </div>
      {/* modal确认框 */}
      <Modal title="新增用户" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          form={addForm}
          name="adduser"
          onFinish={addSubmit}>
          <Form.Item name="id" label="" hidden={true}><Input/> 
          </Form.Item>
          <Form.Item style={{ paddingLeft: '10px' }}
            name="username"
            label={<label style={{ color: "#606266", fontWeight: "bolder" }}>用户名</label>}
            rules={[
              {
                required: true,
                message: '用户名不可为空',
              },
            ]}>
            {flag ? <Input placeholder="请输入用户名" allowClear /> : <Input placeholder="请输入用户名" readOnly />}
          </Form.Item>
          <Form.Item
            name="nickName"
            label={<label style={{ color: "#606266", fontWeight: "bolder" }}>用户昵称</label>}
            rules={[
              {
                required: true,
                message: '用户昵称不可为空',
              },
            ]}>
            <Input placeholder="请输入用户昵称" allowClear />
          </Form.Item>
          <Form.Item style={{ paddingLeft: "40px" }}
            name="password"
            label={<label style={{ color: "#606266", fontWeight: "bolder" }}>密码</label>}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            valuePropName="salt"
            // getValueFromEvent={normFile}
            name="salt"
            label={<label style={{ color: "#606266", fontWeight: "bolder" }}>用户头像</label>}
            rules={[
              {
                required: true
              }
            ]} >
            <Upload
              headers={upImgHeader}
              action="http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={userImgChange}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "50px",
                    height: '50px'
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item style={{ paddingLeft: '10px' }}
            name="roleIds"
            label={<label style={{ color: "#606266", fontWeight: "bolder" }}>选择角色</label>}>
            <Select
              style={{
                width: 180,
              }}
              placeholder="请选择"
              onChange={handleChange}
              options={roleData}
              mode="multiple"
              allowClear
              maxTagCount="4"
            />
          </Form.Item>
          <Form.Item className={styles.formBtn}>
            <Space>
              <Button htmlType="button" onClick={addCancel}>
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

  )
}
