//订单管理下的数据请求
import request from "./request";
//获取订单管理下的地址列表
export const getaddress = () => {
    return request.get('/lejuAdmin/companyAddress/addressList')
}
//删除地址
export const deleteAddress = (id) => {
    return request.delete(`/lejuAdmin/companyAddress/${id}`)
}
//新增地址
export const addAddress = (data) => {
    return request.post('/lejuAdmin/companyAddress/save', data)
}
//设置收货默认
export const defaultReceive = (data) => {
    return request.post('/lejuAdmin/companyAddress/setReceiveOne', data)
}
//设置发货默认
export const defaultSend = (data) => {
    return request.post('/lejuAdmin/companyAddress/setSendOne', data)
}
// //获取地址明细
// export const getDetailAddress=(id)=>{
//     return request.get(`/lejuAdmin/companyAddress/${id}`)
// }
//更新地址
export const updateAddres = (data) => {
    return request.post('/lejuAdmin/companyAddress/update', data)

}

//获取订单列表数据
export const getOrderData = (start, limit, data) => {
    return request.post(`/lejuAdmin/order/findOrdersByPage/${start}/${limit}`, data)
}
//获取订单列表详情
export const getOrderDetail = (id) => {
    return request.get(`/lejuAdmin/order/orderDetail/${id}`)
}
//确认发货请求
export const confirmSend = (data) => {
    return request.post('/lejuAdmin/order/sendDone', data)
}
//关闭订单请求
export const reqCloseOrder = (id) => {
    return request.post(`/lejuAdmin/order/finishOrder/${id}`)
}

//退单列表请求
export const returnOrder = (data, start, limit) => {
    return request.post(`/lejuAdmin/orderReturn/findReturnApply/${start}/${limit}`, data)
}
//获取全部退单申请
export const allOrder = (start, limit) => {
    return request.post(`/lejuAdmin/orderReturn/findReturnApply/${start}/${limit}`)
}
//查询退单明细
export const returnOredrDetail = (id) => {
    return request.get(`/lejuAdmin/orderReturn/${id}`)
}
//同意退单
export const agreeReturn = (id, data) => {
    return request.post(`/lejuAdmin/orderReturn/agreeApply/${id}`, data)
}
//拒绝退单
export const rejectReturng = (id, data) => {
    return request.post(`/lejuAdmin/orderReturn/rejectApply/${id}`, data)
}
export const receiveReturng = (id, data) => {
    return request.post(`/lejuAdmin/orderReturn/receiveProduct/${id}`, data)
}

