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

/************************购买充值**********************/
// 用户账户余额查询
export function getUserMoney(params) {
    return request({
        url: `/monitor/publicManage/order/getUserMoney`,
        method: "GET",
        params,
    })
}

// 创建用户充值订单
export function createTopUpOrder(data) {
    return request({
        url: `/monitor/publicManage/order/createTopUpOrder`,
        method: "POST",
        data,
    })
}

// 优惠券校验
export function verifyUserDiscountCode(data) {
    return request({
        url: `/monitor/verify/verifyUserDiscountCode`,
        method: "POST",
        data,
    })
}

// 获取订单支付状态
export function getPayStatus(data) {
    return request({
        url: `/monitor/publicManage/order/toPay`,
        method: "POST",
        data,
    })
}

/************************订单管理**********************/
// 获取订单管理列表
export function getOrderList(params) {
    return request({
        url: `/monitor/publicManage/order/listOrder`,
        method: "GET",
        params,
    })
}