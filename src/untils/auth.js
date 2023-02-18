
import request from "./request";


export let getlimitPage = (start, limit) => {
    return request.get(`/admin/sysAuth/role/findRolesByPage/${start}/${limit}`)
}

export let getMenulist = () => {
    return request.get('/admin/sysAuth/permission/findAllPermissions')
}

export let rashMenulist = (data) => {
    return request.post('/admin/sysAuth/permission/saveInitMenus', data)
}
export let deleteRole = (id) => {
    return request.delete(`admin/sysAuth/role/removeRole/${id}`)
}
export let addRole = (data) => {
    return request.post('/admin/sysAuth/role/saveRolePermissions', data)
}
export let getRoleInfo = (id) => {
    return request.get(`/admin/sysAuth/role/findRolePermissions/${id}`)
}
export let changeRoleInfo = (data) => {
    return request.put('/admin/sysAuth/role/updateRolePermissions', data)
}

//获取角色数据
export let getrolelist = () => {
    return request.get('/admin/sysAuth/role/findAllRoles')
}
//获取账号管理数据
export const getUsersData=(start,limit,data)=>{
    return request.post(`/admin/sysAuth/user/findUsersByPage/${start}/${limit}`,data)
}
//获取新增账户请求
export const addUserInfo=(data)=>{
    return request.post('/admin/sysAuth/user/saveUserRoles',data)
}
//删除yh
export const removeUser=(id)=>{
    return request.delete(`/admin/sysAuth/user/removeUser/${id}`)
}
//更新用户信息
export const updateUser=(data)=>{
    return request.put('/admin/sysAuth/user/updateUserRoles',data)
}

//增加菜单权限---顶级目录部分
export let addMeunlist = (data) => {
    return request.post('/admin/sysAuth/permission/save', data)
}
//新增菜单--菜单
export let addMeuns = (data) => {
    return request.post('/admin/sysAuth/permission/save', data)
}

