/*
 * @Author: zk
 * @Date: 2021-02-24 13:43:41
 * @LastEditors: zk
 * @LastEditTime: 2021-09-09 17:32:18
 * @description: 
 */
let WSPRO = process.env.VUE_APP_REQUEST_URL.replace('http://', 'ws://').replace('https://', 'wss://');
export let BASE = {
  WSPRO
}
