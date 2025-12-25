/*
 * @Autor: zk
 * @Date: 2024-08-23 19:46:00
 * @LastEditors: zk
 * @LastEditTime: 2024-11-10 20:16:12
 * @Description: 
 */
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store/vuex.js'
import { Getuserid } from '@/store/index.js'
import config from '../../server.config'
import { getToken } from '@/utils/auth';
// import { saveAs } from 'file-saver'

export const BASEURL = config.CAD_REQUEST_URL
// create an axios instance
const CancelToken = axios.CancelToken;
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: BASEURL,
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 10000 // request timeout
  cancelToken: new CancelToken(function executor(c) {
    store && store.commit("request/SET_CANCEL", c);
  })
})

// request interceptor
service.interceptors.request.use(
  config => {
    const params = new URLSearchParams(window.location.href);
    // console.log(params, window.location.href)
    // console.log('getToken', getToken(), params.get('shareToken'))
    config.headers.common['token'] = Getuserid() || params.get('userId');
    config.headers.common['accessToken'] = params.get('shareToken') || params.get('token') || getToken();
    // config.headers['Authorization'] =  getToken()
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
    if (res.code !== 0 && res.code !== 200) {
      if (res.message === '该项目没有BIM构件') {
        return Promise.reject(res)
      }
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message))
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error.response.data) // for debug
    const errorRes = error && error?.response?.data
    Message({
      message: errorRes?.message || '网络异常',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
