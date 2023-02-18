import request from "./request";
export let getmenulist = () => {
    return request.get('/admin/sysAuth/index/getInitMenus')
}

