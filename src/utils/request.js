/*
 * @Author: zk
 * @Date: 2021-02-20 13:30:48
 * @LastEditors: zk
 * @LastEditTime: 2021-09-09 17:32:06
 * @description: 
 */
import axios from 'axios'
import JSONBig from 'json-bigint'
import {
  Getuserid
} from '@/store/index.js'

// axios.defaults.baseURL = 'https://api.ourbim.com:11022/vjapi' //线上

// axios.defaults.baseURL = 'http://api.ourbim.com:21012/vjapi'
// axios.defaults.baseURL = 'http://192.168.3.151:11011/vjapi'
// axios.defaults.baseURL = 'http://192.168.3.235:11011/vjapi'

// axios.defaults.baseURL = 'http://192.168.100.56:11011/vjapi'//范 本地


// axios.defaults.baseURL = 'http://cloud.ourbim.com:11011/vjapi' // 测试服务器

import config from '../../server.config'
axios.defaults.baseURL = config.VUE_APP_REQUEST_URL
// export const BASEURL = 'http://172.16.100.105:9088/vjapi'//杨景


axios.defaults.transformResponse = [
  function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }
]
//请求拦截
axios.interceptors.request.use(config => {
  if (Getuserid()) {
    config.headers.common['token'] = Getuserid()
  }
  //阻止回车键发送请求
  document.onkeydown = e => {
    let keyCode = window.event.keyCode
    if (keyCode == 13 || keyCode == 32) {
      return false
    }
  }
  return config
})
export default axios
