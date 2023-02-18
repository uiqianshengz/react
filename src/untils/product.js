// ----------------- 商品管理相关请求 ----------------------
import request  from "./request";

// ----------------- 品牌管理 ----------------

// 根据页数获取品牌列表数据
export const findBrandByPage = (start, limit) => {
    return request.get(`/lejuAdmin/brand/findBrandByPage/${start}/${limit}`)
}

// 更新品牌 
export const updateBrand = (data) => {
    return request.post('/lejuAdmin/brand/updateBrand', data)
}

// 添加品牌
export const addBrandData = data => {
    return request.post('/lejuAdmin/brand/addBrand', data)
}

// 删除品牌
export const delBrandData = id => {
    return request.delete(`/lejuAdmin/brand/delBrand/${id}`)
}

// ---------------------- 商品列表 -----------------------------

// 分页查询商品列表     
export const productsByPage = (start, limit, query) => {
    return request.post(`/lejuAdmin/product/productsByPage/${start}/${limit}`, query)
}

// 更改是否最新 /lejuAdmin/product/switchNewStatus
export const switchNewStatus = data => {
    return request.post(`/lejuAdmin/product/switchNewStatus`, data)
}

// 更改是否推荐 /lejuAdmin/product/switchRecommandStatus
export const switchRecommandStatus = data => {
    return request.post(`/lejuAdmin/product/switchRecommandStatus`, data)
}
// 更改发布状态 /lejuAdmin/product/switchPublishStatus
export const switchPublishStatus = data => {
    return request.post(`/lejuAdmin/product/switchPublishStatus`, data)
}

// 更改是否推荐 /lejuAdmin/product/switchRecommandStatus
export const switchVerifyStatus = data => {
    return request.post(`/lejuAdmin/product/switchVerifyStatus`, data)
}

// 删除商品信息
export const delProduct = productId => {
    return request.delete(`/lejuAdmin/product/del/${productId}`)
}

// 获取商品 sku 数据
export const getSku = productId => {
    return request.get(`/lejuAdmin/sku/getSkusByProductId/${productId}`)
}

// 更新库存信息 /lejuAdmin/sku/updateSkuInfo
export const updateSkuInfo = data => {
    return request.post(`/lejuAdmin/sku/updateSkuInfo`, data)
}

// 删除 sku  /lejuAdmin/sku/delSku/{skuId}
export const delSku = skuId => {
    return request.delete(`/lejuAdmin/sku/delSku/${skuId}`)
}

// 添加sku /lejuAdmin/sku/addProductSkus
export const addProductSkus = (data) => {
    return request.post(`/lejuAdmin/sku/addProductSkus`, data)
}

// 富文本上传图片
export const addPic = (file) => {
    return request.post(`/lejuAdmin/material/uploadFileOss`, file)
}

// 新增商品
export const addProductAndSkus = data => {
    return request.post(`/lejuAdmin/product/addProductAndSkus`, data)
}

// 获取商品明细     /lejuAdmin/product/productSkusDetail/{productId}
export const productSkusDetail = productId => {
    return request.get(`/lejuAdmin/product/productSkusDetail/${productId}`)
}

// 编辑商品
export const updateProductAndSkus = data => {
    return request.post(`/lejuAdmin/product/updateProductAndSkus`, data)
}

// 获取所有品牌数据
export const findAllBrand = () => {
    return request.get(`/lejuAdmin/brand/findAllBrand`)
}

// 获取所有分类数据
export const getAllCategory = () => {
    return request.get(`/lejuAdmin/category/getAllCategory`)
    // return request.post(`/lejuAdmin/material/uploadFileOssSave`, file)
} 
//查询分类列表
export const getCateData=()=>{
    return request.get('/lejuAdmin/category/getAllCategory')
}