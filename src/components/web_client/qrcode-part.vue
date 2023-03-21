<!--
 * @Author: zk
 * @Date: 2021-07-30 17:06:19
 * @LastEditors: zk
 * @LastEditTime: 2021-08-17 14:59:05
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
    <div class="detail-main" v-if="qrcodeInfo">
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
      qrcodeInfo: null
    };
  },
  mounted() {
    this.qrcodeInfo = this.leafInfo.data.compData
  },
  watch: {
    leafInfo(newValue, oldValue) {
      this.qrcodeInfo = this.leafInfo.data.compData
    }
  },
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
  overflow: hidden;
  background-color: rgba(17,17,17,0.88);
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
      padding-bottom: 20px;
      .el-image {
        width: 120px;
      }
      .qrcode-el-form {
        margin-top: 50px;
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
