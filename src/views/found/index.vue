<template>
  <!-- 创建应用-->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>

    <!-- 中间主体内容 -->
    <div class="container">
      <div class="content">
        <!-- 3步步骤条 -->
        <div class="buzhou" v-show="isHandle == 1">
          <el-steps :active="active">
            <el-step :title="$t('Step')" :description="$t('setUP')"> </el-step>
            <el-step
              :title="$t('twoStep')"
              :description="$t('shangchuan')"
            ></el-step>
            <el-step
              :title="$t('threeStep')"
              :description="$t('finsh')"
            ></el-step>
          </el-steps>
        </div>
        <!-- 4步步骤条 -->
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
          <div class="text">
            <h3>{{ $t('toCreate') }}</h3>
          </div>
          <!-- input框 -->
          <div class="input">
            <span style="color:red;margin-right:5px">*</span>
            <span style="margin-right:5px">{{ $t('application') }}</span>
            <el-input v-model="appName"></el-input>
          </div>
          <!-- 上传图片 -->
          <div class="picture">
            <div class="news">
              <!-- <span style="color:red;margin-right:5px">*</span> -->
              <span style="margin-right:5px">{{ $t('Uploadc') }}</span>
            </div>
            <!-- 上传封面 -->
            <div class="cover">
              <el-upload
                :action="baseURL + '/appli/postScreenImg'"
                :on-success="upLoadImg"
                name="fileUpload"
                :on-error="errorImg"
                list-type="picture-card"
                :limit="1"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                accept=".png,.jpg,.jpeg"
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
            </div>
          </div>
          <div class="xiaoxi">
            <span style="color:red;margin-right:5px">*</span>
            {{ $t('extensions') }}：.png .jpg .jpeg
          </div>
          <!-- 按钮 -->
          <div class="anNiu">
            <el-button @click="next" type="primary">
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
            <h3>{{ $t('Upload') }}</h3>
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
              drag
              :action="baseURL + '/appli/postProjectModel'"
              name="fileUpload"
              multiple
              :limit="1"
              :on-exceed="exceed"
              :before-upload="beforeModelUpload"
              accept=".rvt"
            >
              <img src="./file.png" style="margin-top:60px" />
              <div class="el-upload__text">
                {{ $t('methods') }}<br />
                {{ $t('xianzhi') }}<br />
                {{ $t('limit') }}
              </div>
            </el-upload>
          </div>
          <div class="btn">
            <el-button @click="update" type="primary" :disabled="disabl">
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
          <span class="news">提交失败</span>
          <div class="button">
            <el-button @click="toManage" type="primary">
              {{ $t('manage') }}
            </el-button>
          </div>
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
import { addProject, ProjectModel } from '@/api/my.js'
import { getuserid } from '@/store/index.js'
import axios from '@/utils/request'

export default {
  components: { myHeader, MyFooter },
  name: 'found',
  data () {
    return {
      radio: '1', //单选框
      active: 0,
      isShow: 1,
      isHandle: 1,
      disabl: true, //按钮禁用
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      appName: '',
      baseURL: axios.defaults.baseURL,
      appImgSrc: '',
      appInfo: '',
      appModel: '',
      appliId: ''
    }
  },
  methods: {
    // 上传封面图
    upLoadImg (response, file, fileList) {
      /**
       * @Author: zk
       * @Date: 2021-02-22 16:24:12
       * @description: 上传图片
       */

      this.appImgSrc = response.data
    },
    // 上传模型
    upLoadModel (response, file, fileList) {
      /**
       * @Author: zk
       * @Date: 2021-02-22 17:03:13
       * @description: 上传模型
       */

      this.appModel = response.data
      this.disabl = false
    },
    // 上传封面图失败
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
      if (!this.appName == '' && !this.appImgSrc == '') {
        if (this.active++ > 2) this.active = 0
        addProject({
          userId: getuserid(),
          appName: this.appName,
          screenImg: this.appImgSrc
        })
          .then(res => {
            if (res.data.code === 0) {
              this.appInfo = res.data.data
              this.appliId= res.data.data.appliId
              console.log(this.appInfo)
              this.$message.success('创建应用成功')
              this.isShow = 2
            } else if (res.data.code === 1) {
              this.$message.error('项目新建失败')
              // alert("项目新建失败")
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error('创建失败，请创建应用')
          })
      } else {
        this.$message.warning('请先创建应用名称并上传封面')
      }
    },
    // 开始渲染
    update () {
      if (this.active++ > 2) this.active = 0
      ProjectModel({
          appliId:this.appliId,
          appModel:this.appModel
        })
          .then(res => {
            if (res.data.code === 0) {
              console.log(res)
              this.$message.success('上传模型成功')
              this.isShow = 3
            } else if (res.data.code === 1) {
              this.$message.error('上传模型失败')
              this.isShow = 4
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error('上传失败，请重新上传')
          })
    },
    //去往应用管理
    toManage () {
      this.$router.push('../manage')
      this.$router.go(0)
    },
    // 限制上传图片张数
    handleExceed () {
      this.$message.warning(`您只能上传一张图片`)
    },
    // 删除图片
    // handleRemove (file) {
    //   this.$confirm('此操作将删除当前图片, 是否继续?', '提示')
    //   if (this.$confirm == '确定') {
    //     file.url == ''
    //   }
    // },

    // 放大图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
    // 限制上传模型格式
    beforeModelUpload (file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'rvt'
      if (!extension) {
        this.$message.error('上传模型只能是.rvt格式!')
      }
      return extension
    },
    // 限制上传模型次数
    exceed () {
      this.$message.warning(`您只能上传一个模型`)
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.box {
  .container {
    background-color: #fff;
    margin-bottom: 34px;
    height: 961px;
    padding-top: 38px;
    .content {
      .buzhou {
        width: 800px;
        margin: 0 auto;
        margin-top: 50px;
        /deep/ .el-step__description {
          font-size: 17px;
        }
      }
      .first {
        width: 560px;
        height: 480px;
        box-shadow: 0px 1px 13px 0px rgba(4, 0, 0, 0.1);
        border-radius: 12px;
        margin-left: 430px;
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
            margin-left: 14px;
          }
          .cover {
            // background-color: red;
            float: left;
          }
        }
        .xiaoxi {
          font-size: 14px;
          text-align: center;
          margin-top: 5px;
        }
        .anNiu {
          margin-top: 20px;
          // background-color: green;
          text-align: center;
        }
      }
      .second {
        width: 560px;
        height: 530px;
        box-shadow: 0px 1px 13px 0px rgba(4, 0, 0, 0.1);
        border-radius: 12px;
        margin-left: 430px;
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
        margin-left: 430px;
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
  }
}
</style>
