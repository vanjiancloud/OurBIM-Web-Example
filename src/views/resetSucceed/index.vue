<template>
  <div class="container">
    <div class="box">
      <div class="icon">
        <img src="../resetSucceed/icon.png" alt="" class="icon-img" />
      </div>
      <div class="write">
        <h1>密码重置成功</h1>
        请妥善保管您的账户信息
      </div>
      <div class="btn">
        <el-button class="button" @click="toLogin">重新登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    toLogin () {
      this.$router.replace('../../login')
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
    width: 500px;
    height: 500px;
    border-radius: 10px;
    background-color: #fff;
    .write {
      text-align: center;
    }
    .btn {
      color: yellow;
      text-align: center;
      margin-top: 50px;
      .button {
        width: 200px;
        height: 50px;
      }
    }
    .icon {
      text-align: center;
      width: 140px;
      height: 135px;
      margin: 0 auto;
      margin-top: 90px;
      .icon-img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
