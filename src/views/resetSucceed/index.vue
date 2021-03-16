<template>
  <div class="container">
    <div class="picture">
      <img src="./img.png" alt="" />
    </div>
    <div class="box">
      <!-- .logo区域 -->
      <div class="head">
        <i class="el-icon-arrow-left" @click="toReturn"></i>
        <div class="logo">
          <img src="./logo.png" alt="" />
        </div>
      </div>
      <div class="icon">
        <img src="../resetSucceed/icon.png" alt="" class="icon-img" />
      </div>
      <div class="write">
        <span>密码重置成功</span> <br />
        请妥善保管您的账户信息
      </div>
      <div class="btn">
        <el-button class="button" @click="toLogin" type="primary"
          >去登录</el-button
        >
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
    return {}
  },
  methods: {
    // 返回上一步
    toReturn () {
      this.$router.push('../login')
    },

    // 去登录
    toLogin () {
      this.$router.push('../login')
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
    width: 795px;
    height: 945px;
    margin-right: 350px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .box {
    width: 520px;
    height: 520px;
    margin-right: 220px;
    border-radius: 25px;
    box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);
    .head {
      display: flex;
      justify-content: center;
      margin-top: 50px;
      .logo {
        width: 185px;
        height: 46px;
        margin: 0 auto;
        margin-left: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .el-icon-arrow-left {
        color: #00aaf0;
        font-size: 60px;
        margin-top: -5px;
      }
    }
    .icon {
      text-align: center;
      width: 140px;
      height: 135px;
      margin: 0 auto;
      margin-top: 40px;
      margin-bottom: 30px;
      .icon-img {
        width: 100%;
        height: 100%;
      }
    }
    .write {
      text-align: center;
      color: #999999;
      font-size: 16px;
      span {
        font-size: 30px;
      }
    }
    .btn {
      text-align: center;
      margin-top: 50px;
      .button {
        width: 200px;
        height: 50px;
        font-size: 18px;
        background-color: #00aaf0;
        border-radius: 25px;
      }
    }
  }
  .wenzi {
    width: 340px;
    position: fixed;
    bottom: 21px;
    text-align: center;
    color: #ccc;
    font-size: 16px;
  }
}
</style>
