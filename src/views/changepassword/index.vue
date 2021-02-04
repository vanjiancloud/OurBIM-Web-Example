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
            <i slot="prefix" class="el-input__icon el-icon-message"></i>
          </el-input>
          <el-button
            class="btnMes"
            :disabled="isSend"
            @click="getCode"
            type="primary"
            >{{ btnMes }}</el-button
          >
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
import { sendMsgCode, updateJudgeMsg } from '../../api/my'
export default {
  name: 'changepassword',
  data () {
    return {
      isSend: false, // 是否显示
      delay: 0, // 倒计时
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
      }).then(res => {
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
          this.$message.error('该手机号没有注册')
        } else if (res.data.code === 3) {
          this.$message.error('登录失败,请去完成注册功能')
        } else {
          this.$message.error('您输入的验证码不正确')
        }
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
      sendMsgCode({
        mobile: this.form.mobile,
        msgType: this.form.msgType
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
      .btnMes {
        width: 104px;
        height: 41px;
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
