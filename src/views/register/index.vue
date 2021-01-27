<template>
  <div class="container">
    <div class="zhuce">
      <div class="header">
        <i class="el-icon-arrow-left"></i>
        <span class="logo"> </span>
      </div>
      <div class="body">
        <el-form ref="form" :model="form">
          <el-form-item label="">
            <el-input v-model="form.email" placeholder="请输入邮箱">
              <i slot="prefix" class="el-icon-s-custom"></i>
            </el-input>
            <div class="hint">
              <span>
                <i style="color:#e4551b">*</i>
                您将同意我们不定期给您发送OurBIM产品相关资讯邮件
              </span>
            </div>
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号码"
              class="input"
            >
              <i slot="prefix" class="el-icon-mobile-phone"></i>
            </el-input>
            <el-input
              v-model="form.code"
              placeholder="请输入短信验证码"
              label-width="80px"
              class="input width"
            >
              <i slot="prefix" class="el-icon-message"></i>
            </el-input>
            <el-button type="primary" class="btn-one">获取验证码</el-button>
            <el-input
              v-model="form.password"
              placeholder="请设置6至20位登录密码"
              class="input"
            >
              <i slot="prefix" class="el-icon-lock"></i>
            </el-input>
            <el-input
              v-model="form.newPassword"
              placeholder="请再次输入登录密码"
              class="input"
            >
              <i slot="prefix" class="el-icon-lock"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-checkbox v-model="checked"
            >我同意《OurBIM用户服务协议》</el-checkbox
          >
        </div>
        <div><el-button type="primary" class="btn">注册</el-button></div>
        <div class="footer-size">
          <span
            ><a href="javaScript" style="text-decoration : none "
              >已有账号，立即登录</a
            ></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checked: true,
      form: {
        email: '',
        phone: '',
        code: '',
        password: '',
        newPassword: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
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
        margin: -5px 0;
        font-size: 4px;
        color: #999999;
      }
      .btn {
        width: 300px;
        margin: 30px 0;
      }
      .footer {
        margin-top: -25px;
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
      margin-bottom: 25px;
    }
    .width {
      width: 180px;
    }
  }
}
</style>
