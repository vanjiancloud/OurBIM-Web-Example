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
        <h3 :title="title">你的账户：{{ title }}</h3>
      </div>
      <div class="btn">
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
      // email: '',
      code: 'this.$route.query.code',
      title: '激活成功'
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
        } else {
          this.$message.error('激活码无效')
          this.title = '激活码无效'
        }
      })
      .catch(err => {
        console.log(err)
        this.$message.error('激活码无效')
      })
  },
  methods: {
    toHome () {
      this.$router.replace('/home')
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
    .btn {
      color: yellow;
      text-align: center;
      margin-top: 50px;
      .button {
        width: 200px;
        margin-top: 20px;
        height: 50px;
      }
    }
    .icon {
      color: blue;
      text-align: center;
      width: 140px;
      height: 135px;
      margin: 50px auto;
      .icon-img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
