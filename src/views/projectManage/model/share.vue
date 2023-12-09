<template>
  <el-dialog
    title="分享项目链接"
    :visible.sync="visible"
    center
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
  >
    <div class="box-one" v-show="isShow == 1">
      <el-form :model="formShare">
        <el-form-item label="有效期" label-width="110px">
          <el-radio v-model="formShare.days" label="999">永久</el-radio>
          <el-radio v-model="formShare.days" label="30">30天</el-radio>
          <el-radio v-model="formShare.days" label="7">7天</el-radio>
          <el-radio v-model="formShare.days" label="1">1天</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" class="btn-one">取 消</el-button>
        <el-button type="primary" @click="confirm()" class="btn-two"
          >确 认</el-button
        >
      </div>
    </div>
    <div class="box-two" v-show="isShow == 2">
      <div class="title">通过QQ、微信等分享给好友吧</div>
      <el-form :model="formShare">
        <el-form-item label="链接：">
          <el-input
            v-model="formShare.webShareUrl"
            autocomplete="off"
            :disabled="true"
            class="input"
          >
          </el-input>
          <el-button
            type="primary"
            class="btn"
            v-clipboard:copy="formShare.webShareUrl"
            v-clipboard:success="onCopyUrl"
            v-clipboard:error="onErrorUrl"
            >复制链接</el-button
          >
        </el-form-item>
        <el-form-item label="二维码：">
          <!-- 通过ref获取dom -->
          <div class="share" ref="foo">
            <img :src="formShare.qrurl" alt="" />
          </div>
          <div class="new">
            将二维码分享给好友，对方微信、<br />
            钉钉等扫一扫即可访问BIM场景
          </div>
          <el-button type="primary" class="botton" @click="copyImg">
            复制二维码
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { urlToblob } from "@/utils/file.js";
import { Getuserid } from "@/store/index.js";
import { getWebUrl } from "@/api/projectManage/model.js";
export default {
  data() {
    return {
      visible:false,
      isShow: "1",
      formShare: {
        days: "999", //链接有效期
        qrurl: "", //二维码图片地址
        webShareUrl: "" //链接地址
      },
      appid:''
    };
  },
  methods: {
    show(e){
      this.appid = e
      this.visible = true
    },
    hide(){
      this.visible = false
    },
    //确定分享
    confirm() {
      this.$common.openLoading("正在加载中....");
      getWebUrl({
        appid: this.appid,
        days: this.formShare.days,
        userid: Getuserid()
      })
        .then(res => {
            this.isShow = 2;
            this.formShare.qrurl = res.data.qrurl;
            this.formShare.webShareUrl = res.data.webShareUrl;
            this.$message.success(res.message);
          this.$common.closeLoading();
        })
        .catch(err => {
          this.$common.closeLoading();
          this.hide()
        });
    },

    handleClose() {
      this.isShow = 1;
      this.formShare.days = "999";
      this.hide()
    },

    // 复制二维码图片
    async copyImg() {
      // 剪切板只有image/png格式才行，其他图片格式报错
      urlToblob(this.formShare.qrurl, async blob => {
        const item = new ClipboardItem({
          [blob.type]: blob
        });
        navigator.clipboard.write([item]).then(
          res => {
            this.$message.success("二维码复制成功！");
          },
          err => {
            this.$message.error("二维码复制失败！", err);
          }
        );
      });
    },
    //复制链接成功
    onCopyUrl: function(e) {
      this.$message.success("链接复制成功！");
    },
    //复制链接失败
    onErrorUrl: function(e) {
      this.$message.error("复制失败！");
    }
  }
};
</script>

<style lang="less" scoped>
.box-one {
  display: flex;
  justify-content: center;
  position: relative;
  .el-form {
    margin-bottom: 50px;
  }
  .dialog-footer {
    position: absolute;
    // left: 42%;
    top: 65%;
    // .btn-one {
    // margin-right: 60px;
    // margin-left: -30px;
    // }
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
</style>
