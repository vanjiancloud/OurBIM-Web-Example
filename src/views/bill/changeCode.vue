<template>
  <!-- 账单管理 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 自己写 -->
    <div class="container">
      <div class="content">
        <!-- 导航菜单 -->
        <el-col :span="4">
          <el-menu
            :default-active="this.$route.path"
            router
            background-color="#007BAE"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>账户管理</span>
              </template>
              <el-menu-item
                v-for="(item, i) in navList"
                :key="i"
                :index="item.name"
              >
                {{ item.navItem }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <div class="color"></div>
        <!-- 修改密码 -->
        <div class="neirong">
          <h2>修改密码 </h2>
          <div>
            原密码:<el-input v-model="input" placeholder="请输入原密码"></el-input>
          </div>
          <div>
            新密码:<el-input v-model="input" placeholder="请输入新密码"></el-input>
          </div>
          <div>
            确认密码:<el-input v-model="input" placeholder="请再次输入密码"></el-input>
          </div>
          <div>
            手机号:<el-input
              v-model="input"
              placeholder="请输入手机号"
            ></el-input>
          </div>
          <div>
            验证码:<el-input v-model="input" placeholder="请输入验证码"></el-input>
          </div>
          <el-button type="primary">主要按钮</el-button>
        </div>
      </div>
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
import MyMain from '../components/myMain.vue'
export default {
  components: { myHeader, MyMain, MyFooter },
  data () {
    return {
      navList: [
        { name: '/bill', navItem: '个人信息' },
        { name: '/code', navItem: '授权码' },
        { name: '/order', navItem: '服务订单' },
        { name: '/team', navItem: '团队' },
        { name: '/changeCode', navItem: '修改密码' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    background-color: #fff;
    margin-bottom: 34px;
    height: 1037px;
    .content {
      overflow: hidden;
      ul.el-menu {
        height: 1037px;
      }
      .color {
        width: 25px;
        height: 1037px;
        float: left;
        background-color: #f1f1f1;
      }
      .neirong {
        float: left;
        .el-input {
          width: 400px;
        }
        h2 {
          margin-top: 22px;
          margin-left: 41px;
          margin-bottom: 49px;
        }
      }
      .xia {
        text-align: center;
        margin-bottom: 100px;
      }
    }
  }
}
</style>
