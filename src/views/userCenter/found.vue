<template>
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 内容 -->
    <my-main></my-main>
    <!-- 需要写的内容 -->
    <div class="content">
      <!-- 消息提示 -->
      <div class="message">
        您还可上传2个项目
      </div>
      <div class="btn">
        <el-button type="primary" >下一步</el-button>
      </div>
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import myMain from '../components/my-main.vue'
import myHeader from '../components/my-header.vue'
import MyFooter from '../components/my-footer.vue'

export default {
  components: { myMain, myHeader, MyFooter },
  data () {
    return {}
  },
  methods: {
    handleClick () {
      alert('button click')
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  .content {
    width: 1300px;
    margin-left: 60px;
    .message {
      margin-top: -20px;
    }
    .btn {
      width: 100px;
      margin: 0 auto;
    }
  }
}
</style>
