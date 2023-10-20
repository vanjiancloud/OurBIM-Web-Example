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

// 获取预启动开通总数
export function getOpenPreTotal(params) {
    return request({
      url: '/cloudServicePreStart/getTotalPreStartNum',
      method: 'get',
      params
    })
}

// 删除
export function deleteRow(data) {
    return request({
      url: '/cloudServicePreStart/removeById',
      method: 'post',
      data,
      headers: {
        "Content-Type": "application/json"
      }
    })
}

// 启动
export function startRow(data) {
    return request({
      url: '/cloudServicePreStart/start',
      method: 'post',
      data,
      headers: {
        "Content-Type": "application/json"
      }
    })
}

// 禁用
export function stopRow(data) {
    return request({
      url: '/cloudServicePreStart/stop',
      method: 'post',
      data,
      headers: {
        "Content-Type": "application/json"
      }
    })
}
