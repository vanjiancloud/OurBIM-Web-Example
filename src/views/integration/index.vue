<template>
  <div class="box">
    <!-- 项目集成 -->
    <div class="projiect" v-show="isShow == 1">
      <!-- 消息提示 -->
      <div class="record">
        <div class="left">
          {{ $t('Youhave') }}
          <span style="color:#00aaf0;">{{ itemList.length }} </span>
          个集成项目
        </div>
        <!-- 新建集成 -->
        <div class="right">
          <el-button type="primary" @click="setUp">新建集成</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <el-table :data="itemList" style="width: 100%;" class="sheet">
          <el-table-column prop="appid" :label="$t('applicationid')">
          </el-table-column>
          <el-table-column prop="appName" :label="$t('applyname')">
          </el-table-column>
          <el-table-column prop="maxInstance" label="模型格式">
          </el-table-column>
          <el-table-column :label="$t('state')">
            <template slot-scope="scope">
              <!-- 做自定义操作 需要改成template的形式,scope.row代表的是表格数据itemList中的每一项 -->
              {{ formatStatus(scope.row.applidStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="集成时间" width="200">
          </el-table-column>
          <el-table-column :label="$t('operation')">
            <template slot-scope="scope">
              <!-- 预览 -->
              <el-button
                @click="edit(scope.row), (dialogFormVisible = true)"
                type="text"
                class="btn-one"
                :disabled="scope.row.applidStatus === '4' ? true : false"
                v-if="scope.row.applidStatus === '5' ? false : true"
              >
                预览
              </el-button>
              <!-- 删除 -->
              <el-button
                @click="remove(scope.row)"
                type="text"
                :class="scope.row.applidStatus === '1' ? 'gray' : 'red'"
                :disabled="scope.row.applidStatus === '1' ? true : false"
                v-if="scope.row.applidStatus === '5' ? false : true"
              >
                {{ $t('del') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新建项目 -->
    <div class="setUp" v-show="isShow == 2">
      <!-- 消息提示 -->
      <div class="record">
        <div class="left">
          {{ $t('Youhave') }}
          <span style="color:#00aaf0;">{{ itemList.length }} </span>
          个项目文件
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <el-table :data="itemList" style="width: 100%;" class="sheet">
          <el-table-column prop="appid" label="选择">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-table-column>
          <el-table-column prop="appName" label="文件名称"> </el-table-column>
          <el-table-column prop="applidStatus" label="专业">
            <el-select v-model="applidStatus" placeholder="请选择专业">
              <el-option label="其它" value="0"></el-option>
              <el-option label="建筑" value="1"></el-option>
              <el-option label="结构" value="2"></el-option>
              <el-option label="机电" value="3"></el-option>
            </el-select>
          </el-table-column>
          <el-table-column prop="applidStatus" label="楼层">
            <el-select v-model="floor" placeholder="请选择楼层">
              <el-option label="其它" value="0"></el-option>
              <el-option label="负一层" value="1"></el-option>
              <el-option label="一层" value="2"></el-option>
              <el-option label="二层" value="3"></el-option>
            </el-select>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn">
        <el-button plain @click="goBack">返回</el-button>
        <el-button type="primary" @click="begin">开始集成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectList, getWebUrl } from '@/api/my.js'
import { Getuserid } from '@/store/index.js'
export default {
  name: 'integration',
  data () {
    return {
      itemList: [], //数据列表
      appid: '', //应用ID
      appName: '', //应用名称
      // applidStatus: null, //状态
      createTime: '', //上传日期
      timer: null, //定时器
      appInfo: '',
      appliId: '',
      fileUpload: '',
      dialogFormVisible: false,
      dialogFormVisibleOne: false,
      isShow: '1',  //页面切换
      checked: '',  //选项框
      //专业
      applidStatus: [
        {
          value: '0',
          label: '其它'
        },
        {
          value: '1',
          label: '建筑'
        },
        {
          value: '2',
          label: '结构'
        },
        {
          value: '3',
          label: '机电'
        }
      ],
      //楼层
      floor: [
        {
          value: '0',
          label: '其它'
        },
        {
          value: '1',
          label: '负一层'
        },
        {
          value: '2',
          label: '一层'
        },
        {
          value: '3',
          label: '二层'
        }
      ]
    }
  },
  created () {
    this.GetList()
  },
  methods: {
    // 定时器每隔五秒获取数据
    // setGetdataIn () {
    //   this.timer = setInterval(() => {
    //     this.GetList()
    //     // console.log('每隔5秒更新应用管理')
    //   }, 5000)
    // },
    // 获取应用数据列表
    GetList () {
      getProjectList({
        userid: Getuserid()
      })
        .then(res => {
          // console.log(res, '应用数据列表')
          if (res.data.message == '查询成功') {
            this.itemList = res.data.data
            this.reverse()
            this.appid = res.data.data.appid
            this.appName = res.data.data.appName
            this.maxInstance = res.data.data.maxInstance
            this.applidStatus = res.data.data.applidStatus
            this.createTime = res.data.data.createTime
          } else if (res.data.message === '应用信息为空') {
            // this.$message.warning('暂无数据')
            this.itemList = ''
          }
        })
        .catch(err => {
          console.log(err)
          // this.$message.error('请求失败')
        })
    },
    //翻转数组
    reverse () {
      this.itemList.reverse()
    },
    // 根据传入的status做适配
    formatStatus (status) {
      const statusObj = {
        0: '未上传',
        1: '转换中',
        2: '转换完成',
        3: '转换失败',
        4: '文件损坏',
        5: '删除中'
      }
      return statusObj[status]
    },
    // 分享按钮
    share (e) {
      // console.log(e)
      this.formShare.appid = e.appid
    },
    // 关闭分享dialog
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.isShow = 1
          this.formShare.days = '999'
        })
        .catch(_ => {})
    },
    //确定分享
    confirm () {
      this.$common.openLoading('正在加载中....')
      getWebUrl({
        appid: this.formShare.appid,
        days: this.formShare.days,
        userid: Getuserid()
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.isShow = 2
            this.formShare.qrurl = res.data.data.qrurl
            this.formShare.webShareUrl = res.data.data.webShareUrl
            this.$message.success(res.data.message)
            this.$common.closeLoading()
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('分享失败,请重新选择')
          this.$common.closeLoading()
          this.dialogFormVisibleOne = false
        })
    },
    //新建集成
    setUp () {
      this.isShow = 2
    },
    // 返回
    goBack () {
      this.isShow = 1
    },
    // 开始集成
    begin () {
      this.messageBox()
    },
    // 弹框提示
    messageBox () {
      this.$confirm('操作成功，请在项目集成中查看。', '操作成功！', {
        confirmButtonText: '转到项目集成',
        cancelButtonText: '取消',
        type: 'success'
      })
        .then(() => {
          this.isShow = 1
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '取消查看'
          })
        })
    }
  },
  watch: {
    $route (to, from) {
      this.GetList()
      // clearInterval(this.timer)
      this.$router.go(0)
    }
  },
  // ===== 页面实例销毁 =====
  destroyed () {
    // 清除定时器
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.box {
  overflow: hidden;
  padding: 20px;
  /deep/ .el-button--primary {
    background-color: #00aaf0;
  }
  .record {
    font-size: 16px;
    position: relative;
    .right {
      position: absolute;
      right: 0px;
      bottom: -10px;
    }
  }
  .table {
    margin-top: 20px;
    margin-bottom: 40px;
    .sheet {
      font-size: 16px;
    }
    // 进度条里的文字
    /deep/ .el-progress-bar__innerText {
      color: #000;
      margin-top: -6px;
    }
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
    // /deep/ .el-table_1_column_1 {
    //   color: #00aaf0;
    // }
    .btn-one {
      font-size: 16px;
      color: #00aaf0;
    }
    .bbb {
      background-color: #bbb;
      color: #fff;
    }
    .ff {
      background-color: #00aaf0;
      color: #fff;
    }
    .red {
      font-size: 16px;
      color: #ff6600;
    }
    .gray {
      font-size: 16px;
      color: gray;
    }
    .blue {
      color: #00aaf0;
      font-size: 16px;
    }
  }
  .el-dialog {
    .content {
      display: flex;
      justify-content: center;
      .el-form {
        .el-input {
          width: 150px;
        }
        .el-select {
          width: 150px;
        }
      }
    }
    .box-one {
      display: flex;
      justify-content: center;
      position: relative;
      .el-form {
        margin-bottom: 50px;
      }
      .dialog-footer {
        position: absolute;
        left: 42%;
        top: 65%;
        .btn-one {
          margin-right: 60px;
          margin-left: -30px;
        }
      }
    }
    .box-two {
      position: relative;
      .title {
        text-align: center;
        margin-top: -20px;
        margin-bottom: 30px;
      }
      .el-form {
        margin-left: 100px;
        .input {
          width: 250px;
        }
        /deep/ .el-input.is-disabled .el-input__inner {
          background-color: #f0f5fe;
        }
        .btn {
          margin-left: 30px;
        }
        .share {
          width: 150px;
          height: 150px;
          margin-left: 50px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .new {
          margin-left: 240px;
          margin-top: -100px;
        }
        .botton {
          margin-top: 15px;
          margin-left: 240px;
        }
      }
    }
  }
  .btn {
    text-align: center;
  }
}
</style>
