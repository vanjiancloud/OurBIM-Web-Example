<template>
  <el-dialog
    title="协同模式"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    :close-on-press-escape="false"
    width="35%"
  >
    <el-row
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="nick-row margin-row">
        <div class="nick">链接</div>
        <div class="nick-input">
          <el-input placeholder="请输入内容" v-model="teamUrl" readonly>
            <template slot="append">
              <el-button
                type="info"
                class="btn"
                v-clipboard:copy="teamUrl"
                v-clipboard:success="onCopyUrl"
                v-clipboard:error="onErrorUrl"
                >复制链接</el-button
              >
            </template>
          </el-input>
        </div>
      </div>
      <div>二维码：</div>
      <div class="code-img-row">
        <div><img :src="codeImg" alt="" class="codeImg" /></div>
        <div class="code-row-text">
          <div>将二维码分享给好友，对方微信、</div>
          <div>钉钉等扫一扫即可访问BIM场景</div>
          <div>
            <el-button
              type="primary"
              class="btn"
              v-clipboard:copy="teamUrl"
              v-clipboard:success="onCopyUrl"
              v-clipboard:error="onErrorUrl"
              >复制二维码</el-button
            >
          </div>
        </div>
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
import { getTeamUrl } from "@/api/projectManage/model.js";
export default {
  props: {
    appId: {
      type: String,
    },
    shareCode: {
      type: String,
    },
  },
  data() {
    return {
      nickName: "",
      dialogVisible: false,
      teamUrl: "",
      nickNameReadonly: false,
      codeImg: "",
      loading: false,
    };
  },
  created() {

  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.addUrl();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    addUrl() {
      let params = {
        appId: this.appId,
        code: this.shareCode,
        // userId: '5165161616161',
        userId: this.$route.query.userId || JSON.parse(sessionStorage.getItem("userid")),
      };
      if (this.$route.query.user) {
        params.userId = this.$route.query.user;
      }
      this.loading = true;
      getTeamUrl(params).then((res3) => {
        this.loading = false;
        this.dialogVisible = true;
        this.teamUrl = res3.data.webShareUrl;
        this.codeImg = res3.data.qrurl;
        this.nickNameReadonly = true;
      });
    },
    //复制链接成功
    onCopyUrl: function (e) {
      this.$message.success("链接复制成功！");
    },
    //复制链接失败
    onErrorUrl: function (e) {
      this.$message.error("复制失败！");
    },
  },
};
</script>

<style lang="less" scoped>
.nick-row {
  display: flex;
  align-items: center;
  width: 100%;
  // margin-bottom: 30px;
  .nick {
    margin-right: 20px;
  }
  .nick-input {
    width: 80%;
  }
}

/deep/ .el-input-group__append {
  cursor: pointer;
}

.code-img-row {
  margin-top: 20px;
  display: flex;
  .codeImg {
    width: 150px;
    height: 150px;
    margin: 0 60px;
  }
  .code-row-text > div {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

.margin-row {
  margin: 30px 0;
}

.notice {
  color: red;
  margin-top: 30px;
}

.xingxing {
  color: red;
}
</style>