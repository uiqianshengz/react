import request from "./request";
export let getAdvertise = () => {
    return request.get('/lejuAdmin/advertise/adsList')
}
export let addAdvertise = (data) => {
    return request.post('/lejuAdmin/advertise/addAds', data)
}
export let delAdvertise = (adsId) => {
    return request.delete(`/lejuAdmin/advertise/delAds/${adsId}`)
}
export let editAdvertise = (data) => {
    return request.post('/lejuAdmin/advertise/updateAds', data)

}
//限时活动
export let recommendList = () => {
    return request.get('/lejuAdmin/homeRecommend/findAllRecommends')

}
//删除限时活动
export let delRecommend = (recommendId) => {
    return request.delete(`/lejuAdmin/homeRecommend/delRecommend/${recommendId}`)
}
//请求品牌列表
export let allBrand = () => {
    return request.get('/lejuAdmin/brand/findAllBrand')

}

//新增按钮搜索请求列表
export let productsSerch = (start, limit, data) => {
    return request.post(`/lejuAdmin/product/productsByPage/${start}/${limit}`, data)

}
//新增广告确定按钮
export let addBrand=(data)=>{
    return request.post('/lejuAdmin/homeRecommend/addRecommend',data)
}

