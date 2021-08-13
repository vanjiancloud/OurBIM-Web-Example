/*
 * @Author: zk
 * @Date: 2021-07-30 14:27:46
 * @LastEditors: zk
 * @LastEditTime: 2021-07-30 14:40:55
 * @description: 构件库
 */
import request from '../utils/request'
import qsStringify from "qs-stringify"

const COMPONENTLIBRARY = {
      // 新增构件
      ADDCOMPONENT: params =>{
          return request({
              url: '/cpControl/addCp',
              method: 'POST',
              data: qsStringify(params)
            })
      },
      // 初始化构件
      INITCOMPONENT: params => {
          return request({
              url: '/cpControl/initComp',
              method: 'GET',
              params
            })
      },
      
}

export default COMPONENTLIBRARY