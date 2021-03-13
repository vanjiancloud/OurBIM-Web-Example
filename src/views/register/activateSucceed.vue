<template>
  <div class="container">
    <div class="picture">
      <img src="./img.png" alt="" />
    </div>
    <div class="box">
      <div class="logo">
        <img src="../register/logo.png" alt="" class="img" />
      </div>
      <div class="success" v-show="isShow == 1"></div>
      <div class="error" v-show="isShow == 2"></div>
      <div class="write">
        <h3 :title="title">{{ title }}</h3>
      </div>
      <div class="btn">
        <el-button
          class="button"
          @click="toLogin"
          type="primary"
          v-show="display == 1"
          >去登录</el-button
        >
        <el-button
          class="button"
          @click="toRegister"
          type="primary"
          v-show="display == 2"
          >去注册</el-button
        >
      </div>
    </div>
    <div class="wenzi">
      Copyright © 2021 www.OurBIM.com, All Rights Reserved.
    </div>
  </div>
</template>

<script>
import { activation } from '@/api/my.js'
export default {
  name: 'activateSucceed',
  data () {
    return {
      code: 'this.$route.query.code',
      title: '',
      isShow: 2,
      display: 2
    }
  },
  created () {
    console.log(this.$route.query.code)
    activation({
      code: this.$route.query.code
    })
      .then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.$message.success('激活成功')
          this.title = '激活成功'
          this.isShow = 1
          this.display = 1
        } else if (res.data.code === 1) {
          this.$message.error('激活码无效')
          this.title = '激活码无效'
        }
      })
      .catch(err => {
        console.log(err)
        this.$message.error('激活码无效')
        this.title = '激活码无效'
        icon = 'error'
      })
  },
  methods: {
    toLogin () {
      this.$router.replace('../login')
    },
    toRegister () {
      this.$router.replace('../register')
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
    height: 500px;
    margin-right: 220px;
    border-radius: 25px;
    box-shadow: 0px 1px 13px 0px rgba(135, 206, 235, 0.9);
    .logo {
      width: 223px;
      height: 46px;
      margin: 0 auto;
      margin-top: 50px;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .write {
      text-align: center;
      color: #929292;
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
    .success {
      text-align: center;
      width: 114px;
      height: 114px;
      margin: 50px auto;
      background-image: url('./icon.png');
      background-repeat: no-repeat;
    }
    .error {
      text-align: center;
      width: 114px;
      height: 114px;
      margin: 50px auto;
      background-image: url('./err.png');
      background-repeat: no-repeat;
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
