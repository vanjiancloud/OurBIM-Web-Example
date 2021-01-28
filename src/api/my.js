// 导入抽取的axios对象
import request from '../utils/request'

// 激活账号
export function activation (data) {
  return request({
    url: 'UserCenter/ActiveServlet',
    method: 'GET',
    data
  })
}
// 获取邮箱密码登录
export function login (data) {
  return request({
    url: '/UserCenter/login',
    method: 'POST',
    data
  })
}

// 获取手机短信登录
export function loginMobile (data) {
  return request({
    url: '/UserCenter/loginMobile',
    method: 'POST',
    data
  })
}

// 获取注册
export function getRegister (data) {
  const { email, mobile, code, password } = data
  return request({
    url: '/UserCenter/addUser',
    method: 'POST',
    params: {
      email,
      mobile,
      code,
      password
    }
  })
}

// 发送邮件
export function sendEmail (data) {
  return request({
    url: '/UserCenter/sendEmail',
    method: 'POST',
    data
  })
}

// 发送验证码
export function sendMsgCode (data) {
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

// 修改密码
export function updatePassword (data) {
  return request({
    url: '/UserCenter/updatePassword',
    method: 'POST',
    data
  })
}

// 修改手机号
export function updatePhone (data) {
  return request({
    url: '/UserCenter/updatePhone',
    method: 'POST',
    data
  })
}
