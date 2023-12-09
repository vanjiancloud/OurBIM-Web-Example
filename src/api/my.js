// 导入抽取的axios对象
import request from '../utils/request'
import newRequest from "@/utils/newRequest.js";

// 获取邮箱密码登录
export function login(params) {
    return newRequest({
        url: '/UserCenter/login',
        method: 'POST',
        params
    })
}

// 获取手机短信登录
export function loginMobile(params) {
    return newRequest({
        url: '/UserCenter/loginMobile',
        method: 'POST',
        params
    })
}

// 获取注册
export function getRegister(data) {
    const { email, mobile, code, password, activeUrl, name, company, sex } = data
    return request({
        url: '/UserCenter/addUser',
        method: 'POST',
        params: {
            email,
            mobile,
            code,
            password,
            activeUrl,
            name,
            company,
            sex
        }
    })
}

// 手机号查重
export function repeatMobile(data) {
    const { mobile } = data
    return request({
        url: '/UserCenter/repeatMobile',
        method: 'POST',
        params: {
            mobile
        }
    })
}

// 邮箱查重
export function repeatEmail(data) {
    const { email } = data
    return request({
        url: '/UserCenter/repeatEmail',
        method: 'POST',
        params: {
            email
        }
    })
}

// 获取验证码
export function sendMsgCode(data) {
    const { mobile, msgType } = data
    return request({
        url: '/UserCenter/sendMsgCode',
        method: 'POST',
        params: {
            mobile,
            msgType
        }
    })
}

// 修改密码验证手机号密码
export function updateJudgeMsg(data) {
    const { mobile, code } = data
    return request({
        url: '/UserCenter/judgeMsg',
        method: 'POST',
        params: {
            mobile,
            code
        }
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

// 修改用户信息
export function modifyUserInfo(params) {
    return newRequest({
        url: '/CountManager/ModifyUserCount',
        method: 'POST',
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


// 用户中心-资源信息使用信息统计接口
export function userCenterUse(params) {
    return newRequest({
        url: '/UserCenter/userCenterUse',
        method: 'GET',
        params
    })
}