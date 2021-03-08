/*
 * @Author: zk
 * @Date: 2021-02-24 13:47:18
 * @LastEditors: zk
 * @LastEditTime: 2021-03-08 10:44:23
 * @description: 
 */
import { BASE } from "../utils/socket_request"
import request from '../utils/request'
import qsStringify from "qs-stringify"


const MODELAPI = {
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
    }
}

export default MODELAPI