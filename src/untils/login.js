import request from "./request";
export let logins = (data) => {
    return request.post('/lejuAdmin/index/login', data)
}

