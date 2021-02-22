// 导入抽取的axios对象
import request from '../utils/request'

// 激活账号
export function activation (data) {
  const { code } = data
  return request({
    url: 'UserCenter/ActiveServlet',
    method: 'POST',
    params: {
      code
    }
  })
}
// 获取邮箱密码登录
export function login (data) {
  const { email, password } = data
  return request({
    url: '/UserCenter/login',
    method: 'POST',
    params: {
      email,
      password
    }
  })
}

// 获取手机短信登录
export function loginMobile (data) {
  const { mobile, code } = data
  return request({
    url: '/UserCenter/loginMobile',
    method: 'POST',
    params: {
      mobile,
      code
    }
  })
}

// 获取注册
export function getRegister (data) {
  const { email, mobile, code, password, activeUrl } = data
  return request({
    url: '/UserCenter/addUser',
    method: 'POST',
    params: {
      email,
      mobile,
      code,
      password,
      activeUrl
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

// 修改密码验证手机号密码
export function updateJudgeMsg (data) {
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

// 修改密码
export function updatePassword (data) {
  const { mobile, code, password } = data
  return request({
    url: '/UserCenter/updatePassword',
    method: 'POST',
    params: {
      mobile,
      code,
      password
    }
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
// 新建项目
export function addProject (data) {
  const { userid, name, url } = data
  return request({
    url: '/appli/addProject',
    method: 'POST',
    params: {
      userid,
      name,
      url
    }
  })
}
