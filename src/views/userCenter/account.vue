<template>
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 内容 -->
    <my-main></my-main>
    <!-- 需要写的内容 -->
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
}
</style>
