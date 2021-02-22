// 把通用的一些东西放到里面以便在使用可以节约代码
import axios from 'axios'
import JSONBig from 'json-bigint'
axios.defaults.baseURL = 'http://1.180.74.210:11011/vjapi'
axios.defaults.transformResponse = [function (data) {
  try {
    return JSONBig.parse(data)
  } catch (err) {
    return data
  }
}]
export default axios
