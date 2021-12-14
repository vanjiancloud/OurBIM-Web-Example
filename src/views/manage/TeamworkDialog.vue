<template>
  <el-dialog title="协同模式" :visible.sync="dialogVisible" width="30%">
    <div class="nick-row">
      <div class="nick">昵称</div>
      <div class="nick-input">
        <el-input v-model="nickName" placeholder="请输入内容"></el-input>
      </div>
    </div>

    <div class="nick-row" v-show="status === 2">
      <div class="nick">链接</div>
      <div class="nick-input">
        <el-input placeholder="请输入内容" v-model="teamUrl" disabled>
          <template slot="append">复制</template>
        </el-input>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addUrl" v-show="status === 1"
        >生成链接</el-button
      >
      <el-button type="primary" @click="goApp">进入项目</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MODELAPI from "../../api/model_api";
export default {
  data() {
    return {
      nickName: "",
      dialogVisible: false,
      teamUrl: "",
      appInfo: {},
      status: 1,
    };
  },
  methods: {
    openDialog(info) {
      this.dialogVisible = true;
      this.appInfo = info;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.nickName = "";
      this.appInfo = {};
    },
    addUrl() {
      MODELAPI.GETBIMTOKEN({
        appid: this.appInfo.appid,
      }).then((res) => {
        if (res.data.code !== 0) {
          this.$message.error(res.data.message);
          return;
        }
        MODELAPI.GETMODELINFO({
          token: res.data.data.token,
          appliId: this.appInfo.appid,
          userType: 1,
          nickName: this.nickName,
        }).then((res2) => {
          if (res2.data.code !== 0) {
            this.$message.error(res2.data.message);
            return;
          }
          this.teamUrl = res.data.data.url;
          this.status = 2;
          this.goAppInfo = res;
        });
      });
    },
    goApp() {
      console.log(55);
      this.$emit("goApp", this.appInfo,1);
    },
  },
};
</script>

<style lang="less" scoped>
.nick-row {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  .nick {
    margin-right: 20px;
  }
  .nick-input {
    width: 80%;
  }
}
</style>