import request from "@/utils/threeRequest.js"

// 获取授权码列表
export function getAuthorizationCodeList(params) {
    return request({
        url: `/monitor/publicManage/order/AuthorizationCodeList`,
        method: "GET",
        params,
    })
}

// 查询所有产品信息
export function getProductList(params) {
    return request({
        url: '/monitor/ourbimManage/version/listVersionName',
        method: "GET",
        params,
    })
}

// 创建授权码
export function createAuthorizationCode(data) {
    return request({
        url: '/monitor/publicManage/order/createAuthorizationCode',
        method: "POST",
        data,
    })
}

// 重置授权码
export function resetAuthorizationCode(data) {
    return request({
        url: '/monitor/publicManage/order/editReset',
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data,
    })
}

// 通过枚举名获取枚举数据
export function getDictData(params) {
    return request({
        method: 'GET',
        url: '/monitor/common/getEnumByClassName',
        params
    })
}