// 构件属性
import request from '@/utils/newRequest.js'


// 修改自定义构件坐标
export function updateComsCoordinate(params, data) {
  return request({
    url: '/comControl/updateComs',
    method: 'POST',
    params,
    data
  })
}

// 对水流仿真体构件的开始、停止、重启操作
export function fluidOperate(params) {
  return request({
    url: '/comControl/fluidOperate',
    method: 'POST',
    params
  })
}

// 修改构件信息
export function modifyComParams(params, data) {
  return request({
    url: '/comControl/modifyComParams',
    method: 'POST',
    params,
    data
  })
}
// 媒体播放器 提交视频流地址
export function sendvideoUrl(params) {
  return request({
    url: '/comControl/sendvideoUrl',
    method: 'POST',
    params,
  })
}
// 获取视频流地址
export function getvideoUrl(params) {
  return request({
    url: '/comControl/getvideoUrl',
    method: 'POST',
    params,
  })
}

// 获取类型列表
export function listMemberType(params) {
  return request({
    url: `/buildSystem/getBuildingListByParentId`,
    method: 'get',
    params
  })
}
export function getObj(params) {
  return request({
    url: `/buildSystem/getPaveInfo`,
    method: 'get',
    params: params
  })
}