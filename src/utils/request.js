// 把通用的一些东西放到里面以便在使用可以节约代码
import axios from 'axios'
import JSONBig from 'json-bigint'
axios.defaults.baseURL = 'Our Bim Controller'
axios.defaults.transformResponse = [function (data) {
  console.log('后端的数据为', data)
  try {
    return JSONBig.parse(data)
  } catch (err) {
    console.log('转换出错,就返回吧', err)
    return data
  }
}]
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
