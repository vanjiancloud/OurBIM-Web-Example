<template>
  <!-- 应用管理 -->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>

    <!-- 中间主体内容 -->
    <div class="container">
      <div class="content">
        <!-- 消息提示 -->
        <div class="record">
          <!-- 消息提示 -->
          <div class="left">
            {{ $t('Youhave') }}&nbsp;
            <span style="color:#00aaf0;">{{ itemList.length }} </span>&nbsp;
            {{ $t('project') }}
          </div>
          <!-- 按钮 -->
          <!-- <div class="right">
            <el-button type="primary">{{ $t('link') }}</el-button>
          </div> -->
        </div>
        <!-- 表格 -->
        <div class="table">
          <el-table :data="itemList" style="width: 100%;font-size: 17px;">
            <el-table-column
              prop="appid"
              :label="$t('applicationid')"
            ></el-table-column>
            <el-table-column prop="appName" :label="$t('applyname')">
            </el-table-column>
            <el-table-column prop="maxInstance" :label="$t('maximum')">
            </el-table-column>
            <el-table-column :label="$t('state')">
              <template slot-scope="scope">
                <!-- 做自定义操作 需要改成template的形式,scope.row代表的是表格数据itemList中的每一项 -->
                {{ formatStatus(scope.row.applidStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('uploaddate')">
            </el-table-column>
            <el-table-column prop="" :label="$t('operation')">
              <!-- 分享 -->
              <!-- <button @click="share">
                <span>
                  <img src="../components/share.png" />
                </span>
              </button> -->
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
    <!-- <div class="page">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        background
        :total="400"
      >
      </el-pagination>
    </div> -->

    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
import { getProjectList } from '@/api/my.js'

export default {
  components: { myHeader, MyFooter },
  name: 'manage',
  data () {
    return {
      itemList: [], //数据列表
      appid: '', //应用ID
      appName: '', //应用名称
      maxInstance: '', //最大并发数量
      applidStatus: null, //状态
      createTime: '' //上传日期
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
        userid: this.getCookie('userid')
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

    // 根据传入的status做适配
    formatStatus (status) {
      const statusObj = {
        0: '未上传',
        1: '渲染中',
        2: '渲染完成'
      }
      return statusObj[status]
    },

    // 分享
    share () {
      console.log('点击了分享')
    },

    // 编辑
    edit () {
      console.log('点击了编辑')
    },

    // 删除按钮
    remove () {
      console.log('点击了删除')
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    background-color: #fff;
    margin-bottom: 34px;
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
        margin-bottom: 40px;
        /deep/ .el-table thead {
          color: #fff;
        }
        /deep/ .el-table th {
          background-color: #00aaf0;
          text-align: center;
          font-size: 17px;
          font-weight: normal;
        }
        /deep/ .el-table td {
          text-align: center;
        }
        // 表头字体颜色
        /deep/ .el-table th > .cell {
          color: #fff;
        }
        //表格去横线
        // /deep/ .el-table__row > td {
        //   border: none;
        // }
        //表格去横线之去掉最下面的那一条线
        // /deep/ .el-table::before {
        //   height: 0px;
        // }
        // 第一列字体颜色
        /deep/ .el-table_1_column_1 {
          color: #00aaf0;
        }
        button {
          border: none;
          outline: none;
          height: 20px;
          margin-left: 20px;
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
