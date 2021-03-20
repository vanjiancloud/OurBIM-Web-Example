<template>
  <div class="login-container">
    <div class="picture">
      <img src="./img.png" alt="" />
    </div>
    <div class="right">
      <div class="login-form-wrap">
        <!-- .logo区域 -->
        <div class="login-head">
          <a href="http://www.ourbim.com:7011/">
            <i class="el-icon-arrow-left"></i>
          </a>

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
            <div style="color:#000;font-size: 20px;">
              邮箱
            </div>
            <el-input v-model="form.email" placeholder="请输入邮箱">
              <i slot="prefix" class="el-input__icon el-icon-message"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <div style="color:#000;font-size: 20px;">
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
            <span @click="changePassword" style="font-size: 16px;color:#00aaf0;"
              >忘记密码?</span
            >
            <span @click="register" style="font-size: 16px;color:#00aaf0;"
              >注册新用户</span
            >
          </el-form-item>
          <el-form-item>
            <el-button
              @click="emailLogin"
              type="primary"
              class="login-btn"
              :loading="isLoading"
              >登录</el-button
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
            <div style="color:#000;font-size: 20px;">手机号</div>
            <el-input v-model="mobForm.mobile" placeholder="请输入手机号">
              <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div style="color:#000;font-size: 20px;">
              验证码
            </div>
            <el-input
              v-model="mobForm.code"
              placeholder="请输入短信验证码"
              class="input"
            >
              <!-- 验证码按钮 -->
              <el-button
                slot="suffix"
                style="padding-right:25px;padding-top:47px;"
                :disabled="isSend"
                @click="getVerification"
                type="text"
                >{{ btnMes }}</el-button
              >
              <i slot="prefix" class="el-input__icon el-icon-s-comment"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox
              class="checkbox"
              label="记住登录手机号"
              name="type"
              v-model="mobForm.checkbox"
            ></el-checkbox>
            <span @click="changePassword" style="font-size: 16px;color:#00aaf0;"
              >忘记密码?</span
            >
            <span @click="register" style="font-size: 16px;color:#00aaf0;"
              >注册新用户</span
            >
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
    </div>
    <div class="wenzi">
      Copyright © 2021 www.OurBIM.com, All Rights Reserved.
    </div>
  </div>
</template>

<script>
import { sendMsgCode, login, loginMobile } from '@/api/my.js'
import { setuserid } from '@/store/index.js'
import { Setuserid } from '@/store/index.js'

import { setemail, getemail, delemail } from '@/store/index.js'
import { setmobile, getmobile, delmobile } from '@/store/index.js'

// const Base64 = require('js-base64').Base64
export default {
  name: 'Logoin',
  data () {
    return {
      isSend: false, // 是否显示
      delay: 0, // 倒计时
      btnMes: '获取验证码', // 按钮的文本
      // 邮箱登录表单
      form: {
        isAgree: false, // 复选框的状态
        password: '',
        email: ''
      },
      // 手机登录表单
      mobForm: {
        mobile: '',
        code: '',
        msgType: '2', // 验证状态
        checkbox: false // 复选框的状态
      },
      isshow: 0, // 切换登录类别
      isLoading: false, // 是否正在登录
      // 定义验证规则rules
      rules: {
        email: [
          { required: true, message: '请输入正确邮箱', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[0-9]{1}[0-9]{9}$/,
            message: '请输入正确的11位手机号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码,字符为英文&数字&英文符号，位数6-20',
            trigger: 'blur'
          },
          {
            pattern: /^[\w.]{6,20}$/,
            message: '请输入密码,字符为英文&数字&英文符号，位数6-20',
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
  created () {
    // 记住登录邮箱
    if (localStorage.getItem('email')) {
      this.form.email = getemail()
      console.log(this.form.isAgree)
      this.form.isAgree = true
    } else if (localStorage.getItem('email') === null) {
      this.form.email = ''
    }

    // 记住登录手机号
    if (localStorage.getItem('mobile')) {
      this.mobForm.mobile = getmobile()
      console.log(this.mobForm.checkbox)
      this.mobForm.checkbox = true
    } else if (localStorage.getItem('mobile') === null) {
      this.mobForm.mobile = ''
    }

    //回车登录
    var that = this
    document.onkeydown = function (e) {
      var key = window.event.keyCode
      if (key == 13) {
        //自己写的登录方法，点击事件
        that.emailLogin()
        that.Mobilelogin()
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
    // 点击手机登录
    Mobilelogin () {
      this.$refs.mobForm.validate(valid => {
        if (valid) {
          this.mobLogin()
        }
      })
    },
    // 邮箱登录接口
    doLogin () {
      login({
        email: this.form.email,
        password: this.form.password
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success(res.data.message)
            sessionStorage.setItem("userInfo", JSON.stringify(res.data.data))
            console.log(res.data.data)
            // 存储用户信息userid，到localStorage
            setuserid(res.data.data.userid)
            setemail(this.form.email)
            // 存储用户信息userid，到sessionStorage
            Setuserid(res.data.data.userid)
            console.log(this.form.isAgree)
            if (this.form.isAgree === false) {
              delemail()
            }
            this.$router.push('../userCenter')
          } else if (res.data.code === 2) {
            this.$message.warning(res.data.message)
          } else {
            this.$message.error('用户名或密码不正确，请重新输入')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('登录失败，该账号未注册')
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
            this.$message.success(res.data.message)
            // 存储用户信息userid，到localStorage
            sessionStorage.setItem("userInfo", JSON.stringify(res.data.data))
            setuserid(res.data.data.userid)
            // 存储用户信息userid，到sessionStorage
            Setuserid(res.data.data.userid)
            setmobile(this.mobForm.mobile)
            if (this.mobForm.checkbox === false) {
              delmobile()
            }
            this.$router.push('../userCenter')
          } else if (res.data.code === 2) {
            this.$message.warning(res.data.message)
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
    // 取cookie
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
    // 存cookie
    setCookie: function (cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie =
        cName +
        '=' +
        decodeURIComponent(value) +
        (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
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
  watch: {
    $route (to, from) {
      if (this.form.isAgree === false) {
        this.form.email = ''
        this.form.password = ''
      } else if (this.form.isAgree === true) {
        this.form.password = ''
      }

      if (this.mobForm.checkbox === false) {
        this.mobForm.mobile = ''
        this.mobForm.code = ''
      } else if (this.mobForm.checkbox === true) {
        this.mobForm.code = ''
      }
    }
  }
}
</script>

<style scoped lang="less">
// 书写样式铺满整
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
    height: 650px;
    background-color: #fff;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);
    .login-form-wrap {
      width: 490px;
      // background-color: red;
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
        background-color: #f4f4f4;
        padding-left: 90px;
        color: #000;
      }
      /deep/ .el-checkbox__label {
        font-size: 16px;
        // color: #00aaf0;
      }
      /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #00aaf0;
      }
      /deep/ .el-checkbox__inner {
        width: 20px;
        height: 20px;
        border-color: #00aaf0;
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
        color: #00aaf0;
      }
      .login-head {
        width: 520px;
        height: 46px;
        .icon {
          width: 16px;
          height: 32px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .logo {
          width: 185px;
          height: 46px;
          margin: 0 auto;
          margin-top: -55px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .el-icon-arrow-left {
          color: #00aaf0;
          font-size: 60px;
        }
      }
      .state {
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 18px;
        // background-color: red;
        margin-top: 50px;
        cursor: pointer;
        span {
          color: #999999;
        }
        .color {
          color: #00aaf0;
          border-bottom: 1px solid #00aaf0;
          border-width: 4px;
        }
        span {
          padding-right: 20px;
          border-bottom: 1px solid #e9e9e9;
          border-width: 4px;
          padding: 0px 80px 15px 80px;
        }
      }
      .login-form {
        /deep/ .el-input__inner {
          height: 60px;
        }
        /deep/ .el-form-item__content {
          line-height: 30px;
        }
        .login-btn {
          width: 100%;
          height: 60px;
          font-size: 25px;
          border-radius: 30px;
          background-color: #00aaf0;
        }
        span {
          padding-left: 20px;
          float: right;
          color: #00aaf0;
          display: inline;
          cursor: pointer;
        }
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
