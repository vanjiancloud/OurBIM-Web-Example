<template>
  <!-- 背景 -->
  <div class="container">
    <!-- 注册页面 -->
    <div class="zhuce">
      <!-- 头部区域 -->
      <div class="header">
        <i class="el-icon-arrow-left"></i>
        <span class="logo"> </span>
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
              <i slot="prefix" class="el-icon-s-custom"></i>
            </el-input>
            <div class="hint">
              <span>
                <i style="color:#e4551b">*</i>
                您将同意我们不定期给您发送OurBIM产品相关资讯邮件
              </span>
            </div>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item label="" prop="mobile">
            <el-input
              v-model="ruleForm.mobile"
              placeholder="请输入手机号码"
              class="input"
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
              class="input width"
            >
              <i slot="prefix" class="el-icon-message"></i>
            </el-input>
            <el-button
              :disabled="isSend"
              @click="getcode"
              type="primary"
              class="btn-one"
              >{{ btnMes }}</el-button
            >
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="" prop="password">
            <el-input
              show-password
              v-model="ruleForm.password"
              placeholder="请设置6至20位登录密码"
              class="input"
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
              class="input"
            >
              <i slot="prefix" class="el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <!-- 勾选状态 -->
          <el-form-item label="" prop="checked">
            <el-checkbox v-model="ruleForm.checked"
              >我同意
              <a class="link" @click="toxieyi" style="text-decoration:none">
                《OurBIM用户服务协议》</a
              >
            </el-checkbox>
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
            <span
              ><a href="../login/index.vue" style="text-decoration : none "
                >已有账号，立即登录</a
              ></span
            >
          </div>
        </div>
      </div>
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
  data () {
    return {
      isSend: false, // 是否显示
      isLoading: false, // 是否正在登陆
      delay: 0, // 倒计时
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
            pattern: /^1[3|4|5|7|8][0-9]{9}$/,
            message: '请输入正确的11位手机号',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入合法邮箱', trigger: 'blur' },
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
  methods: {
    // 点击注册
    register () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doRegister()
        }
      })
    },
    // 注册信息
    doRegister () {
      getRegister({
        email: this.ruleForm.email,
        mobile: this.ruleForm.mobile,
        code: this.ruleForm.code,
        password: this.ruleForm.password,
        activeUrl: window.location.href
      })
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success('注册成功')
            this.$router.push('/registerSucceed')
          } else if (res.data.code === 2) {
            this.$message.error('该邮箱已经注册过了')
          } else if (res.data.code === 3) {
            this.$message.error('该手机号已经注册过了')
          } else {
            this.$message.error('验证码错误')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('注册失败')
        })
    },
    // 点击跳转说明
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
      sendMsgCode({
        mobile: this.ruleForm.mobile,
        msgType: this.ruleForm.msgType
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('获取成功')
            this.delay = 60
            this.btnMes = `${this.delay}S后继续`
            this.isSend = true
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
    // 失去焦点获取邮箱
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
            this.$message.success('可以使用此邮箱')
          } else {
            this.$message.error('该邮箱已被注册，请更换邮箱')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('此邮箱已经注册过了')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-size: cover;
  .zhuce {
    width: 460px;
    height: 650px;
    background-color: #fff;
    border-radius: 10px;
    .body {
      padding: 0 76px;
      .footer-size {
        color: #0079fe;
        text-align: center;
      }
      .link:hover {
        color: #409eff;
      }
      .hint {
        margin-top: -5px;
        margin-bottom: -25px;
        font-size: 4px;
        color: #999999;
      }
      .btn {
        width: 308px;
        margin-bottom: 12px;
        margin-top: 8px;
      }
      .btn-one {
        width: 106px;
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      display: flex;
      margin-bottom: 30px;
      .logo {
        width: 250px;
        height: 65px;
        padding-bottom: 30px;
        position: absolute;
        left: 80px;
        background: url(../../assets/logo_index.png) no-repeat;
        background-size: contain;
        margin-left: 25px;
      }
      .el-icon-arrow-left {
        color: #ff6600;
        padding: 40px 0 0 40px;
        font-size: 40px;
      }
    }
    .input {
      margin-bottom: -20px;
    }
    .width {
      width: 180px;
    }
  }
}
</style>
