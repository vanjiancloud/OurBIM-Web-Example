<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <!-- .logo区域 -->
      <div class="login-head">
        <i class="el-icon-arrow-left" @click="toReturn"></i>
        <span class="logo"> </span>
      </div>
      <div class="state">
        <span>
          设置新密码
        </span>
      </div>
      <el-form :rules="rules" :model="form" ref="form" class="login-form">
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="设置设置6至20位登录密码"
          >
            <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="toPassword">
          <el-input
            v-model="form.toPassword"
            placeholder="请再次输入登录密码"
            class="input"
          >
            <i slot="prefix" class="el-input__icon el-icon-message"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="toNext"
            type="primary"
            class="login-btn"
            >下一步</el-button
          >
        </el-form-item>
      </el-form>
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
            this.$router.push('../../resetSucceed')
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
      span {
        padding-right: 20px;
        padding: 15px 70px 15px 70px;
        color: #999999;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
      span {
        padding-left: 20px;
        float: right;
        color: #0097fe;
        display: inline;
      }
    }
  }
}
</style>
