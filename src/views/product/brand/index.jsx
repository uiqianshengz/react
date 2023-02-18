import React from 'react'
import { useState, useEffect } from 'react';
// 导入样式
import styles from './index.module.css'
// 导入 antd 组件
import { Button, Table, Pagination, ConfigProvider, Switch, message, Modal, Form, Input, Upload } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN'
import { PlusOutlined, LoadingOutlined, ExclamationCircleFilled } from '@ant-design/icons';


// 导入相关网络请求
import { findBrandByPage, updateBrand, addBrandData, delBrandData } from '../../../untils/product'

const { confirm } = Modal;
// 更改图片格式
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

// 请求图片前的函数
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('图片格式必须为JPG/PNG!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片不能超过2MB!');
  }
  return isJpgOrPng && isLt2M;
};


export default function Brand() {
  // 品牌列表数据
  const [brandList, setBrandList] = useState([])
  // 品牌列表总个数
  const [brandTotal, setBrandTotal] = useState(0)
  // 控制获取品牌列表数据页数     --  默认为 1
  const [brandPage, setBrandPages] = useState(1)
  // 控制获取品牌列表数据每页数据的个数   --  默认为 5
  const [brandNum, setBrandNum] = useState(5)

  // 切换状态
  const switchStatus = async (data) => {
    if (data.showStatus) {
      data.showStatus = 0
    } else {
      data.showStatus = 1
    }
    upDateBrandData(data)
  };

  // 更新数据
  const upDateBrandData = async (data) => {
    // 更新数据
    let res = await updateBrand(data)
    if (res.code === 20000) {
      message.success('修改成功')
    } else {
      message.error('修改失败')
    }
    // 重新获取数据
    getBrandList()
  }


  // 表格标题相关配置
  const columns = [
    {
      title: '序号',
      width: 50,
      dataIndex: 'key',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      key: '1',
      width: 150,
      align: 'center',
    },
    {
      title: '展示状态',
      dataIndex: 'showStatus',
      key: '2',
      width: 180,
      align: 'center',
      render: (_, data) => (
        <>
          是否展示：
          <Switch defaultChecked checked={data.showStatus ? true : false} onClick={() => {
            switchStatus(data)
          }} />
        </>
      )
    },
    {
      title: 'logo',
      dataIndex: 'logo',
      key: '3',
      width: 200,
      align: 'center',
      render: (_, { logo }) => (
        <>
          <img className={styles.logo} src={logo} alt="logo" />
        </>
      )
    },
    {
      title: '专区大图',
      dataIndex: 'bigPic',
      key: '4',
      width: 200,
      align: 'center',
      render: (_, { bigPic }) => (
        <>
          <img className={styles.bigPic} src={bigPic}  alt="bigPic"/>
        </>
      )
    },
    {
      title: '品牌故事',
      dataIndex: 'brandStory',
      key: '5',
      width: 150,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: '6',
      width: 300,
      align: 'center',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: '7',
      width: 150,
      align: 'center',
    },
    {
      title: '产品评论数量',
      dataIndex: 'productCommentCount',
      key: '8',
      width: 150,
      align: 'center',
    },
    {
      title: '产品数量',
      dataIndex: 'productCount',
      key: '9',
      width: 150,
      align: 'center',
    },
    {
      title: '是否品牌制造商',
      dataIndex: 'factoryStatus',
      key: '10',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (_, data) => (
        <>
          <Button className={styles.editBtn} type="link" size='small' onClick={() => editBtnClick(data)}>编辑</Button>
          <Button className={styles.deleteBtn} type="link" danger size='small' onClick={() => delBtnClick(data)}>删除</Button>
        </>
      )
    },
  ];

  // 获取网络数据列表
  async function getBrandList() {
    const { data } = await findBrandByPage(brandPage, brandNum);
    if (data.rows.length === 0 && brandPage > 1) {
      setBrandPages(brandPage - 1)
    }
    data.rows.forEach((item, index) => item.key = index + 1)
    setBrandList(data.rows)
    setBrandTotal(data.total)
  }
  useEffect(() => {
    // 执行获取网络数据列表
    getBrandList()
  }, [brandPage, brandNum])

  // 控制对话框开关的属性
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // 新增品牌对话框的确定按钮
  const addhandleOk = (obj) => {
    // 打开询问是否添加品牌的对话框
    showConfirm(obj)
  };
  // 询问是否添加的对话框
  const showConfirm = (obj) => {
    confirm({
      title: '您确定要添加该项吗?',
      icon: <ExclamationCircleFilled />,
      content: '你将要添加一个品牌',
      async onOk() {
        // 发送添加品牌的请求
        let res = await addBrandData(obj)
        if (res.code === 20000) {
          // 再次获取数据
          getBrandList()
          // 关闭对话框
          setIsAddModalOpen(false);
          message.success('新增品牌成功')
          // 重置表单
          onReset()
        } else {
          message.error('新增品牌失败')
        }
      }
    });
  };
  // 新增品牌对话框的取消按钮
  const addhandleCancel = () => {
    setIsAddModalOpen(false);
    message.info('您取消了新增品牌')
    // 重置表单
    onReset()
  };

  // 点击新增添加品牌
  const addItem = () => {
    setIsAddModalOpen(true);
  }

  // From 表单相关配置
  const [form] = Form.useForm();
  // 重置表单
  const onReset = () => {
    form.resetFields();
    setImageUrlOne('')
    setImageUrlTwo('')
  };
  // 表单确定验证通过
  const onFinish = (values) => {
    for (const i in values) {
      if (values[i] === undefined) {
        values[i] = ''
      }
    }
    // 排序赋值
    if (!values.sort) {
      values.sort = 1
    }
    // 专区大图 赋值
    if (values.bigPic && (values.bigPic.file ? values.bigPic.file.response.code === 20000 : '')) {
      values.bigPic = values.bigPic.file.response.data.fileUrl
    }
    // logo 图片赋值
    if (values.logo && (values.logo.file ? values.logo.file.response.code === 20000 : '')) {
      values.logo = values.logo.file.response.data.fileUrl
    }
    values.factoryStatus = values.factoryStatus ? 1 : 0
    values.showStatus = values.showStatus ? 1 : 0

    // 判断点击的是 新增 还是 编辑
    if (values.id) {
      editConfirm(values)
    } else {
      addhandleOk(values)
    }
  };
  // 表单确定验证失败
  const onFinishFailed = (errorInfo) => {
    message.error('新增品牌失败')
  };

  // 询问是否修改的对话框
  const editConfirm = (data) => {
    confirm({
      title: '您确定要修改该项吗?',
      icon: <ExclamationCircleFilled />,
      content: '你将要修改一个品牌',
      async onOk() {
        // 修改数据的请求
        let res = await updateBrand(data)
        if (res.code === 20000) {
          message.success('修改成功')
          // 重新获取数据
          getBrandList()
          // 关闭对话框
          setIsAddModalOpen(false);
          // 重置表单
          onReset()
        } else {
          message.error('修改失败')
        }
      }
    });
  };

  // 上传图片的请求头
  const [upImgHeader] = useState({
    token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
  })

  // 图片1
  const [imageUrlOne, setImageUrlOne] = useState();
  // 图片加载1
  const [loadingOne, setLoadingOne] = useState(false);
  // 添加图片1
  const uploadButtonOne = (
    <div>
      {loadingOne ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        添加图片
      </div>
    </div>
  );
  // 图片2
  const [imageUrlTwo, setImageUrlTwo] = useState();
  // 图片加载2
  const [loadingTwo, setLoadingTwo] = useState(false);
  // 添加图片2
  const uploadButtonTwo = (
    <div>
      {loadingTwo ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        添加图片
      </div>
    </div>
  );
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoadingOne(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        setLoadingOne(false);
        setImageUrlOne(url);
      });
    }
  };
  const handleChangeTwo = (info) => {
    if (info.file.status === 'uploading') {
      setLoadingTwo(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoadingTwo(false);
        setImageUrlTwo(url);
      });
    }
  };

  // 编辑按钮的点击事件
  const editBtnClick = (data) => {
    form.setFieldsValue(data)
    if (data.bigPic) setImageUrlOne(data.bigPic)
    if (data.logo) setImageUrlTwo(data.logo)
    setIsAddModalOpen(true);
  }

  // 删除按钮的点击事件
  const delBtnClick = async (data) => {
    // 打开询问是否删除的对话框
    delConfirm(data)
  }

  // 询问是否删除的对话框
  const delConfirm = (data) => {
    confirm({
      title: '确定要删除该品牌吗?',
      icon: <ExclamationCircleFilled />,
      content: '你将要删除该品牌，该操作不可逆，请谨慎选择',
      async onOk() {
        const res = await delBrandData(data.id)
        if (res.code !== 20000) return message.error('删除品牌失败')
        message.success('删除品牌成功')
        // 再次获取数据
        getBrandList()
      },
      onCancel() {
        message.info('您取消了删除')
      },
    });
  };

  return (
    <div className={styles.brandBox}>
      {/* 顶部新增 */}
      <div className={styles.header}>
        <Button type="primary" onClick={addItem}>新增</Button>
      </div>
      <div className={styles.body}>
        {/* 表格 */}
        <Table bordered
          className={styles.tables}
          columns={columns}
          dataSource={brandList}
          pagination={false}
          scroll={{
            x: 1300,
          }}
          onShowQuickJump={(page) => {
            console.log('page:' + page);
            // cur=page;
          }}
        />
        {/* 底部页码 */}
        <ConfigProvider locale={zh_CN}>
          <Pagination
            total={brandTotal}  // 数据总条数
            current={brandPage} // 当前页数
            showSizeChanger
            showQuickJumper
            defaultPageSize={brandNum}  // 默认每页数据显示条数
            pageSizeOptions={[5, 10, 20, 50]}
            onChange={  // 每页条数或者页面改变时发生的回调函数
              (page, pageSize) => {
                setBrandPages(page)
                setBrandNum(pageSize)
              }
            }
            showTotal={(total) => `共 ${total} 条`}
          />
        </ConfigProvider>
      </div>

      {/* 新增品牌对话 */}
      <Modal title="品牌详情" open={isAddModalOpen} onOk={addhandleOk} onCancel={addhandleCancel} getContainer={false} footer={null}
      >
        {/* From 表单 */}
        <Form
          form={form}
          className={styles.froms}
          name="brand"
          layout="vertical"
          // 提交表单且数据验证成功后回调事件
          onFinish={onFinish}
          // 提交表单且数据验证失败后回调事件
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            className={styles.items}
            label="品牌名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入品牌名称',
              },
            ]}
          >
            <Input placeholder="品牌名称" />
          </Form.Item>

          <Form.Item
            className={styles.items}
            label="首字母"
            name="initial"
          >
            <Input placeholder="首字母" />
          </Form.Item>

          <Form.Item name="brandStory" label="品牌故事"
            style={{ width: '95%' }}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            className={styles.items}
            label="排序"
            name="sort"
            rules={[
              { pattern: /^[0-9]*$/, message: '请输入数字' }
            ]}
          >
            <Input placeholder="排序,请输入数字" />
          </Form.Item>

          <Form.Item
            className={styles.items}
            label="产品数量"
            name="productCount"
            rules={[
              { pattern: /^[0-9]*$/, message: '请输入数字' }
            ]}
          >
            <Input placeholder="产品数量,请输入数字" />
          </Form.Item>


          <Form.Item
            className={styles.items}
            label="是否展示"
            name="showStatus"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            className={styles.items}
            label="是否为品牌制造商"
            name="factoryStatus"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* bigPic */}
          <Form.Item
            className={styles.items}
            label="上传专区大图"
            valuePropName="bigPic"
            name="bigPic">
            <Upload
              headers={upImgHeader}
              action="http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss"
              listType="picture-card"
              maxCount={1}
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrlOne ? (
                <img
                  src={imageUrlOne}
                  alt="avatar"
                  style={{
                    width: '100%',
                  }}
                />
              ) : (
                uploadButtonOne
              )}
            </Upload>
          </Form.Item>

          {/* logo */}
          <Form.Item
            className={styles.items}
            label="上传Logo"
            valuePropName="logo"
            name="logo">
            <Upload
              headers={upImgHeader}
              action="http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss"
              listType="picture-card"
              maxCount={1}
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChangeTwo}
            >
              {imageUrlTwo ? (
                <img
                  className={styles.logimg}
                  src={imageUrlTwo}
                  alt="avatar"
                  style={{
                    width: '100%',
                  }}
                />
              ) : (
                uploadButtonTwo
              )}
            </Upload>
          </Form.Item>

          <div className={styles.fromBtn}>
            <Form.Item>
              <Button onClick={addhandleCancel}>
                取消
              </Button>
            </Form.Item>
            <Form.Item
              name="id"
            >
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
