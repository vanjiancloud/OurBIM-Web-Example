<template>
    <div class="header">
      <!-- logo -->
      <div class="logo">
        <img src="./logo.png" alt="" class="img" />
      </div>
      <!-- 导航 -->
      <div class="nav">
        <el-menu
          :default-active="activeIndex"
          class="demo"
          router="true"
          mode="horizontal"
          @select="handleSelect"
          active-text-color="#1890FF"
        >
          <el-menu-item index="1" route="">功能介绍</el-menu-item>
          <el-menu-item index="2" route="">解决方案</el-menu-item>
          <el-menu-item index="3" route="">成功案例</el-menu-item>
          <el-menu-item index="4" route="">产品订价</el-menu-item>
          <el-menu-item index="5" route="">最新咨询</el-menu-item>
          <el-submenu index="6">
            <template slot="title">开发者</template>
            <el-menu-item index="6-1">API文档</el-menu-item>
            <el-menu-item index="6-2">示例项目</el-menu-item>
            <el-menu-item index="6-3">模型中心</el-menu-item>
            <el-menu-item index="6-4">服务中心</el-menu-item>
            <el-menu-item index="6-5">更新日志</el-menu-item>
          </el-submenu>
          <el-menu-item index="7">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                全部
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">全部</el-dropdown-item>
                <el-dropdown-item command="b">资讯</el-dropdown-item>
                <el-dropdown-item command="c">案例</el-dropdown-item>
                <el-dropdown-item command="d">活动</el-dropdown-item>
                <el-dropdown-item command="e">模型</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-input
              v-model="input"
              placeholder="请输入搜索内容"
              class="input"
            ></el-input>
            <i class="el-icon-search"></i>
          </el-menu-item>
          <el-menu-item index="8" route="../login">
            <i class="el-icon-s-custom"></i>登录
          </el-menu-item>
          <el-menu-item index="9" route="../register">
            <i class="el-icon-edit"></i>注册
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 国际化 -->
      <div class="national">
        <a href="">EN</a><br />
        <a href="">中文(CH)</a>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      input: ''
    }
  },
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
    }
  }
}
</script>

<style lang="less" scoped>
  .header {
    width: 100%;
    height: 100px;
    background-color: #fff;
    .logo {
      width: 240px;
      height: 80px;
      float: left;
      margin-left: 25px;
      // margin-right: 15px;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .nav {
      float: left;

      .input {
        width: 200px;
      }
      .demo {
        margin-top: 20px;
      }
    }
    .national {
      padding-top: 25px;
    }
  }
</style>
