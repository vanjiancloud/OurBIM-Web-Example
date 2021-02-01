// 把通用的一些东西放到里面以便在使用可以节约代码
import axios from 'axios'
import JSONBig from 'json-bigint'
axios.defaults.baseURL = 'http://192.168.3.151:11011/vjapi'
axios.defaults.transformResponse = [function (data) {
  // console.log('后端的数据为', data)
  try {
    return JSONBig.parse(data)
  } catch (err) {
    // console.log('转换出错,就返回吧', err)
    return data
  }
}]
export default axios
