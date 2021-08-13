<!--
 * @Author: zk
 * @Date: 2021-07-30 17:06:19
 * @LastEditors: zk
 * @LastEditTime: 2021-07-31 15:39:59
 * @description: 二维码框
-->
<template>
  <div class="qrcode-part">
    <div class="qrcode-title">
      <div class="" v-text="$t('webClient.qrcodePart.title')"></div>
      <div class="close-part">
        <i class="el-icon-close" @click.stop="closePart()"></i>
      </div>
    </div>
    <div class="detail-main">
      <div class="qr-code">
        <el-image
          :src="qrcodeInfo.tagUrl"
          :preview-src-list="[qrcodeInfo.tagUrl]"
        >
        </el-image>
        <el-form
          class="qrcode-el-form"
          ref="qrcode-elForm"
          :model="qrcodeInfo"
          :rules="qrcodeRules"
          size="medium"
          label-width="80px"
        >
          <el-form-item label="名称" prop="fileName">
            <el-input
              v-model="qrcodeInfo.fileName"
              placeholder="请输入名称"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-input
              v-model="qrcodeInfo.createTime"
              placeholder="请输入创建时间"
              readonly
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item label="下边距" prop="bottomMargin">
            <el-input
              v-model="qrcodeInfo.bottomMargin"
              placeholder="请输入下边距"
              :readonly="readonly.bottomMargin"
              clearable
            >
              <span slot="suffix">mm</span>
            </el-input>
          </el-form-item>
          <el-form-item label="左边距" prop="leftMargin">
            <el-input
              v-model="qrcodeInfo.leftMargin"
              placeholder="请输入左边距"
              :readonly="readonly.leftMargin"
              clearable
            >
              <span slot="suffix">mm</span>
            </el-input>
          </el-form-item>
          <el-form-item label="右边距" prop="rightMargin">
            <el-input
              v-model="qrcodeInfo.rightMargin"
              placeholder="请输入右边距"
              :readonly="readonly.rightMargin"
              clearable
            >
              <span slot="suffix">mm</span>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="medium" @click="downloadQrcode"
          >下载</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leafInfo: {
      type: Object,
      default: function () {},
    },
  },
  data() {
    return {
      readonly: {
        bottomMargin: true,
        leftMargin: true,
        rightMargin: true,
      },
      // qrcodeRules: {
      //   bottomMargin: [
      //     {
      //       required: true,
      //       message: "请输入下边距",
      //       trigger: "blur",
      //     },
      //   ],
      //   leftMargin: [
      //     {
      //       required: true,
      //       message: "请输入左边距",
      //       trigger: "blur",
      //     },
      //   ],
      //   rightMargin: [
      //     {
      //       required: true,
      //       message: "请输入右边距",
      //       trigger: "blur",
      //     },
      //   ],
      // },
      qrcodeInfo: {
        id: "09e8913468934cc98b66295d39e6bb20",
        fileName: "测试二维码",
        tagUrl:
          "http://cloud.ourbim.com:11011/vjapi/qrcode/09e8913468934cc98b66295d39e6bb20.jpg",
        childCount: null,
        parentId: "god",
        userId: null,
        createTime: "2021-07-30 15:32:13",
        projectId: "BIM2021052815033753",
        isDelete: null,
        leftMargin: "0.0",
        companyId: null,
        fileSuffix: null,
        isVisible: null,
        fileStorge: null,
        extraId: null,
        isFolder: "0",
        status: "0",
        location: "X=550.508 Y=1018.503 Z=49378.812",
        rotation: "P=0.000000 Y=0.044962 R=0.000000",
        scale: "X=1.000 Y=1.000 Z=1.000",
        rightMargin: "0.0",
        bottomMargin: "1256.3125",
      },
    };
  },
  mounted() {},
  methods: {
    downloadQrcode() {
      /**
       * @Author: zk
       * @Date: 2021-07-31 11:16:27
       * @description: 下载二维码
       */
      this.getUrlBase64(this.qrcodeInfo.tagUrl).then((base64) => {
        let link = document.createElement("a");
        link.href = base64;
        link.download = this.qrcodeInfo.fileName;
        link.click();
      });
    },
    getUrlBase64(url) {
      return new Promise((resolve) => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.crossOrigin = "Anonymous"; //允许跨域
        img.src = url;
        img.onload = function () {
          canvas.height = 300;
          canvas.width = 300;
          ctx.drawImage(img, 0, 0, 300, 300);
          let dataURL = canvas.toDataURL("image/png");
          canvas = null;
          resolve(dataURL);
        };
      });
    },
    closePart() {
      /**
       * @Author: zk
       * @Date: 2021-07-30 17:13:06
       * @description: 关闭二维码框
       */
      this.$parent.handleQrcode(false);
      this.$parent.isQrCodeClick = false;
    },
  },
};
</script>

<style lang="less" scoped>
.qrcode-part {
  pointer-events: auto;
  height: 53vh;
  width: 400px;
  position: absolute;
  top: 0;
  right: 0;
  margin: 2vh 20px 0 0;
  border-radius: 10px;
  width: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  .qrcode-title {
    display: flex;
    padding: 20px 15px 0 15px;
    color: #ffffff;
    .close-part {
      margin-left: auto;
      cursor: pointer;
    }
  }
  .detail-main {
    padding: 0 10px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 1vh;
    height: 47vh;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.3);
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.295);
    }
    .qr-code {
      text-align: center;
      .el-image {
        width: 120px;
      }
      .qrcode-el-form {
        margin-top: 20px;
        /deep/ .el-form-item__label {
          color: #fff;
        }
        /deep/ .el-input__inner {
          background-color: transparent;
          color: #fff;
        }
      }
    }
  }
}
</style>
