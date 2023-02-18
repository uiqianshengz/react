import axios from 'axios'
import { message } from 'antd';

// import { message } from 'antd';
const request = axios.create({
    baseURL: 'http://leju.bufan.cloud',
    timeout: 5000,

})

// 请求拦截器
request.interceptors.request.use(
    config => {
        config.headers.token = localStorage.getItem('token')
        return config
    },
    error => {
        // do something with request error
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(

    response => {
        if (response.data.code !== 20000) {
            return message.error(response.data.message, [2], () => {
                return response.data
            })
        }
        return response.data
    },
    error => {
        console.log('err' + error)
        message.success(error.message, [1], () => {
            return Promise.reject(error)
        })

        // return Promise.reject(error)
    }
)

export default request