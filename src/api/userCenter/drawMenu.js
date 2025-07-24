import request from "@/utils/newRequest.js";
import config from '../../../server.config'
import qs from 'qs'
// const BASE_URL = `${import.meta.env.VITE_BASE_BIM_API}/vjapi`

// 获取数据字典
export function listKey(params) {
  return request({
    url: `/dict/getDictListByKey`,
    method: 'get',
    params
  })
}
// 添加自定义构件
export function addComponent(params, data) {
  return request({
    url: `/comControl/addCom`,
    method: 'post',
    params: params,
    data
  })
}
// 绘制物体
export function addObject(data) {
  return request({
    url: `/buildSystem/draw`,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}
// 设置墙的默认属性
export function updateWallInfo(data) {
  return request({
    url: `/buildSystem/setBuildSystemParam`,
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}
// 铺贴
export function updatePave(params, data) {
  return request({
    url: `/buildSystem/updateTile`,
    method: 'post',
    params: params,
    data
  })
}
// 阵列
export function updateObj(params, data) {
  return request({
    url: `/buildSystem/updateArray`,
    method: 'post',
    params: params,
    data
  })
}