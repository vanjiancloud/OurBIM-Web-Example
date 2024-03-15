import request from '@/utils/newRequest.js'



// 获取Logo
export function getLogo(params) {
    return request({
        url: `/cloudServiceImg/isUploadImg`,
        method: "GET",
        params
    })
}

