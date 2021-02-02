<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    router="true"
    background-color="#f9f9f9"
    text-color="#000"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="1" route="./apply">我的应用</el-menu-item>
    <el-menu-item index="2" route="./issue">我的发布</el-menu-item>
    <el-menu-item index="3" route="./manage">应用管理</el-menu-item>
    <el-menu-item index="4" route="./found">创建应用</el-menu-item>
    <el-menu-item index="5" route="./account">账户管理</el-menu-item>
  </el-menu>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.el-menu-demo {
  height: 85px;
}
</style>
