import request from '@/utils/newRequest.js'

// 字典
export function getDict(dictKey) {
  return request({
    url: '/dict/getDictListByKey',
    method: 'get',
    params: { dictKey }
  })
}