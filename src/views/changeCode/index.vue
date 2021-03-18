<template>
  <!-- 修改密码 -->
  <div class="box">
    <div class="title">
      修改密码
    </div>
    <div class="message" style="margin-top: 30px;">
      <div class="one">原密码:</div>
      <div class="input">
        <el-input v-model="oldCode" placeholder="请输入原密码"></el-input>
      </div>
    </div>
    <div class="message" style="margin-top: 30px;">
      <div class="one">新密码:</div>
      <div class="input">
        <el-input v-model="newCode" placeholder="请输入新密码"></el-input>
      </div>
    </div>
    <div class="message" style="margin-top: 30px;">
      <div class="one">确认密码:</div>
      <div class="input">
        <el-input v-model="newCode" placeholder="请再次输入密码"></el-input>
      </div>
    </div>
    <div class="message" style="margin-top: 30px;">
      <div class="one">手机号:</div>
      <div class="input">
        <el-input v-model="mobile" placeholder="请输入手机号"></el-input>
      </div>
    </div>
    <div class="message" style="margin-top: 30px;">
      <div class="one">验证码:</div>
      <div class="input">
        <el-input v-model="code" placeholder="请输入验证码">
          <el-button
            style="padding-right:25px;color:#00AAF0;"
            slot="suffix"
            type="text"
            @click="getCode"
          >
            发送验证码
          </el-button>
        </el-input>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary">修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'changeCode',
  data () {
    return {
      oldCode: '',
      newCode: '',
      mobile: '',
      code: ''
    }
  },
  methods: {
    // 获取验证码
    getCode () {
      console.log('点击了发送验证码按钮')
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  text-align: center;
  min-height: 961px;
  .title {
    height: 54px;
    line-height: 54px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 1px solid #f1f1f1;
  }
  .message {
    width: 660px;
    height: 46px;
    margin-bottom: 30px;
    font-size: 16px;
    .one {
      float: left;
      height: 46px;
      width: 80px;
      line-height: 46px;
      margin-right: 35px;
      margin-left: 56px;
    }
    .input {
      float: left;
    }
    /deep/ .el-input__inner {
      width: 460px;
      height: 46px;
    }
  }
  .btn {
    
    /deep/ .el-button--primary {
      width: 140px;
      height: 40px;
      background-color: #00aaf0;
    }
  }
}
</style>
