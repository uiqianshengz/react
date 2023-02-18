import request from './request'

//获取文章列表详情
export const getArticle = (start, limit, data) => {
    return request.post(`/lejuAdmin/productArticle/findArticles/${start}/${limit}`, data)
}
//更新文章状态
export const changeStatus = (data) => {
    return request.post('/lejuAdmin/productArticle/changeShowStatus', data)
}
//删除文章
export const delArtData = (id) => {
    return request.delete(`/lejuAdmin/productArticle/del/${id}`)
}
//新增文章
export const addArticleData = (data) => {
    return request.post('/lejuAdmin/productArticle/addArticle', data)
}
//查看文章明细
export const articleDetail = (id) => {
    return request.get(`/lejuAdmin/productArticle/productArticle/${id}`)
}
//素材管理中---------------------------------------------------------------------
//请求所有的
export const getMaterialist = (start, limit) => {
    return request.get(`/lejuAdmin/material/findMaterialByPage/${start}/${limit}`)
}
//删除素材
export const deletMaterialist = (id) => {
    return request.delete(`/lejuAdmin/material/delMaterial/${id}`)
}
//更新文章
export const updateArticle = (data) => {
    return request.post('/lejuAdmin/productArticle/updateArticle', data)
}