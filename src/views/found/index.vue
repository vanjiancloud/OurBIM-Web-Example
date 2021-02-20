<template>
  <!-- 创建应用-->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 自己写的 -->
    <div class="container">
      <div class="content">
          您还可上传2个项目
          <div class="btn">
            <el-button type="primary">下一步</el-button>
          </div>
        </div>
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
import MyMain from '../components/myMain.vue'
export default {
  components: { myHeader, MyMain, MyFooter }
}
</script>

<style lang="less" scoped>
.box {
  .container{
    .content {
      .btn {
      width: 100px;
      margin: 0 auto;
    }
    }
  }
}
</style>>
