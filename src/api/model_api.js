/*
 * @Author: zk
 * @Date: 2021-02-24 13:47:18
 * @LastEditors: zk
 * @LastEditTime: 2021-03-04 15:59:39
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
    LISTMEMBERTREE: params => {
        return request({
            url: '/appli/getComponent',
            method: 'get',
            params
          })
    }
}

export default MODELAPI