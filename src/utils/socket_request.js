/*
 * @Author: zk
 * @Date: 2021-02-24 13:43:41
 * @LastEditors: zk
 * @LastEditTime: 2021-09-09 17:32:18
 * @description: 
 */
// let WSPRO = "ws://api.ourbim.com:11011/vjapi/";

// let WSPRO = "ws://api.ourbim.com:21012/vjapi/";
// let WSPRO = "ws://192.168.3.151:11011/vjapi/";
// let WSPRO = "ws://192.168.3.235:11011/vjapi/";

 //let WSPRO = "ws://192.168.100.56:11011/vjapi/";

// let WSPRO = "ws://cloud.ourbim.com:11011/vjapi/";

let WSPRO = process.env.VUE_APP_SOCKET_URL;
export let BASE = {
  WSPRO
}
