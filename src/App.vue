<!--
 * @Author: zk
 * @Date: 2021-02-20 13:30:47
 * @LastEditors: zk
 * @LastEditTime: 2021-04-07 13:06:55
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

export default {
  name: 'App',
  data() {
    return {
      beginTime: 0,
      differTime: 0
    }
  },
  mounted(){
    
  },
}
</script>

<style></style>
