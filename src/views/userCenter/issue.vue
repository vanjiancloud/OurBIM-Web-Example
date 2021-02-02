<template>
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 内容 -->
    <my-main></my-main>
    <!-- 需要写的内容 -->
    <div class="content">
      <!-- 消息提示和选择器 -->
      <div class="record">
        <!-- 消息提示 -->
        <div class="left">
          您共发布了123组作品
        </div>
        <!-- 选择器 -->
        <div class="right">
          <el-dropdown>
            <el-button plain>
              全部<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>全部</el-dropdown-item>
              <el-dropdown-item>文章</el-dropdown-item>
              <el-dropdown-item>模型</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 列表展示 -->
      <div class="list">
        <ul>
          <li>
            <div></div>
          </li>
          <!-- <li>
            <div></div>
          </li>
          <li>
            <div></div>
          </li>
          <li class="end">
            <div></div>
          </li> -->

        </ul>
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
    .record {
      width: 100%;
      height: 40px;
      position: relative;
      background-color: red;
      .left {
        height: 40px;
      }
      .right {
        position: absolute;
        right: 20px;
        top: 0px;
      }
    }
    .list {
      width: 1300px;
      height: 866px;
      background-color: palevioletred;
      margin-top: -10px;

      li {
        width: 300px;
        height: 400px;
        background-color: green;
        margin-right: 33px;
        margin-bottom: 33px;
        // float: left;
        list-style: none;
        box-sizing: border-box;
      }
      .end {
        margin-right: 1px;
      }
    }
  }
}
</style>
