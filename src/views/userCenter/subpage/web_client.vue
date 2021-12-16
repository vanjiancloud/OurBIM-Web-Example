<!--
 * @Author: zk
 * @Date: 2021-03-10 14:08:18
 * @LastEditors: zk
 * @LastEditTime: 2021-11-26 00:53:34
 * @description: 
-->
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
    <!-- 遮罩层 -->
    <div
      class="hidden-bim"
      :class="runTimeCode === 0 ? '' : 'phone-hidden-bim'"
      v-if="isFade"
    >
      <div class="hidden-bim">
        <img src="@/assets/img/ourbim-logo.png" class="show-loading" alt="" />
        <div class="bim-progress" v-if="hiddenState === 0 || hiddenState === 3">
          <div class="load-tip">
            基础环境加载中…
            <div>{{ propsProgress.loadData }}%</div>
          </div>
          <el-progress
            type="line"
            :show-text="false"
            :percentage="propsProgress.loadData"
          ></el-progress>
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
        <div
          class="hidden-text learn-text"
          v-if="hiddenState === 4"
          v-text="$t('webClient.loadBox.message[6]')"
        ></div>
      </div>
    </div>
    <!-- runTimeCode 1:mobile  0 ：PC  -->
    <div v-if="runTimeCode === 0">
      <!-- 模型浏览器 -->
      <div class="mutual-bim">
        <div
          class="tree-main"
          v-show="
            controllerInfo.tagUiBar &&
            ((browserInfo &&
              browserInfo.type === 10 &&
              browserInfo.state === 1) ||
              controllerInfo.modelClient)
          "
        >
          <div class="tree-title">
            <div class="" v-text="$t('webClient.browser.title')"></div>
            <div class="close-part">
              <i
                class="el-icon-close"
                @click.stop="closePart(browserInfo.type)"
              ></i>
            </div>
          </div>
          <!-- 操作 -->
          <div class="handle-part">
            <el-input
              class="search-tag"
              placeholder="请输入你要搜索的内容"
              @click.native.stop
              @change="changeBrowser"
              @keyup.enter.native="changeBrowser"
              v-model="modelBrowser"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="tree-part">
            <div class="tree-content" id="tree-content">
              <!-- 构件树开始 -->
              <el-tree
                class="set-tree"
                ref="setTree"
                @check="checkTree"
                :empty-text="treeEmpty"
                @node-expand="ExpandNode"
                :props="propsMember"
                :expand-on-click-node="false"
                :load="loadNode"
                :filter-node-method="filterNode"
                show-checkbox
                highlight-current
                node-key="uuid"
                lazy
              >
                <span
                  class="custom-tree-node"
                  :class="
                    activeTree &&
                    node.data.uuid === activeTree.uuid &&
                    activeLeaf
                      ? 'tree-select'
                      : ''
                  "
                  slot-scope="{ node }"
                  @click="handleTree(node, 0)"
                >
                  <span class="label-span">{{ node.label }}</span>
                  <img
                    src="@/assets/images/tag/6.png"
                    @click.stop="deleteCom(node)"
                    class="delect-com-icon"
                    v-if="
                      node.data.typeId === 'comp' && checkedNodeVanjian(node)
                    "
                  />
                  <span>
                    <!-- <span v-if="node.data.typeId !== 'comp'"> -->
                    <!-- 显示状态 -->
                    <i class="iconfont icon-xianshi2" v-if="!node.checked"></i>
                    <i v-else class="iconfont icon-yincang1"></i>
                  </span>
                </span>
              </el-tree>
              <!-- 构件树结束 -->
            </div>
          </div>
        </div>
        <div
          class="bim-info"
          v-show="
            controllerInfo.tagUiBar &&
            ((natureInfo && natureInfo.type === 11 && natureInfo.state === 1) ||
              controllerInfo.memberAvttribute)
          "
        >
          <!-- 属性 -->
          <div class="bim-title">
            <div class="" v-text="$t('webClient.attribute.title')"></div>
            <div class="close-part">
              <i
                class="el-icon-close"
                @click.stop="closePart(natureInfo.type)"
              ></i>
            </div>
          </div>
          <div class="detail-main">
            <table
              class="detail-table"
              v-if="memberInfo && memberInfo.type === 1"
            >
              <tr
                v-for="(item, index) in memberInfo.data.dynamicData"
                :key="index"
              >
                <td v-text="item.name"></td>
                <td v-text="item.value"></td>
              </tr>
            </table>
            <table
              class="detail-table"
              v-else-if="memberInfo && memberInfo.type === 5"
            >
              <tr>
                <td>请选择唯一构件以查看属性</td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 构件库 -->
        <div v-show="comVisible">
          <div
            class="bim-info"
            @click.stop=""
            v-show="
              controllerInfo.tagUiBar &&
              ((listenTodoInfo &&
                listenTodoInfo.type === 14 &&
                listenTodoInfo.state === 1) ||
                controllerInfo.componentLibrary)
            "
          >
            <div class="bim-title">
              <div
                class=""
                v-text="$t('webClient.componentLibrary.title')"
              ></div>
              <div class="close-part">
                <i
                  class="el-icon-close"
                  @click.stop="closePart(listenTodoInfo.type)"
                ></i>
              </div>
            </div>
            <div class="detail-main detail-collapse">
              <scroll-container>
                <!-- <el-collapse v-model="componentCollapse" accordion>
                <el-collapse-item title="二维码" name="1">
                  <div class="collapse-main">
                    <el-button size="mini" type="primary" @click="AddQrCode"
                      >新增</el-button
                    >
                  </div>
                </el-collapse-item>
              </el-collapse> -->

                <!-- 公共构件库列表 -->
                <el-collapse
                  accordion
                  v-for="(item, index) in publicComList"
                  :key="item.title"
                  class=""
                >
                  <el-collapse-item :title="item.group" :name="index">
                    <div class="collapse-main">
                      <div class="oooooooo">
                        <div
                          class="publicComListItem"
                          v-for="listItem in item.rsComponent"
                          :key="listItem.id"
                          @click="addCom(listItem)"
                        >
                          <div class="img">
                            <img :src="listItem.comUrl" alt="" />
                          </div>
                          <div class="name">{{ listItem.comName }}</div>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </scroll-container>
            </div>
          </div>
        </div>
        <!-- 二维码 -->
        <qrcode-part
          v-if="isQrcode"
          :leafInfo="leafInfo"
          @click.native.stop=""
          @setListenClick="setListenClick"
        ></qrcode-part>
      </div>

      <transition name="el-fade-in-linear">
        <progress-bar
          v-if="isProgress"
          :propsProgress="propsProgress"
        ></progress-bar>
      </transition>

      <todo-footer
        v-if="controllerInfo.singleList.length !== 13 && controllerInfo.uiBar"
        v-show="controllerInfo.tagUiBar"
        ref="getFooter"
        @listenTodo="listenTodo"
        @listenPerson="listenPerson"
        @listenMode="listenMode"
        @listenFollow="listenFollow"
        @updataModle="updataModle"
        @comIconChang="comIconChang"
        :setProps="propsFooter"
        :singleList="controllerInfo.singleList"
        :appId="appId"
        :taskId="taskId"
        :socketData="socketData"
        :showTodoIconObj="showTodoIconObj"
      ></todo-footer>
      <view-cube
        v-if="controllerInfo.viewCube"
        v-show="controllerInfo.tagViewCube"
        :userType="userType"
        @handleOrder="handleOrder"
        @goFront="goFront"
        @handleType="handleType"
        ref="getCube"
      ></view-cube>
      <!-- 标签树 -->
      <tag-tree
        @click.native.stop=""
        @closeTag="closeTag"
        @setListenClick="setListenClick"
        @setAddTag="setAddTag"
        @setTagClick="setTagClick"
        :setProps="propsFooter"
        ref="tagTree"
      ></tag-tree>
    </div>
  </div>
</template>

<script>
import MODELAPI from "@/api/model_api";
import TAGTREE from "@/api/tag_tree";
import COMPONENTLIBRARY from "@/api/component-library";
import todoFooter from "@/components/web_client/todo_footer";
import viewCube from "@/components/web_client/view_cube";
import tagTree from "@/components/web_client/tag_tree";
import progressBar from "@/components/web_client/progress_bar";
import qrcodePart from "@/components/web_client/qrcode-part.vue";
import scrollContainer from "@/components/web_client/scrollContainer.vue";

import resMessage from "../../../utils/res-message";

// import "https://res.wx.qq.com/open/js/jweixin-1.3.2.js";
export default {
  name: "look_app",
  layout: "reset",
  components: {
    todoFooter,
    viewCube,
    tagTree,
    progressBar,
    qrcodePart,
    scrollContainer,
  },
  data() {
    return {
      showTodoIconObj: {},
      socketData: {},
      windowChangeFlag: true,
      componentCollapse: "1",
      modelBrowser: null,
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
        componentLibrary: false,
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
      isQrCodeClick: false,
      handleState: 0,
      activeTree: null,
      leafInfo: null,
      listenInfo: null,
      cubeState: 6,
      runTimeCode: 0,
      timerInfo: null,
      memberInfo: null,
      activeLeaf: false,
      loadTimer: null,
      timerCount: 0,
      hiddenState: 0,
      websock: null,
      isSocket: false,
      socketTimer: null,
      browserInfo: null,
      natureInfo: null,
      shadowType: null,
      listenTodoInfo: null,
      isUiBar: true,
      pageSizeInfo: {
        width: null,
        height: null,
      },
      uaInfo: null,
      gaugeInfo: {
        unit: "m",
        accuracy: 0.01,
      },
      treeEmpty: this.$t("webClient.browser.tips[0]"),
      TreePageNo: 2,
      ScrollDistance: 0,
      isQrcode: false,
      iTime: {},
      publicComList: [],
      comSaveNode: null,
      godNode: null,
      comVisible: false,
      appType: null,
      multUuid: null,
      userType:null
    };
  },

  watch: {
    listenTodoInfo(val) {
      console.log("listenTodoInfo", val);
    },
  },
  created() {
    if (localStorage.getItem("appType")) {
      this.appType = localStorage.getItem("appType");
    }
    this.uaInfo = navigator.userAgent.toLowerCase();
    this.setOrderList();
    this.appId = this.$route.query.appid;
    this.appToken = this.$route.query.token;
    this.isUiBar =
      this.$route.query.uibar === undefined || this.$route.query.uibar === true
        ? true
        : false;

    this.handleTodoIcon(this.$route.query);
    if (this.$route.query.width && this.$route.query.height) {
      this.pageSizeInfo = {
        width: this.$route.query.width,
        height: this.$route.query.height,
      };
    } else {
      this.pageSizeInfo = {
        width: 1920,
        height: 1080,
      };
    }
  },
  mounted() {
    document
      .querySelector("#tree-content")
      .addEventListener("scroll", this.throttle(this.handleScroll));
    if (this.$route.query.locale) {
      this.locale = this.$route.query.locale;
      this.$i18n.locale = this.locale;
    } else {
      this.$i18n.locale = this.locale;
    }
    this.setTimeLoad();
    if (this.isMobile()) {
      this.runTimeCode = 1;
    } else {
      this.runTimeCode = 0;
    }
    this.getModelUrl();
    //判断是否使用的是ipad
    let isiPad =
      navigator.userAgent.match(/(iPad)/) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (isiPad !== false || isMac !== false) {
      this.hiddenState = 3;
    }
    this.addMessageEvent();
  },
  destroyed() {
    localStorage.removeItem("shareCode");
    this.clearTimePass();
    this.closeWebSocket();
  },
  methods: {
    addMessageEvent() {
      window.addEventListener(
        "message",
        (e) => {
          if (e.data.prex === "pxymessage") {
            this.getError(e.data);
          }
          if (e.data.prex === "ourbimMessage") {
            // 控制栏显示隐藏
            if (e.data.type === 1001) {
              this.controllerInfo.uiBar = e.data.data;
              this.controllerInfo.viewCube = e.data.data;
            } else if (e.data.type >= 1002 && e.data.type <= 1014) {
              if (this.actionList.indexOf(e.data.type) > -1) {
                if (e.data.data === false) {
                  this.controllerInfo.singleList.push(e.data.type);
                } else {
                  this.controllerInfo.singleList.indexOf(e.data.type) > -1
                    ? this.controllerInfo.singleList.splice(
                        this.controllerInfo.singleList.indexOf(e.data.type),
                        1
                      )
                    : "";
                }
              }
            } else if (e.data.type === 1015) {
              this.controllerInfo.viewCube = e.data.data;
            } else if (e.data.type === 2001) {
              // 构件树的显示隐藏
              this.controllerInfo.modelClient = e.data.data;
            } else if (e.data.type === 2002) {
              this.controllerInfo.memberAvttribute = e.data.data;
            } else if (e.data.type === 2003) {
              this.$refs.tagTree.closePart(e.data.data);
              this.$refs.tagTree.closeIcon();
            } else if (e.data.type === 2004) {
              this.controllerInfo.componentLibrary = e.data.data;
            }
          }
        },
        false
      );
    },
    comIconChang(val) {
      this.comVisible = val;
    },
    handleTodoIcon(query) {
      const arr = [
        "show",
        "select",
        "view",
        "speed",
        "slice",
        "measure",
        "tag",
        "map",
        "camera",
        "animation",
        "decompose",
        "weather",
        "componentList",
        "componentTree",
        "attribute",
      ];
      let obj = {};
      arr.map((v) => {
        if (query[v] == "false") {
          obj[v] = false;
        } else {
          obj[v] = true;
        }
      });
      this.showTodoIconObj = obj;
    },
    getComList() {
      COMPONENTLIBRARY.getPublicComList({
        taskId: this.taskId,
      }).then((res) => {
        this.publicComList = res.data.data;
      });
    },
    listenWindowSize() {
      // 监听窗口大小变化 id=14 height

      this.handleWindowSize();
      window.onresize = () => {
        clearTimeout(this.iTime);
        this.iTime = setTimeout(() => {
          this.handleWindowSize();
        }, 150);
      };
    },
    handleWindowSize() {
      const viewWidth = window.innerWidth; //获取可视区域宽度
      const viewHeight = window.innerHeight; //获取可视区域高度
      let height = "";
      let width = "";
      if (viewWidth > viewHeight) {
        // 宽大于高 横屏
        height = document.body.clientHeight;
        width = document.body.clientWidth;
      } else {
        height = document.body.clientWidth;
        width = document.body.clientHeight;
      }
      let params = {
        taskid: this.taskId,
        action: "platform",
        plateType: this.isMobile() ? 1 : 0,
        height: height,
        width: width,
      };
      MODELAPI.UPDATEORDER(params);
    },
    async updataModle(params) {
      params.taskid = this.taskId;
      const { data: res } = await MODELAPI.UPDATEORDER(params);
      if (res.code === 0) {
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },
    filterNode(value, data) {
      /**
       * @Author: zk
       * @Date: 2021-09-01 10:49:56
       * @description: 筛选模型浏览器
       */
      if (!value) return true;
      const reamVal = data.name.indexOf(value) !== -1;
      if (!reamVal) {
        this.treeEmpty = this.$t("webClient.browser.tips[1]");
      }
      return reamVal;
    },
    changeBrowser() {
      /**
       * @Author: zk
       * @Date: 2021-09-01 10:46:13
       * @description: 搜索
       */
      this.$refs.setTree.filter(this.modelBrowser);
    },

    AddQrCode() {
      /**
       * @Author: zk
       * @Date: 2021-07-30 14:25:42
       * @description: 新增二维码
       */
      return;
      let params = {
        taskId: this.taskId,
      };
      COMPONENTLIBRARY.ADDCOMPONENT(params).then((res) => {
        if (this.controllerInfo.uiBar) {
          this.controllerInfo.tagUiBar = false;
          this.controllerInfo.tagViewCube = false;
        }
      });
    },

    ExpandNode(e, data) {
      /**
       * @Author: zk
       * @Date: 2021-06-18 17:06:25
       * @description: 节点展开
       */
      this.TreePageNo = 2;
      this.openNode = data;

      if (this.appType === "3") {
        // 合模
      } else {
        // 不是合模
        // 展开根节点，保存根节点信息
        if (data.level === 1) {
          this.godNode = data || {};
        }

        // 保存自定义构件信息（普通模型）
        if (data.data.name === "自定义构件") {
          this.comSaveNode = data || {};
        }
      }
    },
    throttle(fn, delay = 500) {
      /**
       * @Author: zk
       * @Date: 2021-06-18 16:50:53
       * @description: 节流优化
       */
      // 设置变量默认为true
      let flag = true;
      // 为了保证this指向，返回一个箭头函数
      return (...args) => {
        // 判断如果已经在执行就直接return
        if (!flag) return;
        // 否则就是没有执行，将状态赋值为false
        flag = false;
        // 设置定时器，设置时间
        let timer = setTimeout(() => {
          // 调用apply方法确保this指向问题
          fn.apply(this, args);
          // 最后将状态重新更改为true，以便程序下次执行
          flag = true;
          clearTimeout(timer);
        }, delay);
      };
    },
    handleScroll() {
      /**
       * @Author: zk
       * @Date: 2021-06-18 16:22:59
       * @description: 监听滚动
       */
      let offsetHeight = document.querySelector(".tree-part").offsetHeight;
      let scrollTop = document.querySelector("#tree-content").scrollTop;
      let scrollHeight = document.querySelector("#tree-content").scrollHeight;
      let scrollBottom = scrollHeight - (offsetHeight + scrollTop);
      const ScrollDistance = scrollTop - this.ScrollDistance;
      this.ScrollDistance = scrollTop;
      if (ScrollDistance > 0) {
        this.ListScrollTree();
      }
    },
    // 更新添加的自定义构件库
    updateComTree() {
      if (!this.comSaveNode) {
        return;
      }
      this.getMyComList(this.comSaveNode).then((res) => {
        this.$refs.setTree.updateKeyChildren(this.comSaveNode.data.uuid, res);
      });
    },
    updateGodChildNode() {
      // 没有根节点，返回
      if (!this.godNode) {
        return;
      }
      // 检查第二层有无自定义构件
      const flag = this.godNode.childNodes.some((item) => {
        return item.data.name === "自定义构件";
      });
      // 如果有
      if (flag) {
        this.updateComTree();
      } else {
        let node = this.$refs.setTree.getNode(this.godNode);

        // 如果没有，添加自定义构件组
        this.getMyComList(this.godNode).then((res) => {
          const data = res[res.length - 1];
          this.$refs.setTree.append(data, node);
        });
      }
    },
    ListScrollTree() {
      /**
       * @Author: zk
       * @Date: 2021-06-18 17:03:03
       * @description: 滚动加载构件树
       */
      this.LisetMemberPage(this.openNode).then((res) => {
        this.TreePageNo++;
        if (res.length > 0) {
          res.forEach((item) => {
            let noneNode = this.$refs.setTree.getNode(item);
            if (!noneNode) {
              this.$refs.setTree.append(item, this.openNode.key);
              this.$refs.setTree.setChecked(item, this.openNode.checked);
            }
          });
        } else {
          if (this.openNode.parent.data) {
            this.TreePageNo = 1;
            this.openNode = this.openNode.parent;
            this.ListScrollTree();
          }
        }
      });
    },
    setOrderList() {
      /**
       * @Author: zk
       * @Date: 2021-05-10 17:54:24
       * @description: 初始化指令对照表
       */
      for (let index = 0; index < 13; index++) {
        this.actionList.push(1002 + index);
      }
    },
    listenFollow(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-08 15:30:38
       * @description: 监听关注视角是否打开
       */
      this.isFollow = e;
    },
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
        101, 102, 103, 201, 202, 203, 301, 401, 402, 403, 404, 501, 502, 503,
        504, 601, 602, 603, 1001, 1002, 1003, 1004,
      ];
      if (e.type === 200) {
        this.getMonitor();
      }
      if (errorList.indexOf(e.type) !== -1) {
        this.hiddenState = 4;
        this.isFade = true;
        this.closeWebSocket();
        this.$message({
          message: this.$t("webClient.loadBox.message[6]"),
          type: "warning",
          customClass: "set-index-message",
        });
      }
    },
    handleType(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-12 11:34:19
       * @description: 选择类型 e 0: 重置主视图 1: 透视投影 2: 正交投影 3 自定义主视图
       */
      if (e === 2 && this.$refs.getFooter) {
        // 上帝视角
        this.$refs.getFooter.resetPerson(1);
      }
      this.shadowType = e;
      if (e === 0) {
        this.handleState = 7;
      } else if (e === 3) {
        this.handleState = 2;
      } else {
        this.handleState = 1;
      }
      this.updateOrder();
    },
    goFront() {
      /**
       * @Author: zk
       * @Date: 2021-04-08 11:47:29
       * @description: 定位主视图
       */
      this.handleState = 10;
      this.updateOrder();
    },
    // 判断父级或者父父级node名字有没有vanjian
    checkedNodeVanjian(node) {
      if (node.level === 1) {
        return true;
      } else if (node.level === 2) {
        if (node.parent.data.uuid.indexOf("vanjian") !== -1) {
          return false;
        } else {
          return true;
        }
      } else if (node.level === 3) {
        if (node.parent.parent.data.uuid.indexOf("vanjian") !== -1) {
          return false;
        } else {
          return true;
        }
      }
    },
    deleteCom(node) {
      const { name, uuid } = node.data;
      this.$confirm("此操作删除此构件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          COMPONENTLIBRARY.deleteCom({
            taskId: this.taskId,
            comId: uuid,
          }).then((res) => {
            resMessage(res.data);
            // 获取自定义构件父级node
            const nodeParent = this.$refs.setTree.getNode(
              node.data.uuid
            ).parent;
            if (res.data.code === 0) {
              this.$refs.setTree.remove(node);
              if (nodeParent.childNodes.length === 0) {
                this.$refs.setTree.remove(nodeParent.data.uuid);
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    componentShowHide(uuid) {
      /* 
        自定义构件显示隐藏
      */
      const lableVisibility = this.leafInfo.activeState == 1 ? false : true;
      COMPONENTLIBRARY.controlComShowOrHide({
        comId: uuid,
        taskId: this.taskId,
        lableVisibility,
      }).then(({ data: res }) => {
        resMessage(res);
      });
    },
    checkTree(data, e) {
      /**
       * @Author: zk
       * @Date: 2021-04-16 11:56:27
       * @description: 显示隐藏
       */
      this.leafInfo = data;

      if (e.checkedKeys.includes(data.uuid)) {
        this.handleState = 8;
        data.activeState = 1;
        // 如果是自定义构件
        if (data.typeId === "comp") {
          this.componentShowHide(data.uuid);
          return;
        }
        this.updateOrder();
      } else {
        this.handleState = 8;
        data.activeState = 0;
        // 如果是自定义构件
        if (data.typeId === "comp") {
          this.componentShowHide(data.uuid);
          return;
        }
        this.updateOrder();
      }
    },
    handleTree(e, index) {
      /**
       * @Author: zk
       * @Date: 2021-03-08 14:39:51
       * @description: 构件树的指令
       */

      let messageInfo = {
        prex: "ourbimMessage",
        type: 20001,
        data: e.data,
        message: "",
      };
      this.sentParentIframe(messageInfo);
      if (this.activeTree && this.activeTree.uuid === e.data.uuid) {
        if (e.data.activeSelect === 1) {
          this.activeLeaf = false;
        } else {
          this.activeLeaf = true;
        }
        e.data.activeSelect = e.data.activeSelect === 0 ? 1 : 0;
        this.leafInfo = e;
      } else {
        this.activeLeaf = true;
        this.leafInfo = e;
        e.data.activeSelect = 1;
      }
      this.memberInfo = {
        type: e.data.haveChild === "0" ? 1 : 5,
        data: e.data,
      };
      this.leafInfo = e;
      this.handleState = 9;

      this.activeTree = e.data;

      if (e.data.typeId === "comp") {
        // 如果是构件库
        // if (e.data.haveChild === "0") {
        this.leafInfo = e;
        this.isQrCodeClick = true;
        // this.handleQrcode(true);
        this.handleFocusTag(e.data);
        // } else {
        //   return;
        // }
      } else {
        this.updateOrder();
      }
      return;
      if (e.data.typeId === "comp") {
        // 如果是构件库
        if (e.data.haveChild === "0") {
          this.leafInfo = e;
          this.isQrCodeClick = true;
          // this.handleQrcode(true);
          this.handleFocusTag(e.data);
        } else {
          return;
        }
      } else {
        let messageInfo = {
          prex: "ourbimMessage",
          type: 20001,
          data: e.data,
          message: "",
        };
        this.sentParentIframe(messageInfo);
        if (this.activeTree && this.activeTree.uuid === e.data.uuid) {
          if (e.data.activeSelect === 1) {
            this.activeLeaf = false;
          } else {
            this.activeLeaf = true;
          }
          e.data.activeSelect = e.data.activeSelect === 0 ? 1 : 0;
          this.leafInfo = e;
        } else {
          this.activeLeaf = true;
          this.leafInfo = e;
          e.data.activeSelect = 1;
        }
        this.memberInfo = {
          type: e.data.haveChild === "0" ? 1 : 5,
          data: e.data,
        };
        this.leafInfo = e;
        this.handleState = 9;
        this.updateOrder();
        this.activeTree = e.data;
      }
    },
    handleFocusTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-08-17 16:00:55
       * @description: 定位二维码
       */
      let flag = null;
      flag = this.leafInfo.data.activeSelect ? true : false;
      let params = {
        taskId: this.taskId,
        comId: e.uuid,
        flag,
      };

      COMPONENTLIBRARY.focusComponent(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((res) => {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        });
    },
    handleQrcode(e) {
      /**
       * @Author: zk
       * @Date: 2021-07-30 16:28:24
       * @description: 打开二维码框
       */
      this.$refs.getFooter.resetState();
      this.isQrcode = e;
    },
    handleOrder(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-08 10:40:10
       * @description: cube指令
       */
      if (this.listenInfo === 0 && this.$refs.getFooter) {
        this.$refs.getFooter.resetPerson(1);
      }
      this.handleState = 6;
      this.cubeState = e;
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
          customClass: "set-index-message",
        });
        return;
      }
      let params = {
        taskid: this.taskId,
      };
      switch (this.handleState) {
        case 0:
          // 一三人称
          params.action = "switchViewMode";
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
          params.action = "switchViewMode";
          // 投影类型切换
          if (this.shadowType === 2) {
            // 正交 必须为上帝视角
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
          params.action = "setGodPos";
          break;
        case 3:
          // 移动速度
          params.action = "setSpeedLevel";
          params.speedLevel = this.listenTodoInfo.data;
          break;
        case 4:
          if (
            this.listenTodoInfo.data === 0 ||
            this.listenTodoInfo.data === 1 ||
            this.listenTodoInfo.data === 2
          ) {
            // 测量前先关闭其他测量（排他思想）
            params.action = "endMeasure";
            await MODELAPI.UPDATEORDER(params);
          }
          // 测量
          if (this.listenTodoInfo.data === 0) {
            // 坐标
            params.action = "coordinate";
            // params.status="begin"
          } else if (this.listenTodoInfo.data === 1) {
            // 距离
            params.action = "distance";
          } else if (this.listenTodoInfo.data === 2) {
            // 角度
            params.action = "angle";
          } else if (this.listenTodoInfo.data === 3) {
            // 设置单位
            params.action = "changePrecisionOrUnit";

            params.unit = this.listenTodoInfo.set;
            params.precision = this.gaugeInfo.accuracy;
          } else if (this.listenTodoInfo.data === 4) {
            // 设置精度

            params.action = "changePrecisionOrUnit";
            params.precision = this.listenTodoInfo.set;
            params.unit = this.gaugeInfo.unit;
          }
          break;
        case 5:
          // 关闭测量
          params.action = "endMeasure";
          break;
        case 6:
          // 六面体
          params.action = "cameraPosSpecial";
          params.sjid = this.cubeState;
          break;
        case 7:
          // 重置主视图
          params.action = "clearGodCamerashot";
          break;
        case 8:
          // 构件显示 隐藏 半透明
          params.mn = this.leafInfo.uuid;
          params.projectId = this.leafInfo.projectId;
          if (this.leafInfo.activeState === 0) {
            params.action = "showComponents";
          } else if (this.leafInfo.activeState === 1) {
            params.action = "hideComponents";
          } else {
            params.action = "setTransparency";
            params.Opacity = 0.5;
          }
          break;
        case 9:
          // 当前 focus + 高亮 /取消
          params.projectId = this.leafInfo.data.projectId;
          params.mn = this.leafInfo.key;
          this.leafInfo.data.activeSelect === 0
            ? (params.action = "cancelSelectComponent")
            : (params.action = "selectComponent");
          break;
        case 10:
          // 定位主视图
          params.action = "cameraPosAll";
          break;
        case 11:
          // 剖切
          if (this.listenTodoInfo.state === 0) {
            params.action = "end";
          }
          if (
            this.listenTodoInfo.state === 1 &&
            this.listenTodoInfo.data === undefined
          ) {
            params.action = "start";
          }
          if (
            this.listenTodoInfo.state === 1 &&
            this.listenTodoInfo.data !== undefined
          ) {
            switch (this.listenTodoInfo.data.id) {
              case 0:
                if (this.listenTodoInfo.data.state === "on") {
                  params.action = "move";
                } else {
                  params.action = "cutBox";
                }
                break;
              case 1:
                if (this.listenTodoInfo.data.state === "on") {
                  params.action = "rotate";
                } else {
                  params.action = "cutBox";
                }
                break;
              case 2:
                params.action = "invert";
                params.Switch = this.listenTodoInfo.data.state;
                break;
              case 3:
                params.action = "startItem";
                break;
              case 4:
                params.action = "restoration";
                break;
              default:
                break;
            }
          }
          break;
        case 12:
          // 分解模型
          params.action = "splitModel";
          params.splitValue = this.listenTodoInfo.data;
          break;
        case 13:
          // 启动应用
          params.action = "platform";
          params.plateType = this.isMobile() ? 1 : 0;
          params.width = document.body.clientWidth;
          params.height = document.body.clientHeight;
          break;
        case 14:
          // 框选
          params.action = "componentBoxSelection";
          params.Switch = this.listenTodoInfo.state === 1 ? "on" : "off";
          break;
        case 15:
          // 渲染环境
          // params.action = "Weather";
          // params.weahterId = this.listenTodoInfo.data.id;
          params.action = "switchWeather ";
          params.weahterId = this.listenTodoInfo.data.id;
          break;
        case 16:
          // 渲染环境
          params.action = "minimapSethidden";
          params.Switch = this.listenTodoInfo.state === 0 ? "off" : "on";
          break;
        case 17:
          // 渲染环境
          params.action = 51;
          params.rate = this.listenTodoInfo.data ? this.listenTodoInfo.data : 6;
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
      //模型操作
      await MODELAPI.UPDATEORDER(params)
        .then((res) => {
          if (res.data.code === 0) {
            // 剖切 重置恢复
            this.resetSection();

            if (params.action === "cameraPosAll" && res.data && res.data.data) {
              // 切换到主视图 重置状态
              if (this.$refs.getFooter) {
                let realView = res.data.data.viewMode === "1" ? 0 : 1;
                this.$refs.getFooter.resetPerson(realView);
              }
              if (this.$refs.getCube) {
                let realProject = res.data.data.projectionMode === "1" ? 1 : 2;
                this.$refs.getCube.resetActive(realProject);
              }
            }
            this.$message({
              message: this.$t("webClient.loadBox.message[2]"),
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch(() => {
          // 剖切 重置恢复
          this.resetSection();
          this.$message({
            message: this.$t("webClient.loadBox.message[3]"),
            type: "error",
          });
        });
    },
    resetSection() {
      /**
       * @Author: zk
       * @Date: 2021-09-03 17:40:45
       * @description: 剖切 重置恢复
       * @param {*} this
       */
      const realId =
        this.listenTodoInfo &&
        this.listenTodoInfo.data &&
        this.listenTodoInfo.data.id
          ? this.listenTodoInfo.data.id
          : "";
      if (this.handleState === 11 && realId === 4) {
        this.$refs.getFooter.resetSection();
      }
    },

    async getMyComList(node) {
      let params = {
        appliId:
          node.data && node.data.projectId ? node.data.projectId : this.appId,
        pageNo: 1,
        pageSize: 999,
      };
      node.key ? (params.uuid = node.key) : "";
      let realMember = await MODELAPI.LISTMEMBERTREE(params).then((res) => {
        if (res.data.code === 0) {
          return res.data.data;
        } else {
          return [];
        }
      });
      return realMember;
    },

    async LisetMemberPage(node) {
      let params = {
        appliId:
          node.data && node.data.projectId ? node.data.projectId : this.appId,
        pageNo: this.TreePageNo,
        pageSize: 20,
      };
      node.key ? (params.uuid = node.key) : "";
      let realMember = await MODELAPI.LISTMEMBERTREE(params).then((res) => {
        if (res.data.code === 0) {
          return res.data.data;
        } else {
          return [];
        }
      });
      return realMember;
    },
    async getMemberList(node) {
      let params = {
        appliId:
          node.data && node.data.projectId ? node.data.projectId : this.appId,
        pageNo: 1,
        pageSize: 20,
      };
      node.key ? (params.uuid = node.key) : "";
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
        this.getMemberList(node).then((res) => {
          if (res.length > 0) {
            res.forEach((item) => {
              item.activeState = 0;
              item.activeSelect = 0;
            });
            return resolve(res);
          } else {
            this.treeEmpty = this.$t("webClient.browser.tips[1]");
          }
        });
      }
      if (node.level >= 1) {
        this.getMemberList(node).then((res) => {
          if (res.length > 0) {
            res.forEach((item) => {
              item.activeState = 0;
              item.activeSelect = 1;
            });

            return resolve(res);
          } else {
            this.treeEmpty = this.$t("webClient.browser.tips[1]");
            return resolve([]);
          }
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
      if (e === 14) {
        this.listenTodoInfo = null;
      }
      if (this.$refs.getFooter) {
        this.$refs.getFooter.editTool(e);
      }
    },
    closeTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-06 10:13:08
       * @description: 关闭标签组件
       */
      this.isTag = false;
      this.listenTodoInfo = {
        type: 4,
        state: 0,
      };
      this.handleTagShow();
      if (this.$refs.getFooter) {
        this.$refs.getFooter.editTool(4);
      }
    },
    setListenClick(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 09:54:23
       * @description: 设置监听点击状态
       */
      if (this.$refs.getFooter) {
        this.$refs.getFooter.setListenClick(e);
      } else {
        if (e) {
          this.isTag = false;
          window.addEventListener("click", this.clickOthers);
        } else {
          this.isTag = true;
          window.removeEventListener("click", this.clickOthers);
        }
      }
    },
    clickOthers() {
      return;
    },
    setTagClick(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-12 16:49:12
       * @description: 标签树是否选中
       */
      let messageInfo = {
        prex: "ourbimMessage",
        type: 30001,
        data: e,
        message: "",
      };
      this.sentParentIframe(messageInfo);
    },
    setAddTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-19 10:45:00
       * @description: 添加标签
       */
      if (this.controllerInfo.uiBar) {
        this.controllerInfo.tagUiBar = false;
        this.controllerInfo.tagViewCube = false;
      }
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

      this.$refs.getCube.closeView();
      if (e.type === 14 || e.type === 11) {
        this.isQrcode = false;
      }
      // 构件库
      if (e.type === 14) {
        this.listenTodoInfo = e;
      }
      // 浏览器
      if (e.type === 10) {
        this.browserInfo = e;
      }
      // 构件属性
      if (e.type === 11) {
        this.natureInfo = e;
        // e.state === 0 ? (this.memberInfo = null) : "";
      }
      // 框选
      if (e.type === 12) {
        this.handleState = 14;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 移动速度
      if (e.type === 1 && e.data) {
        this.handleState = 3;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 标签
      if (e.type === 4) {
        this.isTag = e.state === 0 ? false : true;
        this.$refs.tagTree.closePart(e.state === 0 ? false : true);
        this.listenTodoInfo = e;
        this.handleTagShow();
      } else {
        if (this.isTag && e.type !== 11) {
          this.$refs.tagTree.closePart(false);
          // 如果不是标签并且标签已经开启
          // this.listenTodoInfo = {
          //   type: 4,
          //   state: 0,
          // };
          this.handleTagShow(false);

          this.isTag = false;
        }
      }
      // 模型剖切
      if (e.type === 2) {
        this.handleState = 11;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 测量
      /*
        state: 0,
        type: 3,
        data: 0 1 2,
        set: null,
       */
      if (e.type === 3) {
        if (e.state === 1 && e.data !== undefined) {
          this.handleState = 4;
          this.listenTodoInfo = e;
          if (e.data === 3) {
            this.gaugeInfo.unit = e.set;
          } else if (e.data === 4) {
            this.gaugeInfo.accuracy = e.set;
          }
          this.updateOrder();
        }
        if (e.state === 0) {
          this.handleState = 5;
          this.updateOrder();
        }
      }
      // 分解模型
      if (e.type === 8 && e.data !== undefined) {
        this.handleState = 12;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 渲染环境
      if (e.type === 9 && e.data !== undefined) {
        this.handleState = 15;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 小地图
      if (e.type === 5) {
        this.handleState = 16;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
      // 构件显示隐藏
      // 渲染环境
      if (e.type === 13) {
        this.listenTodoInfo = e;
        this.UpdateMemeberState();
      }
      // 渲染环境修改时间
      if (e.type === 15) {
        this.handleState = 17;
        this.listenTodoInfo = e;
        this.updateOrder();
      }
    },
    UpdateMemeberState() {
      /**
       * @Author: zk
       * @Date: 2021-06-09 11:02:14
       * @description: 更改选中构件状态
       */
      let params = {
        taskid: this.taskId,
        visible: this.listenTodoInfo.state === 0 ? true : false,
      };

      MODELAPI.UPDATEMEMBER(params).then((res) => {
        this.$message({
          message: this.$t("webClient.loadBox.message[2]"),
          type: "success",
        });
      });
    },
    /* 添加构件  */
    addCom(item) {
      // parentId
      let params = {
        // comGroupId: item.parentId,
        comName: item.comName,
        taskId: this.taskId,
        comId: item.id,
      };
      COMPONENTLIBRARY.addCom(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.controllerInfo.tagUiBar = false;
            this.controllerInfo.tagViewCube = false;
          }
          this.$message.success(res.data.message);
        })
        .catch((res) => {
          this.$message.error(res.data.message);
        });
    },
    handleTagShow(flag) {
      /**
       * @Author: zk
       * @Date: 2021-05-12 16:05:22
       * @description: 标签显示/隐藏
       */
      let params = {
        taskId: this.taskId,
        lableVisibility: this.listenTodoInfo.state === 0 ? false : true,
      };
      if (flag !== undefined) {
        params.lableVisibility = flag;
      }
      TAGTREE.UPDATASHOWTAG(params)
        .then(() => {
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
    async handleMultModle() {
      // 查看有没有合模的自定义构件
      // 合模必然有 uuid vanjian1
      const godNodeList =
        this.$refs.setTree.getNode("vanjian1").parent.childNodes;

      const mult = godNodeList.find((item) => {
        return item.data.name === "自定义构件";
      });

      this.multUuid = mult ? mult.data.uuid : null;
      // 如果没有自定义构件，保存最后一个节点，用来insertAfter节点
      if (!this.multUuid) {
        this.multBeforeUuid = godNodeList[godNodeList.length - 1].data.uuid;
      }

      // 处理合模添加构件后更新列表
      if (this.multUuid) {
        // 如果有了自定义构件列表
        let params = {
          appliId: this.appId,
          pageNo: 1,
          pageSize: 999,
          uuid: this.multUuid,
        };
        MODELAPI.LISTMEMBERTREE(params).then((res) => {
          this.$refs.setTree.updateKeyChildren(this.multUuid, res.data.data);
        });
      } else {
        // 合模如果没有自定义构件列表
        // 请求根节点
        // insertAfter自定义构件列表
        let params = {
          appliId: this.appId,
          pageNo: 1,
          pageSize: 999,
        };
        MODELAPI.LISTMEMBERTREE(params).then((res) => {
          const list = res.data.data;
          this.$refs.setTree.insertAfter(
            list[list.length - 1],
            this.multBeforeUuid
          );
        });
      }
    },
    initWebSocket() {
      //初始化weosocket
      /**
       * @Author: zk
       * @Date: 2021-02-24 13:42:13
       * @description: 初始化socket通信
       * 1 单击构件
       * 2.场景部分加载
       * 3 返回关注视角
       * 4 返回主视图信息
       * 5 多选构件
       * 6 启动事件
       * 7 点击空白
       * 8 初始化成功 加载进度
       */
      const wsuri = MODELAPI.CREATESOCKET(this.taskId);
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = (e) => {
        if (e.data.length > 20) {
          console.log(222, JSON.parse(e.data));
          let realData = JSON.parse(e.data);
          this.socketData = realData;
          if (realData.id === "1") {
            this.memberInfo = {
              type: 1,
              data: realData.data,
            };
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20001,
              data: realData.data,
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "3") {
            if (this.$refs.getFooter) {
              this.$refs.getFooter.resetPointList(realData.object);
            }
          } else if (realData.id === "5") {
            this.memberInfo = {
              type: 5,
            };
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20002,
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "7") {
            this.memberInfo = null;
            this.activeLeaf = false;
            let messageInfo = {
              prex: "ourbimMessage",
              type: 20003,
              data: "",
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "8") {
            // 加载完成
            this.listenWindowSize();
            let messageInfo = {
              prex: "ourbimMessage",
              type: 10003,
              data: {
                progress: Number(realData.progress),
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            this.hiddenState = 0;
            const progress = Number(
              String(Number(realData.progress) * 100).substring(0, 3)
            );
            if (
              progress >= 0 &&
              progress <= 100 &&
              this.propsProgress.data < 100
            ) {
              this.propsProgress.data = progress;
              if (progress === 100) {
                // 定位主视图
                setTimeout(() => {
                  MODELAPI.UPDATEORDER({
                    taskid: this.taskId,
                    action: "cameraPosAll",
                  });
                }, 1000);
                let params = {
                  taskId: this.taskId,
                };
                COMPONENTLIBRARY.initComponent(params)
                  .then((res) => {
                    this.$message.success(res.data.message);
                  })
                  .catch((res) => {
                    this.$message.error(res.data.message);
                  });
              }
            }
            if (Number(realData.progress) === 1) {
              let noneTimer = setTimeout(() => {
                this.isProgress = false;
                clearTimeout(noneTimer);
              }, 1000);
            }
          } else if (realData.id === "9") {
            let messageInfo = {
              prex: "ourbimMessage",
              type: 30001,
              data: {
                state: true,
                tagId: realData.tagId,
                tagType: 0,
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "10") {
            // 构件新建完成事件
            // 构件添加完成

            // 更新自定义构件列表
            if (this.appType === "3") {
              // 合模
              this.handleMultModle();
            } else {
              this.updateGodChildNode();
            }
            if (this.controllerInfo.uiBar) {
              this.controllerInfo.tagUiBar = true;
              this.controllerInfo.tagViewCube = true;
            }
            // 判断原本标签有没有开启
            if (
              this.listenTodoInfo.type === 4 &&
              this.listenTodoInfo.state === 1
            ) {
              this.$refs.tagTree.closePart(true);
            }
            let messageInfo = {
              prex: "ourbimMessage",
              type: 30002,
              data: {
                tagId: realData.tagId,
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "11") {
            let messageInfo = {
              prex: "ourbimMessage",
              type: 30003,
              data: {
                tagId: realData.tagId,
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
          } else if (realData.id === "12") {
            if (
              Number(this.propsProgress.loadData) >= 0 &&
              Number(this.propsProgress.loadData) <= 100
            ) {
              this.propsProgress.loadData = Number(
                String(Number(realData.progress) * 100).substring(0, 3)
              );
            }
            let messageInfo = {
              prex: "ourbimMessage",
              type: 10002,
              data: {
                progress: Number(realData.progress),
              },
              message: "",
            };
            this.sentParentIframe(messageInfo);
            if (Number(realData.progress) === 1) {
              this.handleState = 13;
              this.updateOrder();
              if (this.uaInfo.match(/MicroMessenger/i) != "micromessenger") {
                this.delMaskTimer(500);
              } else {
                this.delMaskTimer(1000 * 5);
              }
            } // 13cube返回数据
          } else if (realData.id === "14") {
            // 添加构件，但是按了esc
            if (this.controllerInfo.uiBar) {
              this.controllerInfo.tagUiBar = true;
              this.controllerInfo.tagViewCube = true;
            }
          } else if (realData.id === "15") {
            this.$refs.getFooter.handleComOperateIcon(realData);
          } else if (realData.id === "16") {
            // 距离上一次操作时长
            this.exitMiniprogram(realData.lastOperationTime);
          }
        }
      };
      this.websock.onopen = (e) => {
        this.isSocket = true;
        this.socketTimer = setInterval(() => {
          this.websock.send("Bang");
        }, 1000 * 60);
      };
      this.websock.onerror = (e) => {};
    },
    exitMiniprogram(time) {
      // 微信小程序长时间未操作，返回项目列表页
      if (time > 1) {
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) {
            this.hiddenState = 1;
            this.destroyed();
            wx.miniProgram.redirectTo({ url: "/pages/home/home" });
          }
        });
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
    getModelUrl() {
      let appId = this.$route.query.appid;

      let params = {
        appliId: appId,
        token: this.appToken,
      };
      const { userType, nickName, code } = this.$route.query;
      if (userType) {
        this.userType=1
        params.userType = userType;
      }
      if (userType == 0) {
        this.runTimeCode=1
        this.isFade = false;
        // this.isProgress=false
        // this.controllerInfo.tagUiBar = false;
        // this.controllerInfo.tagViewCube = false;
      }
      if (nickName) {
        params.nickName = nickName;
      }
      if (code) {
        params.code = code;
      }
      MODELAPI.GETMODELINFO(params)
        .then((res) => {
          if (res.data.code === 0 && res.data.data) {
            this.webUrl = res.data.data.url;
            this.taskId = res.data.data.taskId;
            this.ourbimInfo = res.data.data;
            this.propsFooter.taskId = res.data.data.taskId;
            // 保存code
            if (res.data.data.code) {
              localStorage.setItem("shareCode", res.data.data.code || null);
            }

            let messageInfo = {
              prex: "ourbimMessage",
              type: 10001,
              data: {
                taskId: res.data.data.taskId,
              },
              message: "",
            };
            this.getComList();
            this.sentParentIframe(messageInfo);
            this.initWebSocket();
            if (res.data.data.appliType !== "1") {
              this.controllerInfo.uiBar = true;
              if (this.isUiBar) {
                this.controllerInfo.uiBar = true;
              } else {
                this.controllerInfo.uiBar = false;
                this.controllerInfo.viewCube = false;
                if (this.$refs.tagTree) {
                  this.$refs.tagTree.closePart(false);
                }
              }
            } else {
              this.controllerInfo.uiBar = false;
              this.controllerInfo.viewCube = false;
              if (this.$refs.tagTree) {
                this.$refs.tagTree.closePart(false);
              }
            }
          } else {
            this.$message({
              type: "warning",
              message: res.data.message,
              customClass: "set-index-message",
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: this.$t("webClient.loadBox.message[4]"),
            customClass: "set-index-message",
          });
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
      }, 1000 * 60 * 3);
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
    closeWebSocket() {
      // 清除定时器
      if (this.socketTimer) {
        clearInterval(this.socketTimer);
        this.socketTimer = null;
      }
      if (this.websock) {
        this.isSocket = false;
        this.websock.close(); //离开路由之后断开websocket连接
        this.websock = null;
        this.webUrl = null;
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
          // this.sendToIframe(
          //   10002,
          //   {
          //     button: "left",
          //     x: 500,
          //     y: 500,
          //   },
          //   ""
          // );
          // this.sendToIframe(
          //   10002,
          //   {
          //     button: "right",
          //     x: 500,
          //     y: 500,
          //   },
          //   ""
          // );
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
          if (this.isFollow || this.isTag || this.isQrCodeClick) {
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
          if (this.isFollow || this.isTag || this.isQrCodeClick) {
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
    sentParentIframe(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-27 11:42:25
       * @description:
       * 参考readme
       */
      window.parent.postMessage(e, "*");
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
    z-index: 300;
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
      width: 80px;
      height: 80px;
      margin-bottom: 30px;
    }
  }

  .phone-hidden-bim {
    .load-text {
      letter-spacing: 5rpx;
      font-size: 23px;
      display: flex;
      text-align: center;
      letter-spacing: 5rpx;
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
      .handle-part {
        padding: 1vh 15px 10px 15px;
      }
      .tree-part {
        height: calc(100% - 110px);
        overflow: hidden;
      }
      .tree-content {
        margin-top: 1vh;
        width: 99.5%;
        height: calc(100% - 1vh);
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
          width: calc(100% - 50px);
          .label-span {
            padding-left: 5px;
            width: calc(100% - 30px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .bim-info {
      pointer-events: auto;
      height: 50vh;
      min-width: 400px;
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
      .detail-collapse {
        padding: 0 10px;
        .el-collapse {
          border-bottom: none;
          border-top: none;
          /deep/ .el-collapse-item__header {
            background: none;
            color: #fff;
            border-bottom: none;
          }
          /deep/ .el-collapse-item__wrap {
            background: none;
            border-bottom: none;
          }
          .collapse-main {
            padding: 0 10px;
          }
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
    width: 100vw !important;
  }
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
  width: 260px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-progress {
    margin: 0 auto;
    width: 100%;
    .el-progress-bar__outer {
      // height: 6px!important;
      background-color: #00a8f054;
    }
    .el-progress-bar__inner {
      line-height: 0;
      background-color: #00aaf0;
    }
  }
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

.dasdasdsad {
  position: fixed;
  top: 0;
  left: 0;
}

.oooooooo {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.publicComListItem {
  // display: inline-block;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100px;
  height: 100px;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
  // background-color: pink;
  .img {
    // margin: 0 auto;
    height: 60px;
    width: 60px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .name {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
  }
}

.delect-com-icon {
  padding: 0 10px;
  width: 15px;
  height: 15px;
}
</style>