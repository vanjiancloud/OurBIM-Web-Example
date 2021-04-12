<template>
  <!-- 应用管理 -->
  <div class="box">
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
        <el-table-column prop="appid" :label="$t('applicationid')">
        </el-table-column>
        <el-table-column prop="appName" :label="$t('applyname')">
        </el-table-column>
        <el-table-column prop="maxInstance" :label="$t('maximum')">
        </el-table-column>
        <el-table-column :label="$t('state')">
          <template slot-scope="scope">
            <!-- 做自定义操作 需要改成template的形式,scope.row代表的是表格数据itemList中的每一项 -->
            {{ formatStatus(scope.row.applidStatus) }}
            <el-progress
              :text-inside="true"
              :percentage="scope.row.progress"
              :show-text="true"
              :stroke-width="15"
              :color="customColor"
              v-if="scope.row.applidStatus === '1' ? true : false"
            >
            </el-progress>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('uploaddate')"
          width="200"
        >
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              @click="edit(scope.row), (dialogFormVisible = true)"
              type="text"
              class="btn-one"
              :disabled="scope.row.applidStatus === '4' ? true : false"
              v-if="scope.row.applidStatus === '5' ? false : true"
            >
              {{ $t('edit') }}
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
        <el-table-column label="进入项目">
          <template slot-scope="scope">
            <el-button
              @click="GoApp(scope.row)"
              :disabled="scope.row.applidStatus === '2' ? false : true"
              :class="scope.row.applidStatus === '2' ? 'ff' : 'bbb'"
            >
              {{ $t('into') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog框 -->
    <el-dialog
      title="编辑项目"
      :visible.sync="dialogFormVisible"
      center
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="content">
        <el-form :model="form">
          <el-form-item label="项目名称：" label-width="110px">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="最大并发数：" label-width="110px">
            <el-input
              v-model="form.maxInstance"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="修改封面：" label-width="110px"> -->
          <!-- <el-upload
              :action="baseURL + '/appli/postScreenImg'"
              :on-success="upLoadImg"
              name="fileUpload"
              :on-error="errorImg"
              list-type="picture-card"
              :limit="1"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              accept=".png,.jpg,.jpeg"
              ref="upload"
              :file-list="fileList"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload> -->
          <!-- <div class="xiaoxi">
              {{ $t('extensions') }}：.png .jpg .jpeg
            </div> -->
          <!-- </el-form-item> -->
          <!-- <el-form-item label="上传模型" :label-width="formLabelWidth">
              <el-upload
                :on-success="upLoadModel"
                drag
                :action="baseURL + '/appli/postProjectModel'"
                name="fileUpload"
                :data="{
                  appliId: appInfo.appid
                }"
                multiple
                :limit="1"
                :on-exceed="exceed"
                :before-upload="beforeModelUpload"
                accept=".rvt"
                :disabled="this.form.applidStatus === 0 ? false : true"
              >
                <img src="./file.png" style="margin-top:60px" />
                <div class="el-upload__text">
                  {{ $t('methods') }}<br />
                  {{ $t('xianzhi') }}<br />
                  {{ $t('limit') }}
                </div>
              </el-upload>
            </el-form-item> -->
          <el-form-item label="鼠标操作模式：">
            <el-select v-model="form.doMouse" placeholder="请选择操作模式">
              <el-option label="非锁定模式" value="0"></el-option>
              <el-option label="锁定模式" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="窗口显示模式：">
            <el-select
              v-model="form.displayWindow"
              placeholder="请选择显示模式"
            >
              <el-option label="完全填充" value="0"></el-option>
              <el-option label="尽量填充" value="1"></el-option>
              <el-option label="原始大小" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="amend()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectList, deleteProject, updateProject } from '@/api/my.js'
import MODELAPI from "@/api/model_api";
import { Getuserid } from '@/store/index.js'
import axios from '@/utils/request'

export default {
  name: 'manage',
  data () {
    return {
      itemList: [], //数据列表
      appid: '', //应用ID
      appName: '', //应用名称
      maxInstance: '', //最大并发数量
      applidStatus: null, //状态
      createTime: '', //上传日期
      timer: null, //定时器
      display: false, //转换进度条默认隐藏
      customColor: '#00AAF0', //进度条颜色
      baseURL: axios.defaults.baseURL,
      appInfo: '',
      appliId: '',
      fileUpload: '',
      fileList: [{ url: '' }], //上传图片列表显示
      dialogFormVisible: false,
      //编辑应用表单
      form: {
        name: '',
        maxInstance: '',
        appid: '',
        screenImg: '',
        appModel: '',
        dialogImageUrl: '',
        applidStatus: null,
        displayWindow: [
          {
            value: '0',
            label: '完全填充'
          },
          {
            value: '1',
            label: '尽量填充'
          },
          {
            value: '2',
            label: '原始大小'
          }
        ],
        doMouse: [
          {
            value: '0',
            label: '非锁定模式'
          },
          {
            value: '1',
            label: '锁定模式'
          }
        ]
      }
    }
  },
  created () {
    this.GetList()
    // this.setGetdataIn()
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

    // 编辑按钮
    edit (e) {
      console.log(e)
      this.form.name = e.appName
      this.form.appid = e.appid
      this.form.displayWindow = e.displayWindow
      this.form.doMouse = e.doMouse
      this.form.maxInstance = e.maxInstance
      this.form.applidStatus = e.applidStatus
      this.form.screenImg = e.screenImg
      for (let index = 0; index < this.fileList.length; index++) {
        this.fileList[index].url = e.screenImg
      }
    },
    //确定修改
    amend () {
      let param = this.form
      // 1 验证必填项
      const verify = {
        name: '项目名称'
        // screenImg: '封面'
      }
      console.log(param)
      for (const k in verify) {
        const val = Array.isArray(param[k]) ? param[k][0] : param[k]
        if (!this.$common.noNull(val)) {
          this.$common.message(verify[k] + ' 不能为空', 'warning') // 提示信息
          return
        }
      }
      this.$common.openLoading('正在加载中....')
      updateProject({
        appid: this.form.appid,
        appName: this.form.name,
        doMouse: this.form.doMouse,
        displayWindow: this.form.displayWindow,
        screenImg: this.form.screenImg
        // appModel: this.form.appModel
      })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res)
            this.$message.success('编辑成功')
            this.$common.closeLoading()
            this.GetList()
            this.dialogFormVisible = false
          } else if (res.data.code === 1) {
            console.log(res)
            this.$message.error('编辑失败')
            this.dialogFormVisible = false
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('修改信息失败,请重新修改')
        })
    },
    // 删除按钮
    remove (e) {
      console.log(e)
      console.log(e.progress)
      this.$confirm('此操作将删除该应用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.del(e)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //删除应用
    del (e) {
      deleteProject({
        appliId: e.appid,
        userid: getuserid()
      })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res)
            this.$message.success(res.data.message)
            this.GetList()
          } else if (res.data.code === 1) {
            console.log(res)
            this.$message.warning(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('删除失败')
        })
    },
    //进入应用
    GoApp (e) {
      MODELAPI.GETBIMTOKEN({
        appid: e.appid
      })
      .then(res => {
        if (res.data.code === 0) {
          const { href } = this.$router.resolve({
            name: 'web_client',
            query: {
              appid: e.appid,
              locale: this.$i18n.locale,
              token: res.data.data.token
            }
          })
          window.open(href, '_blank')
        }else{
          this.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      })
      .catch(err => {
        this.$message({
            type: 'error',
            message: err.data.message
          })
      })      
    },
    // 上传封面图
    upLoadImg (response, file, fileList) {
      this.form.screenImg = response.data
    },
    // 上传模型
    upLoadModel (response, file, fileList) {
      console.log('模型上传成功')
      this.$message.success('模型上传成功')
      this.form.appModel = response.data
      this.disabl = false
    },
    // 上传封面图失败
    errorImg (err, file, fileList) {
      console.log(err)
    },
    // 删除图片
    handleRemove (file) {
      this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.form.screenImg = ''
          // 删除文件
          this.$refs.upload.clearFiles()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 限制上传封面次数
    handleExceed () {
      this.$message.warning(`亲，只能上传一张图片哦！`)
    },
    // 限制上传封面格式
    beforeUpload (file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const one = testmsg === 'jpg'
      const two = testmsg === 'jpeg'
      const three = testmsg === 'png'
      if (!one && !two && !three) {
        this.$message.error('上传封面只能是.jpg .jpeg .png格式!')
      }
      return one || two || three
    },
    // 限制上传模型次数
    exceed () {
      this.$message.warning(`您只能上传一个模型`)
    },
    // 限制上传模型格式
    beforeModelUpload (file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'rvt'
      if (!extension) {
        this.$message.error('上传模型只能是.rvt格式!')
      }
      return extension
    }
  },
  mounted () {
    //禁用返回键
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener(
        'popstate',
        function () {
          history.pushState(null, null, document.URL)
        },
        false
      )
    }
  },
  watch: {
    $route () {
      this.GetList()
      clearInterval(this.timer)
    }
  },
  activated () {
    this.timer = setInterval(() => {
      this.GetList()
      // console.log('每隔5秒更新应用管理')
    }, 5000)
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
      top: 0px;
    }
  }
  .table {
    margin-top: 20px;
    margin-bottom: 40px;
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
    /deep/ .el-table_1_column_1 {
      color: #00aaf0;
    }
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
  }
}
</style>
