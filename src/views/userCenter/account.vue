<template>
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 内容 -->
    <my-main></my-main>
    <!-- 需要写的内容 -->
    <div class="content">
      <el-tabs type="border-card" tab-position="left">
        <el-tab-pane label="用户管理">
          <div class="demo">
            用户管理
          </div>
          <span slot="label"><i class="el-icon-date"></i> 我的行程</span>
        </el-tab-pane>
        <el-tab-pane label="配置管理">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
      </el-tabs>
      <!-- dwadwdddw -->
      <!-- 垂直菜单 -->
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!-- 尾部 -->
    <!-- 666666 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import myMain from '../components/my-main.vue'
import myHeader from '../components/my-header.vue'
import MyFooter from '../components/my-footer.vue'

export default {
  components: { myMain, myHeader, MyFooter },
  data () {
    return {}
  },
  methods: {
    handleClick () {
      alert('button click')
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  .content {
    height: 500px;
    width: 1300px;
    margin-left: 60px;
    background-color: palevioletred;
    .demo {
      width: 400px;
      height: 300px;
      background-color: red;
    }
  }
}
</style>
