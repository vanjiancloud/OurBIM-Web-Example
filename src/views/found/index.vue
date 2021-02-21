<template>
  <!-- 创建应用-->
  <div class="box">
    <!-- 头部 -->
    <my-header></my-header>
    <!-- 中间 -->
    <my-main></my-main>
    <!-- 自己写的 -->
    <div class="container">
      <div class="content">
        <div class="text">您还可上传2个项目</div>
        <div class="buzhou">
          <el-steps :active="active" finish-status="success">
            <el-step title="步骤 1" description="创建应用项目信息"> </el-step>
            <el-step title="步骤 2" description="上传BIM模型"></el-step>
            <el-step title="步骤 3" description="上传完成"></el-step>
          </el-steps>
        </div>

        <div class="first" v-show="isShow == 1">
          <el-button
            style="margin-top: 12px; margin-left: 450px;"
            @click="next"
          >
            下一步
          </el-button>
          <div class="img">
            <img src="./icon.png" alt="" />
          </div>
          <div class="text"><h3>创建应用</h3></div>
          <div class="input">
            应用名称：
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </div>
          <div class="picture">
            <div class="news">
              上传封面：
            </div>
            <div class="cover">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
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
                      @click="handleDownload(file)"
                    >
                      <i class="el-icon-download"></i>
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
        </div>
        <div class="second" v-show="isShow == 2">
          <el-button style="margin-top: 12px; margin-left: 450px;" @click="two">
            下一步
          </el-button>
          <div class="img">
            <img src="./icon.png" alt="" />
          </div>
          <div class="text"><h3>上传BIM模型</h3></div>
          <div class="cover">
            <el-upload
              class="upload-demo"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </div>
        </div>
        <div class="third" v-show="isShow == 3">
          <el-button
            style="margin-top: 12px; margin-left: 450px;"
            @click="three"
          >
            完成
          </el-button>
          恭喜上传完成！
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
export default {
  components: { myHeader, MyMain, MyFooter },
  data () {
    return {
      active: 0,
      isShow: 1,
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  methods: {
    next () {
      if (this.active++ > 2) this.active = 0
      this.isShow = 2
    },
    two () {
      if (this.active++ > 2) this.active = 0
      this.isShow = 3
    },
    three () {
      // 数据重新加载
    },
    // 上传图片
    handleRemove (file) {
      console.log(file)
    },
    // 上传图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传图片
    handleDownload (file) {
      console.log(file)
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
        margin: 0 auto;
        margin-top: 50px;
        .img {
          width: 50px;
          height: 50px;
          margin: 0 auto;
          margin-top: -30px;
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
        margin: 0 auto;
        margin-top: 50px;
        .img {
          width: 50px;
          height: 50px;
          margin: 0 auto;
          margin-top: -30px;
          margin-bottom: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          margin-left: 220px;
        }
        .cover {
          margin-left: 100px;
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
}</style
>>
