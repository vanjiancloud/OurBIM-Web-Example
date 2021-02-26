/*
 * @Author: zk
 * @Date: 2021-02-24 13:47:18
 * @LastEditors: zk
 * @LastEditTime: 2021-02-24 14:04:07
 * @description: 
 */
import { BASE } from "../utils/socket_request"

const MODELAPI = {
// 建立websocket通信
    CREATESOCKET: params => {
        return `${BASE.WSPRO}websocket/${params}`
    }
}

export default MODELAPI