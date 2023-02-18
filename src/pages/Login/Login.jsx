import React from 'react'
import { logins } from "../../untils/login"
import { Button, Form, Input } from 'antd';
import styles from './index.module.css'
import { useNavigate } from 'react-router-dom'
import ParticlesBg from 'particles-bg'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
export default function Login() {
    let config = {
        num: [4, 7],
        rps: 0.1,
        radius: [5, 40],
        life: [1.5, 3],
        v: [2, 3],
        tha: [-50, 50],
        alpha: [0.6, 0],
        scale: [.1, 0.9],
        position: "all",
        // color: ["random", "#ff0000"],
        cross: "dead",
        random: 60
    };
 

    let navgite = useNavigate()
    const onFinish = async (values) => {

        let data = {
            "password": values.password,
            "username": values.username
        }
        let res = await logins(data)
        console.log(res)
        if (res.code === 20000) {
            message.success(res.message, [1], () => {
                localStorage.setItem('userinfo', JSON.stringify(res.data.userInfo))
                localStorage.setItem('token', res.data.token)

                navgite('/home')
            })
        }

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>

            <div className={styles.box}>

                <div className={styles.form} >
                    <div className={styles.title} >Login Form</div>
                    <Form
                        name="basic"
                        size={"Large"}
                        wrapperCol={{
                            span: 80,
                        }}
                        style={{
                            maxWidth: 800,
                        }}

                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed} >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名',
                                },
                            ]}
                        >

                            <Input className={styles.inpust} prefix={<UserOutlined />} placeholder="请输入用户名" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码',
                                },
                            ]}
                        >

                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="请输入密码"

                            />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button className={styles.buttonlogin} type="primary" htmlType="submit">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>

                </div>
            </div>
            <ParticlesBg type="polygon" config={config} bg={true} />
        </>
    )
}
