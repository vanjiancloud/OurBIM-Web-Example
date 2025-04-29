import request from '@/utils/newRequest.js'

// 列表
export function list(params) {
  return request({
    url: '/cloudServiceProcess/list',
    method: 'get',
    params
  })
}

// 详情
export function detail(id) {
    return request({
      url: `/cloudServiceProcess/detail/${id}`,
      method: 'get'
    })
}

// 终止
export function end(data) {
    return request({
      url: `/cloudServiceProcess/end`,
      method: 'post',
      data,
      headers: {
        "Content-Type": "application/json"
      }
    })
}

// 批量终止
export function batchEnd(data) {
    return request({
      url: `/cloudServiceProcess/batchEnd`,
      method: 'post',
      data,
      headers: {
        "Content-Type": "application/json"
      }
    })
}