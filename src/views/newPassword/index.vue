<template>
  <div class="login-container">
    <div class="picture">
      <img src="./img.png" alt="" />
    </div>
    <div class="login-form-wrap">
      <!-- .logo区域 -->
      <div class="login-head">
        <i class="el-icon-arrow-left" @click="toReturn"></i>
        <span class="logo">
          <img src="./logo.png" alt="" />
        </span>
      </div>
      <div class="state">
        <span>
          设置新密码
        </span>
      </div>
      <el-form :rules="rules" :model="form" ref="form" class="login-form">
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="请输入6至20位密码">
            <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="toPassword">
          <el-input
            v-model="form.toPassword"
            placeholder="请再次输入密码"
            class="input"
          >
            <i slot="prefix" class="el-input__icon el-icon-message"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="toNext" type="primary" class="login-btn"
            >下一步</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="wenzi">
      Copyright © 2021 www.OurBIM.com, All Rights Reserved.
    </div>
  </div>
</template>

<script>
import { updatePassword } from '../../api/my'
export default {
  name: 'newPassword',
  data () {
    return {
      isLoading: false, // 是否正在登陆
      form: {
        password: '',
        toPassword: '',
        mobile: this.$route.query.mobile,
        code: this.$route.query.code
      },
      // 定义验证规则rules
      rules: {
        password: [
          {
            required: true,
            message: '请设置密码,字符为英文&数字&英文符号，位数6-20',
            trigger: 'blur'
          },
          {
            pattern: /^[\w.]{6,20}$/,
            message: '请设置密码,字符为英文&数字&英文符号，位数6-20',
            trigger: 'blur'
          }
        ],
        toPassword: [
          {
            required: true,
            message: '请再次输入您设置的密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 返回登录页
    toReturn () {
      this.$router.push('../../changepassword')
    },
    // 跳转到成功页面
    toNext () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.newPas()
        }
      })
    },
    // 成功页面
    newPas () {
      updatePassword({
        mobile: this.form.mobile,
        code: this.form.code,
        password: this.form.password
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$router.replace('../../resetSucceed')
          } else {
            this.$message.error('验证码验证失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('验证码验证失败')
        })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(./bg.png);
  background-size: cover;
  .picture {
    float: left;
    width: 652px;
    height: 802px;
    margin-right: 300px;
    margin-left: 206px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .login-form-wrap {
    margin-right: 220px;
    float: left;
    width: 520px;
    height: 636px;
    /deep/ .el-form-item__error {
      position: absolute;
      left: 0;
      bottom: 0;
    }
    /deep/ .el-input__inner {
      height: 65px;
      margin-top: 25px;
      font-size: 20px;
      background-color: transparent;
      padding-left: 90px;
      color: #fff;
    }
    // 输入框内图标
    /deep/ .el-input__icon {
      font-size: 25px;
      margin-top: 15px;
      margin-left: 36px;
    }
    /deep/ .el-checkbox__label {
      font-size: 20px;
    }
    /deep/ .el-checkbox__inner {
      width: 20px;
      height: 20px;
      background-color: transparent;
    }
    /deep/ .el-input__icon {
      font-size: 25px;
      margin-top: 15px;
    }
    /deep/ .el-checkbox__inner::after {
      width: 9px;
      height: 13px;
    }
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 223px;
        height: 46px;
        margin: 0 auto;
        margin-left: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .el-icon-arrow-left {
        color: #0097fe;
        font-size: 60px;
        margin-top: -5px;
      }
    }
    .state {
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 30px;
      span {
        padding-right: 20px;
        padding: 15px 70px 15px 70px;
        color: #999999;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
        height: 60px;
        font-size: 22px;
        margin-top: 30px;
      }
      span {
        padding-left: 20px;
        float: right;
        color: #0097fe;
        display: inline;
      }
    }
  }
  .wenzi {
    width: 100%;
    color: #999999;
    position: fixed;
    bottom: 21px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
