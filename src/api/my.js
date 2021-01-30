// 导入抽取的axios对象
import request from '../utils/request'

// 激活账号
export function activation (data) {
  const { code } = data
  return request({
    url: 'UserCenter/ActiveServlet',
    method: 'GET',
    params: {
      code
    }
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

// 手机号查重
export function repeatMobile (data) {
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
export function repeatEmail (data) {
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
