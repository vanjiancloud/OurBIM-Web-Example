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


axios.defaults.baseURL = process.env.VUE_APP_REQUEST_URL


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
  const params = new URLSearchParams(window.location.href);
  config.headers.common['token'] = Getuserid() || params.get('userId')
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
