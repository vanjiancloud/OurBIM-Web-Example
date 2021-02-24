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
          <div class="message" style="margin-top: 30px;">
            <div class="one">ID:</div>
            <div class="input">
              <el-input v-model="id" placeholder="请输入ID"></el-input>
            </div>
          </div>
          <div class="message">
            <div class="one">签名:</div>
            <div class="input">
              <el-input v-model="name" placeholder="请输入签名"></el-input>
            </div>
          </div>
          <div class="message">
            <div class="one">邮箱:</div>
            <div class="input">
              <el-input v-model="email" placeholder="请输入邮箱"></el-input>
            </div>
          </div>
          <div class="message">
            <div class="one">手机号:</div>
            <div class="input">
              <el-input v-model="mobile" placeholder="请输入手机号"></el-input>
            </div>
          </div>
          <div class="message">
            <div class="one">公司:</div>
            <div class="input">
              <el-input v-model="company" placeholder="请输入公司"></el-input>
            </div>
          </div>
          <div class="message">
            <div class="one">职位:</div>
            <div class="input">
              <el-input v-model="position" placeholder="请输入职位"></el-input>
            </div>
          </div>
          <div class="photo">
            上传头像
          </div>
          <div class="btn">
            <el-button type="primary" @click="changeUserInfo">修改</el-button>
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
import { getUserInfo } from '@/api/my.js'
// import { modifyUserInfo } from '@/api/my.js'
// import { uploadImg } from '@/api/my.js'
import { getuserid } from '@/store/index.js'

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
      name: '', //签名
      email: '',
      mobile: '',
      company: '',
      position: '' //职位
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取用户信息
    getData () {
      getUserInfo({
        userid: getuserid()
      })
        .then(res => {
          console.log(res)
          this.id = res.data.data.id
          this.name = res.data.data.name
          this.email = res.data.data.email
          this.mobile = res.data.data.mobile
          this.company = res.data.data.company
          this.position = res.data.data.position
        })
        .catch(err => {
          this.$message.error('请求失败')
        })
    },
    //修改用户信息
    changeUserInfo () {
      modifyUserInfo({
        userid: getuserid(),
        id: this.id,
        name: this.name,
        email: this.email,
        mobile: this.mobile,
        company: this.company,
        position: this.position
      })
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success('修改成功')
          } else if (res.data.code === 1) {
            this.$message.error('修改失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('修改信息失败,请重新修改')
        })
    },
    //上传头像
    updata () {
      uploadImg()
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          this.message.error('上传失败')
        })
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
            width: 60px;
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
