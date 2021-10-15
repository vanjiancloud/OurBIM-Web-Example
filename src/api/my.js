// 导入抽取的axios对象
import request from '../utils/request'
// 导入字符串转换工具
import qsStringify from 'qs-stringify'

// 激活账号
export function activation(data) {
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
export function login(data) {
  const { loginName, password } = data
  return request({
    url: '/UserCenter/login',
    method: 'POST',
    params: {
      loginName,
      password
    }
  })
}

// 获取手机短信登录
export function loginMobile(data) {
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

// 修改密码
export function updatePassword(data) {
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
export function updatePhone(data) {
  return request({
    url: '/UserCenter/updatePhone',
    method: 'POST',
    data
  })
}

// 新建项目
export function addProject(data) {
  return request({
    url: '/appli/addProject',
    method: 'POST',
    data: qsStringify(data)
  })
}

// 上传项目模型
export function ProjectModel(data) {
  return request({
    url: '/appli/postProjectModel',
    method: 'POST',
    data
  })
}

// 获取项目列表
export function getProjectList(data) {
  return request({
    url: '/appli/getApplicationList',
    method: 'GET',
    params: data
  })
}
export function upgradeModle(params) {// 升级模型
  return request({
    url: '/appli/upgradeBIMModel',
    method: 'POST',
    params
  })
}
// 分享项目
export function getWebUrl(data) {
  return request({
    url: '/appli/getWebUrl',
    method: 'POST',
    params: data

  })
}
// 删除项目
export function deleteProject(data) {
  return request({
    url: '/appli/deleteProject',
    method: 'POST',
    data: qsStringify(data)
  })
}

// 编辑项目
export function updateProject(data) {
  return request({
    url: '/appli/updateProject',
    method: 'POST',
    data: qsStringify(data)
  })
}

// 获取用户已有信息
export function getUserInfo(data) {
  return request({
    url: '/CountManager/getUserCount',
    method: 'GET',
    params: data
  })
}

// 修改用户信息
export function modifyUserInfo(data) {
  return request({
    url: '/CountManager/ModifyUserCount',
    method: 'POST',
    data: qsStringify(data)
  })
}

// 上传头像
export function uploadImg(data) {
  return request({
    url: '/CountManager/postUserImg',
    method: 'POST',
    params: data
  })
}

// 当前用户信息展示
export function showDetail(data) {
  return request({
    url: '/CountManager/getCountDetail',
    method: 'GET',
    params: data
  })
}

// 获取服务订单数据列表
export function getOrder(data) {
  return request({
    url: '/dingdanManager/searchDingdan',
    method: 'POST',
    data: qsStringify(data)
  })
}

// 提交授权码
export function updateSQM(data) {
  return request({
    url: '/dingdanManager/updateSQM',
    method: 'POST',
    data: qsStringify(data)
  })
}

// 验证授权码
export function verification(data) {
  return request({
    url: '/dingdanManager/verification',
    method: 'POST',
    data: qsStringify(data)
  })
}
