<template>
  <div class="container">
    <div class="box">
      <div class="logo">
        <img src="../register/logo.png" alt="" class="img" />
      </div>
      <div class="icon">
        <img src="../register/icon.png" alt="" class="icon-img" />
      </div>
      <div class="write">
        <h3>你的账户：example@vanjian.com注册成功</h3>
      </div>
      <div class="section">
        激活邮件已发送到你的邮箱中，邮件有效期为24小时。
        请及时登录邮箱，点击邮件中的链接激活帐户。
      </div>
      <div class="btn">
        <el-button type="primary" class="button" @click="toLookEmail"
          >查看邮件</el-button
        >
        <el-button class="button" @click="toHome">进入首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { activation } from '@/api/my.js'
export default {
  data () {
    return {
      code: '499790'
    }
  },
  methods: {
    toHome () {
      this.$router.replace('/home')
    },
    toLookEmail () {
      // 激活账号
      activation({
        code: this.code
      })
        .then(res => {
          console.log(res)
          this.$message.success('注册成功')
          this.$router.replace('/lookEmail')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('注册失败')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    width: 580px;
    height: 580px;
    border-radius: 10px;
    background-color: #fff;
    .logo {
      width: 290px;
      height: 110px;
      margin: 0 auto;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .write {
      text-align: center;
    }
    .section {
      text-align: center;
      padding: 0 90px;
      margin-top: 30px;
      margin-bottom: -20px;
      color: #929292;
      font-size: 14px;
    }
    .btn {
      color: yellow;
      text-align: center;
      margin-top: 50px;
      .button {
        width: 150px;
        height: 45px;
        margin: 0 25px;
      }
    }
    .icon {
      color: blue;
      text-align: center;
      width: 140px;
      height: 135px;
      margin: 0 auto;
      margin-bottom: 20px;
      margin-top: 30px;
      .icon-img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
