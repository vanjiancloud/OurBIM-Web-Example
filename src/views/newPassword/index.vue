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
          设置新密码
        </span>
      </div>
      <!-- 短信登录的表单 -->
      <el-form :rules="rules" :model="form" ref="form" class="login-form">
        <!--  账号密码通过双向绑定获取里面的值 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="设置设置6至20位登录密码"
          >
            <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            v-model="form.newPassword"
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
            :loading="isLoading"
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
  // 声明账号和密码
  data () {
    return {
      isLoading: false, // 是否正在登陆
      form: {
        password: '13292706730',
        newPassword: '13292706730'
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
      this.$router.push('../../changePassword')
    },
    // 跳转到成功页面
    toNext () {
      this.$refs.form.validate(valid => {
        // 验证通过把结构赋值写载这里
        if (valid) {
          this.newPas()
        }
      })
    },
    newPas () {
      updatePassword({
        password: this.form.password,
        newPassword: this.form.newPassword
      })
        .then(res => {
          console.log(res)
          this.$message.success('修改成功')
          this.$router.push('../../sucPassword')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('修改失败')
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
