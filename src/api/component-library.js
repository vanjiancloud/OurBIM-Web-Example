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

  // 开启/关闭构件库操作
  // /comControl/comAction
  comSwitch: (params) => {
    return request({
      url: '/comControl/comAction',
      method: 'POST',
      data: qsStringify(params)
    })
  },
  // 添加构件
  addCom: params => {
    return request({
      url: '/comControl/addCom',
      method: 'POST',
      data: qsStringify(params)
    })
  },

  // 获取构件列表
  getPublicComList: params => {
    return request({
      url: '/comControl/getPublicComList',
      method: 'get',
      params
    })
  },

  // 初始化构件
  initComponent: params => {
    return request({
      url: '/comControl/initCom',
      method: 'GET',
      params
    })
  },
  // 构件定位
  focusComponent: params => {
    return request({
      url: '/comControl/comFocus',
      method: 'POST',
      params
    })
  },

  /* 
 构件操作 
  params:{
    comId:'',
    taskId:'',
    action:'',//translate、rotate、scale
  }
  */
  operateCom: params => {
    return request({
      url: '/comControl/operateCom',
      method: 'POST',
      params
    })
  }
}

export default COMPONENTLIBRARY