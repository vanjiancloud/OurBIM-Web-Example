<template>
  <div class="login-container">
    <div class="picture">
      <img src="./img.png" alt="" />
    </div>
    <div class="right">
      <div class="login-form-wrap">
        <!-- .logo区域 -->
        <div class="login-head">
          <i class="el-icon-arrow-left" @click="toReturn"></i>
          <div class="logo">
            <img src="./logo.png" alt="" />
          </div>
        </div>
        <div class="state">
          <span>
            重置密码
          </span>
        </div>
        <!-- 短信登录的表单 -->

        <el-form :rules="rules" :model="form" ref="form" class="login-form">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入账号手机号码">
              <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
            </el-input>
          </el-form-item>

          <el-form-item prop="code">
            <el-input
              v-model="form.code"
              placeholder="请输入短信验证码"
              class="input"
            >
              <el-button
                style="padding-right:25px;padding-top:35px"
                slot="suffix"
                type="text"
                class="btnMes"
                :disabled="isSend"
                @click="getCode"
              >
                {{ btnMes }}
              </el-button>
              <i slot="prefix" class="el-input__icon el-icon-s-comment"></i>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              @click="toNext"
              type="primary"
              class="login-btn"
              :loading="isLoading"
              >下一步</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="wenzi">
      Copyright © 2021 www.OurBIM.com, <br> All Rights Reserved.
    </div>
  </div>
</template>

<script>
import { sendMsgCode, updateJudgeMsg } from '../../api/my'

export default {
  name: 'changepassword',

  data () {
    return {
      isSend: false, // 是否显示
      delay: 60, // 倒计时
      interId: null, // 定时器
      // 按钮的文本
      btnMes: '获取验证码',
      isLoading: false, // 是否正在登陆
      form: {
        mobile: '',
        code: '',
        msgType: '3'
      },
      // 定义验证规则rules
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|7|8][0-9]{9}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {
            pattern: /^\d{4}|\d{6}$/,
            message: '请输入合法的验证码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    delay: function (newVal, oldVal) {
      if (oldVal === 0) {
        clearInterval(this.interId)
        this.btnMes = '获取验证码'
        this.isSend = false
        this.delay = 60 // 倒计时
      }
    }
  },
  methods: {
    // 返回登录页
    toReturn () {
      this.$router.push('../../login')
    },

    // 跳转到重制密码
    toNext () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.remakePas()
        }
      })
    },

    // 重制密码
    remakePas () {
      updateJudgeMsg({
        mobile: this.form.mobile,
        code: this.form.code
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$router.push({
              name: 'newPassword',
              query: {
                mobile: this.form.mobile,
                code: this.form.code
              }
            })
          } else if (res.data.code === 2) {
            this.$message.error('该手机号未注册')
          } else if (res.data.code === 3) {
            this.$message.error('该账号未激活，请先去邮箱激活')
          } else {
            this.$message.error('您输入的验证码不正确')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('请检查网络或稍后重试')
        })
    },

    // 点击获取验证码
    getCode () {
      this.$refs.form.validateField('mobile', codeError => {
        if (!codeError) {
          this.toGetCode()
        }
      })
    },

    // 获取验证码
    toGetCode () {
      this.isSend = true
      this.btnMes = `发送验证码中...`
      sendMsgCode({
        mobile: this.form.mobile,
        msgType: this.form.msgType
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('获取成功')
            // 监听定时器
            this.interId = setInterval(() => {
              this.btnMes = `${this.delay}S后继续`
              this.delay--
            }, 1000)
          } else {
            this.$message.error('短信请求失败，您的操作过于频繁，请稍后在试')
          }
        })
        .catch(err => {
          console.log(err)

          this.$message.error('获取失败请重新获取')
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
    width: 795px;
    height: 945px;
    margin-left: -200px;
    margin-right: 350px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    width: 560px;
    height: 520px;
    background-color: #fff;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);
  }
  .login-form-wrap {
    width: 490px;
    // 输入框
    /deep/ .el-input__inner {
      height: 65px;
      margin-top: 25px;
      font-size: 20px;
      background-color: #f4f4f4;
      padding-left: 90px;
      color: #000;
    }
    // 输入框内图标
    /deep/ .el-input__icon {
      font-size: 25px;
      margin-top: 15px;
      margin-left: 36px;
    }
    // 按钮内文字
    /deep/ .el-button--primary {
      font-size: 25px;
    }
    .login-head {
      position: relative;
      display: flex;
      .logo {
        width: 185px;
        height: 46px;
        margin-top: 5px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .el-icon-arrow-left {
        color: #00aaf0;
        // padding-top: 10px;
        margin-right: 100px;
        font-size: 60px;
      }
    }
    .state {
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
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
        margin-top: 20px;
        border-radius: 30px;
        background-color: #00aaf0;
      }
      .input {
        margin-right: 10px;
      }
      .btnMes {
        width: 104px;
        height: 41px;
        margin-top: 15px;
      }
      span {
        padding-left: 20px;
        float: right;
        color: #00aaf0;
        display: inline;
      }
    }
  }
  .wenzi {
    width: 340px;
    position: fixed;
    bottom: 21px;
    text-align: center;
    color: #ccc;
    font-size: 16px;
  }
}
</style>
