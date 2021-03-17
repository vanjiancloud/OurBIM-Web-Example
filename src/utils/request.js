/*
 * @Author: zk
 * @Date: 2021-02-20 13:30:48
 * @LastEditors: zk
 * @LastEditTime: 2021-03-17 17:31:49
 * @description: 
 */
// 把通用的一些东西放到里面以便重复使用
import axios from 'axios'
import JSONBig from 'json-bigint'
// axios.defaults.baseURL = 'http://1.180.74.210:11011/vjapi'
axios.defaults.baseURL = 'http://192.168.3.235:11011/vjapi'
axios.defaults.transformResponse = [function (data) {
  try {
    return JSONBig.parse(data)
  } catch (err) {
    return data
  }
}]
export default axios
