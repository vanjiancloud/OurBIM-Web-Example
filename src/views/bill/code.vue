<template>
  <!-- 授权码 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 主体内容 -->
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
        <!-- 授权码 -->
        <div class="neirong">
          <div class="title">
            授权码
          </div>
          <div class="input">
            授权码
            <el-input v-model="code" placeholder="请输入授权码"></el-input>
            <el-button type="primary" class="btn">验证</el-button>
            <div class="news">
                <div>*</div>
               如授权码不可用请联系售后
            </div>
            <div class="xiugai">
              <el-button type="primary">修改</el-button>
            </div>
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
  name: 'authorizationCode',
  data () {
    return {
      navList: [
        { name: '/bill', navItem: '个人信息' },
        { name: '/code', navItem: '授权码' },
        { name: '/order', navItem: '服务订单' },
        { name: '/team', navItem: '团队' },
        { name: '/changeCode', navItem: '修改密码' }
      ],
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
        .input {
          margin-left: 60px;
          margin-top: 20px;
          .el-input {
            width: 462px;
            margin-left: 20px;
            margin-right: 20px;
          }
          /deep/ .el-input__inner {
            width: 462px;
            height: 46px;
          }
          .news {
            width: 224px;
            height: 36px;
            margin-top: 10px;
            background-color: #EEEEEE;
            color: #ccc;
            text-align: center;
            line-height: 36px;
            div {
              color: red;
              float: left;
              font-size: 20px;
              margin-left: 5px;
              margin-top: 3px;
            }
          }
          .btn {
            width: 78px;
            height: 46px;
            background-color: #00aaf0;
          }
        }
        .xiugai {
          margin-top: 190px;
          text-align: center;
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
