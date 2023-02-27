<template>
  <div class="bim-main">
      <iframe
        class="bim-web"
        allowfullscreen="true"
        :class="runTimeCode === 0 ? '' : 'phone-bim'"
        v-if="webUrl"
        :src="webUrl"
        frameborder="0"
        id="show-bim"
      ></iframe>
    <!-- 协同模式弹窗 -->
    <teamwork-dialog
      ref="teamworkDialogRef"
      :shareCode="shareCode"
      :appId="appId"
    ></teamwork-dialog>
    <div class="invite-team-friend" v-if="userType === '1'">
      <div class="invite-btn" @click="openTeamDialog">
        <img src="./friend.png" alt="" /> 邀请成员
      </div>
    </div>
  </div>
</template>

<script>
// import MODELAPI from "@/api/model_api";
import { BASE } from "../../src/api/base_url";
export default {
  name: "cloudApp-web_client",
  layout: "reset",
  data() {
    return {
      shareCode:null,
      websock: null,
      openNode: null,
      actionList: [],
      propsFooter: {
        taskId: null,
      },
      propsProgress: {
        data: 0,
        loadData: 0,
      },
      isProgress: true,
      propsMember: {
        label: "name",
        isLeaf: (e) => {
          if (e.haveChild === "1") {
            return false;
          }
          if (e.haveChild === "0") {
            return true;
          }
        },
      },
      controllerInfo: {
        uiBar: true,
        viewCube: true,
        tagUiBar: true,
        tagViewCube: true,
        modelClient: false,
        memberAvttribute: false,
        singleList: [],
      },
      webUrl: null,
      appId: null,
      appToken: null,
      locale: "zh",
      taskId: null,
      ourbimInfo: null,
      isFade: true,
      isFollow: false,
      isTag: false,
      handleState: 0,
      activeTree: null,
      leafInfo: null,
      listenInfo: null,
      cubeState: 6,
      runTimeCode: 0,
      memberInfo: null,
      activeLeaf: false,
      loadTimer: null,
      timerCount: 0,
      hiddenState: 0,
      isSocket: false,
      browserInfo: null,
      natureInfo: null,
      shadowType: null,
      listenTodoInfo: null,
      isUiBar: true,
      pageSizeInfo: {
        width: 1920,
        height: 1080,
      },
      gaugeInfo: {
        unit: "m",
        accuracy: 0.01,
      },
      TreePageNo: 2,
      ScrollDistance: 0,
      userType:null,
    };
  },
  watch: {},
  created() {
  },
  mounted() {
     this.getSceneUrl();
    this.setTimeLoad();
    if (this.isMobile()) {
      this.runTimeCode = 1;
    } else {
      this.runTimeCode = 0;
    }
    //判断是否使用的是ipad
    let isiPad =
      navigator.userAgent.match(/(iPad)/) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (isiPad !== false || isMac !== false) {
      this.hiddenState = 3;
    }
    window.addEventListener(
      "message",
      (e) => {
        if (e.data.prex === "pxymessage") {
          this.getError(e.data);
        }
      },
      false
    );
  },
  destroyed() {
    this.clearTimePass();
  },
  methods: {
    getError(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-16 13:55:19
       * @description: 处理异常
       */
      let errorList = [
        101, 102, 103, 201, 202, 203, 301, 401, 402, 403, 404, 501, 502, 503,
        504, 601, 602, 603, 1001, 1002, 1003, 1004,
      ];
      if (e.type === 200) {
        this.getMonitor();
      }
      if (errorList.indexOf(e.type) !== -1) {
        this.hiddenState = 4;
        this.isFade = true;
        this.$message({
          message: this.$t("webClient.loadBox.message[6]"),
          type: "warning",
          customClass: "set-index-message",
        });
      }
      if (e.type === 610) {
        this.delMaskTimer(1000 * 5);
      }
    },
    delMaskTimer(e) {
      /**
       * @Author: zk
       * @Date: 2021-06-02 18:08:55
       * @description: 去除遮罩时限
       * @param {*} setTimeout
       */
      let loadTimer = setTimeout(() => {
        this.isFade = false;
        clearTimeout(loadTimer);
      }, e);
    },

    getParam(url, name) {
      try {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.split("?")[1].match(reg);
        if (r != null) {
          return r[2];
        }
        return ""; //如果此处只写return;则返回的是undefined
      } catch (e) {
        return ""; //如果此处只写return;则返回的是undefined
      }
    },
    openTeamDialog() {
      this.$refs.teamworkDialogRef.openDialog({
        appid: this.appId,
      });
    },
    getSceneUrl() {
      let appId = this.$route.query.appid;
      let token = this.$route.query.token;
      let params = {
        appliId: appId,
        token,
      };
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      const { userType } = this.$route.query; 
      if(userType == "1"){
        params.userType = userType,
        params.nickName = userInfo.name
      }
      this.$api().requestbaogang(params).then((res) => {
        console.log(res);
        this.webUrl = res.data.data.url;
        this.taskId = res.data.data.taskId;
        this.initWebsocket(this.taskId);
      });
    },
    initWebsocket(taskId) {
      console.log("zzwid",taskId);
      this.websock = new WebSocket(BASE.WSPRO + "websocket/" + taskId);
      this.websock.onmessage = (e) => {
      };
    },

    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    // 设置加载时间超时提醒
    setTimeLoad() {
      this.loadTimer = setTimeout(() => {
        if (this.isFade === true) {
          this.hiddenState = 2;
        }
        clearTimeout(this.loadTimer);
      }, 1000 * 60 * 3);
    },
    // 清除定时器
    clearTimePass() {
      if (this.loadTimer) {
        clearTimeout(this.loadTimer);
      }
    },
    getMonitor() {
      /**
       * @Author: zk
       * @Date: 2020-09-27 17:56:43
       * @description: 监听事件
       */
      let realTimer = setTimeout(() => {
        // 鼠标移出
        document.getElementById("show-bim").onmouseout = () => {
          this.sendToIframe(
            10002,
            {
              button: "left",
              x: 500,
              y: 500,
            },
            ""
          );
          this.sendToIframe(
            10002,
            {
              button: "right",
              x: 500,
              y: 500,
            },
            ""
          );
        };
        // 移动滚轮
        document.getElementById("show-bim").onmousewheel = () => {
          this.sendToIframe(
            10003,
            {
              x: 500,
              y: 500,
              wheel: -100,
            },
            ""
          );
        };
        // 关闭tool
        this.sendToIframe(10200, "false", "");
        document.addEventListener("keydown", (e) => {
          if (this.isFollow || this.isTag) {
            return;
          }
          this.sendToIframe(
            10010,
            {
              key: e.code,
              isRepeat: e.repeat,
            },
            ""
          );
        });
        document.addEventListener("keyup", (e) => {
          if (this.isFollow || this.isTag) {
            return;
          }
          this.sendToIframe(
            10011,
            {
              key: e.code,
            },
            ""
          );
        });
        window.clearTimeout(realTimer);
      }, 1000 * 2);
    },
    sendToIframe(type, data, message) {
      /**
       * @Author: zk
       * @Date: 2020-09-29 10:18:33
       * @description: postmessage通信
       */
      let realIframe = document.getElementById("show-bim");
      if (realIframe) {
        realIframe.contentWindow.postMessage(
          {
            prex: "pxymessage", // 约定的消息头部
            type: type, // 消息类型
            data: data, // 具体数据
            message: message, // 附加信息
          },
          "*"
        );
      } else {
        console.warn("content window not find.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@-webkit-keyframes fadeIt {
  0% {
    background-color: #092b4c;
  }

  50% {
    background-color: #2a4663;
  }

  100% {
    background-color: none;
  }
}

@-moz-keyframes fadeIt {
  0% {
    background-color: #092b4c;
  }

  50% {
    background-color: #2a4663;
  }

  100% {
    background-color: none;
  }
}

@-o-keyframes fadeIt {
  0% {
    background-color: #092b4c;
  }

  50% {
    background-color: #2a4663;
  }

  100% {
    background-color: none;
  }
}

@keyframes fadeIt {
  0% {
    background-color: #092b4c;
  }

  50% {
    background-color: #2a4663;
  }

  100% {
    background-color: none;
  }
}

.bim-main {
  // position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .time-log {
    pointer-events: none;
    position: absolute;
    z-index: 3000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .log-main {
      pointer-events: auto;
      width: 360px;
      padding: 30px;
      border-radius: 3px;
      background-color: rgba(0, 0, 0, 0.36);
      text-align: center;
      color: #ffffff;

      .show-logo {
        width: 224px;
        height: 40px;
        margin-bottom: 30px;
      }
    }

    .phone-log-main {
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      /* IE 9 */
      -moz-transform: rotate(90deg);
      /* Firefox */
      -webkit-transform: rotate(90deg);
      /* Safari 和 Chrome */
      -o-transform: rotate(90deg);
    }
  }

  .hidden-bim {
    position: absolute;
    z-index: 3000;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;

    @-webkit-keyframes bgp {
      0% {
        background-position: 0 0;
      }

      100% {
        background-position: -100% 0;
      }
    }

    .load-text {
      letter-spacing: 5px;
      display: flex;

      .model-loading {
        margin-left: 20px;
        margin-right: 10px;
      }
    }

    @keyframes dot {
      0% {
        left: -30px;
      }

      25% {
        left: -30px;
      }

      50% {
        left: -20px;
      }
      75% {
        left: -10px;
      }
      100% {
        left: 0px;
      }
    }
    @-webkit-keyframes dot {
      0% {
        left: -30px;
      }

      25% {
        left: -30px;
      }

      50% {
        left: -20px;
      }
      75% {
        left: -10px;
      }
      100% {
        left: 0px;
      }
    }

    .wait-main {
      width: 30px;
      position: relative;
      left: 0px;
      background: #000;
      animation: dot 3s infinite step-start;
    }

    .learn-text {
      letter-spacing: 1px;
      // font-size: 30px;
    }

    .hidden-text {
      margin-top: 130px;
      position: absolute;
      font-size: 20px;
      // color: #fff;
      background-image: linear-gradient(
        to right,
        #b9fffc,
        #a2d8f4,
        #9ab3f5,
        #7579e7,
        #9ab3f5,
        #a2d8f4,
        #b9fffc
      );
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      -webkit-background-size: 200% 100%;
      animation: bgp 3s infinite linear;
    }

    .loading:after {
      overflow: hidden;
      display: inline-block;
      vertical-align: bottom;
      animation: ellipsis 1.5s infinite;
      content: "\2026";
      /* ascii code for the ellipsis character */
    }

    @keyframes ellipsis {
      from {
        width: 2px;
      }

      to {
        width: 25px;
      }
    }

    .show-loading {
      width: 224px;
      height: 40px;
      margin-bottom: 30px;
    }
  }

  .phone-hidden-bim {
    .load-text {
      letter-spacing: 5 rpx;
      font-size: 23px;
      display: flex;
      text-align: center;
      letter-spacing: 5 rpx;
    }

    @-webkit-keyframes dotPhone {
      0% {
        left: -25px;
      }

      33% {
        left: -20px;
      }

      66% {
        left: -15px;
      }

      100% {
        left: -0px;
      }
    }

    .wait-main {
      width: 30px;
      position: relative;
      left: -30px;
      background: #000;
      animation: dotPhone 3s infinite step-start;
    }
  }

  // 视图层
  .mutual-bim {
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    pointer-events: none;

    .leaf-slide {
      position: absolute;
      width: 10vw;
      bottom: 8vh;
      left: 45vw;
      pointer-events: auto;
    }

    .tree-main {
      pointer-events: auto;
      height: 50vh;
      width: 400px;
      margin: 2vh 0 0 20px;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.5);

      .tree-title {
        display: flex;
        padding: 20px 15px 0 15px;
        color: #ffffff;

        .close-part {
          margin-left: auto;
          cursor: pointer;
        }
      }

      .tree-part {
        height: 40vh;
        overflow: hidden;
      }

      .tree-content {
        margin-top: 1vh;
        width: 99.5%;
        height: 40vh;
        overflow-x: hidden;
        overflow-y: auto;

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

        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 8px;

          .label-span {
            padding-left: 5px;
          }
        }
      }
    }

    .bim-info {
      pointer-events: auto;
      height: 50vh;
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

      .bim-title {
        display: flex;
        padding: 20px 15px 0 15px;
        color: #ffffff;

        .close-part {
          margin-left: auto;
          cursor: pointer;
        }
      }

      .detail-main {
        overflow-x: hidden;
        overflow-y: auto;
        margin-top: 1vh;
        height: 40vh;

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
      }

      .detail-table {
        width: 100%;
        line-height: 35px;
        text-align: center;

        tr td {
          &:first-child {
            width: 30%;
          }

          &:last-child {
            width: 70%;
            word-break: break-all;
          }
        }
      }
    }

    .handle-body {
      pointer-events: auto;
      position: absolute;
      top: 3vh;
      right: 3vh;
    }

    .show-footer {
      position: absolute;
      pointer-events: auto;
      padding: 10px 0;
      width: 100%;
      display: flex;
      align-items: center;
      left: 0;
      bottom: 0;
      color: #ffffff;

      .foot-title {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  #show-bim {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .phone-bim {
    height: 100vh !important;
    width: 100vw !important;
  }
}
</style>
<style lang="scss">
.tree-content {
  .el-tree {
    background: none;
    color: #fff;

    .el-tree-node {
      .el-tree-node__content {
        line-height: 200%;
        background: none;

        &:hover {
          background: none;
        }
      }

      .el-tree-node__expand-icon {
        color: #fff;
      }

      .is-leaf {
        color: transparent;
      }

      // .is-current {
      //   .tree-select {
      //     background: rgba(255, 255, 255, 0.2);
      //   }
      // }
      .el-checkbox {
        position: absolute;
        right: 0;
      }

      .el-checkbox__inner {
        background-color: transparent;
        border-color: transparent;
      }
    }

    .tree-select {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.set-index-message {
  z-index: 5000 !important;
}

.bim-progress {
  position: absolute;
  margin-top: 120px;
  width: 160px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .load-tip {
    width: 100%;
    display: flex;
    margin: 20px 0;
    letter-spacing: 2px;
    color: #00aaf0;

    div {
      margin-left: auto;
    }
  }
}
</style>
