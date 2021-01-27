// 把通用的一些东西放到里面以便在使用可以节约代码
import axios from 'axios'
import JSONBig from 'json-bigint'
axios.defaults.baseURL = 'http://192.168.3.151:11011/vjapi'
axios.defaults.transformResponse = [function (data) {
  console.log('后端的数据为', data)
  try {
    return JSONBig.parse(data)
  } catch (err) {
    console.log('转换出错,就返回吧', err)
    return data
  }
}]
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 3. 添加请求拦截器主要时设置token
axios.interceptors.request.use(function (config) {
  const tokenStr = localStorage.getItem('tokenStr')
  if (tokenStr) {
    config.headers.Authorization = `Bearer ${tokenStr}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
export default axios
