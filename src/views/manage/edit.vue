<template>
  <!-- 编辑应用 -->
  <div class="content">
    <!-- 头部 -->
    <my-header></my-header>

    <!-- 中间主体内容 -->
    <div class="container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      编辑应用
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import myHeader from '../components/myHeader.vue'
import myFooter from '../components/myFooter.vue'
export default {
  components: { myHeader, myFooter },
  name: 'manage',
  data() {
    return {
      form:{
        
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.content {
  .container {
    height: 961px;
    background-color: #fff;
    margin-bottom: 34px;
  }
}
</style>
