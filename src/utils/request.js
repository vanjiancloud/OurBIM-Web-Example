/*
 * @Author: zk
 * @Date: 2021-02-20 13:30:48
 * @LastEditors: zk
 * @LastEditTime: 2021-03-10 16:04:02
 * @description: 
 */
// 把通用的一些东西放到里面以便在使用可以节约代码
import axios from 'axios'
import JSONBig from 'json-bigint'
<<<<<<< HEAD
=======
// axios.defaults.baseURL = 'http://1.180.74.210:11011/vjapi'
>>>>>>> df12d3f77d55b2c8605707eed5d51c32aa55f5ca
axios.defaults.baseURL = 'http://192.168.3.235:11011/vjapi'
axios.defaults.transformResponse = [function (data) {
  try {
    return JSONBig.parse(data)
  } catch (err) {
    return data
  }
}]
export default axios
