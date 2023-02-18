import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Form, Input, Col, Row, Select, Switch, message, Upload, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { changeProduct } from '../../../../store/productInfo'
import { findAllBrand, getAllCategory } from '../../../../untils/product'


import styles from './index.module.css'


// 提交表单
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

// 商品分类 下拉选择框 的点击事件
const productCateChange = (value) => {
  console.log(`selected ${value}`);
};
// 商品品牌 下拉选择框 的点击事件
const brandNameChange = (value) => {
  console.log(`selected ${value}`);
};





export default function DetailForm({ page, changePage }) {
  // 获取仓库中的数据
  const { product } = useSelector(state => state.product)
  // 将仓库中的方法映射到组件
  const dispath = useDispatch()


  const [form] = Form.useForm();
  // 增减按钮
  const addInput = (info) => {
    if (info) {
      return (
        <Input
          style={{ textAlign: "center" }}
          addonBefore={(<button className={styles.addBtn} onClick={() => {
            let num = form.getFieldValue(info)
            if (num <= 0) {
              message.error('值不能为负数')
              return false
            }
            if (isNaN(num)) {
              num = 1
            }
            let obj = {}
            obj[info] = parseFloat(num) - 1
            form.setFieldsValue(obj)
            return false
          }}>-</button>)}
          addonAfter={(<button className={styles.addBtn} onClick={() => {
            let num = form.getFieldValue(info)
            let obj = {}
            if (isNaN(num)) {
              num = 0
            }
            obj[info] = parseFloat(num) + 1
            form.setFieldsValue(obj)
            return false
          }}>+</button>)}
          onChange={() => inputNumChange(info)}
        />
      )
    } else {
      return (
        <Input
          disabled
          style={{ textAlign: "center" }}
          addonBefore={(<button className={styles.addBtn}>-</button>)}
          addonAfter={(<button className={styles.addBtn}>+</button>)}
        />
      )
    }
  }

  const inputNumChange = (info) => {
    let num = form.getFieldValue(info)
    if (isNaN(num)) {
      let obj = {}
      obj[info] = 0
      form.setFieldsValue(obj)
      message.info("请输入数字")
    }
  }

  // ------------------- 上传图片相关 ----------------------
  // 上传图片的请求头
  const [upImgHeader] = useState({
    token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
  })
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
  const [pic, setPic] = useState('')
  useEffect(() => {
    setPic(product.product.pic)
  }, [product])

  // 图片改变时的函数
  const handleChange = (info, data) => {
    if (info.file.status === 'done') {
      let obj = {}
      obj[data] = info.file.response.data.fileUrl
      setPic(info.file.response.data.fileUrl)
      form.setFieldsValue(obj)
    }
  };

  const getFormData = () => {
    const data = form.getFieldsValue()
    const serviceIds = data.serviceIds ? data.serviceIds.toString() : ""
    const productObj = {
      name: data.name,            // 商品名称  string
      productSn: data.productSn,   // 商品编码  string
      productCategoryName: data.productCategoryName,   // 商品分类名称 string
      brandName: data.brandName,   // 商品品牌名称 string
      description: data.description,  // 商品描述 string
      originalPrice: data.originalPrice ? parseInt(data.originalPrice) : 0,  // 商品原价 number
      weight: data.weight ? parseInt(data.weight) : 0,    // 商品重量 单位 kg number
      promotionType: 0,       // 促销类型
      price: data.originalPrice,    // 商品价格
      verifyStatus: data.verifyStatus ? 1 : 0,   // 审核状态 0：未审核，1：审核通过
      publishStatus: data.publishStatus ? 1 : 0,  // 发布状态
      pic: data.pic,    // 封面图片
      newStatus: data.newStatus ? 1 : 0,    // 新品状态
      recommendStatus: data.recommendStatus ? 1 : 0,    // 推荐状态 
      previewStatus: data.previewStatus ? 1 : 0,    // 预告商品 
      keywords: data.keywords,    // 关键词
      lowStock: data.lowStock ? parseInt(data.lowStock) : 0,    // 库存预警   number
      sort: data.sort ? parseInt(data.sort) : 0,            // 商品排序   number
      serviceIds: serviceIds,          // 产品服务，以逗号分隔  string
    }
    // 给父组件发送相关数据
    changePage(1, data)
    // 向仓库传递数据
    dispath(changeProduct(productObj))
  }

  // 获取所有品牌列表
  const allBrand = async () => {
    let res = await findAllBrand()
    const arr = []
    res.data.items.forEach(item => {
      arr.push({
        label: item.name,
        value: item.name
      })
    })
    setBrandList(arr)
  }
  // 所有品牌的数据
  const [brandList, setBrandList] = useState([])
  // 获取所有商品分类
  const allCateList = async () => {
    let res = await getAllCategory()
    const arr = []
    res.data.items[1].children.forEach(item => {
      arr.push({
        value: item.name,
        label: item.name,
      })
    })
    setCateList(arr)
  }
  // 所有品牌的数据
  const [cateList, setCateList] = useState([])

  useEffect(() => {
    // 获取所有分类数据
    allCateList()
    // 获取所有商品品牌
    allBrand()
  }, [])

  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 5,
        }}
        initialValues={product.product}
        name="goodsDetail"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{
          padding: "20px"
        }}
      >

        <div>
          <div className={styles.formItemTable}>
            基本信息
          </div>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="商品名称"  // name   string
                name="name"
                colon={false}
                rules={[
                  {
                    required: true,
                    message: '请输入活动名称!',
                  },
                ]}
              >
                <Input placeholder='商品名称' />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="商品编码"  // productSn
                name="productSn"
                colon={false}
              >
                <Input placeholder='商品编码' />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="商品分类"  // productCategoryName
                name="productCategoryName"
                colon={false}
              >
                <Select
                  placeholder="商品分类"
                  onChange={productCateChange}
                  allowClear
                  options={cateList}
                >
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="商品品牌"  // productCategoryName
                name="brandName"
                colon={false}
              >
                <Select
                  placeholder="商品品牌"
                  onChange={brandNameChange}
                  allowClear
                  options={brandList}
                >
                </Select>

              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="商品描述"  // productCategoryName
                name="description"
                colon={false}
              >
                <Input.TextArea placeholder='商品描述' />
              </Form.Item>
            </Col>
          </Row>
        </div>


        <div>
          <div className={styles.formItemTable}>
            商品属性
          </div>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="商品原价"  // originalPrice
                name="originalPrice"
                colon={false}
              // initialValue={0}
              >
                {addInput('originalPrice')}
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="促销类型"  // 禁用
                // name="promotionType"  // 未找到
                colon={false}
              >
                <Select
                  placeholder="没有促销，使用原价"
                  onChange={brandNameChange}
                  disabled
                ></Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="活动价格"  // price
                name="originalPrice"
                colon={false}
              >
                {addInput()}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="重量"  // weight
                name="weight"
                colon={false}
              // initialValue={0}
              >
                {addInput('weight')}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="审核状态"  // verifyStatus
                name="verifyStatus"
                colon={false}
                // initialValue={0}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="是否上架"  // publishStatus
                name="publishStatus"
                colon={false}
                // initialValue={0}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="略缩图"  // pic
                name="pic"
                colon={false}
                valuePropName="file"
              >
                <Upload
                  headers={upImgHeader}
                  action="http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss"
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={(e) => handleChange(e, 'pic')}
                >
                  {pic ? (
                    <img
                      src={pic}
                      alt="pic"
                      style={{
                        width: '100%',
                        height: "100%"
                      }}
                    />
                  ) : (
                    <PlusOutlined />
                  )}
                </Upload>

              </Form.Item>
            </Col>
          </Row>
        </div>

        <div>
          <div className={styles.formItemTable}>
            其他信息
          </div>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="推荐状态"  // recommendStatus
                name="recommendStatus"
                colon={false}
                // initialValue={0}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="新品状态"  // newStatus
                name="newStatus"
                colon={false}
                // initialValue={0}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="预告商品"  // previewStatus
                name="previewStatus"
                colon={false}
                // initialValue={0}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="搜索关键词"  // keywords
                name="keywords"
                colon={false}
              >
                <Input placeholder='关键词' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="库存预警"  // keywords
                name="lowStock"
                colon={false}
              // initialValue={0}
              >
                {addInput('lowStock')}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="商品排序"  // sort
                name="sort"
                colon={false}
              // initialValue={0}
              >
                {addInput('sort')}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="产品服务"  // serviceIds
                name="serviceIds"
                colon={false}
              >
                <Checkbox.Group>
                  <Row>
                    <Col span={8}>
                      <Checkbox value="1" style={{ lineHeight: '32px' }}>
                        无忧退货
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="2" style={{ lineHeight: '32px' }}>
                        快速退款
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="3" style={{ lineHeight: '32px' }}>
                        免费包邮
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
        </div>



        <div style={{ marginTop: 24 }}>
          {page === 0 && (
            <Form.Item>
              <Button type="primary" style={{ margin: '0 8px' }} onClick={getFormData} >
                下一步填写库存信息
              </Button>
            </Form.Item>
          )}
        </div>
      </Form>
    </>
  )
}
