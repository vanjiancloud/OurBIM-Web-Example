<template>
  <div class="login-container">
    <div class="picture">
      <img src="./img.png" alt="" />
    </div>
    <div class="login-form-wrap">
      <!-- .logo区域 -->
      <div class="login-head">
        <div class="icon">
          <img src="./sicon.png" alt="" />
        </div>
        <div class="logo">
          <img src="./logo.png" alt="" />
        </div>
      </div>
      <!-- 登录的不同状态 -->
      <div class="state">
        <span
          @click="isshow = 0"
          :class="{ color: isshow == 0 }"
          style="font-size: 20px;"
        >
          邮箱登录
        </span>
        <span
          @click="isshow = 1"
          :class="{ color: isshow == 1 }"
          style="font-size: 20px;"
        >
          短信登录
        </span>
      </div>
      <!-- 邮箱登录的表单 -->
      <el-form
        :rules="rules"
        :model="form"
        ref="form"
        class="login-form"
        v-show="isshow == 0"
      >
        <!--  邮箱密码通过双向绑定获取 -->
        <el-form-item prop="email">
          <div style="color:#999999;font-size: 18px;">
            邮箱
          </div>
          <el-input v-model="form.email" placeholder="请输入邮箱">
            <i slot="prefix" class="el-input__icon el-icon-message"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <div style="color:#999999;font-size: 18px;">
            密码
          </div>
          <el-input
            v-model="form.password"
            placeholder="请输入登录密码"
            type="password"
          >
            <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="isAgree">
          <el-checkbox
            class="checkbox"
            label="记住登录邮箱"
            name="type"
            v-model="form.isAgree"
          ></el-checkbox>
          <span @click="changePassword" style="font-size: 16px;"
            >忘记密码?</span
          >
          <span @click="register" style="font-size: 16px;">注册新用户</span>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="emailLogin"
            type="primary"
            class="login-btn"
            :loading="isLoading"
            >登陆</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 短信登录的表单 -->
      <el-form
        :rules="rules"
        :model="mobForm"
        ref="mobForm"
        class="login-form"
        v-show="isshow == 1"
      >
        <!--  手机号验证码通过双向绑定获取里面的值 -->
        <el-form-item prop="mobile">
          <div style="color:#999999;font-size: 18px;">手机号</div>
          <el-input v-model="mobForm.mobile" placeholder="请输入手机号">
            <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div style="color:#999999;font-size: 18px;">
            验证码
          </div>
          <el-input
            v-model="mobForm.code"
            placeholder="请输入短信验证码"
            class="input"
          >
            <el-button
              style="padding-right:25px;padding-top:35px"
              slot="suffix"
              type="text"
              :disabled="isSend"
              @click="getVerification"
            >
              发送验证码
            </el-button>
            <i slot="prefix" class="el-input__icon el-icon-s-comment"></i>
          </el-input>
          <!-- <el-button
            class="btnMes"
            :disabled="isSend"
            @click="getVerification"
            type="primary"
            >{{ btnMes }}</el-button
          > -->
        </el-form-item>
        <el-form-item prop="isAgree">
          <el-checkbox
            class="checkbox"
            label="记住登录手机号"
            name="type"
            v-model="mobForm.checkbox"
          ></el-checkbox>
          <span @click="changePassword" style="font-size: 16px;"
            >忘记密码?</span
          >
          <span @click="register" style="font-size: 16px;">注册新用户</span>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="Mobilelogin"
            type="primary"
            class="login-btn"
            :loading="isLoading"
            >登录</el-button
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
import { sendMsgCode, login, loginMobile } from '@/api/my.js'
import {setuserid} from '@/store/index.js'
// const Base64 = require('js-base64').Base64
export default {
  data () {
    return {
      isSend: false, // 是否显示
      delay: 0, // 倒计时
      btnMes: '获取验证码', // 按钮的文本
      mobForm: {
        mobile: '',
        code: '',
        msgType: '2', // 验证状态
        checkbox: false // 复选框的状态
      },
      isshow: 0, // 切换登录类别
      isLoading: false, // 是否正在登陆
      form: {
        isAgree: false, // 复选框的状态
        password: '123456',
        email: 'aa@vanjian.com'
      },
      // 定义验证规则rules
      rules: {
        email: [
          { required: true, message: '请输入合法邮箱', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|7|8][0-9]{9}$/,
            message: '请输入正确的11位手机号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码,已字符为英文&数字&英文符号，位数6-20',
            trigger: 'blur'
          },
          {
            pattern: /^[\w.]{6,20}$/,
            message: '您输入的账号或不正确',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          {
            pattern: /^\d{4}|\d{6}$/,
            message: '您输入的验证码不正确',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 注册新用户
    register () {
      this.$router.push('../../register')
    },
    // 忘记密码
    changePassword () {
      this.$router.push('../../changePassword')
    },
    // 点击邮箱登录
    emailLogin () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.doLogin()
        }
      })
    },
    // 邮箱登录
    doLogin () {
      login({
        email: this.form.email,
        password: this.form.password
      })
        .then(res => {
          console.log(res)
          console.log(res.data.data.userid)
          if (res.data.code === 0) {
            this.$message.success('恭喜登陆成功')
            this.setCookie('email', this.form.email)
            this.setCookie('password', this.form.password)
            // 存储用户信息userid
            setuserid(res.data.data.userid)
            this.setCookie('userid', res.data.data.userid)
            this.$router.push('../userCenter')
            this.setUserInfo()
          } else if (res.data.code === 2) {
            this.$message.error('登录失败,请去激活')
          } else {
            this.$message.error('用户名或密码不正确，请重新输入')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('登陆失败，用户名密码错误')
        })
    },
    // cookie邮箱
    setUserInfo: function () {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.form.isAgree) {
        this.setCookie('email', this.form.email)
        // base64加密密码
        this.setCookie('password', this.form.password)
        // const passWord = Base64.encode(this.form.password)
        // this.setCookie('isAgree', passWord)
      } else {
        this.setCookie('email', '')
        this.setCookie('password', '')
      }
    },
    // cookie手机
    getUserInfo: function () {
      if (this.mobForm.checkbox) {
        this.setCookie('mobile', this.mobForm.mobile)
      } else {
        this.setCookie('mobile', '')
      }
    },
    // 获取cookie
    getCookie: function (key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ''
    },
    // 保存cookie
    setCookie: function (cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie =
        cName +
        '=' +
        decodeURIComponent(value) +
        (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
    },
    // 点击手机登录
    Mobilelogin () {
      this.$refs.mobForm.validate(valid => {
        if (valid) {
          this.mobLogin()
        }
      })
    },
    // 手机登录接口
    mobLogin () {
      loginMobile({
        mobile: this.mobForm.mobile,
        code: this.mobForm.code
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('恭喜登录成功')
            this.setCookie('mobile', this.mobForm.mobile)
            this.$router.push('../userCenter')
            this.getUserInfo()
          } else if (res.data.code === 2) {
            this.$message.error('登录失败,请去激活')
          } else if (res.data.code === 1) {
            this.$message.error('验证码验证失败')
          } else {
            this.$message.error('验证码验证失败，您的操作过于频繁，请稍后再试')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('验证码验证失败')
        })
    },
    // 点击获取验证码
    getVerification () {
      this.$refs.mobForm.validateField('mobile', codeError => {
        // 验证通过把结构赋值写载这里
        if (!codeError) {
          this.toGetCode()
        }
      })
    },
    // 获取验证码
    toGetCode () {
      sendMsgCode({
        mobile: this.mobForm.mobile,
        msgType: this.mobForm.msgType
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('获取成功')
            this.delay = 60
            this.btnMes = `${this.delay}S后继续`
            this.isSend = true
            // 开启定时器
            const interId = setInterval(() => {
              this.delay--
              if (this.delay === 0) {
                clearInterval(interId)
                this.btnMes = '获取验证码'
                this.isSend = false
                return
              }
              this.btnMes = `${this.delay}S后继续`
            }, 1000)
          } else if (res.data.code === 1) {
            this.$message.error('短信请求失败')
          } else {
            this.$message.error('短信请求失败，您的操作过于频繁，请稍后在试')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('获取失败')
        })
    }
  },
  // 在页面加载时从cookie获取登录信息
  created () {
    const email = this.getCookie('email')
    const password = this.getCookie('password')
    const mobile = this.getCookie('mobile')
    console.log(mobile)
    // 如果存在赋值给表单，并且将记住密码勾选
    if ((email, mobile)) {
      this.form.email = email
      this.form.password = password
      // this.form.isAgree = true
      this.mobForm.mobile = mobile
      // this.mobForm.checkbox = true
    }
  }
}
</script>

<style scoped lang="less">
// 书写样式铺满整
body,
html {
  font-size: 0;
}
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
  vertical-align: middle;
  background-image: url(./bg.png);
  background-size: cover;
  .picture {
    float: left;
    width: 625px;
    height: 802px;
    margin-right: 623px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .login-form-wrap {
    // 错误提示
    /deep/ .el-form-item__error {
      position: absolute;
      left: 0;
      bottom: 0;
    }
    // 输入框
    /deep/ .el-input__inner {
      height: 65px;
      margin-top: 25px;
      font-size: 20px;
      background-color: transparent;
      padding-left: 90px;
      color: #fff;
    }
    /deep/ .el-checkbox__label {
      font-size: 20px;
    }
    /deep/ .el-checkbox__inner {
      width: 20px;
      height: 20px;
      background-color: transparent;
    }
    // 输入框内图标
    /deep/ .el-input__icon {
      font-size: 25px;
      margin-top: 15px;
      margin-left: 36px;
    }
    /deep/ .el-checkbox__inner::after {
      width: 9px;
      height: 13px;
    }
    float: right;
    width: 520px;
    height: 636px;
    .login-head {
      position: relative;
      display: flex;
      .logo {
        width: 250px;
        height: 65px;
        margin-left: 130px;
        margin-bottom: 60px;
        margin-top: -10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .state {
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 30px;
      cursor: pointer;
      span {
        color: #999999;
      }
      .color {
        color: #0097fe;
        border-bottom: 1px solid #0097fe;
        border-width: 2px;
      }
      span {
        padding-right: 20px;
        border-bottom: 1px solid #e9e9e9;
        border-width: 2px;
        padding: 30px 70px 15px 70px;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
        height: 60px;
        margin-top: 40px;
        font-size: 25px;
      }
      .btnMes {
        height: 50px;
        margin-top: 15px;
      }
      .input {
        width: 100%;
        margin-right: 10px;
      }
      span {
        padding-left: 20px;
        float: right;
        color: #0097fe;
        display: inline;
        cursor: pointer;
      }
      .checkbox {
        color: #999999;
        span {
          cursor: pointer;
        }
      }
      .tips {
        color: #0097de;
      }
    }
  }
  .wenzi {
    width: 100%;
    color: #999999;
    position: fixed;
    bottom: 21px;
    text-align: center;
    font-size: 12px;
  }
}
</style>
