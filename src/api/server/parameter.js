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


// 获取ip黑名单列表
export function Iplist(params) {
    return request({
        url: `/cloudServiceConfigIp/list`,
        method: "GET",
        params,
    })
}

// 添加ip
export function addIp(data) {
    return request({
        url: `/cloudServiceConfigIp/add`,
        method: "POST",
        data,
    })
}

// 删除ip
export function removeIp(data) {
    return request({
        url: `/cloudServiceConfigIp/remove`,
        method: "POST",
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 获取Logo
export function getLogo(params) {
    return request({
        url: `/cloudServiceImg/downloadImg`,
        method: "GET",
        params,
        responseType: "blob"
    })
}

// logo上传图片
export function uploadLogo(data) {
    return request({
        url: `/cloudServiceImg/uploadImg`,
        method: "POST",
        data,
    })
}

// logo重置
export function restoreImg(params) {
    return request({
        url: `/cloudServiceImg/restoreImg`,
        method: "GET",
        params,
    })
}

