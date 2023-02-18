import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
// 导入样式
import styles from './index.module.css'
import { Collapse, message, Table, Button, Switch, Form, Row, Col, Input, Select, Modal, Pagination, ConfigProvider } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import zh_CN from 'antd/es/locale/zh_CN'
import { CSVLink } from 'react-csv';


// 导入相关请求
import { productsByPage, switchNewStatus, switchRecommandStatus, switchPublishStatus, switchVerifyStatus, delProduct, getSku, productSkusDetail } from '../../untils/product'

// 导入自定义组件
import SkuModal from './skuModal'

// import { useDispatch } from 'react-redux';
import { changePmsSkuStockList, changeProduct, initProductStore } from '../../store/productInfo';


const { Panel } = Collapse;
const { confirm } = Modal;


export default function BrandList() {

  // 获取仓库中的数据
  const { product } = useSelector(state => state.product)

  const dispath = useDispatch()
  const navigate = useNavigate()

  // 获取商品列表数据时的查询参数
  const [query, setQuery] = useState([])
  // 商品列表数据
  const [productData, setProductData] = useState([])
  // 商品列表总条数
  const [productTotal, setProductTotal] = useState(0)
  // 定义商品列表数的页数   --- 默认值为 1
  const [pageStart, setPageStart] = useState(1)
  // 定义商品列表一页的数据条数   ---   默认值为 5
  const [pageLimit, setPageLimit] = useState(5)

  // 获取品牌列表的所有名称
  const [brandName, setBrandName] = useState([]);
  const getBrandName = async () => {
    let res = await productsByPage(1, productTotal)
    if (res.code !== 20000) return message.error('获取品牌名称失败')
    let arr = res.data.rows
    var newArr = [];
    var arrId = [];
    for (var item of arr) {
      if (arrId.indexOf(item['brandId']) === -1) {
        arrId.push(item['brandId']);
        if (item.brandName && item.brandId) {
          item.value = item.brandId
          item.label = item.brandName
          newArr.push(item);
        }
      }
    }
    setBrandName(newArr)
  }


  // ---------------- 获取商品数据 ------------------- 
  // 页面刷新或当页码或每页内容变动时获取商品数据
  useEffect(() => {
    getProductData()
  }, [pageStart, pageLimit])
  // 获取商品数据的函数
  const getProductData = async (query) => {
    let res = await productsByPage(pageStart, pageLimit, query)
    if (res.code !== 20000) return message.error('获取商品数据列表失败')
    res.data.rows.forEach((item, index) => {
      item.key = index + 1
    })
    setProductData(res.data.rows)
    setProductTotal(res.data.total)
  }

  //--------------------- 切换按钮 -------------------------
  // 切换 按钮 的状态
  const switchBtn = (data, who) => {
    switch (who) {
      case 0:
        const obj = {
          "productId": data.id,
          "status": data.newStatus ? 0 : 1
        }
        switchNewStatusData(obj, who);
        break;
      case 1:
        const obj1 = {
          "productId": data.id,
          "status": data.recommendStatus ? 0 : 1
        }
        switchNewStatusData(obj1, who);
        break;
      case 2:
        const obj2 = {
          "productId": data.id,
          "status": data.publishStatus ? 0 : 1
        }
        switchNewStatusData(obj2, who);
        break;
      case 3:
        const obj3 = {
          "productId": data.id,
          "status": data.verifyStatus ? 0 : 1
        }
        switchNewStatusData(obj3, who);
        break;
      default:
        message.error('未匹配到点击的按钮')
    }
  }
  // 切换按钮最新状态的请求
  const switchNewStatusData = async (obj, who) => {
    const isSuccess = (code) => {
      if (code === 20000) {
        message.success('状态修改成功')
        if (query.length === 0) {
          getProductData()
        } else {
          getProductData(query)
        }
      }
    }
    switch (who) {
      case 0:
        const res = await switchNewStatus(obj)
        isSuccess(res.code)
        break;
      case 1:
        const res1 = await switchRecommandStatus(obj)
        isSuccess(res1.code)
        break;
      case 2:
        const res2 = await switchPublishStatus(obj)
        isSuccess(res2.code)
        break;
      case 3:
        const res3 = await switchVerifyStatus(obj)
        isSuccess(res3.code)
        break;
      default:
        message.error('未匹配到点击的按钮')
    }
  }

  // -------------------- form表单 ------------------------
  const onFinish = (values) => {
    let arr = Object.values(values).filter(function (item) {
      if (item !== undefined) {
        return true			//过滤掉为空的项
      }
    })
    if (arr.length === 0) {		// 如果过滤后的arr长度为0，表示对象的键值对的值都为空！
      setQuery([])
      return getProductData()
    }
    // 转换数据
    switch (values.publishStatus) {
      case '未上架':
        values.publishStatus = 0;
        break;
      case '上架':
        values.publishStatus = 1;
        break;
      default:
        break
    }
    switch (values.verifyStatus) {
      case '未审核':
        values.verifyStatus = 0;
        break;
      case '审核':
        values.verifyStatus = 1;
        break;
      default:
        break
    }
    if (values.brandId) {
      values.brandId = values.brandId.value
    }
    // 设置请求参数
    setQuery(values)
    // 发送请求
    getProductData(values)
    message.success('条件查询成功')
  };
  const onFinishFailed = (errorInfo) => {
    message.error('条件查询失败')
  };
  // 重置按钮
  const resetBtn = () => {
    setQuery([]);
    getProductData()
  }

  // ------------------- 表格 ----------------------------
  // 表格的删除操作
  const delBtnClick = async ({ id }) => {
    let res = await delProduct(id)
    if (res.code === 20000) {
      message.success('删除成功')
      if (query.length === 0) {
        getProductData()
      } else {
        getProductData(query)
      }
    }
  }
  // 删除对话框
  const showConfirm = (data) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '是否删除sku?',
      closable: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        delBtnClick(data)
      },
      onCancel() {
        message.error('您取消了删除')
      },
    });
  };

  let [skuId, setSkuId] = useState(0)

  // 编辑 sku
  const editSku = async ({ id }) => {
    setSkuId(id)
    let res = await getSku(id)
    res.data.items.forEach((item, index) => item.key = index + 1)
    res.data.items.forEach(item => item.spData = JSON.parse(item.spData))
    res.data.items.forEach(item => {
      if (item.spData) {
        item.color = item.spData[0].value
        item.size = item.spData[1].value
      }
    })

    setSkuData(res.data.items)


    showModal()
  }
  // sku 数据
  const [skuData, setSkuData] = useState([])


  // -------------------- 编辑 sku 相关 ------------------------
  // 编辑 sku 对话框相关
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 商品列表的表格
  const columns = [
    // 序号
    {
      title: '序号',
      width: 50,
      dataIndex: 'key',
      key: 'key',
      fixed: 'left',
    },
    // 商品图片
    {
      title: '商品图片',
      key: 'key',
      width: 150,
      align: 'center',
      render: (_, { pic }) => (
        <>
          <img src={pic} style={{ width: "100px", height: "100px" }} alt="商品图片" />
        </>
      )

    },
    // 商品名称
    {
      title: '商品名称',
      key: 'key',
      width: 350,
      align: 'center',
      render: (_, data) => (
        <>
          <p>{data.name}</p>
          <p>品牌：{data.brandName}</p>
          <p>{data.description}</p>
        </>
      )
    },
    // 商品价格
    {
      title: '商品价格',
      key: 'key',
      width: 150,
      align: 'center',
      render: (_, data) => (
        <>
          <p>原价：{data.price}</p>
          <p>现价：{data.originalPrice}</p>
        </>
      )
    },
    // 商品类别
    {
      title: '商品类别',
      dataIndex: 'productCategoryName',
      key: 'key',
      width: 150,
      align: 'center',
    },
    // 标签
    {
      title: '标签',
      dataIndex: 'newStatus',
      key: 'key',
      width: 180,
      align: 'center',
      render: (_, data) => (
        <>
          <p>
            最新：
            <Switch defaultChecked
              checked={data.newStatus}
              onClick={() => {
                switchBtn(data, 0)
              }} />
          </p>
          <p>
            推荐：
            <Switch defaultChecked
              checked={data.recommendStatus}
              onClick={() => {
                switchBtn(data, 1)
              }} />
          </p>
        </>
      )
    },
    // 标签2
    {
      title: '标签2',
      dataIndex: 'publishStatus',
      key: 'key',
      width: 180,
      align: 'center',
      render: (_, data) => (
        <>
          <p>
            发布：
            <Switch defaultChecked
              checked={data.publishStatus}
              onClick={() => {
                switchBtn(data, 2)
              }} />
          </p>
          <p>
            审核：
            <Switch defaultChecked
              checked={data.verifyStatus}
              onClick={() => {
                switchBtn(data, 3)
              }} />
          </p>
        </>
      )
    },
    // sku
    {
      title: 'sku',
      key: 'key',
      width: 150,
      align: 'center',
      render: (_, data) => (
        <Button className={styles.editBtn} onClick={() => editSku(data)} type="link" size='small'>编辑sku</Button>
      )
    },
    // 重量
    {
      title: '重量',
      dataIndex: 'weight',
      key: 'key',
      width: 80,
      align: 'center',
    },
    // 排序
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'key',
      width: 150,
      align: 'center',
    },
    // 操作
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 150,
      align: 'center',
      render: (_, data) => (
        <>
          <Button className={styles.editBtn} type="link" size='small' onClick={() => editDetailBtn(data)}>编辑</Button>
          <Button className={styles.deleteBtn} type="link" danger size='small' onClick={() => showConfirm(data)}>删除</Button>
        </>
      ),
    },
  ];

  const [excel, setEscel] = useState([])
  // 导出表格
  const getTable = async () => {
    let res = await productsByPage(1, productTotal)
    if (res.code !== 20000) return message.error('获取品牌名称失败')
    const data = []
    res.data.rows.forEach(item => {
      data.push({
        "商品名称": item.name,
        "商品品牌": item.brandName,
        "商品价格": item.price
      })
    })
    setEscel(data)
  }
  useEffect(() => {
    getTable()
  }, [productTotal])


  // 新增按钮
  const addBtn = () => {
    // 初始化仓库数据
    dispath(initProductStore())
    navigate("/home/product/addDetail")
  }

  // 点击编辑按钮
  const editDetailBtn = async (data) => {
    // 发起查询商品明细的请求)
    const res = await productSkusDetail(data.id)
    if (res.code === 20000) {
      // const goodsSku = []
      res.data.skus.forEach(item => {

        if (item.spData) {
          const arr = JSON.parse(item.spData)
          item.color = arr[0]['value'] ? arr[0]['value'] : ''
          item.size = arr[1]['value'] ? arr[1]['value'] : ''
        } else {
          item.color = ""
          item.size = ""
        }

      })
      
      dispath(changePmsSkuStockList(res.data.skus))
      dispath(changeProduct(res.data.product))
      navigate('/home/product/addDetail')
    }
  }


  return (
    <>
      {/* 商品管理介绍 */}
      <Collapse className={styles.brandIntroduce} bordered={false} expandIconPosition="end">
        <Panel header="商品管理介绍" key="1">
          <p style={{ paddingLeft: 24 }}>
            商品管理模块可以对客户端的商品进行增删改查等相关操作,来控制客户端商品的列表展示和商品详情
          </p>
        </Panel>
      </Collapse>

      <div className={styles.productBody}>
        {/* 条件查询 */}
        <Collapse className={styles.conditionalQuery} bordered={false} expandIconPosition="end" onChange={getBrandName}>
          <Panel header='条件查询' key="1">
            {/* 条件查询内容 */}
            <Form
              name="productData"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ padding: 16 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row gutter={[16, 24]}>
                <Col className={styles.gutterBow} span={6}>
                  <Form.Item
                    label="商品名称"
                    name="name"
                  >
                    <Input placeholder='商品名称/模糊查询' />
                  </Form.Item>
                </Col>
                <Col className={styles.gutterBow} span={6}>
                  <Form.Item
                    label="商品货号"
                    name="productSn"
                  >
                    <Input placeholder='商品货号' />
                  </Form.Item>
                </Col>
                <Col className={styles.gutterBow} span={6}>
                  <Form.Item label="品牌" name="brandId">
                    <Select allowClear placeholder="品牌" labelInValue options={brandName}>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className={styles.gutterBow} span={6}>
                  <Form.Item label="上架状态" name="publishStatus">
                    <Select allowClear placeholder="上架状态" options={[
                      {
                        value: '未上架',
                        key: 0
                      },
                      {
                        value: '上架',
                        key: 1
                      }
                    ]}>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className={styles.gutterBow} span={6}>
                  <Form.Item label="审核状态" name="verifyStatus">
                    <Select allowClear placeholder="审核状态" options={[
                      {
                        value: '未审核',
                        key: 0
                      },
                      {
                        value: '审核',
                        key: 1
                      }
                    ]}>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <div className={styles.queryBtns}>
                    <Button className={styles.queryBtn} onClick={resetBtn} htmlType="reset">重置</Button>
                    <Button className={styles.queryBtn} htmlType="submit" type="primary">搜索</Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Panel>
        </Collapse>

        {/* 表格 */}
        <Table
          bordered
          title={() => (
            <>
              <Button type="primary" onClick={addBtn}>
                新增
              </Button>
              <CSVLink
                data={excel}
                filename="商品列表表.csv"
              >
                <Button type="primary" style={{ marginLeft: "10px" }}>
                  导出商品列表 excel 文件
                </Button>
              </CSVLink>
            </>
          )}
          columns={columns}
          dataSource={productData}
          scroll={{
            x: 1300,
          }}
          pagination={false}
        />

        {/* 底部页码 */}
        <ConfigProvider locale={zh_CN}>
          <Pagination
            total={productTotal}  // 数据总条数
            current={pageStart}   // 当前页数
            showSizeChanger
            showQuickJumper
            defaultPageSize={pageLimit}  // 默认每页数据显示条数
            pageSizeOptions={[5, 10, 20, 50]}
            onChange={  // 每页条数或者页面改变时发生的回调函数
              (page, pageSize) => {
                setPageLimit(pageSize)
                setPageStart(page)
              }
            }
            showTotal={(total) => `共 ${total} 条`}
          />
        </ConfigProvider>
      </div>


      {/* 编辑 sku 对话框 */}
      <Modal title="sku列表" width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>
      ]}>
        <SkuModal skuData={skuData} skuId={skuId}></SkuModal>
      </Modal>
    </>
  )
}
