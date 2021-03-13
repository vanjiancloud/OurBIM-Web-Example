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
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <!-- 编辑 -->

                <el-button
                  @click="edit"
                  :disabled="scope.row.applidStatus === '4' ? true : false"
                  type="text"
                  class="btn-one"
                >
                  {{ $t('edit') }}
                </el-button>
                <!-- 删除 -->
                <el-button
                  @click="remove"
                  :disabled="scope.row.applidStatus === '4' ? true : false"
                  type="text"
                  class="btn-two"
                >
                  {{ $t('del') }}
                </el-button>
              </template>
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
import { getuserid } from '@/store/index.js'

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
      createTime: '', //上传日期
      timer: null
    }
  },
  created () {
    this.GetList()
  },
  methods: {
    // 分页
    handleCurrentChange () {
      /**
       * @Author: zk
       * @Date: 2021-02-22 17:46:30
       * @description: 分页
       */
    },

    // 获取应用数据列表
    GetList () {
      getProjectList({
        userid: getuserid()
      })
        .then(res => {
          console.log(res)
          this.itemList = res.data.data
          this.appid = res.data.data.appid
          this.appName = res.data.data.appName
          this.maxInstance = res.data.data.maxInstance
          this.applidStatus = res.data.data.applidStatus
          this.createTime = res.data.data.createTime
          if (applidStatus === 0) {
            this.disabled = true
          }
        })
        .catch(err => {
          console.log(err)
          // this.$message.error('请求失败')
        })
    },
    reverse () {
      this.itemList.reverse()
    },
    // 根据传入的status做适配
    formatStatus (status) {
      const statusObj = {
        0: '未上传',
        1: '渲染中',
        2: '渲染完成',
        3: '转换失败',
        4: '项目损坏'
      }
      return statusObj[status]
    },

    // 编辑
    edit () {
      this.$router.push('./edit')
    },

    // 删除按钮
    remove () {
      console.log('点击了删除')
      this.$confirm('此操作将删除当前应用, 是否继续?', '提示')
      if (this.$confirm == '确定') {
      }
    }
  },

  //  把定时器放在activated事件里，当清除定时后，
  // 下次再次进入当前路由的话，可以再次唤起定时器
  activated () {
    this.timer = setInterval(() => {
      this.GetList()
      console.log('每隔5秒更新应用管理')
    }, 5000)
  },
  // 路由跳转清除定时
  beforeRouteLeave (to, from, next) {
    next()
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    background-color: #fff;
    margin-bottom: 34px;
    // height: 961px;
    min-height: 961px;
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
        .btn-one {
          font-size: 16px;
          color: #00aaf0;
          margin-right: 20px;
        }
        .btn-two {
          font-size: 16px;
          color: red;
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
