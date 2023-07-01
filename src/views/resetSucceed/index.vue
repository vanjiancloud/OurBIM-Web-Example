<template>
  <div class="boxs">
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
      Copyright © 2023 www.OurBIM.com, <br>All Rights Reserved.
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
.boxs {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-image: url(./bg.png);
  background-size: cover;
  background-size: 100% 100%;
  .picture {
    height: 100%;
    width: 40%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .box {
    width: 30%;
    height: 60%;
    border-radius: 25px;
    box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);
    .head {
      display: flex;
      justify-content: center;
      margin-top: 5%;
      width: 100%;
      height: 20%;
      .logo {
        width: 50%;
        height: 100%;
        margin: 0 auto;
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
      width: 30%;
      height: 25%;
      margin: 0 auto;
      margin-bottom: 3%;
      margin-top: 3%;
      .icon-img {
        width: 100%;
        height: 100%;
      }
    }
    .write {
      text-align: center;
      color: #999999;
      font-size: 30px;
      span {
        font-size: 30px;
      }
    }
    .btn {
      text-align: center;
      margin-top: 3%;
      .button {
        width: 50%;
        // height: 50%;
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
