/*
 * @Author: zk
 * @Date: 2021-02-20 13:30:48
 * @LastEditors: LB
 * @LastEditTime: 2021-05-20 11:44:47
 * @description: 
 */
import axios from 'axios'
import JSONBig from 'json-bigint'
import { Getuserid } from '@/store/index.js'

axios.defaults.baseURL = 'http://1.182.89.34:11011/vjapi'
// axios.defaults.baseURL = 'http://192.168.3.235:11011/vjapi'
// axios.defaults.baseURL = 'http://192.168.3.151:11011/vjapi'
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
