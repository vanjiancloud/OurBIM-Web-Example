<template>
  <!-- 创建应用-->
  <div class="box">
    <!-- 步骤条 -->
    <div class="buzhou">
      <el-steps :active="active">
        <el-step :title="$t('Step')" :description="$t('setUP')"> </el-step>
        <el-step
          :title="$t('twoStep')"
          :description="$t('shangchuan')"
        ></el-step>
        <el-step :title="$t('threeStep')" :description="$t('finsh')"></el-step>
      </el-steps>
    </div>
    <!-- 第一步 创建应用项目信息-->
    <div class="first" v-show="isShow == 1">
      <!-- 图片 -->
      <div class="img">
        <img src="./icon.png" alt="" />
      </div>
      <div class="text">
        {{ $t('toCreate') }}
      </div>
      <!-- input框 -->
      <div class="input">
        <span style="color:red;margin-right:5px;font-size: 16px;">*</span>
        <span style="margin-right:5px;">{{ $t('application') }}</span>
        <el-input v-model="appName"></el-input>
      </div>
      <!-- 上传图片 -->
      <div class="picture">
        <!-- <div class="news">
          <span style="color:red;margin-right:5px;font-size: 16px;">*</span>
          <span style="margin-right:5px; font-size: 16px;  ">{{
            $t('Uploadc')
          }}</span>
        </div> -->
        <!-- 上传封面 -->
        <!-- <div class="cover">
          <el-upload
            :class="{ hide: hideUpload }"
            :action="baseURL + '/appli/postScreenImg'"
            :on-success="upLoadImg"
            name="fileUpload"
            :on-error="errorImg"
            list-type="picture-card"
            :limit="imglimit"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            accept=".png,.jpg,.jpeg"
            ref="upload"
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
        </div> -->
        <!-- <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog> -->
      </div>
      <!-- <div class="xiaoxi">
        <span style="color:red;margin-right:5px;font-size: 16px;">*</span>
        {{ $t('extensions') }}：.png .jpg .jpeg
      </div> -->
      <!-- 按钮 -->
      <div class="anNiu">
        <el-button @click="next" :loading="isLoading" type="primary">
          {{ $t('nextstep') }}
        </el-button>
      </div>
    </div>
    <!-- 第二步 上传BIM模型-->
    <div class="second" v-show="isShow == 2">
      <!-- 图标 -->
      <div class="img">
        <img src="./icon.png" alt="" />
      </div>
      <!-- 提示 -->
      <div class="text">
        {{ $t('Upload') }}
      </div>
      <!-- 单选框 -->
      <el-radio v-model="radio" label="1">{{ $t('UploadBIM') }}</el-radio>
      <el-radio disabled v-model="radio" label="2">
        {{ $t('Uploadto') }}
      </el-radio>
      <!-- 上传BIM模型 -->
      <div class="cover">
        <el-upload
          :on-success="upLoadModel"
          :on-error="errorModel"
          drag
          :action="baseURL + '/appli/postProjectModel'"
          name="fileUpload"
          :data="{
            appliId: appInfo.appid
          }"
          :limit="limit"
          multiple
          :on-change="onchange"
          :on-exceed="exceed"
          :on-remove="onremove"
          :before-upload="beforeModelUpload"
          accept=".rvt,.ifc,.fbx"
          ref="bimupload"
          :auto-upload="false"
        >
          <img src="./file.png" style="margin-top:70px" />
          <div class="el-upload__text">
            {{ $t('methods') }}<br />
            {{ $t('uploadLimit') }}<br />
            {{ $t('uploadGoBeyond') }}<br />
            <!-- {{ $t('xianzhi') }}<br />
            {{ $t('limit') }}<br /> -->
          </div>
        </el-upload>
      </div>

      <div
        style="margin:10px 40px;margin-top:-20px;text-align:left; font-size: 14px; "
      >
        <span style="color:red">*</span>
        文件默认打开初始的三维视图，请将文件在对应视图打开状态下保存，再上传。上传的BIM文件需要与中心文件分离，否则可能无法转换。
      </div>
      <div class="btn">
        <el-button
          @click="update"
          type="primary"
          :loading="isLoading"
          :disabled="disabl"
        >
          {{ $t('Render') }}
        </el-button>
      </div>
    </div>
    <!-- 第三步之上传成功-->
    <div class="third" v-show="isShow == 3">
      <div class="icon">
        <img src="./success.png" alt="" />
      </div>
      <span class="news">提交完成</span>
      <div class="button">
        <el-button @click="toManage" type="primary">
          {{ $t('manage') }}
        </el-button>
      </div>
    </div>
    <!-- 第三步之上传失败-->
    <div class="third" v-show="isShow == 4">
      <div class="icon">
        <img src="./error.png" alt="" />
      </div>
      <span class="news">上传模型失败</span>
      <div class="button">
        <el-button @click="toManage" type="primary">
          {{ $t('manage') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addProject, ProjectModel } from '@/api/my.js'
import { Getuserid } from '@/store/index.js'
import axios from '@/utils/request'

export default {
  name: 'found',
  data () {
    return {
      radio: '1', //单选框
      active: 1,
      isShow: 1,
      disabl: true, //按钮禁用
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      appName: '',
      baseURL: axios.defaults.baseURL,
      appImgSrc: [], // 封面图
      hideUpload: false, // 封面图添加按钮隐藏
      appInfo: '',
      appModel: [], // 上传模型
      imglimit: 1, // 上传封面图限制数量
      // limt: 1, // 限制模型数量
      bimupNumber: 0, // 监听
      appliId: '',
      fileUpload: '',
      limit:1,
      isLoading: false
    }
  },
  created(){
    console.log(666);
  },
  methods: {
    // 上传封面图
    upLoadImg (response, file, fileList) {
      this.appImgSrc.push(response.data)
    },
    // 上传封面图失败
    errorImg (err, file, fileList) {
      console.log(err)
    },
    // 上传模型失败
    errorModel (err, file, fileList) {
      this.isLoading = false
      console.log(err)
      this.isShow = 4
      this.$common.closeLoading()
    },
    // 下一步
    next () {
      if (this.appName !== '') {
        this.isLoading = true
        this.$common.openLoading('正在加载请稍后')
        // if (this.active++ > 3) this.active = 0
        addProject({
          userId: Getuserid(),
          appName: this.appName,
          screenImg: this.appImgSrc.toString()
        })
          .then(res => {
            this.isLoading = false
            if (res.data.code === 0) {
              this.appInfo = res.data.data
              this.appliId = res.data.data.appid
              // console.log(this.appInfo)
              this.$message.success('创建项目成功')
              this.$common.closeLoading()
              if (this.active++ > 3) this.active = 0
              this.isShow = 2
            } else if (res.data.code === 1) {
              this.$message.error('创建项目失败')
              this.$common.closeLoading()
            }
          })
          .catch(err => {
            this.isLoading = false
            console.log(err)
            this.$common.closeLoading()
            this.$message.error('创建失败，请稍后重试')
          })
      } else {
        this.$message.warning('请先创建项目名称')
      }
    },
    // 开始转换
    update () {
      this.isLoading = true
      // 上传bim模型
      this.$refs.bimupload.submit()
    },
    submit (status) {},
    //去往应用管理
    toManage () {
      this.$router.push('../manage')
      this.isShow = 1
    },

    // 预览图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 删除图片
    handleRemove (file) {
      this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let newarr = this.$common.deOneArr(this.appImgSrc, file.response.data)
          this.appImgSrc = newarr
          this.$refs.upload.handleRemove(file)
          this.hideUpload = false
          console.log(this.hideUpload)
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
    // 删除模型事件
    onremove (file, fileList) {
      console.log('onremove');
      this.bimupNumber--
      this.disabl = !this.disabl
    },
    // 添加模型文件
    onchange (file, fileList) {
      console.log(333,file, fileList);
      if (!file.response) {
        this.bimupNumber++
        console.log('this.bimupNumber',this.bimupNumber);
        this.disabl = !this.disabl
        console.log('this.disabl',this.disabl);
      }
    },
    // 上传模型成功
    upLoadModel (response, file, fileList) {
      this.isLoading = false
      this.appModel.push(response.data)
      // response等同于后端返回的res，根据response里的code判断状态
      // console.log(response)
      if (response.code === 0) {
        this.$message.success(response.message)
        if (this.bimupNumber === this.appModel.length) {
          this.$common.closeLoading()
          if (this.active++ > 3) this.active = 0
          this.isShow = 3
          this.disabl = !this.disabl
        }
      } else if (response.code === 1) {
        this.$message.error(response.message)
        if (this.bimupNumber === this.appModel.length) {
          this.$common.closeLoading()
          if (this.active++ > 3) this.active = 0
          this.isShow = 4
          this.disabl = !this.disabl
        }
      }
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
        this.hideUpload = false
      } else {
        this.hideUpload = true
      }
      return one || two || three
    },
    // 限制上传模型次数
    exceed () {
      this.$message.warning(`上传模型数量超过限制`)
    },
    // 上传bim模型前
    beforeModelUpload (file) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let listModel = ['rvt', 'ifc', 'fbx']
      const isLt = file.size / 1024 / 1024 < 200
       if(!isLt) {

          this.$message({

            message: '上传文件大小不能超过200MB!',

            type: 'warning'

          });

          return false;

        }
       
      let extension = false
      if (listModel.indexOf(testmsg) === -1) {
        extension = false
        this.isLoading = false
        this.$message.error('请上传支持的文件格式!')
      } else {
        extension = true
        this.$common.openLoading('上传模型中')
      }
      return extension
    }
  },
  watch: {
    // 监听路由变化，当路由发生变化的时候，重新加载组件
    $route (to, from) {
      window.location.reload()
    },
    disabl(){
      console.log(111);
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding-top: 38px;
  // 隐藏上传
  /deep/.hide .el-upload--picture-card {
    display: none;
  }
  .buzhou {
    width: 800px;
    margin: 0 auto;
    margin-top: 50px;
    /deep/ .el-step__description {
      font-size: 16px;
      // color: red;
    }
    /deep/.is-process {
      color: #c0c4cc !important;
      font-weight: 10 !important;
      border-color: #c0c4cc !important;
    }
  }
  .first {
    width: 560px;
    height: 480px;
    box-shadow: 0px 1px 13px 0px rgba(4, 0, 0, 0.1);
    border-radius: 12px;
    margin: 0 auto;
    margin-top: 50px;
    padding-top: 30px;
    /deep/ .el-button--primary {
      width: 140px;
      height: 40px;
      vertical-align: middle;
      background-color: #00aaf0;
      font-size: 17px;
    }
    .img {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      margin-bottom: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      text-align: center;
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: bold;
    }
    .input {
      margin-left: 100px;
      .el-input {
        width: 237px;
        margin: 0 auto;
      }
    }
    .picture {
      margin-left: 100px;
      margin-top: 40px;
      overflow: hidden;
      .news {
        float: left;
        // margin-left: 14px;
      }
      .cover {
        // background-color: red;
        float: left;
      }
    }
    .xiaoxi {
      font-size: 14px;
      text-align: center;
      margin-left: 30px;
      margin-top: 10px;
    }
    .anNiu {
      margin-top: 180px;
      // background-color: green;
      text-align: center;
    }
  }
  .second {
    width: 560px;
    // height: 530px;
    padding-bottom: 10px;
    box-shadow: 0px 1px 13px 0px rgba(4, 0, 0, 0.1);
    border-radius: 12px;
    margin: 0 auto;
    margin-top: 50px;
    padding-top: 30px;
    text-align: center;
    .img {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      margin: 0 auto;
      margin: 20px 0;
      font-size: 20px;
      font-weight: bold;
    }
    .radio {
      margin-right: 10px;
      /deep/ .el-radio__label {
        font-size: 16px;
      }
    }
    .cover {
      margin-top: 20px;
      margin-bottom: 25px;
      .el-upload__text {
        font-size: 16px;
      }
      /deep/ .el-upload-dragger {
        width: 476px;
        height: 232px;

        background-color: #f5f5f5;
      }
    }
    .btn {
      /deep/ .el-button--primary {
        width: 140px;
        height: 40px;
        vertical-align: middle;
        font-size: 16px;
      }
    }
  }
  .third {
    width: 560px;
    height: 480px;
    box-shadow: 0px 1px 13px 0px rgba(4, 0, 0, 0.1);
    border-radius: 12px;
    margin: 0 auto;
    margin-top: 50px;
    padding-top: 60px;
    text-align: center;
    .icon {
      width: 80px;
      height: 80px;
      margin: 0 auto;
      margin-bottom: 50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .news {
      font-size: 25px;
      font-weight: bold;
    }
    .button {
      margin-top: 50px;
      .el-button {
        width: 140px;
        height: 40px;
        font-size: 16px;
      }
    }
  }
}
</style>
