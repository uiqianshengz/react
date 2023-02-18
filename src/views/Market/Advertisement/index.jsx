import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { message, Upload, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import {
  Space, Table, Modal,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  Button
} from 'antd';

import { PlusOutlined, LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getAdvertise, editAdvertise, addAdvertise, delAdvertise } from '../../../untils/market'
const getBase64 = (img, callback) => {
  // console.log(img)
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  // console.log('file', file)
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你只能上传一张图片!');
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('图片必须小于1M!');
  }
  return isJpgOrPng && isLt1M;
};

export default function Index() {
  let [editOradd, setStatues] = useState('增加')

  let [advlist, setAdv] = useState([])
  async function getAtv() {
    let res = await getAdvertise()
    // console.log(res);
    if (res.code === 20000) {
      let list = res.data.items
      list.forEach((item, index) =>
        item.index = index + 1,
      )
      list.forEach((item, index) =>
        item.times = ['开始时间:' + item.startTime, '结束时间:' + item.endTime]
      )

      list.forEach((item, index) =>
        item.key = index
      )
      list.forEach((item, index) =>
        item.build = ['编辑', "删除"]
      )
      // console.log(list);
      setAdv(list)
    }
  }
  //请求表格列表数据
  useEffect(() => {
    getAtv()
  }, [])
  //表格数据
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 100,
    },
    {
      title: '广告图片',
      dataIndex: 'pic',
      key: 'pic',
      width: 100,

      render: (_, { pic }) => (
        <>
          <img className={styles.imgs} src={pic} alt="" />
        </>
      ),
    },
    {
      title: '时间',
      dataIndex: 'times',
      key: 'times',
      render: (_, { times }) => (
        <>
          {times.map((item) => {
            return (
              <div style={{ fontSize: '12px' }} key={item}>{item}</div>
            );
          })}
        </>
      ),
    },
    {
      title: '广告名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '点击数',
      dataIndex: 'clickCount',
      key: 'clickCount',
      width: 100,
    },
    {
      title: '下单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
    }, {
      title: '轮播位置',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (_, { type }) => (
        <>
          {
            type === 1 ? <div >其他</div> : <div >首页轮播</div>
          }

        </>
      ),
    }, {
      title: '链接地址',
      dataIndex: 'url',
      key: 'url',
      width: 100,
    }, {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      width: 100,
    },
    {
      title: '上线状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, { status }) => (
        <>
          {
            status === 1 ? <div key="上线">上线</div> : <div key="下线">下线</div>
          }

        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'build',
      key: 'build',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Space size="middle">
            <Button onClick={() => editAtv(record)} type="link" style={{ fontSize: '12px', width: '18px' }}  >{record.build[0]}</Button>
            <Button onClick={() => deletAtv(record)} type="link" danger style={{ fontSize: '12px', width: '18px' }}>{record.build[1]}</Button>
          </Space>

        </>
      ),
    },

  ];
  // -------------------------------------------弹出框内部各种点击事件--------------------------
  const [form] = Form.useForm();
  //表单重置
  const onReset = () => {
    form.resetFields();
  };
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  //增加
  async function addAdve(val) {
    let res = await addAdvertise(val)
    // console.log(res)
    if (res.code === 20000) {
      handleOk()
      getAtv()
      onReset()
    } else {
      message.error('添加失败')
    }
  }

  let [createTime, setDat] = useState('')
  let [endDat, setendDat] = useState('')
  //开始日期点击事件
  const creatChange = (date, dateString) => {
    setDat(dateString)
  };
  //结束日期点击事件
  const endChange = (date, dateString) => {
    // console.log(date, dateString, 'date, dateString');
    setendDat(dateString)
  };
  // const [modal, contextHolder] = Modal.useModal();
  //弹出框确认按钮
  const handleOk = () => {
    // setModalText('对话框将于两分钟后关闭');
    setConfirmLoading(true);
    setOpen(false);
    setConfirmLoading(false);
    message.success('提交成功')
  };
  const { confirm } = Modal;

  async function editAtvsitem(val) {
    let res = await editAdvertise(val)
    // console.log(111111, res);
    if (res.code === 20000) {
      handleOk()
      getAtv()
      onReset()
    } else {
      message.error('添加失败')
    }
  }

  let [records, setrec] = useState('')
  //form表单数据
  const onFinish = (values) => {
    // console.log('editOradd', editOradd)
    // console.log(createTime, 111111, endDat);
    //进行开始时间和结束时间的限制
    let str = Number(createTime.split('-').join('').split(' ').join('').split(':').join(''))
    let str2 = Number(endDat.split('-').join('').split(' ').join('').split(':').join(''))
    if (str2 < str) return message.error('时间选择错误')
    values.startTime = createTime
    values.endTime = endDat
    //更改上线下状态的key值
    values.status ? values.status = 1 : values.status = 0
    /*  if (values.pic && values.pic.file && values.pic.file && values.pic.file.response.code === 20000) {
       values.pic = imageUrl
     } else {
       values.pic = ''
     } */
    values.pic = imageUrl
    //对key值为undefind的值进行处理
    for (let i in values) {
      if (values[i] === undefined) {
        values[i] = ''
      }
    }
    if (!values.sort) {
      values.sort = 1
    }

    // console.log(11111, editOradd, values)
    if (editOradd === '增加') {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: '是否添加该商品',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          addAdve(values)
        },
        onCancel() {
          message.info('取消添加商品')
        },
      });
    } else {
      values.id = records.id
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: '是否更新该商品',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          editAtvsitem(values)
          handleOk()
        },
        onCancel() {
          message.info('取消更新商品')
        },
      });
    }
  };

  //新增，编辑取消按钮点击事件
  const onFinishFailed = (errorInfo) => {
    message.info('按格式提交数据')
  };
  //弹出框
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const [modalText, setModalText] = useState('广告详情');
  const showModal = () => {
    setStatues('增加')
    setLoading(false)
    setImageUrl('')
    setOpen(true);
  };

  //弹出框取消按钮
  const handleCancel = () => {
    setOpen(false);
    //重置表单
    onReset()
  };

  //图片上传
  const handleChange = (info) => {
    setImageUrl('')
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code !== 20000) {
        setLoading(false);
        message.error('上传错误，请重试')
      } else {
        getBase64(info.file.originFileObj, (url) => {
          // console.log(url)
          setLoading(true);
          setImageUrl(info.file.response.data.fileUrl);
        });
      }
    }
  };
  let [headerTok, setHead] = useState({})
  useEffect(() => {
    setHead({
      Accept: "*/*",
      token: localStorage.getItem('token')
    })
  }, [loading])
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      {loading ? <div
        style={{
          marginTop: 8,
        }}
      >
        上传中
      </div> : <div
        style={{
          marginTop: 8,
        }}
      >
        上传图片
      </div>}
    </div>
  );
  //------------------------------编辑按钮---------------

  let editAtv = (record) => {
    setStatues('编辑')
    // console.log(record);
    setrec(record)
    //设置编辑默认时间
    setendDat(record.endTime)
    setImageUrl(record.pic)
    record.startTime = dayjs(record.startTime)
    record.endTime = dayjs(record.endTime)
    form.setFieldsValue(record)
    setOpen(true);
  }
  //删除事件的请求函数
  async function delAtv(val) {
    let res = await delAdvertise(val)
    // console.log(res);
    if (res.code === 20000) {
      return message.success('删除成功')
    } else {
      return message.error('删除失败')
    }
  }
  //删除按钮点击事件
  let deletAtv = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '是否删除该商品',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        delAtv(record.id)
        getAtv()
      },
      onCancel() {
        message.info('取消删除')
      },
    });



  }

  return (
    <div className={styles.box} >
      {/* 中间表格数据 */}
      <div className={styles.content}>
        <div className={styles.btnbox}>
          <Button style={{ fontSize: '12px' }} type="primary" size='small' onClick={showModal}>新增</Button>
        </div>
        <div>
          <Table bordered style={{ fontSize: '12px', fontWeight: 'normal' }} scroll={{
            x: 1300,
          }} columns={columns} dataSource={advlist} />
        </div>
      </div>
      <Modal
        className={styles.modal}
        title="广告详情"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 800,
          }}
          className={styles.formsbox}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className={styles.formbox}>
            <div className={styles.formitem}>
              <Form.Item

                label="广告名称"
                name="name"
                rules={[
                  {
                    required: true,
                    message: '请输入广告名称!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="排序"
                name="sort"
                rules={[
                  {
                    pattern: /^[0-9]*$/,
                    message: '请输入数字!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="链接"
                name="url"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="开始时间"
                name="startTime"
                rules={[
                  {
                    required: true,
                    message: '请输入开始时间!',
                  },
                ]}
              >
                <ConfigProvider locale={zhCN}>
                  <DatePicker placeholder='开始时间' showTime onChange={creatChange} />
                </ConfigProvider>
              </Form.Item>
              <Form.Item
                label="上下线状态"
                name="status"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

            </div>
            <div className={styles.formitem}>
              <Form.Item
                label="备注"
                name="note"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="产品数量"
                name="orderCount"
                rules={[
                  {

                    pattern: /^[0-9]*$/,
                    message: '请输入数字!',
                  },
                ]}
              >
                <Input />
              </Form.Item>


              <Form.Item
                label="首页轮播位置"
                name="type"
              >
                <Select
                  style={{ width: 120 }}
                  options={[
                    { value: 0, label: 'app轮播' },
                    { value: 1, label: '其他' },

                  ]}
                />
              </Form.Item>

              <Form.Item
                label="结束时间"
                name="endTime"
                rules={[
                  {
                    required: true,
                    message: '请输入结束时间!',
                  },
                ]}
              >
                <ConfigProvider locale={zhCN}>
                  <DatePicker placeholder='结束时间' showTime onChange={endChange} />
                </ConfigProvider>
              </Form.Item>

              <Form.Item
                label="图片上传"
                name="pic"
                valuePropName="file"
              >
                <Upload
                  // name="avatar"
                  method='post'
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  headers={headerTok}
                  action="http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>

            </div>

          </div>
          <div className={styles.sumits}>
            <Form.Item >
              <div className={styles.sumit}>
                <Button style={{ marginRight: '20px' }} htmlType="button" onClick={handleCancel}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>

      </Modal>


    </div >
  )


}
