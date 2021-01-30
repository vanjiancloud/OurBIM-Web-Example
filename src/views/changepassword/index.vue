<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <!-- .logo区域 -->
      <div class="login-head">
        <i class="el-icon-arrow-left" @click="toReturn"></i>
        <span class="logo"> </span>
      </div>
      <!-- 登录的不同状态 -->
      <div class="state">
        <span>
          重置密码
        </span>
      </div>
      <!-- 短信登录的表单 -->
      <el-form :rules="rules" :model="form" ref="form" class="login-form">
        <!--  账号密码通过双向绑定获取里面的值 -->
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
            <i slot="prefix" class="el-input__icon el-icon-message"></i>
          </el-input>
          <el-button @click="getCode" type="warning">获取验证码</el-button>
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
</template>

<script>
import { sendMsgCode } from '../../api/my'
export default {
  // 声明账号和密码
  data () {
    return {
      isLoading: false, // 是否正在登陆
      form: {
        isAgree: false, // 复选框的状态
        mobile: '13292706730',
        code: ''
      },
      // 定义验证规则rules
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
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
  methods: {
    // 返回登录页
    toReturn () {
      this.$router.push('../../login')
    },
    // 跳转到重制密码
    toNext () {
      this.$refs.form.validate(valid => {
        // 验证通过把结构赋值写载这里
        if (valid) {
          this.remakePas()
        }
      })
    },
    remakePas () {
      this.$router.push('../../newPassword')
    },
    // 获取验证码
    getCode () {
      sendMsgCode({
        code: this.form.code
      })
        .then(res => {
          console.log(res)
          this.$message.success('获取验证码成功')
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
    }
  }
}
</style>
