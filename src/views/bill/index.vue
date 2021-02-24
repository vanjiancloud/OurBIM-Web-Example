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
        <!-- 个人信息 -->
        <div class="neirong">
          <div class="title">
            个人信息
          </div>
          <div class="id">
            ID:<el-input v-model="id" placeholder="请输入ID" class="id"></el-input>
          </div>
          <div>
            签名:<el-input v-model="name" placeholder="请输入签名"></el-input>
          </div>
          <div>
            邮箱:<el-input v-model="email" placeholder="请输入邮箱"></el-input>
          </div>
          <div>
            手机号:<el-input
              v-model="mobile"
              placeholder="请输入手机号"
            ></el-input>
          </div>
          <div>
            公司:<el-input v-model="company" placeholder="请输入公司"></el-input>
          </div>
          <div>
            职位:<el-input v-model="post" placeholder="请输入职位"></el-input>
          </div>
          <el-button type="primary">修改</el-button>
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
      ],
      id: '',
      name: '',
      email: '',
      mobile: '',
      company: '',
      post: ''

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
        padding-left: 300px;
        background-color: red;
        height: 1037px;
        .title {
          // background-color: deeppink;
          height: 54px;
          line-height: 54px;
          margin-left: -40px;
          font-size: 22px;
          font-weight: bold;
          border-bottom: 1px solid #f1f1f1;
        }
        div {
          margin-left: 50px;
          margin-bottom: 20px;
        }
        .el-input {
          width: 400px;
        }
        .id {
          margin-left: 50px;
        }
      }
    }
  }
}
</style>
