<template>
  <!-- 授权码 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
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
                <span>{{ $t('accountManage') }}</span>
              </template>
              <el-menu-item index="/bill">
                <span slot="title">{{ $t('information') }}</span>
              </el-menu-item>
              <el-menu-item index="/code">
                <span slot="title">{{
                  $t('Authorization')
                }}</span> </el-menu-item
              ><el-menu-item index="/order">
                <span slot="title">{{ $t('Serviceorder') }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <div class="color"></div>
        <!-- 授权码 -->
        <div class="neirong">
          <div class="title">
            {{ $t('Authorization') }}
            <!-- 授权码 -->
          </div>
          <div class="input">
            {{ $t('Authorizations') }}
            <!-- 授权码 -->
            <el-input v-model="SQM"></el-input>
            <el-button type="primary" class="btn" @click="verification">
              <!-- 验证 -->
              {{ $t('verification') }}
            </el-button>
            <div class="news">
              <span>*</span>
              <!-- 联系售后 -->
              {{ $t('nouse') }}
            </div>
          </div>
          <!-- 提交按钮 -->
          <div class="submit">
            <el-button type="primary" :disabled="dis" @click="update">
              {{ $t('submit') }}
            </el-button>
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
import { updateSQM, verification } from '@/api/my.js'
// import { verification } from '@/api/my.js'
import { getuserid } from '@/store/index.js'

export default {
  components: { myHeader, MyFooter },
  name: 'authorizationCode',
  data () {
    return {
      SQM: '',
      dis: true
    }
  },
  methods: {
    // 验证授权码
    verification () {
      verification({
        userid: getuserid(),
        SQM: this.SQM
      })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res)
            this.$message.success('授权码验证成功')
            this.dis = false
          } else if (res.data.code === 1) {
            console.log(res)
            this.$message.error('授权码验证失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('授权码验证失败,请重新填写')
        })
    },
    // 提交授权码
    update () {
      updateSQM({
        userid: getuserid(),
        SQM: this.SQM
      })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res)
            this.$message.success('提交授权码成功')
          } else if (res.data.code === 1) {
            console.log(res)
            this.$message.error('提交授权码失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('授权码提交失败,请重新提交')
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
      /deep/ .el-submenu__title * {
        font-size: 17px;
      }
      /deep/ .el-menu-item {
        font-size: 17px;
      }
      .color {
        width: 25px;
        height: 1037px;
        float: left;
        background-color: #f1f1f1;
      }
      .neirong {
        // padding-left: 300px;
        height: 1037px;
        .title {
          height: 54px;
          text-align: center;
          line-height: 54px;
          margin-left: -40px;
          font-size: 22px;
          font-weight: bold;
          border-bottom: 1px solid #f1f1f1;
        }
        .input {
          margin-left: 360px;
          margin-top: 20px;
          .el-input {
            width: 462px;
            margin-right: 20px;
          }
          /deep/ .el-input__inner {
            width: 462px;
            height: 46px;
            font-size: 16px;
          }
          .news {
            margin-top: 10px;
            // background-color: #eeeeee;
            color: #ccc;
            line-height: 36px;
            span {
              color: red;
              float: left;
              font-size: 20px;
              margin-right: 5px;
              margin-top: 3px;
            }
          }
          .btn {
            height: 46px;
            background-color: #00aaf0;
            font-size: 16px;
          }
        }
        .submit {
          margin-top: 190px;
          text-align: center;
          /deep/ .el-button--primary {
            height: 40px;
            width: 140px;
            font-size: 17px;
          }
        }
      }
    }
  }
}
</style>
