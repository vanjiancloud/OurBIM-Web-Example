<template>
  <!-- 编辑应用 -->
  <div class="content">
    <!-- 头部 -->
    <my-header></my-header>

    <!-- 中间主体内容 -->
    <div class="container">
      <!-- 基本信息 -->
      <div class="info">
        <div class="hint">基本信息</div>
        <div class="table">
          <table>
            <tr>
              <td class="first">应用名称</td>
              <td>
                <el-input v-model="input" placeholder="请输入内容"></el-input>
              </td>
            </tr>
            <tr>
              <td class="first">最大并发数</td>
              <td>基本信息</td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 上传文件 -->
      <div class="file">
        <div class="hint">上传文件</div>

        <div class="cover">
          <span>修改封面:</span>
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
          <div class="xiaoxi">
            <!-- <span style="color:red;margin-right:5px">*</span> -->
            {{ $t('extensions') }}：.png .jpg .jpeg
          </div>
        </div>

        <span>上传模型:</span>
        <div class="cover">
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
          >
            <img src="./file.png" style="margin-top:60px" />
            <div class="el-upload__text">
              {{ $t('methods') }}<br />
              {{ $t('xianzhi') }}<br />
              {{ $t('limit') }}
            </div>
          </el-upload>
        </div>
      </div>
      <!-- 交互操作 -->
      <div class="handle">
        <div class="hint">交互操作</div>
        <div class="table">
          <table>
            <tr>
              <td class="first">鼠标操作模式</td>
              <td>
                <el-select v-model="value">
                  <el-option
                    v-for="item in option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="first">窗口显示模式</td>
              <td>
                <el-select v-model="values">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="btn">
        <el-button type="warning" @click="giveUp">放弃修改</el-button>
        <el-button class="button" @click="save" type="success"
          >保存修改</el-button
        >
      </div>
    </div>
    <!-- 尾部 -->
    <my-footer></my-footer>
  </div>
</template>

<script>
import myHeader from '../components/myHeader.vue'
import myFooter from '../components/myFooter.vue'
import axios from '@/utils/request'
import { addProject, ProjectModel } from '@/api/my.js'
import { getuserid } from '@/store/index.js'

export default {
  components: { myHeader, myFooter },
  name: 'manage',
  data () {
    return {
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      appName: '',
      baseURL: axios.defaults.baseURL,
      appImgSrc: '',
      appInfo: '',
      appModel: '',
      appliId: '',
      fileUpload: '',
      input: '',
      option: [
        {
          value: '选项1',
          label: '非锁定模式'
        },
        {
          value: '选项2',
          label: '锁定模式'
        }
      ],
      value: '',
      options: [
        {
          value: '选项1',
          label: '完全填充'
        },
        {
          value: '选项2',
          label: '尽量填充'
        },
        {
          value: '选项3',
          label: '原始大小'
        }
      ],
      values: ''
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
      console.log('模型上传成功')
      this.$message.success('模型上传成功')
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
    },
    giveUp () {
      this.$router.push('../manage')
    },
    save () {
      this.$router.push('../manage')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  .container {
    height: 961px;
    background-color: #fff;
    margin-bottom: 34px;
    padding-top: 10px;

    .info {
      // width: 600px;
      margin: 0 auto;
      .hint {
        text-align: center;
        font-size: 20px;
        margin: 20px 0;
      }
      .table {
        width: 350px;
        margin: 0 auto;
        table,
        tr,
        td {
          border: 1px solid #000;
          border-collapse: collapse;
          height: 30px;
          padding-left: 10px;
        }
        table {
          width: 100%;
          .first {
            width: 140px;
          }
        }
        /deep/ .el-input__inner {
          height: 100%;
          border: none;
          outline: none;
          color: #000;
          font-size: 16px;
          margin-left: -10px;
        }
      }
    }
    .file {
      width: 600px;
      margin: 0 auto;
      text-align: center;

      .hint {
        text-align: center;
        font-size: 20px;
        margin: 20px 0;
      }
      span {
        float: left;
      }
      .cover {
      }
      .xiaoxi {
        font-size: 14px;
        margin-bottom: 10px;
      }
    }
    .handle {
      // width: 600px;
      margin: 0 auto;
      .hint {
        text-align: center;
        font-size: 20px;
        margin: 20px 0;
      }
      span {
        float: left;
      }
      .table {
        width: 350px;
        margin: 0 auto;
        table,
        tr,
        td {
          border: 1px solid #000;
          border-collapse: collapse;
        }
        table {
          width: 100%;
          .first {
            width: 140px;
            text-align: center;
          }
          /deep/ .el-input__inner {
            border: none;
            outline: none;
            color: black;
            font-size: 17px;
          }
          /deep/ .el-select-dropdown__item.selected {
            color: black;
            font-size: 17px;
          }
        }
      }
    }
    .btn {
      margin: 0 auto;
      width: 400px;
      margin-top: 50px;
      // background-color: red;
      .button {
        float: right;
        // background-color: blue;
      }
    }
  }
}
</style>
