<template>
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 内容 -->
    <div class="content">
      <img src="./timg.jpg" alt="" class="img" />
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/my-footer.vue'
import myHeader from '../components/my-header.vue'
export default {
  components: { myHeader, MyFooter },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
    .img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
