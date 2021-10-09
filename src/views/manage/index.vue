<template>
  <!-- 应用管理 -->
  <div class="box">
    <!-- 消息提示 -->
    <div class="record">
      <!-- 消息提示 -->
      <div class="left">
        {{ $t("Youhave") }}&nbsp;
        <span style="color: #00aaf0">{{ itemList.length }} </span>&nbsp;
        {{ $t("project") }}
      </div>
      <!-- 按钮 -->
      <div class="right">
        <el-button type="primary" @click="AddIntegrate">链接模型</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="itemList" style="width: 100%" class="sheet">
        <el-table-column prop="appName" :label="$t('applyname')" width="150">
          <template slot-scope="scope">
            <el-tooltip
              popper-class="app-name-tip"
              placement="top"
              effect="dark"
            >
              <div slot="content">{{ scope.row.appName }}</div>
              <div>
                {{ scope.row.appName }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="appid" :label="$t('applicationid')" width="130">
        </el-table-column>
        <el-table-column :label="$t('uploaddate')" width="120">
          <template slot-scope="scope">
            <div v-text="scope.row.createTime"></div>
            <!-- <div v-text="scope.row.createTime.slice(0, 10)"></div> -->
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="模型大小">
          <template slot-scope="scope">
            {{ scope.row.fileSize !== "0" ? scope.row.fileSize : "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="项目类型" width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.appType === '0'">普通模型</span>
            <span v-else-if="scope.row.appType === '1'">漫游模型</span>
            <span v-else-if="scope.row.appType === '3'">链接模型</span>
            <span v-else>其他模型</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="并发节点">
          <template slot-scope="scope">
            {{ scope.row.currentInstance }}/{{ scope.row.maxInstance }}
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('state')">
          <template slot-scope="scope">
            <!-- 做自定义操作 需要改成template的形式,scope.row代表的是表格数据itemList中的每一项 -->
            {{ formatStatus(scope.row.applidStatus) }}
            <el-progress
              :text-inside="true"
              :percentage="scope.row.progress"
              :show-text="true"
              :stroke-width="13"
              :color="customColor"
              v-if="scope.row.applidStatus === '1' ? true : false"
            >
            </el-progress>
          </template>
        </el-table-column>

        <el-table-column :label="$t('operation')" width="150">
          <template slot-scope="scope">
            <div class="handle-btn">
              <!-- 分享 -->
              <el-button
                @click="share(scope.row), (dialogFormVisibleOne = true)"
                type="text"
                v-if="scope.row.applidStatus === '5' ? false : true"
                :class="scope.row.applidStatus === '2' ? 'blue' : 'gray'"
                :disabled="scope.row.applidStatus === '2' ? false : true"
              >
                {{ scope.row.applidStatus === "2" ? "分享" : "" }}
              </el-button>
              <!-- 编辑 -->
              <el-button
                @click="edit(scope.row), (dialogFormVisible = true)"
                type="text"
                class="btn-one"
                :disabled="scope.row.applidStatus === '4' ? true : false"
                v-if="scope.row.applidStatus === '5' ? false : true"
              >
                {{ $t("edit") }}
              </el-button>
              <!-- 删除 -->
              <el-button
                @click="remove(scope.row)"
                type="text"
                v-if="scope.row.applidStatus === '5' ? false : true"
              >
                {{ $t("del") }}
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="进入项目" width="120">
          <template slot-scope="scope">
            <el-button
              @click="GoApp(scope.row)"
              :disabled="scope.row.applidStatus === '2' ? false : true"
              :class="scope.row.applidStatus === '2' ? 'ff' : 'bbb'"
            >
              {{ $t("into") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分享dialog框 -->
    <el-dialog
      title="分享项目链接"
      :visible.sync="dialogFormVisibleOne"
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
          <el-button @click="dialogFormVisibleOne = false" class="btn-one"
            >取 消</el-button
          >
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
    <!-- 编辑dialog框 -->
    <el-dialog
      title="编辑项目"
      :visible.sync="dialogFormVisible"
      center
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="content">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="项目名称：" label-width="110px">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="最大并发数："
            label-width="110px"
            prop="maxInstance"
          >
            <el-input v-model="form.maxInstance" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="鼠标操作模式：">
            <el-select v-model="form.doMouse" placeholder="请选择操作模式">
              <el-option label="非锁定模式" value="0"></el-option>
              <el-option label="锁定模式" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="窗口显示模式：">
            <el-select
              v-model="form.displayWindow"
              placeholder="请选择显示模式"
            >
              <el-option label="完全填充" value="0"></el-option>
              <el-option label="尽量填充" value="1"></el-option>
              <el-option label="原始大小" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="amend()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="链接模型"
      custom-class="integrate-dialog"
      :visible.sync="IsIntegrate"
      width="690px"
    >
      <div>
        <el-transfer
          class="integrate-transfer"
          filterable
          :titles="['模型', '模型']"
          v-model="ActiveLinkModel"
          :data="ListLinkModel"
          :props="{
            key: 'appid',
            label: 'appName',
          }"
        >
          <span slot-scope="{ option }">{{ option.appName }}</span>
        </el-transfer>
        <el-form
          :model="FormIntegrate"
          class="form-integrate"
          :rules="rulesIntegrate"
          ref="FormIntegrate"
          label-width="110px"
        >
          <el-form-item label="链接模型名称" prop="appName">
            <el-input v-model="FormIntegrate.appName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="IsIntegrate = false">取 消</el-button>
        <el-button type="primary" @click="SubmitIntegrate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProjectList,
  deleteProject,
  updateProject,
  getWebUrl,
} from "@/api/my.js";
import MODELAPI from "@/api/model_api";
import { Getuserid } from "@/store/index.js";
import axios from "@/utils/request";
export default {
  name: "manage",
  data() {
    return {
      FormIntegrate: {
        appName: null,
      },
      rulesIntegrate: {
        appName: [
          { required: true, message: "请输入链接模型名称", trigger: "blur" },
        ],
      },
      ActiveLinkModel: [],
      ListLinkModel: [],
      IsIntegrate: false,
      btnCopy: "",
      itemList: [], //数据列表
      appid: "", //应用ID
      appName: "", //应用名称
      fileSize: "", //文件大小
      maxInstance: "", //最大并发数
      currentInstance: "", //当前并发数
      applidStatus: null, //状态
      createTime: "", //上传日期
      timer: null, //定时器
      display: false, //转换进度条默认隐藏
      customColor: "#00AAF0", //进度条颜色
      baseURL: axios.defaults.baseURL,
      appInfo: "",
      appliId: "",
      fileUpload: "",
      fileList: [{ url: "" }], //上传图片列表显示
      dialogFormVisible: false,
      dialogFormVisibleOne: false,
      isShow: "1",
      //分享应用表单
      formShare: {
        days: "999", //链接有效期
        appid: "",
        qrurl: "", //二维码图片地址
        webShareUrl: "", //链接地址
      },
      //编辑应用表单
      form: {
        name: "",
        maxInstance: "",
        appid: "",
        screenImg: "",
        appModel: "",
        dialogImageUrl: "",
        applidStatus: null,
        displayWindow: [
          {
            value: "0",
            label: "完全填充",
          },
          {
            value: "1",
            label: "尽量填充",
          },
          {
            value: "2",
            label: "原始大小",
          },
        ],
        doMouse: [
          {
            value: "0",
            label: "非锁定模式",
          },
          {
            value: "1",
            label: "锁定模式",
          },
        ],
      },
      // 最大并发校验规则
      rules: {
        maxInstance: [
          {
            pattern: /^([1-9]\d{0,3})$/,
            message: "请输入1-9999的正整数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.GetList();
    this.setGetdataIn();
    // this.showTips()
  },
  methods: {
    SubmitIntegrate() {
      /**
       * @Author: zk
       * @Date: 2021-06-05 11:20:15
       * @description: 确认集成
       */
      if (this.ActiveLinkModel.length === 0) {
        this.$message({
          message: "请选择模型",
          type: "warning",
        });
        return false;
      }
      this.$refs["FormIntegrate"].validate((valid) => {
        if (valid) {
          let params = {
            userId: Getuserid(),
            appName: this.FormIntegrate.appName,
            bimList: this.ActiveLinkModel.join(),
          };
          MODELAPI.ADDINTEGRARE(params).then((res) => {
            if (res.data.code === 0) {
              this.GetList();
              this.ActiveLinkModel = [];
              this.$refs["FormIntegrate"].resetFields();
              this.IsIntegrate = false;
            } else {
              this.$message({
                message: res.data.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    GetIntegrate() {
      getProjectList({
        userid: Getuserid(),
        isHandle: 1,
        appType: 0,
      }).then((res) => {
        if (res.data.code === 0) {
          this.ListLinkModel = res.data.data;
        } else {
          this.ListLinkModel = [];
        }
      });
    },
    AddIntegrate() {
      /**
       * @Author: zk
       * @Date: 2021-06-05 10:14:30
       * @description: 新增集成
       */
      this.GetIntegrate();
      this.IsIntegrate = true;
    },
    noneTips(obj, row) {
      row.showTooltip = false;
    },
    showTips(obj, row) {
      /*obj为鼠标移入时的事件对象*/
      /*currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
      let TemporaryTag = document.createElement("span");
      TemporaryTag.innerText = row.appName;
      TemporaryTag.className = "getTextWidth";
      document.querySelector("body").appendChild(TemporaryTag);
      let currentWidth = document.querySelector(".getTextWidth").offsetWidth;
      document.querySelector(".getTextWidth").remove();
      /*cellWidth为表格容器的宽度*/
      const cellWidth = obj.target.offsetWidth;
      /*当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行*/
      currentWidth <= 2 * cellWidth
        ? (row.showTooltip = false)
        : (row.showTooltip = true);
    },
    // 定时器每隔五秒获取数据
    setGetdataIn() {
      this.timer = setInterval(() => {
        this.GetList();
        // console.log('每隔5秒更新应用管理')
      }, 5000);
    },
    // 获取应用数据列表
    GetList() {
      getProjectList({
        userid: Getuserid(),
      })
        .then((res) => {
          // console.log(res, '应用数据列表')
          if (res.data.code == "0") {
            this.itemList = res.data.data;
            this.reverse();
            this.appid = res.data.data.appid;
            this.maxInstance = res.data.data.maxInstance;
            this.currentInstance = res.data.data.currentInstance;
            this.appName = res.data.data.appName;
            this.fileSize = res.data.data.fileSize;
            this.applidStatus = res.data.data.applidStatus;
            this.createTime = res.data.data.createTime;
          } else if (res.data.message === "应用信息为空") {
            // this.$message.warning('暂无数据')
            this.itemList = [];
          }
        })
        .catch((err) => {
          console.log(err);
          // this.$message.error('请求失败')
        });
    },
    //翻转数组
    reverse() {
      this.itemList.reverse();
    },
    // 根据传入的status做适配
    formatStatus(status) {
      const statusObj = {
        0: "未上传",
        1: "转换中",
        2: "转换完成",
        3: "转换失败",
        4: "文件损坏",
        5: "删除中",
      };
      return statusObj[status];
    },
    // 分享按钮
    share(e) {
      // console.log(e)
      this.formShare.appid = e.appid;
    },
    // 关闭分享dialog
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
          this.isShow = 1;
          this.formShare.days = "999";
        })
        .catch((_) => {});
    },
    //确定分享
    confirm() {
      this.$common.openLoading("正在加载中....");
      getWebUrl({
        appid: this.formShare.appid,
        days: this.formShare.days,
        userid: Getuserid(),
      })
        .then((res) => {
          // console.log(res)
          if (res.data.code === 0) {
            this.isShow = 2;
            this.formShare.qrurl = res.data.data.qrurl;
            this.formShare.webShareUrl = res.data.data.webShareUrl;
            this.$message.success(res.data.message);
            this.$common.closeLoading();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("分享失败,请重新选择");
          this.$common.closeLoading();
          this.dialogFormVisibleOne = false;
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
    // 复制二维码图片
    copyImg(e) {
      //nextTick,当前dom渲染完毕的回调
      this.$nextTick(function () {
        // console.log('foo', this.$refs.foo) //打印获取的dom
        const selection = window.getSelection();
        const range = document.createRange();
        //复制前先清除粘贴板上的缓存
        selection.removeAllRanges();
        range.selectNode(this.$refs.foo); //传入dom
        selection.addRange(range);
        document.execCommand("copy"); //copy是复制
        //复制后再清除缓存
        selection.removeAllRanges();
      });
      this.$message.success("二维码复制成功！");
    },
    // 编辑按钮
    edit(e) {
      console.log(e);
      this.form.name = e.appName;
      this.form.appid = e.appid;
      this.form.displayWindow = e.displayWindow;
      this.form.doMouse = e.doMouse;
      this.form.maxInstance = e.maxInstance;
      this.form.applidStatus = e.applidStatus;
      this.form.screenImg = e.screenImg;
      for (let index = 0; index < this.fileList.length; index++) {
        this.fileList[index].url = e.screenImg;
      }
    },
    //确定修改
    amend() {
      let param = this.form;
      // 1 验证必填项
      const verify = {
        name: "项目名称",
        maxInstance: "最大并发数",
      };
      console.log(param);
      for (const k in verify) {
        const val = Array.isArray(param[k]) ? param[k][0] : param[k];
        if (!this.$common.noNull(val)) {
          this.$common.message(verify[k] + " 不能为空", "warning"); // 提示信息
          return;
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$common.openLoading("正在加载中....");
          updateProject({
            appid: this.form.appid,
            appName: this.form.name,
            doMouse: this.form.doMouse,
            displayWindow: this.form.displayWindow,
            screenImg: this.form.screenImg,
            maxInstance: this.form.maxInstance,
          })
            .then((res) => {
              if (res.data.code === 0) {
                console.log(res);
                this.$message.success(res.data.message);
                this.$common.closeLoading();
                this.GetList();
                this.dialogFormVisible = false;
              } else if (res.data.code === 1) {
                // console.log(res)
                this.$message.error("修改失败，" + res.data.message);
                this.$common.closeLoading();
                this.dialogFormVisible = false;
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("修改信息失败,请重新修改");
              this.$common.closeLoading();
            });
        }
      });
    },
    // 删除按钮
    remove(e) {
      // console.log(e)
      // console.log(e.progress)
      this.$confirm("此操作将删除该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.del(e);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //删除应用
    del(e) {
      deleteProject({
        appliId: e.appid,
        userid: Getuserid(),
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
            this.GetList();
          } else if (res.data.code === 1) {
            this.$message.warning(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("删除失败");
        });
    },

    //进入应用
    GoApp(e) {
      let isiPad =
        navigator.userAgent.match(/(iPad)/) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
      MODELAPI.GETBIMTOKEN({
        appid: e.appid,
      }).then((res) => {
        if (res.data.code === 0) {
          if (isiPad !== false || isMac !== false) {
            this.$router.push({
              name: "web_client",
              query: {
                appid: e.appid,
                locale: this.$i18n.locale,
                token: res.data.data.token,
              },
            });
          } else {
            const { href } = this.$router.resolve({
              name: "web_client",
              query: {
                appid: e.appid,
                locale: this.$i18n.locale,
                token: res.data.data.token,
                // isScene:true
              },
            });
            window.open(href, "_blank");
          }
        } else {
          this.$message({
            type: "error",
            message: err.data.message,
          });
        }
      });
    },
    // 上传封面图
    upLoadImg(response, file, fileList) {
      this.form.screenImg = response.data;
    },
    // 上传模型
    upLoadModel(response, file, fileList) {
      console.log("模型上传成功");
      this.$message.success("模型上传成功");
      this.form.appModel = response.data;
      this.disabl = false;
    },
    // 上传封面图失败
    errorImg(err, file, fileList) {
      console.log(err);
    },
    // 删除图片
    handleRemove(file) {
      this.$confirm("此操作将删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.form.screenImg = "";
          // 删除文件
          this.$refs.upload.clearFiles();
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 限制上传封面次数
    handleExceed() {
      this.$message.warning(`亲，只能上传一张图片哦！`);
    },
    // 限制上传封面格式
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const one = testmsg === "jpg";
      const two = testmsg === "jpeg";
      const three = testmsg === "png";
      if (!one && !two && !three) {
        this.$message.error("上传封面只能是.jpg .jpeg .png格式!");
      }
      return one || two || three;
    },
    // 限制上传模型次数
    exceed() {
      this.$message.warning(`您只能上传一个模型`);
    },
    // 限制上传模型格式
    beforeModelUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "rvt";
      if (!extension) {
        this.$message.error("上传模型只能是.rvt格式!");
      }
      return extension;
    },
  },
  mounted() {
    //禁用返回键
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener(
        "popstate",
        function () {
          history.pushState(null, null, document.URL);
        },
        false
      );
    }
  },
  watch: {
    $route(to, from) {
      this.GetList();
      // clearInterval(this.timer)
      this.$router.go(0);
    },
  },
  // activated () {
  //   this.timer = setInterval(() => {
  //     this.GetList()
  //     // console.log('每隔5秒更新应用管理')
  //   }, 5000)
  // },
  // ===== 页面实例销毁 =====
  destroyed() {
    // 清除定时器
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.handle-btn {
  text-align: right;
}
.box {
  overflow: hidden;
  width: 96%;
  padding: 20px 2%;
  /deep/ .el-button--primary {
    background-color: #00aaf0;
  }
  .record {
    display: flex;
    align-items: center;
    font-size: 16px;
    position: relative;
    .right {
      margin-left: auto;
    }
  }
  .table {
    margin-top: 20px;
    margin-bottom: 40px;
    .name-two {
      background-color: red !important;
    }
    .sheet {
      font-size: 16px;
    }
    // 进度条里的文字
    /deep/ .el-progress-bar__innerText {
      color: #000;
      margin-top: -6px;
    }
    /deep/ .el-table thead {
      color: #fff;
    }
    /deep/ .el-table th {
      background-color: #00aaf0;
      text-align: center;
      font-size: 17px;
      font-weight: normal;
    }
    /deep/ .el-table td {
      text-align: center;
    }
    // 表头字体颜色
    /deep/ .el-table th > .cell {
      color: #fff;
    }
    //表格去横线
    // /deep/ .el-table__row > td {
    //   border: none;
    // }
    //表格去横线之去掉最下面的那一条线
    // /deep/ .el-table::before {
    //   height: 0px;
    // }
    // 第一列字体颜色
    // /deep/ .el-table_1_column_1 {
    //   color: #00aaf0;
    // }
    .btn-one {
      font-size: 16px;
      color: #00aaf0;
    }
    .bbb {
      background-color: #bbb;
      color: #fff;
    }
    .ff {
      background-color: #00aaf0;
      color: #fff;
    }
    .red {
      font-size: 16px;
      color: #ff6600;
    }
    .gray {
      font-size: 16px;
      color: gray;
    }
    .blue {
      color: #00aaf0;
      font-size: 16px;
    }
  }
  .el-dialog {
    .content {
      display: flex;
      justify-content: center;
      .el-form {
        .el-input {
          width: 150px;
        }
        .el-select {
          width: 150px;
        }
      }
    }
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
        .btn-one {
          // margin-right: 60px;
          // margin-left: -30px;
        }
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
    .hidden {
      width: 0;
      height: 0;
      opacity: 0;
      position: absolute;
      top: -1000%;
      left: -1000%;
      z-index: -9999999;
    }
  }
}
.form-integrate {
  margin-top: 20px;
}
.integrate-transfer {
  /deep/ .el-transfer__buttons {
    padding: 0 10px;
  }
  /deep/ .el-transfer__button {
    display: block;
    margin-left: 0;
    padding: 7px;
    background-color: #ecf5ff;
    border-color: #ecf5ff;
    color: #606266;
    &:hover {
      background-color: #ecf5ff8f;
      border-color: #ecf5ff8f;
      color: #606266;
    }
  }
}
</style>
<style lang="less">
/* 背景 */
.app-name-tip {
  background-color: #00aaf0 !important;
  /* 箭头 */
  &[x-placement^="top"] .popper__arrow:after {
    border-top-color: #00aaf0 !important;
  }
  &[x-placement^="bottom"] .popper__arrow:after {
    border-bottom-color: #00aaf0 !important;
  }
  /* 箭头边框 */
  &[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: #00aaf0 !important;
  }
  &[x-placement^="top"] .popper__arrow {
    border-top-color: #00aaf0 !important;
  }
}
.integrate-transfer {
  .el-transfer-panel {
    width: 300px;
  }
}
.integrate-dialog {
  .el-dialog__body {
    padding: 20px !important;
  }
  .el-dialog__footer {
    padding-top: 0;
  }
}
.sheet {
  .el-table__body,
  .el-table__header {
    width: 100% !important;
    table-layout: auto;
  }
}
</style>