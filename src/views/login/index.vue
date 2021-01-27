<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <!-- .logo区域 -->
      <div class="login-head">
        <i class="el-icon-arrow-left"></i>
        <span class="logo"> </span>
      </div>
      <!-- 登录的不同状态 -->
      <div class="state">
        <span @click="isshow = 0" :class="{ color: isshow == 0 }">
          邮箱登录
        </span>
        <span @click="isshow = 1" :class="{ color: isshow == 1 }">
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
        <!--  账号密码通过双向绑定获取里面的值 -->
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱">
            <i slot="prefix" class="el-input__icon el-icon-s-custom"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入登录密码"
            type="password"
          >
            <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="isLoading"
            >登陆</el-button
          >
        </el-form-item>
        <el-form-item prop="isAgree">
          <el-checkbox
            class="checkbox"
            label="记住登录邮箱"
            name="type"
            v-model="form.isAgree"
          ></el-checkbox>
          <span @click="changePassword">忘记密码?</span>
          <span @click="register">注册新用户</span>
        </el-form-item>
      </el-form>

      <!-- 短信登录的表单 -->
      <el-form
        :rules="rules"
        :model="form"
        ref="form"
        class="login-form"
        v-show="isshow == 1"
      >
        <!--  账号密码通过双向绑定获取里面的值 -->
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号">
            <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="Verification">
          <el-input
            v-model="form.Verification"
            placeholder="请输入短信验证码"
            class="input"
          >
            <i slot="prefix" class="el-input__icon el-icon-message"></i>
          </el-input>
          <el-button type="primary">获取验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="isLoading"
            >登陆</el-button
          >
        </el-form-item>
        <el-form-item prop="isAgree">
          <el-checkbox
            class="checkbox"
            label="记住登录手机号"
            name="type"
            v-model="form.isAgree"
          ></el-checkbox>
          <span @click="changePassword">忘记密码?</span>
          <span @click="register">注册新用户</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // 声明账号和密码
  data () {
    return {
      isshow: 0, // 切换登录类别
      isLoading: false, // 是否正在登陆
      form: {
        isAgree: false, // 复选框的状态
        mobile: '',
        code: '',
        email: '',
        Verification: ''
      },
      // 定义验证规则rules
      // 邮箱验证
      rules: {
        email: [
          { required: true, message: '请输入合法邮箱', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message:
              '请输入正确的邮箱,字符为英文&数字，结尾必须有“@xx.com/cn”字符',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: '请输入正确的11位手机号',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入密码,已字符为英文&数字&英文符号，位数6-20',
            trigger: 'blur'
          },
          {
            pattern: /^\d{6}$/,
            message: '您输入的账号或不正确',
            trigger: 'blur'
          }
        ],
        Verification: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          {
            message: '您输入的账号或不正确',
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
      this.$router.push('../../changepassword')
    },
    doLogin () {
      // // 解构赋值
      alert(1)
      // const { mobile, code } = this.form
      // console.log(mobile, code)
      // //  axios发请求(下载, 导入)
      // // 加载
      // this.isLoading = true
      // // 14.查看文档获取axios请求数据
      // this.$axios({
      //   method: 'POST',
      //   url: '/UserCenter/login',
      //   data: {
      //     mobile,
      //     code
      //   }
      //   // 14.1成功的时候
      // })
      //   .then(res => {
      //     this.isLoading = false // 加载
      //     // 把res的token保存下来,以便后续发送请求时带上
      //     localStorage.setItem('tokenStr', res.data.data.token)
      //     console.log(res)
      //     this.$message.success('恭喜登陆成功')
      //     this.$router.push('/')
      //     // 14.2失败的时候
      //   })
      //   .catch(err => {
      //     this.isLoading = false // 加载
      //     console.log(err)
      //     this.$message.error('登陆失败，用户名密码错误')
      //   })
    }
  }
}
</script>

<style scoped lang="less">
// 10.书写样式铺满整屏
.login-container {
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
  .login-form-wrap {
    min-width: 430px;
    min-height: 450px;
    padding: 5px 50px 1px 40px;
    background-color: #fff;
    .login-head {
      position: relative;
      display: flex;
      // justify-content: center;
      .logo {
        width: 250px;
        height: 65px;
        padding-bottom: 30px;
        position: absolute;
        left: 80px;
        background: url('../../assets/logo_index.png') no-repeat;
        background-size: contain;
      }
      .el-icon-arrow-left {
        color: #ff6600;
        padding: 40px 150px 0 0;
        font-size: 40px;
      }
    }
    .state {
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 30px;
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
      }
      .input {
        width: 315px;
        margin-right: 10px;
      }
      span {
        padding-left: 20px;
        float: right;
        color: #0097fe;
        display: inline;
      }
      .checkbox {
        color: #999999;
      }
      .tips {
        color: #0097de;
      }
    }
  }
}
</style>
