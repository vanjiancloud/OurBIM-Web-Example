import request from '@/utils/newRequest.js'

// 新增
export function add(data) {
  return request({
    url: '/cloudServicePreStart/add',
    method: 'post',
    data
  })
}

// 编辑
export function edit(data) {
    return request({
      url: '/cloudServicePreStart/edit',
      method: 'post',
      data
    })
  }

// 查找项目
export function findProject(params) {
    return request({
      url: '/cloudServicePreStart/getProject',
      method: 'get',
      params
    })
}

// 列表
export function list(params) {
    return request({
      url: '/cloudServicePreStart/list',
      method: 'get',
      params
    })
}

// 删除
export function deleteRow(data) {
    return request({
      url: '/cloudServicePreStart/removeById',
      method: 'post',
      data
    })
}

// 启动
export function startRow(data) {
    return request({
      url: '/cloudServicePreStart/start',
      method: 'post',
      data
    })
}

// 禁用
export function stopRow(data) {
    return request({
      url: '/cloudServicePreStart/stop',
      method: 'post',
      data
    })
}
