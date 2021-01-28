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
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱">
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
            <el-button @click="getcode" type="primary" class="btn-one">获取验证码</el-button>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="" prop="password">
            <el-input
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
              v-model="ruleForm.newPassword"
              placeholder="请再次输入登录密码"
              class="input"
            >
              <i slot="prefix" class="el-icon-lock"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <div class="footer">
          <el-checkbox v-model="checked" class="xieyi"
            >我同意《OurBIM用户服务协议》</el-checkbox
          >
          <div>
            <el-button type="primary" class="btn" @click="register"
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
import { getRegister, sendMsgCode } from '@/api/my.js'
export default {
  data () {
    return {
      checked: false,
      msgType: null,
      // 验证表单数据
      ruleForm: {
        email: 'liuxiaolongtong@163.com',
        mobile: '13292706730',
        code: '',
        password: '1399116021',
        newPassword: '1399116021',
        msgType: '1'
      },
      // 验证规则
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的十一位手机号',
            trigger: 'change'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '请输入正确的邮箱',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请设置密码,字符为英文&数字&英文符号，位数6-20',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '请再次输入您设置的密码',
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
            pattern: /^\d{6}$/,
            message: '您输入的验证码不正确',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 校验不能为空
    register () {
      if (
        (this.ruleForm.email !== null) &
        (this.ruleForm.mobile !== null) &
        (this.ruleForm.code !== null) &
        (this.ruleForm.password !== null) &
        (this.ruleForm.newPassword !== null) &
        (this.checked === true)
      ) {
        this.doRegister()
      }
    },
    // 获取注册信息
    doRegister () {
      const { email, mobile, code, password, newPassword } = this.ruleForm
      console.log(email, mobile, code, password, newPassword)
      getRegister()
        .then(res => {
          console.log(res)
          this.$message.success('注册成功')
          this.$router.push('/registerSucceed')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('注册失败')
        })
    },
    // 获取验证码
    getcode () {
      const { mobile, msgType } = this.ruleForm
      // console.log(mobile, msgType)
      sendMsgCode(mobile, msgType).then(res => {
        console.log(res)
        this.$message.success('获取成功')
      }).catch(err => {
        console.log(err)
        this.$message.error('获取失败')
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
      .hint {
        margin-top: -5px;
        margin-bottom: -25px;
        font-size: 4px;
        color: #999999;
      }
      .btn {
        width: 300px;
        margin-bottom: 30px;
      }
      .footer {
        margin-top: -25px;
        .xieyi {
          margin: 20px 0;
        }
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
        padding: 40px 150px 0 0;
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
