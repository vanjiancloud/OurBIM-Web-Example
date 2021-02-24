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
          <div class="title">
            修改密码
          </div>
          <div class="message" style="margin-top: 30px;">
            <div class="one">原密码:</div>
            <div class="input">
              <el-input v-model="id" placeholder="请输入原密码"></el-input>
            </div>
          </div>
          <div class="message" style="margin-top: 30px;">
            <div class="one">新密码:</div>
            <div class="input">
              <el-input v-model="id" placeholder="请输入新密码"></el-input>
            </div>
          </div>
          <div class="message" style="margin-top: 30px;">
            <div class="one">确认密码:</div>
            <div class="input">
              <el-input v-model="id" placeholder="请再次输入密码"></el-input>
            </div>
          </div>
          <div class="message" style="margin-top: 30px;">
            <div class="one">手机号:</div>
            <div class="input">
              <el-input v-model="id" placeholder="请输入手机号"></el-input>
            </div>
          </div>
          <div class="message" style="margin-top: 30px;">
            <div class="one">验证码:</div>
            <div class="input">
              <el-input v-model="id" placeholder="请输入验证码">
                <el-button
              style="padding-right:25px;color:#00AAF0;"
              slot="suffix"
              type="text"
              :disabled="isSend"
              @click="getVerification"
            >
              发送验证码
            </el-button>
              </el-input>
            </div>
          </div>
          <div class="btn">
            <el-button type="primary">修改</el-button>
          </div>
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
      oldCode: '',
      newCode: '',
      mobile: '',
      code: ''
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
        height: 1037px;
        .title {
          height: 54px;
          line-height: 54px;
          margin-left: -40px;
          font-size: 22px;
          font-weight: bold;
          border-bottom: 1px solid #f1f1f1;
        }
        .message {
          width: 660px;
          height: 46px;
          margin-bottom: 30px;
          .one {
            float: left;
            height: 46px;
            width: 80px;
            line-height: 46px;
            margin-right: 35px;
            margin-left: 56px;
          }
          .input {
            float: left;
          }
          /deep/ .el-input__inner {
            width: 460px;
            height: 46px;
          }
        }
        .btn {
          margin-left: 300px;
          /deep/ .el-button--primary {
            width: 140px;
            height: 40px;
            background-color: #00aaf0;
          }
        }
      }
    }
  }
}
</style>
