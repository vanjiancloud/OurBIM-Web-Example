<template>
  <div class="box">
    <div class="picture">
      <img src="../login/img.png" alt="" />
    </div>
    <!-- 注册页面 -->
    <div class="right">
      <div class="zhuce">
        <!-- 头部区域 -->
        <div class="header">
          <i class="el-icon-arrow-left" @click="toReturn"></i>
          <div class="logo">
            <img src="./logo.png" alt="" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="body">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
            <!-- 邮箱 -->
            <el-form-item label="" prop="email">
              <el-input
                v-model="ruleForm.email"
                placeholder="请输入邮箱"
                @blur="emailBlur"
              >
                <i slot="prefix" class="el-icon-message"></i>
              </el-input>
              <div class="hint">
                <span style="font-size: 14px;">
                  <i style="color:#e4551b;">*</i>
                  您将同意我们不定期给您发送OurBIM产品相关资讯邮件
                </span>
              </div>
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item label="" prop="mobile">
              <el-input
                v-model="ruleForm.mobile"
                placeholder="请输入手机号码"
                @blur="mobileBlur"
              >
                <i slot="prefix" class="el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item label="" prop="code">
              <el-input
                v-model="ruleForm.code"
                placeholder="请输入短信验证码"
                label-width="80px"
              >
                <el-button
                  class="code"
                  slot="suffix"
                  type="text"
                  :disabled="isSend"
                  @click="getcode"
                >
                  {{ btnMes }}
                </el-button>
                <i slot="prefix" class="el-icon-s-comment"></i>
              </el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="" prop="password">
              <el-input
                show-password
                v-model="ruleForm.password"
                placeholder="请设置6至20位登录密码"
              >
                <i slot="prefix" class="el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <!-- 再次输入密码 -->
            <el-form-item label="" prop="newPassword">
              <el-input
                show-password
                v-model="ruleForm.newPassword"
                placeholder="请再次输入登录密码"
              >
                <i slot="prefix" class="el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <!-- 勾选状态 -->
            <el-form-item label="" prop="checked" class="check">
              <el-checkbox v-model="ruleForm.checked"
                >我同意
              </el-checkbox>
              <a class="link" @click="toxieyi"
                style="text-decoration:none; font-size: 16px;">
              《OurBIM用户服务协议》</a>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <div class="footer">
            <div>
              <el-button
                type="primary"
                class="btn"
                @click="register"
                :loading="isLoading"
                >注册</el-button
              >
            </div>
            <div class="footer-size">
              <el-button type="text" @click="toLogoin">已有账号，立即登录</el-button>
              <!-- <span
                ><a
                  href="http://www.ourbim.com:7012/#/login"
                  style="text-decoration:none;font-size: 16px;color:#00aaf0 "
                  >已有账号，立即登录</a
                ></span
              > -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wenzi">
      Copyright © 2021 www.OurBIM.com, All Rights Reserved.
    </div>
  </div>
</template>
<script>
import {
  getRegister,
  repeatMobile,
  repeatEmail,
  sendMsgCode
} from '@/api/my.js'
export default {
  name: 'register',
  data () {
    return {
      isSend: false, // 是否显示
      isLoading: false, // 是否正在登陆
      delay: 60, // 倒计时
      interId: null, // 定时器
      btnMes: '获取验证码', // 按钮的文本
      // 验证表单数据
      ruleForm: {
        email: '',
        mobile: '',
        code: '',
        password: '',
        newPassword: '',
        msgType: '1',
        checked: false, // 复选框的状态
        activeUrl: 'window.location.href'
      },
      // 验证规则
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[0-9]{1}[0-9]{9}$/,
            message: '请输入正确的11位手机号',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message:
              '请输入正确邮箱,字符为英文&数字，结尾必须有“@xx.com/cn”字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
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
        newPassword: [
          {
            required: true,
            message: '请再次输入您设置的密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
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
        ],
        checked: [
          {
            // 自定义规则
            validator: function (rule, value, callback) {
              if (value) {
                // 选中
                callback()
              } else {
                // 用户不同意
                callback(new Error('请勾选！'))
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    delay: function(newVal, oldVal) {
      if (oldVal === 0) {
        clearInterval(this.interId)
        this.btnMes = '获取验证码'
        this.isSend = false
        this.delay = 60 // 倒计时
      }
    }
  },
  methods: {
    // 点击注册校验
    register () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doRegister()
        }
      })
    },
    // 返回登录页
    toReturn () {
      this.$router.push('../../login')
    },
    toLogoin () {
      console.log('666666666');
      this.$router.push('../login')
    },
    // 点击注册
    doRegister () {
      getRegister({
        email: this.ruleForm.email,
        mobile: this.ruleForm.mobile,
        code: this.ruleForm.code,
        password: this.ruleForm.password,
        activeUrl: window.location.href
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('注册成功')
            this.$router.push('/registerSucceed')
          } else if (res.data.code === 1) {
            this.$message.error('验证码验证失败')
          } else if (res.data.code === 2) {
            this.$message.error('该邮箱已经注册过了')
          } else if (res.data.code === 3) {
            this.$message.error('该手机号已经被注册')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('注册失败')
        })
    },
    // 点击跳转用户协议
    toxieyi () {
      this.$router.push('/protocol')
    },

    // 点击获取验证码
    getcode () {
      this.$refs.ruleForm.validateField('mobile', codeError => {
        if (!codeError) {
          this.toGetCode()
        }
      })
    },
    // 获取验证码
    toGetCode () {
      // 禁用发送验证码按钮
      this.isSend = true
      this.btnMes = `发送验证码中...`
      sendMsgCode({
        mobile: this.ruleForm.mobile,
        msgType: this.ruleForm.msgType
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
    },
    // 失去焦点获取手机号
    mobileBlur () {
      this.$refs.ruleForm.validateField('mobile', mobileError => {
        if (!mobileError) {
          this.getmobileBlur()
        }
      })
    },
    getmobileBlur () {
      repeatMobile({
        mobile: this.ruleForm.mobile
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('可以使用此手机号')
          } else {
            this.$message.error('该手机号已被注册，请更换手机号')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('此手机号已经注册过了')
        })
    },
    // 失去焦点获取
    emailBlur () {
      this.$refs.ruleForm.validateField('email', emailError => {
        if (!emailError) {
          this.getemailBlur()
        }
      })
    },
    getemailBlur () {
      repeatEmail({
        email: this.ruleForm.email
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success(res.data.message)
          } else if (res.data.code === 1) {
            // this.$message.error('该邮箱已被注册，请更换邮箱')
            this.$message.warning(res.data.message)
          }
        })
        .catch(err => {
          // console.log(err)
          this.$message.error('邮箱不可用')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.box {
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
    height: 750px;
    background-color: #fff;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);
    .zhuce {
      width: 490px;
      height: 702px;
      .header {
        width: 521px;
        height: 46px;
        margin-bottom: 40px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        .logo {
          width: 185px;
          height: 46px;
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .el-icon-arrow-left {
          color: #00aaf0;
          font-size: 60px;
          margin-left: -15px;
        }
      }
      .body {
        /deep/ .el-form-item__error {
          margin-top: -15px;
        }
        // 输入框
        /deep/ .el-input__inner {
          height: 60px;
          margin-bottom: 15px;
          font-size: 20px;
          padding-left: 90px;
          background-color: #f4f4f4;
          color: #000;
        }
        /deep/ .el-checkbox__label {
          font-size: 16px;
        }
        /deep/ .el-checkbox__inner {
          width: 20px;
          height: 20px;
          margin-bottom: 2px;
          // background-color: transparent;
        }
        /deep/ .el-input__prefix {
          font-size: 20px;
          margin-top: 10px;
          margin-left: 36px;
        }
        /deep/ .el-input .el-input__clear {
          margin-right: 27px;
          margin-top: -5px;
          font-size: 20px;
        }
        /deep/ .el-checkbox__inner::after {
          width: 9px;
          height: 13px;
        }
        .footer-size {
          color: #00aaf0;
          text-align: center;
          font-size: 16px;
        }
        .link:hover {
          color: #00aaf0;
          cursor:pointer;
        }
        .hint {
          margin-top: -13px;
          margin-bottom: -30px;
          font-size: 4px;
          color: #999999;
        }
        .btn {
          width: 100%;
          height: 60px;
          margin-bottom: 12px;
          font-size: 25px;
          border-radius: 30px;
          background-color: #00aaf0;
        }
        .code {
          padding-right: 27px;
          padding-top: 23px;
          // color: #00aaf0;
        }
        .check {
          margin-top: -30px;
          color: #00aaf0;
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
