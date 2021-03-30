<!--
 * @Author: zk
 * @Date: 2021-02-20 13:30:47
 * @LastEditors: zk
 * @LastEditTime: 2021-03-26 17:59:00
 * @description: 
-->
<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>

import { delCookie } from "@/utils/cookie";
export default {
  name: 'App',
  data() {
    return {
      beginTime: 0,
      differTime: 0
    }
  },
  mounted(){
    window.addEventListener("unload", e => {
      this.differTime = new Date().getTime() - this.beginTime;
        if(this.differTime <= 5) {
            // console.log("浏览器关闭")
            delCookie("userInfo")             
        }else{
            // console.log("浏览器刷新")
        }
    })
    window.addEventListener('beforeunload', e => {
      this.beginTime = new Date().getTime();
    })
  },
}
</script>

<style></style>
