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
        url: '/monitor/publicManage/order/getVersionNameSelect',
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

// 获取支付链接
export function getPayUrl(data) {
    return request({
        url: `/monitor/publicManage/order/getPayUrl`,
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
        url: `/monitor/publicManage/order/getOrderStatus`,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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

// 开发票
export function doInvoice(data) {
    return request({
        url: `/monitor/publicManage/order/doInvoice`,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data,
    })
}

// 删除订单
export function deleteOrder(data) {
    return request({
        url: `/monitor/publicManage/order/deleteOrder`,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data,
    })
}

/************************消费账单管理**********************/
// 获取消费账单列表
export function getConsumerList(params) {
    return request({
        url: `/monitor/publicManage/order/listConsumerRecord`,
        method: "GET",
        params,
    })
}

// 获取消费内容下拉列表接口
export function getConsumerContentList(params) {
    return request({
        method: 'GET',
        url: '/monitor/publicManage/order/listConsumerContent',
        params
    })
}

// 获取授权码下拉列表接口
export function getAuthorizationCodeSelect(params) {
    return request({
        method: 'GET',
        url: '/monitor/publicManage/order/listAuthorizationCode',
        params
    })
}

// 由于接口都是用的threeRequest去请求，暂时先把用户管理相关的接口也写在这里
// 后续需要挪回到用户管理对应的接口文件夹中
/************************用户管理**********************/
// 修改密码
export function editPassword(data) {
    return request({
        url: '/monitor/publicManage/user/editPassword',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        data: data
    })
}