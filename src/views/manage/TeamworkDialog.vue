<template>
  <el-dialog
    :title="status===1?'协同模式':'邀请好友'"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    :close-on-press-escape="false"
    width="35%"
  >
    <div class="nick-row" v-show="status === 1">
      <div class="nick"><span class="xingxing">*</span> 昵称</div>
      <div class="nick-input">
        <el-input
          v-model="nickName"
          placeholder="请输入内容"
          minlength="1"
          clearable
          :readonly="nickNameReadonly"
        ></el-input>
      </div>
    </div>
    <div class="nick-row margin-row" v-show="status === 2">
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
    <div v-show="status === 2">二维码：</div>
    <div class="code-img-row" v-show="status === 2">
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
    <span slot="footer" class="dialog-footer">
      <!-- 项目列表显示进入项目 -->
      <el-button type="primary" @click="goApp" v-show="status === 1"
        >进入项目</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import MODELAPI from "../../api/model_api";
import TeamModeApi from "../../api/team_mode";
export default {
  props: {
    status: {
      type: Number,
      default: 1,
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
      appInfo: {},
      nickNameReadonly: false,
      codeImg: "",
      loading: false,
    };
  },
  created() {},
  methods: {
    openDialog(info) {
      this.dialogVisible = true;
      this.appInfo = info;
      if (!this.teamUrl && this.status === 2) {
        this.addUrl();
      }
    },
    initData() {
      this.nickName = "";
      this.dialogVisible = false;
      this.teamUrl = "";

      this.nickNameReadonly = false;
      this.codeImg = "";
      this.loading = false;
      this.shareCode = null;
    },
    closeDialog() {
      this.nickName = "";
      this.appInfo = {};
      this.dialogVisible = false;
    },
    addUrl() {
      TeamModeApi.getTeamUrl({
        appId: this.appInfo.appid,
        code: this.shareCode,
        userId: JSON.parse(sessionStorage.getItem("userid")),
      }).then((res3) => {
        this.loading = false;
        if (res3.data.code !== 0) {
          this.$message.error(res3.data.message);
          return;
        }
        this.dialogVisible = true;
        this.teamUrl = res3.data.data.webShareUrl;
        this.codeImg = res3.data.data.qrurl;
        this.nickNameReadonly = true;
      });
    },
    dasda() {
      if (this.nickName === "") {
        return this.$message.error("昵称不能为空！");
      }
      this.loading = true;
      MODELAPI.GETBIMTOKEN({
        appid: this.appInfo.appid,
      }).then((res) => {
        if (res.data.code !== 0) {
          this.$message.error(res.data.message);
          this.loading = false;
          return;
        }
        MODELAPI.GETMODELINFO({
          appliId: this.appInfo.appid,
          token: res.data.data.token,
          userType: 1,
          nickName: this.nickName,
        }).then((res2) => {
          if (res2.data.code !== 0) {
            this.$message.error(res2.data.message);
            this.loading = false;
            return;
          }
          TeamModeApi.getTeamUrl({
            appId: this.appInfo.appid,
            code: res2.data.data.code,
            userId: JSON.parse(sessionStorage.getItem("userid")),
          }).then((res3) => {
            this.loading = false;
            if (res3.data.code !== 0) {
              this.$message.error(res3.data.message);
              return;
            }
            this.teamUrl = res3.data.data.webShareUrl;
            this.codeImg = res3.data.data.qrurl;
            this.nickNameReadonly = true;
          });
        });
      });
    },
    //     观察这
    //     userType:0
    // roomCode：
    goApp() {
      if (this.nickName === "") {
        return this.$message.error("昵称不能为空！");
      }
      this.$emit("goApp", this.appInfo, {
        userType: 1,
        nickName: this.nickName,
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