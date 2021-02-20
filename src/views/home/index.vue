<template>
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <div class="banner">
      <img src="./banner.png" alt="">
    </div>
    <div class="first">
      <h2>OurBIM云计算平台</h2> <br>
      颠覆BIM云应用的开发方式 <br> <br>
      经OurBIM云计算引擎对BIM工程数据进行自动分析处理，将BIM数据进阶为独一无二且真实的
      应用场景，实现在Web平台中进行漫游浏览和基于API进行二次开发应用，提升BIM数据价值。
    </div>
    <div class="second"></div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
export default {
  components: { myHeader, MyFooter }

}
</script>

<style lang="less" scoped>
.box {
  .banner {
    width: 100%;
    height: 520px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .first {
    width: 100%;
    height: 233px;
    text-align: center;
    font-size: 16px;
    h2 {
      color:#FF6600;
      font-size: 30px;
      margin-top: 62px;
    }
  }
  .second {
    width: 100%;
    height: 260px;
    background-color: pink;
  }
}
</style>
