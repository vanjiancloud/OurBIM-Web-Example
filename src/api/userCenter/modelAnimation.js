// 序列动画
import request from '@/utils/newRequest.js'

// 动画模块打开与关闭接口
export function animAction(params) {
  return request({
    url: '/OurBim/animAction',
    method: 'post',
    params
  })
}

// 创建序列动画
export function createAnim(params) {
  return request({
    url: '/sequenceAnim/createAnim',
    method: 'post',
    params
  })
}
// 编辑动画
export function updateAnim(params) {
  return request({
    url: '/sequenceAnim/updateAnim',
    method: 'post',
    params
  })
}

// 查询模型下的动画列表
export function selectAnimationList(params) {
  return request({
    url: '/sequenceAnim/selectAnimationList',
    method: 'post',
    params
  })
}

// 创建序列动画事件 0位置 2视点
// 一个序列动画，可包含多项并行的序列动画事件。
export function createAnimEvent(params, data) {
  return request({
    url: '/sequenceAnim/createAnimEvent',
    method: 'post',
    params,
    data
  })
}

// 查询动画下的动画事件列表
export function selectAnimationEventFrameList(params) {
  return request({
    url: '/sequenceAnim/selectAnimationEventFrameList',
    method: 'post',
    params
  })
}

// 创建(编辑)关键帧
export function updateAnimFrame(params, data) {
  return request({
    url: '/sequenceAnim/updateAnimFrame',
    method: 'post',
    params,
    data
  })
}

// 保存关键帧数据
export function saveAnimFrame(params) {
  return request({
    url: '/sequenceAnim/saveAnimFrame',
    method: 'post',
    params
  })
}

// 退出动画模式接口，指退出动画编辑模式，模型恢复正常位置
export function quitAnimation(params, data) {
  return request({
    url: '/sequenceAnim/quitAnimation',
    method: 'post',
    params,
    data
  })
}

// 关联数据接口
export function updateLinkage(params, data) {
  return request({
    url: '/sequenceAnim/updateLinkage',
    method: 'post',
    params,
    data
  })
}

// 删除关键帧
export function deleteAnimFrame(params) {
  return request({
    url: '/sequenceAnim/deleteAnimFrame',
    method: 'post',
    params
  })
}

// 删除动画事件
export function deleteAnimEvent(params) {
  return request({
    url: '/sequenceAnim/deleteAnimEvent',
    method: 'post',
    params
  })
}

// 删除动画
export function deleteAnim(params) {
  return request({
    url: '/sequenceAnim/deleteAnim',
    method: 'post',
    params
  })
}

// 控制序列动画播放的接口
export function playAnimation(params, data) {
  return request({
    url: '/sequenceAnim/playAnimation',
    method: 'post',
    params,
    data
  })
}