/*
 * @Author: zk
 * @Date: 2021-07-30 14:27:46
 * @LastEditors: zk
 * @LastEditTime: 2021-08-17 16:15:29
 * @description: 构件库
 */
import request from '../utils/request'
import qsStringify from "qs-stringify"

const COMPONENTLIBRARY = {

  // 获取构件列表
  getPublicComList: params => {
    return request({
      url: '/comControl/getPublicComList',
      method: 'get',
      params
    })
  },
  // 新增构件
  ADDCOMPONENT: params => {
    return request({
      url: '/comControl/addCom',
      method: 'POST',
      data: qsStringify(params)
    })
  },
  // 初始化构件
  INITCOMPONENT: params => {
    return request({
      url: '/comControl/initComp',
      method: 'GET',
      params
    })
  },
  // 构件定位
  FOCUSCOMPONENT: params => {
    return request({
      url: '/comControl/comFocus',
      method: 'POST',
      params
    })
  },

}

export default COMPONENTLIBRARY