
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
