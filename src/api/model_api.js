/*
 * @Author: zk
 * @Date: 2021-02-24 13:47:18
 * @LastEditors: zk
 * @LastEditTime: 2021-04-12 10:09:30
 * @description: 
 */
import {
  BASE
} from "../utils/socket_request"
import request from '../utils/request'
import qsStringify from "qs-stringify"

const MODELAPI = {
  GETMODELINFO: params => {
    return request({
      url: '/OurBim/requestOurBim',
      method: 'POST',
      data: qsStringify(params)
    })
  },
  // 建立websocket通信
  CREATESOCKET: params => {
    return `${BASE.WSPRO}websocket/${params}`
  },
  // 获取构件树
  LISTMEMBERTREE: params => {
    return request({
      url: '/appli/getComponent',
      method: 'get',
      params
    })
  },
  // 指令下发
  UPDATEORDER: params => {
    return request({
      url: '/OurBim/doAction',
      method: 'get',
      params
    })
  },
  // 获取关注视角
  LISTFOLLOWPOINT: params => {
    return request({
      url: '/OurBim/selectCamerashotAll',
      method: 'post',
      params
    })
  },
//   修改关注视角
  UPDATEFOLLOWPOINT: params => {
    return request({
        url: '/OurBim/updateCamerashotGod',
        method: 'post',
        params
      })
  },
//   删除关注视角
    DElETEFOLLOWPOINT: params => {
    return request({
        url: '/OurBim/deleteCamerashotGod',
        method: 'post',
        params
      })
  },
  // 还原模型
  UPDATERESETANGLE: params => {
    return request({
        url: '/OurBim/clearGodCamerashot',
        method: 'post',
        params
      })
  },
  // 获取模型token
  GETBIMTOKEN: params => {
    return request({
        url: '/OurBim/getEnterToken',
        method: 'get',
        params
      })
  },

}

export default MODELAPI
