import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Form, Input, message, Upload, Checkbox, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';

import styles from './index.module.css'
import SkuTable from './skuTable';
import { changePmsSkuStockList, changeProduct } from '../../../../store/productInfo'

const { confirm } = Modal;

// 提交表单
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });



export default function DetailForm({ page, changePage, goBack }) {

  const [form1] = Form.useForm();
  const skuRef = useRef(null);

  const { product } = useSelector(state => state.product)
  // 将仓库中的方法映射到组件
  const dispath = useDispatch()

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


  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  // 图片列表
  const [fileList, setFileList] = useState([
    // {
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
  ]);
  const [imageUrl, setImageUrl] = useState(fileList);

  const handleImgCancel = () => setPreviewOpen(false);
  const handleImgPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleImgChange = ({ file, fileList }) => {
    setFileList(fileList);
    if (file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (file.status === 'done') {
      setLoading(false);
      let arr = imageUrl
      arr.push({ uid: file.uid, url: file.response.data.fileUrl })
      setImageUrl(arr)
    }
    if (file.status === 'removed') {
      const arr = imageUrl.filter(item => item.uid !== file.uid)
      setImageUrl(arr)
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );




  // 颜色选项
  const [colorOption, setColorOption] = useState([])
  // 创建颜色选项
  const addColor = () => {
    const color = form1.getFieldValue('colorInput')
    if (!color) return message.error('请输入颜色描述后添加')
    // const findColor = colorOption.find(item => item === color)
    if (colorOption.find(item => item === color)) return message.error('已经有这个颜色了')
    const colorArr = [...colorOption, color]
    setColorOption(colorArr)
  }
  // 勾选颜色
  const onChangeColorOption = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };
  const delColor = (i) => {
    const arr = [...colorOption]
    arr.splice(i, 1)
    setColorOption(arr)
  }

  // 大小选项
  const [sizeOption, setSizeOption] = useState([])
  // 创建大小选项
  const addSize = () => {
    const size = form1.getFieldValue('sizeInput')
    if (!size) return message.error('请输入大小后添加')
    if (sizeOption.find(item => item === size)) return message.error('已经有这个尺寸了')
    const sizeArr = [...sizeOption, size]
    setSizeOption(sizeArr)
  }
  // 勾选大小
  const onChangesizeOption = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };
  const delSize = (i) => {
    const arr = [...sizeOption]
    arr.splice(i, 1)
    setSizeOption(arr)
  }

  // 传递 页码和页面数据给父组件
  const getFormData = () => {

    changePage(2, form1.getFieldsValue())


    sendProduct()
  }
  // 传递数据给 仓库
  const sendProduct = () => {
    const url = []
    fileList && fileList.forEach(item => {
      if (item.response) {
        url.push(item.response.data.fileUrl)
      } else if (item.url) {
        url.push(item.url)
      }
    })

    const arr = form1.getFieldsValue()

    const obj = {
      detailTitle: arr.detailTitle ? arr.detailTitle : "",
      detailDesc: arr.detailDesc ? arr.detailDesc : "",
      albumPics: url.join(),
      color: arr.color ? arr.color : [],
      size: arr.size ? arr.size : [],
      allColor: colorOption,
      allSize: sizeOption
    }
    // 把 obj 传进仓库中
    dispath(changeProduct(obj))
  }


  // sku 相关数据
  const [skuData, setSkuData] = useState([])


  // 页面一加载 获取仓库中 sku 的数据  如果有数据  传递给 skuTable
  useEffect(() => {
    // 获取仓库中的数据
    // 仓库中 sku 的数据
    let skuVal = JSON.parse(JSON.stringify(product.pmsSkuStockList))
    let productVal = JSON.parse(JSON.stringify(product.product))

    // 仓库中 标题 副标题 画册的数据
    const newVal = JSON.parse(JSON.stringify(product.product))

    // 传入添加的所有颜色和尺寸选项
    newVal.allColor && setColorOption(newVal.allColor)
    newVal.allSize && setSizeOption(newVal.allSize)

    newVal.color = productVal.color
    newVal.size = productVal.size
    // 标题 副标题 的回显
    form1.setFieldsValue(newVal)

    // 图片画册的回显
    if (newVal.albumPics) {
      const url = newVal.albumPics.split(",")
      const arr = url.map((item, index) => {
        return {
          key: index,
          url: item
        }
      })
      setFileList(arr)
    }

    // sku Table 的回显
    if (skuVal.length !== 0) {
      setSkuData(skuVal)
    }
  }, [])

  // 生成 sku 按钮
  const createAdd = () => {
    const obj = form1.getFieldsValue()
    if (obj.color && obj.color.length !== 0) {
      if (obj.size && obj.size.length !== 0) {
        return createSkuConfirm(obj)
      }
    }
    message.error('请选择颜色或尺寸')
  }

  // 生成 sku 时的提示框
  const createSkuConfirm = (obj) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '此操作将清空sku列表,并生成新的列表, 是否继续?',
      closable: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        const arr = []
        obj.color.forEach(item => {
          obj.size.forEach(item1 => {
            arr.push({
              color: item,
              size: item1
            })
          })
        })
        return setSkuData(arr)
      },
      onCancel() {
        message.info("您取消了生成 sku 列表")
      },
    });
  };

  // 新增 sku 按钮
  const addSku = () => {
    const obj = form1.getFieldsValue()
    if (obj.color && obj.color.length !== 0) {
      if (obj.size && obj.size.length !== 0) {
        const arr = []
        obj.color.forEach(item => {
          obj.size.forEach(item1 => {
            arr.push({
              color: item,
              size: item1
            })
          })
        })
        return skuRef.current && skuRef.current.handleAdd(arr)
      }
    }
    message.error('请选择颜色或尺寸')
  }

  // 接收 skuTable 传递来的数据 并将其存储到仓库中
  const getSkuTable = (val) => {
    if (val.length !== 0) {
      const newVal = JSON.parse(JSON.stringify(val))
      newVal.forEach(item => {
        const arr = [{
          key: "颜色",
          value: item.color
        }, {
          key: "大小",
          value: item.size
        }]
        item.spData = JSON.stringify(arr)
      })
      // 将 val 发送给存储到仓库的 pmsSkuStockList 中
      dispath(changePmsSkuStockList(newVal))
    } else {
      dispath(changePmsSkuStockList(val))
    }
  }

  const backPage = () => {
    sendProduct()
    goBack()
  }


  return (
    <>
      <Form
        form={form1}
        name="goodsDetail2"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{
          padding: "20px"
        }}
      >

        <div>
          <div className={styles.formItemTable}>
            商品sku信息
          </div>
          {/* 标题 副标题 */}
          <div className={styles.row1}>
            <Form.Item
              label="标题"  // name
              name="detailTitle"
              colon={false}
            >
              <Input placeholder='标题'
                style={{ width: "20rem", marginRight: "50px" }} />
            </Form.Item>
            <Form.Item
              label="副标题"  // productSn
              name="detailDesc"
              colon={false}
            >
              <Input placeholder='副标题' style={{ width: "20rem" }} />
            </Form.Item>
          </div>

          {/* 上传图片 */}
          <div className={styles.row1}>
            <Form.Item
              label="画册图片"  // pic
              name="skuPic"
              colon={false}
              valuePropName="file"
            >
              <Upload
                headers={upImgHeader}
                action="http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss"
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onPreview={handleImgPreview}
                onChange={(e) => handleImgChange(e)}
              >
                {fileList.length >= 5 ? null : (uploadButton)}
              </Upload>
            </Form.Item>
          </div>

          {/* sku 设置 */}
          <div className={styles.row1}>

            {/* 创建颜色      colorInput */}
            <Form.Item
              label="sku 设置"  // name
              name="colorInput"
              colon={false}
            >
              <Input placeholder='颜色描述:土豪金' />
            </Form.Item>
            {/* 创建颜色      addColor*/}
            <Form.Item
              name="addColor"
              colon={false}
              style={{ margin: "0 10px" }}
            >
              <Button onClick={addColor}>创建颜色选项</Button>
            </Form.Item>
            {/* 大小输入框    sizeInput */}
            <Form.Item
              name="sizeInput"
              colon={false}
            >
              <Input placeholder='大小' />
            </Form.Item>
            {/* 创建大小      addSize */}
            <Form.Item
              name="addSize"
              colon={false}
              style={{ margin: "0 10px" }}
            >
              <Button onClick={addSize}>创建大小选项</Button>
            </Form.Item>

            <div style={{ marginLeft: "20px" }}>
              <Button type="primary" style={{ margin: "0 5px" }} onClick={createAdd}>
                生成 sku 列表
              </Button>
              <Button type="primary" onClick={addSku}>
                新增 sku
              </Button>
            </div>


          </div>
          <div className={styles.row1}>
            {
              colorOption.length ?
                <Form.Item
                  label="颜色"  // name
                  name="color"
                  colon={false}
                >
                  <Checkbox.Group onChange={onChangeColorOption} className={styles.checkboxGroup}>
                    {
                      colorOption.map((item, i) => {
                        return (
                          <div className={styles.checkbox} key={item}>
                            <Checkbox value={item} style={{ lineHeight: '32px' }}>
                              {item}
                            </Checkbox>
                            <Button type="text" danger size='small' style={{ marginRight: "30px" }}
                              onClick={() => { delColor(i) }}>删除</Button>
                          </div>
                        )
                      })
                    }
                  </Checkbox.Group>
                </Form.Item>
                : null
            }
          </div>
          <div className={styles.row1}>
            {
              sizeOption.length ?
                <Form.Item
                  label="大小"  // name
                  name="size"
                  colon={false}
                >
                  <Checkbox.Group onChange={onChangesizeOption} className={styles.checkboxGroup}>
                    {
                      sizeOption.map((item, i) => {
                        return (
                          <div className={styles.checkbox} key={item}>
                            <Checkbox value={item} style={{ lineHeight: '32px' }}>
                              {item}
                            </Checkbox>
                            <Button type="text" danger size='small' style={{ marginRight: "30px" }}
                              onClick={() => { delSize(i) }}>删除</Button>
                          </div>
                        )
                      })
                    }
                  </Checkbox.Group>
                </Form.Item>
                : null
            }
          </div>

          {/* sku 列表 */}
          <SkuTable ref={skuRef} skuData={skuData} sendSkuData={getSkuTable}></SkuTable>
        </div>



        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleImgCancel}>
          <img
            alt="example"
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>

        <div style={{ marginTop: 24 }}>
          {page === 1 && (
            <>
              <Button style={{ margin: '0 8px' }} onClick={() => backPage()} >
                返回上一步
              </Button>
              <Button type="primary" style={{ margin: '0 8px' }} onClick={getFormData} >
                下一步，填写移动端详情
              </Button>
            </>
          )}
        </div>
      </Form>
    </>
  )
}
