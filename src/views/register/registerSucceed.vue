<template>
  <div class="container">
    <div class="picture">
      <img src="./img.png" alt="" />
    </div>
    <div class="box">
      <div class="logo">
        <img src="../register/logo.png" alt="" class="img" />
      </div>
      <div class="icon">
        <img src="../register/icon.png" alt="" class="icon-img" />
      </div>
      <div class="write">
        <h3>你的账户：{{email}}注册成功</h3>
      </div>
      <div class="section">
        激活邮件已发送到你的邮箱中，邮件有效期为24小时。
        请及时登录邮箱，点击邮件中的链接激活帐户。
      </div>
      <div class="btn">
        <el-button class="button" @click="toHome" type="primary">进入首页</el-button>
      </div>
    </div>
    <div class="wenzi">
      Copyright © 2021 www.OurBIM.com, All Rights Reserved.
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: 'this.$route.query.email'
    }
  },
  methods: {
    toHome () {
      this.$router.replace('/home')
    },
    toLookEmail () {
      this.$router.replace('/lookEmail')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(./bg.png);
  background-size: cover;
  .picture {
    float: left;
    width: 625px;
    height: 802px;
    margin-right: 623px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .box {
    width: 580px;
    height: 580px;
    border-radius: 10px;
    // background-color: #fff;
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
      color: #929292;
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
   .wenzi {
    width: 100%;
    color: #999999;
    position: fixed;
    bottom: 21px;
    text-align: center;
    font-size: 12px;
  }
}
</style>
