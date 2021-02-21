<template>
  <!-- 应用管理 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 自己写的内容 -->
    <div class="container">
      <div class="content">
        <!-- 消息提示 -->
        <div class="record">
          <!-- 消息提示 -->
          <div class="left">
            您共有3个项目
          </div>
          <!-- 按钮 -->
          <div class="right">
            <el-button type="primary">{{ $t('link') }}</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <table>
          <tr>
            <th>应用ID</th>
            <th>应用名称</th>
            <th>最大并发数量</th>
            <th>状态</th>
            <th>上传日期</th>
            <th>操作</th>
          </tr>
          <tr>
            <td style="color:skyblue">ID43321432</td>
            <td>钱龙广场1.0</td>
            <td>5</td>
            <td>转换完成</td>
            <td>2021-01-0112：34</td>
            <td>
              <el-button type="primary" icon="el-icon-share" circle></el-button>
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        background
        :total="400"
      >
      </el-pagination>
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
  .container {
    background-color: #fff;
    height: 961px;
    .content {
      margin-left: 41px;
      margin-right: 41px;
      overflow: hidden;
      .record {
        width: 100%;
        height: 40px;
        margin-top: 38px;
        position: relative;
        .left {
          height: 40px;
        }
        .right {
          position: absolute;
          right: 0px;
          top: 0px;
        }
      }
      table {
        width: 100%;
        margin-top: 15px;
        margin-bottom: 40px;
        border-collapse: collapse;
        font-size: 18px;
        tr {
          height: 70px;
        }
        th {
          background-color: #409eff;
          color: #fff;
        }
        td {
          background-color: #fff;
        }
      }
      table,
      th,
      td {
        border: 1px solid black;
        text-align: center;
      }
    }
  }
  .page {
    width: 550px;
    margin: 0 auto;
    margin-bottom: 40px;
    margin-top: 40px;
  }
}
</style>
