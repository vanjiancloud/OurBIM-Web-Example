<template>
  <!-- 应用管理 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 主体内容 -->
    <div class="container">
      <div class="content">
        <!-- 消息提示 -->
        <div class="record">
          <!-- 消息提示 -->
          <div class="left">您共有{{ itemList.length }}个项目</div>
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
          <tr v-for="(item, index) in itemList" :key="index">
            <td style="color: skyblue">{{ item.appid }}</td>
            <td>{{ item.appName }}</td>
            <td>{{ item.maxInstance }}</td>
            <td>{{ item.applidStatus }}</td>
            <td>{{ item.createTime }}</td>
            <td>
              <!-- 分享 -->
              <el-button
                type="primary"
                icon="el-icon-share"
                circle
                @click="share"
              ></el-button>
              <!-- 编辑 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="edit"
              ></el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="remove"
              ></el-button>
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
import { getProjectList } from '@/api/my.js'
export default {
  components: { myHeader, MyMain, MyFooter },
  name: 'manage',
  data () {
    return {
      itemList: []
    }
  },
  created () {
    this.GetList()
  },
  methods: {
    // 读取cookie中userid
    getCookie: function (userid) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(userid + '=')
        if (start !== -1) {
          start = start + userid.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      console.log()
      return ''
    },
    handleCurrentChange () {
      /**
       * @Author: zk
       * @Date: 2021-02-22 17:46:30
       * @description: 分页
       */
    },
    GetList () {
      /**
       * @Author: zk
       * @Date: 2021-02-22 17:43:22
       * @description: 获取应用列表
       */
      getProjectList({
        userId: this.getCookie('userid')
      })
        .then(res => {
          console.log(res)
          this.itemList = res.data.data
        })
        .catch(err => {
          this.$message.error('请求失败')
        })
    },
    // 分享
    share () {},
    // 编辑
    edit () {},
    // 删除按钮
    remove () {}
  }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    background-color: #fff;
    /deep/ .el-button--primary {
      background-color: #00aaf0;
    }
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
          background-color: #00aaf0;
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
