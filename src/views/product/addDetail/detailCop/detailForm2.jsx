import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Form, Row, Col, Input, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import styles from './index.module.css'
import { addPic } from '../../../../untils/product'
import { changeProduct, initProductStore } from '../../../../store/productInfo'
import { addProductAndSkus, updateProductAndSkus } from '../../../../untils/product';


const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export default function DetailForm2({ goBack }) {

    const [form2] = Form.useForm();

    const { product } = useSelector(state => state.product)
    const dispath = useDispatch()
    const navigate = useNavigate()


    // 富文本内容
    const [editStr, setEdiStr] = useState()
    // 富文本内容初始内容
    const [initEditStr, setInitEditStr] = useState()

    // 一进页面获取仓库数据并赋值给页面
    useEffect(() => {
        if (product && product.product) {
            if (product.product.detailMobileHtml) {
                setInitEditStr(product.product.detailMobileHtml)
                setEdiStr(product.product.detailMobileHtml)
            }
            if (product.product.note) {
                const obj = {
                    note: product.product.note
                }
                form2.setFieldsValue(obj)
            }
        }
    }, [])

    // 编辑富文本时候的回调函数
    const handleEditorChange = (val) => {
        setEdiStr(val)
    }

    // 向仓库发送页面数据
    const sendDetailData = () => {
        const obj = {
            note: form2.getFieldValue('note'),
            detailMobileHtml: editStr
        }
        // 向仓库发送数据
        dispath(changeProduct(obj))
    }

    // 提交表单
    const onFinish = () => {
        // 将数据存入 仓库
        sendDetailData()
        if (!product.product.name) return message.error("商品名称是必填项")
        // 判断仓库的数据是否有 id ，有 id ，发送编辑的请求，没有 id ，发送新增的请求
        if (product.product.id) {
            editDetail(product)
        } else {
            // 添加商品的请求
            addDetail(product)
        }
    };

    // 发送新增商品的请求
    const addDetail = async (data) => {
        let res = await addProductAndSkus(data)
        if (res.code === 20000) {
            message.success("添加成功")
            // 跳转路由
            navigate("/home/product/list");
            // 初始化仓库
            dispath(initProductStore())
        }
    }

    // 发送更新商品的请求
    const editDetail = async (data) => {
        let res = await updateProductAndSkus(data)
        if (res.code === 20000) {
            message.success("修改成功")
            // 跳转路由
            navigate("/home/product/list");
            // 初始化仓库
            dispath(initProductStore())
        }
    }


    const backPage = () => {
        sendDetailData()
        goBack()
    }



    const editorObj = {
        height: '400px',
        language: 'zh_CN',
        plugins: 'table lists link image preview code',
        toolbar: `formatselect | code | preview | bold italic strikethrough forecolor backcolor | 
      link image | alignleft aligncenter alignright alignjustify  | 
      numlist bullist outdent indent`,
        relative_urls: false,
        file_picker_types: 'image',
        image_advtab: true,
        image_uploadtab: true,
        images_upload_handler: blobInfo => new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            addPic(formData).then(res => {
                const data = res.data.fileUrl
                resolve(data)
            }).catch(err => {
                reject(err.message)
            })
        })
    }


    return (
        <>
            <Form
                form={form2}
                name="goodsDetail2"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{
                    padding: "20px"
                }}
            >
                <div className={styles.formItemTable}>
                    详情描述
                </div>

                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <Form.Item
                            label="商品详情"
                            colon={false}
                        >
                            <Editor
                                apiKey="stlfwjubz049iavq9q36bjczzu5rqvhj7j9uv7oc702zyicg"
                                initialValue={initEditStr}
                                init={editorObj}
                                onEditorChange={handleEditorChange}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" span={18}>
                        <Form.Item
                            label="备注"  // productCategoryName
                            name="note"
                            colon={false}
                            style={{ marginLeft: "25px" }}
                        >
                            <Input.TextArea placeholder='备注' />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ marginTop: 24 }}>
                    <Button style={{ margin: '0 8px' }} onClick={() => backPage()} >
                        返回上一步
                    </Button>
                    <Button type="primary" style={{ margin: '0 8px' }} htmlType="submit">
                        提交保存
                    </Button>

                </div>
            </Form>

        </>
    )
}
