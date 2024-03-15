
import newRequest from "@/utils/newRequest.js";

// 获取邮箱密码登录
export function login(params) {
    return newRequest({
        url: '/UserCenter/login',
        method: 'POST',
        params
    })
}

// 获取用户已有信息
export function getUserInfo(params) {
    return newRequest({
        url: '/CountManager/getUserCount',
        method: 'GET',
        params
    })
}

// 当前用户信息展示
export function showDetail(data) {
    return newRequest({
        url: '/CountManager/getCountDetail',
        method: 'GET',
        params: data
    })
}