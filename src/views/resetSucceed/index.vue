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
      this.$router.push('../newPassword')
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
    width: 652px;
    height: 802px;
    margin-right: 300px;
    margin-left: 206px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .box {
    width: 520px;
    height: 630px;
    border-radius: 10px;
    background-color: transparent;
    // background-color: #fff;
    margin-right: 220px;
    .head {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      // background-color: red;
      .logo {
        width: 223px;
        height: 46px;
        margin: 0 auto;
        margin-left: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .el-icon-arrow-left {
        color: #0097fe;
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
      }
    }
  }
  .wenzi {
    width: 100%;
    color: #999999;
    position: fixed;
    bottom: 21px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
