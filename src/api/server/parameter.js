import request from '@/utils/newRequest.js'
import threeRequest from "@/utils/threeRequest.js"


// 验证公有云授权码
export function verifyUserAuthorizationCode(data) {
    return threeRequest({
        url: `/monitor/verify/verifyUserAuthorizationCode`,
        method: "POST",
        data,
    })
}

// 列表
export function authorizationCodeList(params) {
    return request({
        url: `/UserCenter/authorizationCodeList`,
        method: "GET",
        params,
    })
}

// 删除
export function deleteAuthorizationCode(params) {
    return request({
        url: `/UserCenter/deleteAuthorizationCode`,
        method: "GET",
        params,
    })
}

// 弹框详情
export function getConsumeRule(params) {
    return threeRequest({
        url: `/monitor/publicManage/version/getConsumeRule`,
        method: "GET",
        params,
    })
}