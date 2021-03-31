
import axios from 'axios'
import JSONBig from 'json-bigint'
import { Getuserid } from '@/store/index.js'

// axios.defaults.baseURL = 'http://1.182.89.34:11011/vjapi'
// axios.defaults.baseURL = 'http://192.168.3.235:11011/vjapi'
axios.defaults.baseURL = 'http://192.168.3.151:11011/vjapi'
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
axios.interceptors.request.use(
  config => {
    if (Getuserid()) {
      config.headers.common['token'] = Getuserid()
    }
    return config
  }
)
export default axios
