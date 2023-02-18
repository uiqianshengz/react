import request from "./request";

export const findMembersByPage = (start, limit) => {
    return request.get(`/lejuAdmin/member/findMembersByPage/${start}/${limit}`)
} 