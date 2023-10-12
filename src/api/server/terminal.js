import request from '@/utils/newRequest.js'

// 列表
export function list(params) {
  return request({
    url: '/cloudServiceTerminal/list',
    method: 'get',
    params
  })
}

// 详情
export function detail(id) {
    return request({
      url: `/cloudServiceTerminal/detail/${id}`,
      method: 'get'
    })
}

// 终止
export function end(data) {
    return request({
      url: `/cloudServiceTerminal/end`,
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
      url: `/cloudServiceTerminal/batchEnd`,
      method: 'post',
      data,
      headers: {
        "Content-Type": "application/json"
      }
    })
}

// 查看终端监测
export function getTerminalDetail(params) {
  return request({
    url: `/cloudServiceTerminalDetail/list`,
    method: 'get',
    params
  })
}