import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store/vuex.js'
import { Getuserid } from '@/store/index.js'

export const BASEURL = process.env.VUE_APP_REQUEST_URL
// create an axios instance
const CancelToken = axios.CancelToken;
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: BASEURL,
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 10000 // request timeout
  cancelToken: new CancelToken(function executor(c){
    store && store.commit("request/SET_CANCEL", c);
  })
})

// request interceptor
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['token'] = getToken()
    // }
    if (Getuserid()) {
      config.headers.common['token'] = Getuserid()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 403: token失效;
      // if (res.code === 403) {
      //   // to re-login
      //   MessageBox.confirm('您已注销，可以取消以停留在此页面，或再次登录', '退出', {
      //     confirmButtonText: '登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message))
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error.response.data) // for debug
    const errorRes = error && error.response.data
    Message({
      message: errorRes?.message || '网络异常',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
