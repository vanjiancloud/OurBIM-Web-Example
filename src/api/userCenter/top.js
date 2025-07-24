import request from "@/utils/newRequest.js";
import config from '../../../server.config'
import qs from 'qs'

export function updateObj(params, data) {
    return request({
      url: `/buildSystem/setSurfaceEditing`,
      method: 'post',
      params: params,
      data
    })
  }
export function getObj(params) {
    return request({
      url: `/buildSystem/getPaveInfo`,
      method: 'get',
      params: params
    })
  }