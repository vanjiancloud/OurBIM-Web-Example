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
        <div class="table">
          <el-table :data="itemList" style="width: 100%;">
            <el-table-column prop="appid" label="应用ID">
            </el-table-column>
            <el-table-column prop="appName" label="应用名称">
            </el-table-column>
            <el-table-column prop="maxInstance" label="最大并发数量">
            </el-table-column>
            <el-table-column prop="applidStatus" label="状态"> </el-table-column
            ><el-table-column prop="createTime" label="上传日期">
            </el-table-column>
            <el-table-column prop="" label="操作">
              <!-- 分享 -->
               <button @click="share">
                <span>
                  <img src="../components/share.png" />
                </span>
              </button>
              <!-- 编辑 -->
               <button @click="edit">
                <span>
                  <img src="../components/edit.png" />
                </span>
              </button>
              <!-- 删除 -->
               <button @click="remove">
                <span>
                  <img src="../components/del.png" />
                </span>
              </button>
            </el-table-column>
          </el-table>
        </div>
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
      itemList: [],
      appid: '',
      appName: '',
      maxInstance: '',
      applidStatus: '',
      createTime: ''
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
          this.appid = res.data.data.appid
          this.appName = res.data.data.appName
          this.maxInstance = res.data.data.maxInstance
          this.applidStatus = res.data.data.applidStatus
          this.createTime = res.data.data.createTime
        })
        .catch(err => {
          this.$message.error('请求失败')
        })
    },
    // 分享
    share () {
      console.log('点击了分享');
    },
    // 编辑
    edit () {
      console.log('点击了编辑');
    },
    // 删除按钮
    remove () {
      console.log('点击了删除');
    }
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
      .table {
        margin-top: 20px;
        /deep/ .el-table thead {
          color: #fff;
        }
        /deep/ .el-table th {
          background-color: #00aaf0;
          text-align: center;
          font-size: 15px;
          font-weight: normal;
        }
        /deep/ .el-table td {
          text-align: center;
        }
        // 表头字体颜色
        /deep/ .el-table th>.cell {
          color: #fff;
        }
        //表格去横线
        /deep/ .el-table__row > td {
          border: none;
        }
        //表格去横线之去掉最下面的那一条线
        /deep/ .el-table::before {
          height: 0px;
        }
        // 第一列字体颜色
        /deep/ .el-table_1_column_1 {
          color: #00aaf0;
        }
        button {
          border: none;
          outline: none;
          height: 20px;
          margin-left: 30px;
          background-color: #fff;
        }
        button:hover {
          cursor: pointer;
        }
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
