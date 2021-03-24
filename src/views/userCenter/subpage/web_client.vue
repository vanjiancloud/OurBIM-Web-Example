<template>
  <div class="bim-main">
    <iframe
      class="bim-web"
      :class="runTimeCode === 0 ? '' : 'phone-bim'"
      v-if="webUrl && hiddenState === 0"
      :src="webUrl"
      frameborder="0"
      id="show-bim"
    ></iframe>
    <div class="time-log" v-if="moreCount < 10">
      <div class="log-main" :class="runTimeCode === 0 ? '' : 'phone-log-main'">
        <div>
          <img class="show-logo" src="@/assets/img/ourbim-logo.png" alt="" />
        </div>
        <span v-text="moreCount"></span>
        <span v-text="$t('webClient.loadBox.title[0]')"></span>
      </div>
    </div>
    <div
      class="hidden-bim"
      :class="runTimeCode === 0 ? '' : 'phone-hidden-bim'"
      v-if="isFade"
    >
      <img src="@/assets/img/ourbim-logo.png" class="show-loading" alt="" />
      <div class="hidden-text load-text" v-if="hiddenState === 0">
        <div
          class="model-loading"
          v-text="$t('webClient.loadBox.title[1]')"
        ></div>
        <div class="dot">...</div>
        <div class="wait-main"></div>
      </div>
      <div
        class="hidden-text learn-text"
        v-if="hiddenState === 1"
        v-text="$t('webClient.loadBox.title[2]')"
      ></div>
      <div
        class="hidden-text learn-text"
        v-if="hiddenState === 2"
        v-text="$t('webClient.loadBox.title[3]')"
      ></div>
    </div>
    <div v-if="runTimeCode === 0">
      <div class="mutual-bim">
        <div
          class="tree-main"
          v-if="
            browserInfo && browserInfo.type === 10 && browserInfo.state === 1
          "
        >
          <!-- 模型浏览器 -->
          <div class="tree-title">
            <div class="" v-text="$t('webClient.browser.title')"></div>
            <div class="close-part">
              <i class="el-icon-close" @click="closePart(browserInfo.type)"></i>
            </div>
          </div>
          <div class="tree-content">
            <el-tree
              ref="setTree"
              :empty-text="$t('webClient.browser.tips')"
              :props="propsMember"
              :load="loadNode"
              node-key="uuid"
              lazy
              accordion
            >
              <span
                class="custom-tree-node"
                :class="
                  node.checked && node.data.haveChild === '0'
                    ? 'tree-select'
                    : ''
                "
                slot-scope="{ node }"
                @click.stop="handleTree(node, 0)"
              >
                <span class="label-span">{{ node.label }}</span>
                <span>
                  <i
                    class="iconfont icon-xianshi2"
                    v-if="node.data.activeState === 0"
                    @click.stop="handleTree(node, 1)"
                  ></i>
                  <i
                    class="iconfont icon-yincang1"
                    v-if="node.data.activeState === 1"
                    @click.stop="handleTree(node, 2)"
                  ></i>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
        <div
          class="bim-info"
          v-if="natureInfo && natureInfo.type === 11 && natureInfo.state === 1"
        >
          <!-- 属性 -->
          <div class="bim-title">
            <div class="" v-text="$t('webClient.attribute.title')"></div>
            <div class="close-part">
              <i class="el-icon-close" @click="closePart(natureInfo.type)"></i>
            </div>
          </div>
          <div class="detail-main">
            <table
              class="detail-table"
              v-if="memberInfo && memberInfo.dynamicData"
            >
              <tr v-for="(item, index) in memberInfo.dynamicData" :key="index">
                <td v-text="item.name"></td>
                <td v-text="item.value"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <todo-footer
        ref="getFooter"
        @listenTodo="listenTodo"
        @listenPerson="listenPerson"
        @listenMode="listenMode"
        :setProps="propsFooter"
      ></todo-footer>
      <view-cube
        @handleOrder="handleOrder"
        @handleType="handleType"
        ref="getCube"
      ></view-cube>
    </div>
  </div>
</template>

<script>
import MODELAPI from "@/api/model_api";
import todoFooter from "@/components/web_client/todo_footer";
import viewCube from "@/components/web_client/view_cube";

export default {
  name: "look_app",
  layout: "reset",
  components: {
    todoFooter,
    viewCube,
  },
  data() {
    return {
      propsFooter: {
        taskId: null,
      },
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
      webUrl: null,
      appId: null,
      locale: "zh",
      taskId: null,
      isFade: true,
      handleState: 0,
      leafInfo: null,
      listenInfo: null,
      cubeState: 6,
      viewHeight: 0,
      runTimeCode: 0,
      timerInfo: null,
      memberInfo: null,
      loadTimer: null,
      timerCount: 0,
      moreCount: 10,
      hiddenState: 0,
      websock: null,
      isSocket: false,
      socketTimer: null,
      browserInfo: null,
      natureInfo: null,
      shadowType: null,
      listenTodoInfo: null
    };
  },
  watch: {
    viewHeight() {
      //普通的watch监听
      if (this.isFade) {
        this.$message({
          type: "success",
          message: this.$t("webClient.loadBox.message[0]"),
        });
      }
      this.isFade = false;
      this.setTimePass();
    },
  },
  mounted() {
    this.appId = this.$route.query.appid;
    this.locale = this.$route.query.locale;
    this.$i18n.locale = this.locale;
    this.setTimeLoad();
    if (this.isMobile()) {
      this.runTimeCode = 1;
    } else {
      this.runTimeCode = 0;
    }
    this.getSceneUrl();
    window.addEventListener(
      "message",
      (e) => {
        this.getError(e.data);
        if (e.data.data && e.data.data.frameHeight > 0 && e.data.type !== 500) {
          this.viewHeight = e.data.data.frameHeight;
        }
      },
      false
    );
    //判断是否使用的是ipad
    let isiPad =
      navigator.userAgent.match(/(iPad)/) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isiPad !== false) {
      this.viewHeight = 1;
    }
  },
  destroyed() {
    this.clearTimePass();
    this.closeWebSocket();    
  },
  methods: {
    listenMode(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-17 16:01:54
       * @description: 切换投影模式
       */
      this.handleState = e;
      this.$refs.getCube.resetActive(e);
    },
    getError(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-16 13:55:19
       * @description: 处理异常
       */
      let errorList = [
        101,
        102,
        103,
        201,
        202,
        203,
        301,
        401,
        402,
        403,
        404,
        501,
        502,
        503,
        504,
        601,
        602,
        603,
        1001,
        1002,
        1003,
        1004,
      ];
      if (errorList.indexOf(e.type) !== -1) {
        this.closeWebSocket()
        this.$message({
          message: this.$t('webClient.loadBox.message[6]'),
          duration: 0,
          showClose: true,
          type: "warning",
        });
      }
    },
    handleType(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-12 11:34:19
       * @description: 选择类型 e 0: 重置主视图 1: 透视投影 2: 正交投影 3 自定义主视图
       */
      if (e === 2) {
        // 第三人称
        this.$refs.getFooter.resetpPrson(1);
      }
      this.shadowType = e;
      if (e === 0) {
        this.handleState = 4
      } else if (e === 3) {
        this.handleState = 2;       
      } else {
        this.handleState = 1;
      }
      this.updateOrder();
    },
    handleTree(e, index) {
      /**
       * @Author: zk
       * @Date: 2021-03-08 14:39:51
       * @description: 构件树的指令
       */
      this.leafInfo = e;
      if (index === 0) {
        // 选中
        if (e.checked) {
          this.memberInfo = null;
          e.checked = false;
        } else {
          this.memberInfo = e.data;
          this.$refs.setTree.setCheckedKeys([e.key]);
        }
        e.data.activeSelect = e.data.activeSelect === 0 ? 1 : 0;
        this.handleState = 9;
        if (e.data.haveChild === "0") {
          this.updateOrder();
        }
      } else if (index === 1) {
        this.handleState = 8;
        e.data.activeState = 1;
        this.updateOrder();
      } else if (index === 2) {
        this.handleState = 8;
        e.data.activeState = 0;
        this.updateOrder();
      }
    },
    handleOrder(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-08 10:40:10
       * @description: cube指令
       */
      this.handleState = 6;
      switch (e) {
        case 0:
          this.cubeState = 6;
          break;
        case 1:
          this.cubeState = 7;
          break;
        case 2:
          this.cubeState = 2;
          break;
        case 3:
          this.cubeState = 3;
          break;
        case 4:
          this.cubeState = 4;
          break;
        case 5:
          this.cubeState = 5;
          break;
        case 6:
          this.cubeState = 1;
          break;
        default:
          break;
      }
      this.updateOrder();
    },
    async updateOrder() {
      /**
       * @Author: zk
       * @Date: 2020-09-14 15:16:16
       * @description: 操作指令
       */
      if (!this.taskId) {
        this.$message({
          message: this.$t("webClient.loadBox.message[1]"),
          type: "error",
        });
        return;
      }
      let params = {
        taskid: this.taskId,
      };
      switch (this.handleState) {
        case 0:
          // 一三人称
          params.id = 8;
          params.viewMode = this.listenInfo === 0 ? 1 : 2;
          if (this.listenInfo === 0) {
            this.shadowType = 1;
            this.$refs.getCube.resetActive(1);
          }
          params.projectionMode =
            this.shadowType === 1 || this.shadowType === 2
              ? this.shadowType
              : 1;
          break;
        case 1:
          // 模式切换
          params.id = 8;
          // 投影类型切换
          if (this.shadowType === 2) {
            // 正交 必须为第三人称
            params.projectionMode = 2;
            params.viewMode = 2;
          }
          if (this.shadowType === 1) {
            // 透视投影
            params.projectionMode = 1;
            if (this.listenInfo) {
              params.viewMode = this.listenInfo.state === 0 ? 1 : 2;
            } else {
              params.viewMode = 2;
            }
          }
          break;
        case 2:
          // 自定义主视图
          params.id = 11
          break;
        case 3:
          // 移动速度
          params.id = 12
          params.speedLevel = this.listenTodoInfo.data
          break;
        case 4:
          // 测量
          if (this.listenTodoInfo.data === 0) {
            // 坐标
            params.id = 37;
          } else if (this.listenTodoInfo.data === 1) {
            // 距离
            params.id = 35;
          } else if (this.listenTodoInfo.data === 2) {
            // 角度
            params.id = 36;
          } else if (this.listenTodoInfo.data === 3) {
            // 设置单位
            params.id = 38;
            params.unit = this.listenTodoInfo.set;
          } else if (this.listenTodoInfo.data === 4) {
            // 设置精度
            params.id = 38;
            params.precision = this.listenTodoInfo.set;
          }
          break;
        case 5:
          // 关闭测量
          params.id = 39;
          break;
        case 6:
          // 六面体
          params.id = this.cubeState;
          break;
        case 8:
          // 构件显示 隐藏 半透明
          console.log(this.leafInfo);
          params.mn = this.leafInfo.key;
          if (this.leafInfo.data.activeState === 0) {
            params.id = 26;
          } else if (this.leafInfo.data.activeState === 1) {
            params.id = 27;
          } else {
            params.id = 30;
            params.Opacity = 0.5;
          }
          break;
        case 9:
          // 当前 focus + 高亮 /取消
          params.mn = this.leafInfo.key;
          this.leafInfo.data.activeSelect === 0
            ? (params.id = 29)
            : (params.id = 28);
          break;
        default:
          break;
      }
      if (this.isAngle) {
        params = {
          taskid: this.taskId,
          id: 20,
        };
      }

      await MODELAPI.UPDATEORDER(params)
        .then((res) => {
          if (params.id === 1 && res.data && res.data.data) {
            // 切换到主视图 重置状态
            let realView = res.data.data.viewMode === "1" ? 0 : 1
            this.$refs.getFooter.resetpPrson(realView);
            let realProject = res.data.data.projectionMode === "1" ? 1 : 2
            this.$refs.getCube.resetActive(realProject);
          }
          this.$message({
            message: this.$t("webClient.loadBox.message[2]"),
            type: "success",
          });
        })
        .catch(() => {
          this.$message({
            message: this.$t("webClient.loadBox.message[3]"),
            type: "error",
          });
        });
    },
    async getMemberList(e) {
      let params = {
        appliId: this.appId,
      };
      e ? (params.uuid = e) : "";
      let realMember = await MODELAPI.LISTMEMBERTREE(params).then((res) => {
        if (res.data.code === 0) {
          return res.data.data;
        } else {
          return [];
        }
      });
      return realMember;
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.getMemberList(node.key).then((res) => {
          res.forEach((item) => {
            item.activeState = 0;
            item.activeSelect = 0;
          });
          return resolve(res);
        });
      }
      if (node.level >= 1) {
        this.getMemberList(node.key).then((res) => {
          res.forEach((item) => {
            item.activeState = 0;
            item.activeSelect = 0;
          });
          return resolve(res);
        });
      }
    },
    // 关闭模块
    closePart(e) {
      if (e === 10) {
        this.browserInfo = null;
      }
      if (e === 11) {
        this.natureInfo = null;
      }
      this.$refs.getFooter.editTool(e);
    },
    listenPerson(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-16 18:06:24
       * @description: 人称切换
       */
      this.handleState = 0;
      this.listenInfo = e;
      this.updateOrder();
    },
    listenTodo(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-04 14:06:09
       * @description: 监听操作栏
       */
      // 浏览器
      if (e.type === 10) {
        this.browserInfo = e;
      }
      // 构件属性
      if (e.type === 11) {
        this.natureInfo = e;
        e.state === 0 ? (this.memberInfo = null) : "";
      }
      // 移动速度
      if (e.type === 1 && e.data) {
        this.handleState = 3
        this.listenTodoInfo = e
        this.updateOrder()
      }
      // 测量
      if (e.type === 3) {
        if (e.state === 1 && e.data !== undefined) {
          this.handleState = 4
          this.listenTodoInfo = e
          this.updateOrder()
        }
        if (e.state === 0) {
          this.handleState = 5
          this.updateOrder()
        }
      }
    },
    initWebSocket() {
      //初始化weosocket
      /**
       * @Author: zk
       * @Date: 2021-02-24 13:42:13
       * @description: 初始化socket通信
       */
      const wsuri = MODELAPI.CREATESOCKET(this.taskId);
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = (e) => {
        if (e.data.length > 20) {
          let realData = JSON.parse(e.data);
          if (realData.id === "1") {
            this.memberInfo = realData.data;
          } else if (realData.id === "3") {
            this.$refs.getFooter.resetPointList(realData.object)
          }
        }
      };
      this.websock.onopen = (e) => {
        this.isSocket = true;
        this.socketTimer = setInterval(() => {
          this.websock.send("heartbeat");
        }, 1000 * 60);
      };
      this.websock.onerror = (e) => {
        // console.log(e);
      };
    },
    getSceneUrl() {
      let appId = this.$route.query.appid;
      MODELAPI.GETMODELINFO({
        appliId: appId,
      })
        .then((res) => {
          if (res.data.code === 0 && res.data.data) {
            this.webUrl = res.data.data.url;
            this.taskId = res.data.data.taskId;
            this.propsFooter.taskId = res.data.data.taskId;
            this.initWebSocket();
            this.getMonitor();
            let timer = setTimeout(() => {
              window.clearTimeout(timer);
            }, 1000 * 10);
          } else {
            this.$message.warning(res.data.message);
          }
        })
        .catch((err) => {
          this.$message.error(this.$t("webClient.loadBox.message[4]"));
        });
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
          this.closeWebSocket();
        }
        clearTimeout(this.loadTimer);
      }, 1000 * 60);
    },
    // 清除定时器
    clearTimePass() {
      if (this.timerInfo) {
        clearInterval(this.timerInfo);
      }
      if (this.loadTimer) {
        clearTimeout(this.loadTimer);
      }
    },
    // 设置超时时间
    setTimePass() {
      this.clearTimePass();
      this.timerInfo = setInterval(() => {
        this.timerCount++;
        if (this.timerCount >= 170) {
          this.moreCount = 180 - this.timerCount;
        }
        if (this.moreCount === 0) {
          this.closeWebSocket();
          this.isFade = true;
          this.hiddenState = 1;
          this.clearTimePass();
        }
      }, 1000);
    },
    closeWebSocket() {
      // 清除定时器
      if (this.socketTimer) {
        clearInterval(this.socketTimer);
        this.socketTimer = null
      }
      if (this.websock) {
        this.isSocket = false;
        this.websock.close(); //离开路由之后断开websocket连接
        this.websock = null
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
        };
        // 关闭tool
        this.sendToIframe(10200, "false", "");
        document.addEventListener("keydown", (e) => {
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

<style lang="less" scoped>
@font-c: center;
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
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .time-log {
    pointer-events: none;
    position: absolute;
    z-index: 9999;
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
        width: 80px;
        height: 80px;
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
    z-index: 9999;
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
      width: 80px;
      height: 80px;
      margin-bottom: 30px;
    }
  }

  .phone-hidden-bim {
    .load-text {
      letter-spacing: 5rpx;
      font-size: 20px;
      display: flex;
      text-align: center;
      letter-spacing: 5rpx;
      font-size: 40px;
    }
    @-webkit-keyframes dotPhone {
      0% {
        left: -25px;
      }

      25% {
        left: -20px;
      }

      50% {
        left: -15px;
      }

      75% {
        left: -10px;
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
      height: 47vh;
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
      .tree-content {
        margin-top: 1vh;
        height: 40vh;
        width: 99.5%;
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
      position: absolute;
      bottom: 2vh;
      pointer-events: auto;
      margin-top: 1vh;
      height: 47vh;
      margin: 1vh 0 0 20px;
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

      .footer-main {
        margin: 0 auto;
        width: 680px;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-wrap: wrap;
        justify-content: @font-c;
        align-items: @font-c;
        text-align: @font-c;

        .main-content {
          flex: 0 0 16.66%;
          width: 16.66%;
        }
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
    width: 120vw !important;
  }
}
.tree-select {
  background: rgba(255, 255, 255, 0.2);
}
</style>
<style lang="less" >
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
    }
  }
}
</style>