import React, { useEffect, useState} from 'react'
import styles from './index.module.css'
import { Input, Form, Button, Switch, Row, Col, Upload, message, Alert, Radio, Tooltip } from 'antd'
import { ArrowDownOutlined, LoadingOutlined, } from '@ant-design/icons';
import { useLocation,useNavigate } from 'react-router-dom'
//获取网络请求
import { addArticleData, articleDetail, updateArticle } from '../../../untils/content'
//富文本
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
//markdown
import MDEditor from '@uiw/react-md-editor';
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
    const isLt2M = file.size / 1024 / 1024 < 0.5;
    if (!isLt2M) {
        message.error(' 图片大小不得大于500kb!');
    }
    return isJpgOrPng && isLt2M;
};
export default function Add() {
    const navigate=useNavigate()
    const [artform] = Form.useForm()
    //获取当前文章的id
    const [articleId] = useState(useLocation().search.split('?id=')[1])
    //文本框
    const { TextArea } = Input;
    //富文本
    const [textValue, setTextValue] = useState('');
    //编辑类型切换
    const [editor, setEditor] = useState(0);
    const changeEditor = (e) => {
        //切换事件
        setEditor(e.target.value);
        if (textValue) {
            setTextValue('')
        }
        if (markValue) {
            setMarkValue('')
        }
    };
    //markdown
    const [markValue, setMarkValue] = React.useState("");
    //图片表头
    const [imgHeader] = useState({
        token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
    })
    //图片加载
    const [loading, setLoading] = useState(false);
    //图片url
    const [imageUrl, setImageUrl] = useState();
    const coverImgChange = (info) => {
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
    }
    //图片上传
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <><Button type='primary'>点击上传素材</Button> <p>只能上传jpg/png文件，且不超过500kb</p></>}
        </div>
    )
    //富文本自定义配置
    const modules = {
        // 方式1: 可以是简单的一维数组配置
        // toolbar: ["bold", "italic", "underline", "strike", "blockquote"]
        // 方式2: 可以配置二维数组，进行多个选项的配置
        toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            // 或者针对某一个配置项的key值，进行配置 
             [{ 'header': 1 }, { 'header': 2 }],    
            [{ header: [1, 2, false] }],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image"],
            ["clean"],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: [] }, { background: [] }]
        ],
       
    };
    //编辑文章时 表单回显
    async function getArtDetail() {
        if (articleId) {
            let { data } = await articleDetail(articleId)
            // console.log(data);
            artform.setFieldsValue(data.productArticle)
            setImageUrl(data.productArticle.coverImg)
            setTextValue(data.productArticle.content1)
            setMarkValue(data.productArticle.content2)
        }
    }
    //表单提交按钮
    const onFinish = async (values) => {
        // console.log(values); 
        //新增文章
        if (!articleId) {
            values.editorType = Number(values.editorType)
            //是否展示转换为数字
            values.isShow ? values.isShow = 1 : values.isShow = 0
            //图片地址
            if (values.coverImg && values.coverImg.file.response.code === 20000) {
                values.coverImg = values.coverImg.file.response.data.fileUrl
            }
            let res = await addArticleData(values)
            // console.log(res);
            if(res.code===20000){
                message.success('新增文章成功')
                navigate('/home/content/articleList')
            }else{
                message.error('新增失败')
            }

        } else {
            //编辑时追加id
            values['id'] = articleId
            let res1 = await updateArticle(values)
            if(res1.code===20000){
                message.success('编辑文章成功')
                navigate('/home/content/articleList')
            }else{
                message.error('编辑失败')
            }
        }
        // console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        getArtDetail()
    }, [])
    return (
        <div className={styles.addArtBox}>
            <div className={styles.header}>
                {articleId ? <p>编辑文章</p> : <p>新增文章</p>}
            </div>
            <div className={styles.content}>
                <Form form={artform}
                    name="basic"
                    style={{
                        maxWidth: 1200,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <Row gutter={[30, 24]}>
                        <Col span={8}>
                            <Form.Item
                                label="作者"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入作者姓名',
                                    },
                                ]}
                            >
                                <Input placeholder='作者姓名' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="标题"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入文章标题',
                                    },
                                ]}
                            >
                                <Input placeholder='文章标题' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="是否显示"
                                valuePropName="checked"
                                name="isShow">
                                <Switch checked />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="摘要" name="summary"
                        wrapperCol={{
                            span: 8,
                        }}>
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item
                        valuePropName="coverImg"
                        name="coverImg"
                        label="封面图片">
                        <Upload
                            action='http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss'
                            headers={imgHeader}
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={coverImgChange}>
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="avatar"
                                    style={{
                                        width: "100px",
                                        height: '100px'
                                    }}
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="切换富文本类型" name="editorType">
                        <Row align="middle">
                            <Radio.Group onChange={changeEditor} value={editor}>
                                <Radio value={0}>富文本</Radio>
                                <Radio value={1}>markdown</Radio>
                            </Radio.Group>
                            <Alert message="注意！切换编辑器会清空编辑内容" type="warning" className={styles.aletMess} showIcon />
                        </Row>
                    </Form.Item>
                    {editor === 0 &&
                        <Form.Item name="content1">
                            <>
                                <Upload>
                                    <Button type='primary'>插入图片<ArrowDownOutlined /></Button>
                                </Upload>
                                <ReactQuill style={{ height: "200px", marginTop: '10px' }} theme="snow" value={textValue} onChange={setTextValue} modules={modules} />
                            </>
                        </Form.Item>
                    }
                    {editor === 1 &&
                        <Form.Item name="content2">
                            <>
                                <MDEditor
                                    value={markValue}
                                    onChange={setMarkValue} />
                                <MDEditor.Markdown style={{ whiteSpace: 'pre-wrap' }} />
                            </>
                        </Form.Item>}
                    <Form.Item
                        wrapperCol={{
                            offset: 10,
                            span: 16,
                        }}>
                        {articleId ?
                            <Button type="primary" htmlType="submit" className={styles.subBtn}>立即修改</Button> :
                            <Button type="primary" htmlType="submit" className={styles.subBtn}>提交新增</Button>}

                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
