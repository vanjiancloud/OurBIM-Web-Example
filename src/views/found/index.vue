<template>
  <!-- 创建应用-->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 主体内容 -->
    <div class="container">
      <div class="content">
        <!-- 提示 -->
        <div class="text">您还可上传2个项目</div>
        <!-- 步骤条 -->
        <div class="buzhou" v-show="isHandle == 1">
          <el-steps :active="active">
            <el-step title="步骤一" description="创建应用项目信息"> </el-step>
            <el-step title="步骤二" description="上传BIM模型"></el-step>
            <el-step title="步骤三" description="上传完成"></el-step>
          </el-steps>
        </div>
        <div class="buzhou" v-show="isHandle == 2">
          <el-steps :active="active">
            <el-step title="步骤一" description="创建应用项目信息"> </el-step>
            <el-step title="步骤二" description="上传BIM模型"></el-step>
            <el-step title="步骤三" description="同时上传倾斜摄影"></el-step>
            <el-step title="步骤四" description="上传完成"></el-step>
          </el-steps>
        </div>
        <!-- 第一步 创建应用项目信息-->
        <div class="first" v-show="isShow == 1">
          <!-- 图片 -->
          <div class="img">
            <img src="./icon.png" alt="" />
          </div>
          <div class="text"><h3>创建应用</h3></div>
          <!-- input框 -->
          <div class="input">
            应用名称：
            <el-input v-model="appName" placeholder="请输入应用名称"></el-input>
          </div>
          <!-- 上传图片 -->
          <div class="picture">
            <div class="news">
              上传封面：
            </div>
            <!-- 上传封面 -->
            <div class="cover">
              <el-upload
                :action="baseURL + '/appli/postScreenImg'"
                :on-success="upLoadImg"
                name="fileUpload"
                :on-error="errorImg"
                :before-remove="handleRemove"
                list-type="picture-card"
                :limit="1"
                :on-exceed="handleExceed"
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
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete">
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </div>
          </div>
          <!-- 按钮 -->
          <div class="btn">
            <el-button @click="next" type="primary">
              下一步
            </el-button>
          </div>
        </div>
        <!-- 第二步 上传BIM模型-->
        <div class="second" v-show="isShow == 2">
          <!-- 图标 -->
          <div class="img">
            <img src="./icon.png" alt="" />
          </div>
          <div class="text"><h3>上传模型</h3></div>
          <!-- 复选框 -->
          <span style="margin-right: 40px; ">
            <input
              type="radio"
              name="upload"
              class="radio"
              @click="isHandle = 1"
            />仅上传BIM模型
          </span>
          <input
            type="radio"
            name="upload"
            class="radio"
            @click="isHandle = 2"
          />同时上传倾斜摄影模型
          <!-- 上传BIM模型 -->
          <div class="cover">
            <el-upload
              v-if="appInfo"
              class="upload-demo"
              :on-success="upLoadModel"
              drag
              :action="baseURL + '/appli/postProjectModel'"
              name="fileUpload"
              :data="{
                appliId: appInfo.appid
              }"
              multiple
            >
              <img src="./file.png" alt="" />
              <div class="el-upload__text">
                点击或将文件拖拽到这里上传 <br />
                支持扩展名：.rar .3dm .rvt .stl .fbx .skp...
              </div>
            </el-upload>
          </div>
          <div class="btn">
            <el-button @click="update" type="primary">
              开始转换
            </el-button>
          </div>
        </div>
        <!-- 第三步 同时上传倾斜摄影-->
        <div class="second" v-show="isShow == 3">
          <!-- 图标 -->
          v-show="isShow == 3"
          <div class="img">
            <img src="./book.png" alt="" />
          </div>
          <div class="text"><h3>上传模型</h3></div>
          <!-- 复选框 -->
          <span style="margin-right: 40px; ">
            <input
              type="radio"
              name="upload"
              class="radio"
              @click="isHandle = 1"
            />仅上传BIM模型
          </span>
          <input
            type="radio"
            name="upload"
            class="radio"
            @click="isHandle = 2"
          />同时上传倾斜摄影模型
          <!-- 上传BIM模型 -->
          <div class="cover">
            <el-upload
              v-if="appInfo"
              class="upload-demo"
              :on-success="upLoadModel"
              drag
              :action="baseURL + '/appli/postProjectModel'"
              name="fileUpload"
              :data="{
                appliId: appInfo.appid
              }"
              multiple
            >
              <img src="./file.png" alt="" />
              <div class="el-upload__text">
                点击或将文件拖拽到这里上传 <br />
                支持扩展名：.rar .3dm .rvt .stl .fbx .skp...
              </div>
            </el-upload>
          </div>
          <div class="btn">
            <el-button @click="update" type="primary">
              开始转换
            </el-button>
          </div>
        </div>
        <!-- 第四步 上传完成-->
        <div class="fourth" v-show="isShow == 4">
          <el-button
            style="margin-top: 12px; margin-left: 450px;"
            @click="finsh"
          >
            完成
          </el-button>
          正在上传，请稍后
        </div>
      </div>
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyFooter from '../components/myFooter.vue'
import myHeader from '../components/myHeader.vue'
import MyMain from '../components/myMain.vue'
import { addProject } from '@/api/my.js'
import axios from '@/utils/request'

export default {
  components: { myHeader, MyMain, MyFooter },
  name: 'found',
  data () {
    return {
      active: 0,
      isShow: 1,
      isHandle: 1,
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      appName: '',
      baseURL: axios.defaults.baseURL,
      appImgSrc: '',
      appInfo: null,
      userId: ''
    }
  },
  methods: {
    upLoadImg (response, file, fileList) {
      /**
       * @Author: zk
       * @Date: 2021-02-22 16:24:12
       * @description: 上传图片
       */

      this.appImgSrc = response.data
    },
    upLoadModel (response, file, fileList) {
      /**
       * @Author: zk
       * @Date: 2021-02-22 17:03:13
       * @description: 上传模型
       */

      this.appModel = response.data
    },
    errorImg (err, file, fileList) {
      /**
       * @Author: zk
       * @Date: 2021-02-22 16:28:11
       * @description: 上传失败
       */

      console.log(err)
    },
    // 下一步
    next () {
      if (this.active++ > 2) this.active = 0
      this.isShow = 2
      this.update()
    },
    // 开始转换
    update () {
      if (this.active++ > 2) this.active = 0
      this.isShow = 4
      addProject({
        userId: this.getCookie('userid'),
        appName: this.appName,
        screenImg: this.appImgSrc
      })
        .then(res => {
          if (res.data.code === 0) {
            this.appInfo = res.data.data
            this.$message.success('新建成功')
          } else if (res.data.code === 1) {
            this.$message.error('新建失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('上传失败，请上传模型')
        })
    },
    // 读取cookie中数据
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
    // 完成
    finsh () {
      // 数据重新加载
      this.$router.go(0)
    },
    // 限制上传图片张数
    handleExceed () {
      this.$message.warning(`您只能上传一张图片`)
    },
    // 删除图片
    handleRemove (file, appImgSrc) {
      return this.$confirm(`确定移除该图片吗？`)
      this.appImgSrc = ''
      console.log(file, appImgSrc)
    },
    // 放大图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .container {
    background-color: #fff;
    margin-bottom: 34px;
    height: 1037px;
    padding-top: 38px;
    .content {
      .text {
        margin-left: 40px;
        margin-bottom: 30px;
      }
      .buzhou {
        width: 800px;
        margin: 0 auto;
        margin-top: 50px;
      }
      .first {
        width: 561px;
        height: 450px;
        box-shadow: 0px 1px 13px 0px rgba(4, 0, 0, 0.1);
        border-radius: 12px;
        margin-left: 430px;
        margin-top: 50px;
        padding-top: 30px;
        position: absolute;
        /deep/ .el-button--primary {
          width: 140px;
          height: 40px;
          vertical-align: middle;
          background-color: #00aaf0;
        }
        .btn {
          position: relative;
          top: 180px;
          left: -140px;
        }
        .img {
          width: 50px;
          height: 50px;
          margin: 0 auto;
          margin-bottom: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          margin-left: 240px;
        }
        .input {
          margin-left: 120px;
          .el-input {
            width: 237px;
            margin: 0 auto;
          }
        }
        .picture {
          margin-left: 120px;
          margin-top: 40px;
          .news {
            float: left;
            margin-right: 5px;
          }
          .cover {
            float: left;
          }
        }
      }
      .second {
        width: 561px;
        height: 600px;
        box-shadow: 0px 1px 13px 0px rgba(4, 0, 0, 0.1);
        border-radius: 12px;
        margin-left: 430px;
        margin-top: 50px;
        padding-top: 30px;
        text-align: center;
        /deep/ .el-button--primary {
          width: 140px;
          height: 40px;
          vertical-align: middle;
          background-color: #00aaf0;
        }
        .radio {
          margin-right: 10px;
        }
        .cover {
          margin-top: 30px;
          margin-bottom: 50px;
          /deep/ .el-upload-dragger {
            width: 476px;
            height: 232px;
            background-color: #f5f5f5;
          }
          img {
            margin-top: 60px;
          }
        }
        .btn {
          margin-bottom: 25px;
        }
        .text {
          margin-top: 20px;
          margin-left: 1px;
        }
      }
      .third {
        width: 561px;
        height: 402px;
        // background-color: palevioletred;
        margin-left: 400px;
        margin-top: 50px;
        text-align: center;
        font-size: 25px;
      }
    }
  }
}
</style>
