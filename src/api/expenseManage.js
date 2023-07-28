import request from "@/utils/threeRequest.js"

// 获取授权码列表
export function getAuthorizationCodeList(params) {
    return request({
        url: `/monitor/publicManage/order/AuthorizationCodeList`,
        method: "GET",
        params,
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}