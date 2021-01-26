<template>
  <div class="login-container">
     
      <div class="login-form-wrap">
        <!-- .logo区域 -->
       <div class="login-head">
         <i class="el-icon-arrow-left" ></i>
         <span class="logo">
         </span>
       </div>
       <!-- 登录的不同状态 -->
       <div class="state">
         <span  @click="isshow=0" :class="{color:isshow==0}">
           邮箱登录
         </span>
         <span @click="isshow=1" :class="{color:isshow==1}">
           短信登录
         </span>
       </div>
        <!--删除多余的表单 表单区域 -->
        <!-- rules="rules" 验证表单的方法 -->
         <!-- 邮箱登录的表单 -->
        <el-form :rules="rules" :model="form" ref="form" class="login-form" v-show="isshow==0" >
          <!--  账号密码通过双向绑定获取里面的值 -->
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入邮箱">
               <i slot="prefix" class="el-input__icon el-icon-s-custom"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="form.code" placeholder="请输入登录密码">
               <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
            type="primary"
            class="login-btn"
            :loading="isLoading">登陆</el-button>
          </el-form-item>
           <el-form-item prop="isAgree">
            <el-checkbox class="checkbox" label="记住登录邮箱" name="type"  v-model="form.isAgree"></el-checkbox>
            <span>忘记密码?</span>
            <span>注册新用户</span>
          </el-form-item>
        </el-form>

         <!-- 短信登录的表单 -->
          <el-form :rules="rules" :model="form" ref="form" class="login-form"  v-show="isshow==1">
          <!--  账号密码通过双向绑定获取里面的值 -->
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号">
               <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="form.code" placeholder="请输入短信验证码">
               <i slot="prefix" class="el-input__icon el-icon-message"></i>
            </el-input>
          </el-form-item>
          <div><span class="tips">发送验证码</span></div>
          <el-form-item>
            <el-button
            type="primary"
            class="login-btn"
            :loading="isLoading">登陆</el-button>
          </el-form-item>
           <el-form-item prop="isAgree">
            <el-checkbox class="checkbox" label="记住登录手机号" name="type"  v-model="form.isAgree"></el-checkbox>
            <span>忘记密码?</span>
            <span>注册新用户</span>
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
        code: ''
      },
      // 定义验证规则rules
      rules: {
        // 字段名：mobile就表示要验证的 属性
        // 模板中的配置值: 是一个数组。数组中的每一项表示一条规则。
        mobile: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入合法的邮箱号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入合法的验证码', trigger: 'blur' }
        ],
        isAgree: [
          {
            // 自定义规则
            validator: function (rule, value, callback) {
              if (value) { // 选中
                callback()
              } else { // 用户不同意
                callback(new Error('不同意不行！'))
              }
            },
            trigger: 'change'
          }
        ]
      }
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
  flex-direction:column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-size: cover;
  .login-form-wrap {
    min-width: 400px;
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
        background: url("../../assets/logo_index.png") no-repeat;
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
        border-width:2px;
      }
      span {
        padding-right: 20px;
        border-bottom: 1px solid #e9e9e9;
        border-width:2px;
        padding: 30px 60px 15px 60px;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
      span {
        padding-left: 20px;
        Float:right;
        color: #0097fe;
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
