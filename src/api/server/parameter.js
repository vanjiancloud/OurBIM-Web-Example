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


// 添加时间限制
export function addTime(data) {
    return request({
        url: `/cloudServiceConfigDict/add`,
        method: "POST",
        data,
    })
}

// 编辑时间限制
export function editTime(data) {
    return request({
        url: `/cloudServiceConfigDict/edit`,
        method: "POST",
        data,
    })
}

// 获取限制时间
export function getLimitTime(params) {
    return request({
        url: `/cloudServiceConfigDict/list`,
        method: "GET",
        params,
    })
}
