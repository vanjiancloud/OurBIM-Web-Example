// 定位码
import request from '@/utils/newRequest.js'

// 列表
export function getList(params) {
  return request({
    url: '/ar/getAllLocators',
    method: 'get',
    params
  })
}

// 新增
export function create(params) {
  return request({
    url: '/ar/createLocator',
    method: 'post',
    params
  })
}

// 获取code
export function getCode(){
  return request({
    url: '/ar/createCodeId',
    method: 'get'
  })
}

// 根据定位码ID获取这个定位码信息
export function getCodeImg(params){
  return request({
    url: '/ar/getLocatorCodeInfo',
    method: 'get',
    params
  })
}

// 进入/退出定位模式
export function openLocate(params){
  return request({
    url: '/ar/changeLocateMode',
    method: 'post',
    params
  })
}

// 确定/取消放置定位码
export function sureLocator(params){
  return request({
    url: '/ar/confirmOrCancelLocator',
    method: 'post',
    params
  })
}

// 删除
export function deleteCode(params,data) {
  return request({
    url: '/ar/deleteLocator',
    method: 'post',
    params,
    data
  })
}

// 确定/取消更新定位码
export function confirmUpdateLocator(params) {
  return request({
    url: '/ar/confirmUpdateLocator',
    method: 'post',
    params
  })
}

// 启动更新
export function updateLocator(params) {
  return request({
    url: '/ar/updateLocator',
    method: 'post',
    params
  })
}

// 选中定位码，定位到定位码位置
export function focusLocator(params) {
  return request({
    url: '/ar/locatorCodeFocus',
    method: 'post',
    params
  })
}