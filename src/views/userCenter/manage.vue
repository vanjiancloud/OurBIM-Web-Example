<template>
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 内容 -->
    <my-main></my-main>
    <!-- 需要写的内容 -->
    <div class="content">
      <!-- 消息提示 -->
      <div class="record">
        <!-- 消息提示 -->
        <div class="left">
          您共有3个项目
        </div>
        <!-- 按钮 -->
        <div class="right">
          <el-button type="primary">添加团队链接</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <el-table
          :data="tableData"
          border="true"
          style="width:100%;"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
        >
          <el-table-column prop="ID" label="">应用ID</el-table-column>
          <el-table-column prop="name" label="应用名称"> </el-table-column>
          <el-table-column prop="data" label="最大并发数量"> </el-table-column>
          <el-table-column prop="state" label="状态"> </el-table-column
          ><el-table-column prop="date" label="上传日期"> </el-table-column
          ><el-table-column prop="handle" label="操作">
            <div class="link">
              <a href="">分享</a>
              <a href="">编辑</a>
              <a href="" style="color:#E0001B">删除</a>
            </div>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        background="blue"
        :total="400"
      >
      </el-pagination>
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
    return {
      tableData: [
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        },
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        },
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        },
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        },
        {
          ID: 'ID43321432',
          name: '钱龙广场1.0',
          data: '5',
          state: '转换完成',
          date: '2021-01-01 12：34'
        }
      ]
    }
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
      // background-color: red;
      margin-top: -20px;

      .left {
        height: 40px;
      }
      .right {
        position: absolute;
        right: 20px;
        top: 0px;
      }
    }
    .table {
      width: 100%;
      margin-top: 5px;
      margin-bottom: 50px;
      .link {
        padding-left: 25px;
        a {
          margin-right: 28px;
          color: #02a7f0;
        }
      }
    }
  }
  .page {
    width: 550px;
    margin: 0 auto;
    margin-bottom: 40px;
  }
}
</style>
