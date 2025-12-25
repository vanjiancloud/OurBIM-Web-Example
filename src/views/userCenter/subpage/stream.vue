<template>
  <div class="stream">
    <iframe class="iframe" allowfullscreen="true" v-if="iframeUrl" :src="iframeUrl" frameborder="0"
      @mouseover="setFocus()" @mouseout="leaveFocus()"></iframe>
    <!-- 遮罩层 -->
    <div class="hidden-bim" v-if="mask">
      <div class="hidden-bim" :style="{ background: `#000000 url(${logoImg.startUpBkgImg}) no-repeat center` }">
        <img v-if="logoImg.startUpLogo" :src="logoImg.startUpLogo" class="show-loading" alt="" />
        <div class="hidden-text">{{ baseExceptMessge }}</div>
      </div>

      <div class="proccessText" v-if="loadingProccessArr.length && baseExceptMessge === exceptionMessge[0]">
        {{ loadingProccessArr[loadingProccess].text }} ({{ loadingProccess + 1 }}/{{ loadingProccessArr.length || 5 }})
      </div>
    </div>
  </div>
</template>

<script>
import { getLogo } from '@/api/server/parameter'
import { getProccess, preloadStart, doRequestOurBimStream } from "@/api/userCenter/index";
import { encrypt, decrypt } from '@/utils/jsencrypt.js'

require('@/utils/mqttws31.min.js')
export default {
  components: {},
  props: {},
  data() {
    return {
      iframeUrl: '',
      mask: true,
      logoImg: {
        startUpLogo: '',
        startUpBkgImg: ''
      },
      // 加载流程
      loadingProccess: 0,
      loadingProccessArr: [{
        status: "success",
        text: "准备统一权限认证"
      }],
      //   异常提示
      exceptionMessge: [
        "环境加载中…",
        "长时间未交互，已自动断开，刷新即可重连",
        "模型长时间未操作，已自动退出"
      ],
      baseExceptMessge: "环境加载中…",
      preType: false,//是否是预启动
      taskId: '',
      quitEvent: false,//防止请求多次
      islandscape: false,
      showLogoControls: false,
    }
  },
  watch: {},
  computed: {},
  created() {
    this.taskId = this.$route.query.taskId;
    this.islandscape = this.$route.query.islandscape === 'true' || this.$route.query.islandscape === true;
    this.showLogoControls = this.$route.query.showLogoControls === 'true' || this.$route.query.showLogoControls === true;
    this.getLogo("startUpLogo");
    this.getLogo("startUpBkgImg");
    this.unLoad();
    this.initMqtt();
    this.addMessageEvent();
  },
  mounted() { },
  beforeDestroy() {
    this.removeEventListeners();
  },
  destroyed() {
    this.sendMqtt();
  },
  deactivated() {
    this.sendMqtt();
    this.removeEventListeners();
  },
  methods: {
    setFocus() {
      document.querySelector('.iframe').contentWindow.focus()
    },
    leaveFocus() {
      document.querySelector('.iframe').contentWindow.blur()
    },
    // 是否移动端
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
    // 是否手机端(排除平板)
    isPhone() {
      const userAgent = navigator.userAgent;
      // 明确排除iPad
      if (/iPad/i.test(userAgent)) return false;
      // iPhone直接返回true
      if (/iPhone/i.test(userAgent)) return true;
      // Android设备：必须有Mobile标识且排除常见平板型号
      if (/Android/i.test(userAgent)) {
        // 排除常见平板型号
        const tabletModels = /(MI PAD|MediaPad|HUAWEI.*MediaPad|Lenovo.*Tab|SM-T|Nexus 7|Nexus 9|Nexus 10)/i;
        if (tabletModels.test(userAgent)) return false;
        // 必须有Mobile标识
        return /Mobile/i.test(userAgent);
      }
      // 其他手机设备
      const phoneRegex = /(BlackBerry|IEMobile|Windows Phone|Symbian|webOS)/i;
      return phoneRegex.test(userAgent);
    },
    // 获取中logo
    getLogo(type) {
      let url = `${this.$config.VUE_APP_REQUEST_URL}/cloudServiceImg/downloadImg?userId=${this.$route.query.userId}&type=${type}&time=${new Date().getTime()}`
      let data = {
        userId: this.$route.query.userId,
        type
      }
      let imgs = {
        startUpLogo: require('@/assets/images/logo/logo.png'),
        startUpBkgImg: require('@/assets/images/logo/loading.png')
      }
      getLogo(data).then(res => {
        if (res.message === "用户已上传图片") {
          this.$set(this.logoImg, type, url)
        } else {
          this.$set(this.logoImg, type, imgs[type])
        }
      }).catch(() => {
        this.$set(this.logoImg, type, imgs[type])
      })
    },
    // 获取流程文字
    getProccess() {
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      let count = 0;//计算请求次数
      const getResponse = () => {
        if (this.baseExceptMessge !== this.exceptionMessge[0]) return
        getProccess({ taskId: this.taskId }).then(async res => {
          this.loadingProccessArr = res.data
          for (let i = 0; i < res.data.length; i++) {
            if (!this.mask || this.loadingProccessArr[this.loadingProccessArr.length - 1].status === 'success' || count > 30) return
            const element = res.data[i];
            if (element.status === "waiting") {
              this.loadingProccess = i
              count++
              setTimeout(getResponse(), 1200)
              return
            } else if (element.status === "success" && (count === 0 || (this.loadingProccess < i))) {
              this.loadingProccess = i
            }
            await sleep(200);
          }
        })
      }
      getResponse()
    },
    handleWindowSize() {
      const scale = window.devicePixelRatio; // 获取缩放比例
      const viewWidth = window.innerWidth; //获取可视区域宽度
      const viewHeight = window.innerHeight; //获取可视区域高度
      // console.log('viewWidth', viewWidth, 'viewHeight', viewHeight)
      let height = "";
      let width = "";

      // 判断是否为移动端
      const isMobile = this.isMobile();
      const isPhone = this.isPhone();
      // if (viewWidth > viewHeight) {
      //   // 宽大于高 横屏
      //   height = document.body.clientHeight;
      //   width = document.body.clientWidth;
      // } else {
      //   height = document.body.clientWidth;
      //   width = document.body.clientHeight;
      // }
      // return { width, height }

      if (isMobile) {
        // 移动端逻辑
        if (this.islandscape) {
          // islandscape=true 使用横屏宽高比 无论竖着还是横着都是横屏的宽高比 而且显示操作栏
          if (viewWidth > viewHeight) {
            // 已经是横屏，直接使用
            height = document.body.clientHeight;
            width = document.body.clientWidth;
          } else {
            // 竖屏设备，交换宽高以获取横屏比例
            height = document.body.clientWidth;
            width = document.body.clientHeight;
          }
        } else {
          // islandscape=false 自适应宽高比 当前横屏打开就是横屏宽高比 竖屏打开就是竖屏宽高比 忽略后续手机旋转的动作
          if (viewWidth < viewHeight) {
            height = document.body.clientHeight;
            width = document.body.clientWidth;
          } else {
            height = document.body.clientHeight;
            width = document.body.clientWidth;
          }
        }
      } else {
        // 非移动端，保持原有逻辑
        if (viewWidth > viewHeight) {
          height = document.body.clientHeight;
          width = document.body.clientWidth;
        } else {
          height = document.body.clientWidth;
          width = document.body.clientHeight;
        }
      }
      // 手机端单独计算倍率 解决分辨率模糊问题
      if (isPhone) {
        const maxValue = Math.max(width, height);
        if (maxValue < 2400) {
          const scaleRatio = 2400 / maxValue;
          width = Math.round(width * scaleRatio);
          height = Math.round(height * scaleRatio);
        }
      }
      console.log('islandscape', this.islandscape, { width, height })
      return { width, height };
    },
    // 获取流
    getUrl() {
      let size = this.handleWindowSize()
      let data = {
        appliId: this.$route.query.appid,
        token: this.$route.query.token,
        resX: size.width || 1920,
        resY: size.height || 1080,
        taskId: this.taskId
      }
      doRequestOurBimStream(data).then(res => {
        console.info(`%cTaskId:${this.taskId}`, "font-size:18px;background:#67c23a;color:#ffffff")
        console.info(`%cIP:${new URLSearchParams(res.data.url).get('renderServerIp')}`, "font-size:18px;background:#67c23a;color:#ffffff")
        // islandscape-移动端是否横屏模式 
        // showLogoControls-是否显示logo和控制条
        this.iframeUrl = `${res.data.url}&webUrl=${this.$config.VUE_APP_REQUEST_URL}&islandscape=${this.islandscape}&showLogoControls=${this.showLogoControls}`
        this.preType = res.data.preType === '1' ? true : false
        if (this.preType) {
          preloadStart({ taskId: this.taskId })
        }
        this.getMonitor();
        this.client.subscribe(`task/${this.taskId}/#`);
        this.client.subscribe(`preloadEnd/${this.taskId}`);
      }).catch((e) => {
        if (e?.message) {
          this.baseExceptMessge = e.message
          this.sentToParentIframe(this.baseExceptMessge, 'error')
        }
      })
    },
    /*
    注释中所提到的后台即为发布端/订阅端
    */
    initMqtt() {
      const url = new URL(this.$config.VUE_APP_REQUEST_URL);
      var hostname = url.hostname,
        port = this.$config.mqttPort,
        clientId = `mqtt_${Math.random().toString(16).slice(3)}`,
        timeout = 4000,
        keepAlive = 100,
        cleanSession = false,
        ssl = url.protocol === 'https:';
      this.client = new Paho.MQTT.Client(hostname, port, clientId);
      var options = {
        invocationContext: {
          host: hostname,
          port: port,
          path: this.client.path,
          clientId: clientId
        },
        timeout: timeout,
        keepAliveInterval: keepAlive,
        cleanSession: cleanSession,
        useSSL: ssl,
        // rejectUnauthorized: process.env.NODE_ENV === 'production', // 忽略证书验证（危险！仅开发使用）
        // userName: "vanjian",
        // password: "vanjian666",
        userName: decrypt(this.$config.mqttUserName),
        password: decrypt(this.$config.mqttPassword),
        onSuccess: (e) => {
          this.client.subscribe(`terminal/${this.$route.query.token}`);
          this.$nextTick(() => {
            this.getUrl();
          })
        },
        onFailure: (e) => {
          console.log("onFailure", e);
        }
      };
      this.client.connect(options);

      // 注册消息接收处理事件
      this.client.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
          console.log("连接已断开");
        }
      };
      //注册连接断开处理事件  
      this.client.onMessageArrived = (message) => {
        switch (message.destinationName) {
          case `terminal/${this.$route.query.token}`:
            let res = JSON.parse(message.payloadString)
            if (res.taskId) {
              this.taskId = res.taskId
              this.getProccess()
            }
            break;
          case `preloadEnd/${this.taskId}`:
            // 关闭视频流
            this.sendToIframe(10400, true);
            break;

          default:
            break;
        }
      };
    },
    // 发送关闭进程消息到mqtt
    sendMqtt() {
      if (!this.taskId) return
      if (this.preType) {
        // 预启动关闭
        this.closePre()
        return
      }
      this.closeProgress()
      let mess = `task/${this.taskId}/js/close`
      var message = new Paho.MQTT.Message(JSON.stringify({ timestamp: new Date().getTime() }));
      message.destinationName = mess;
      message.qos = 0;
      this.client.send(message);
    },
    // 关闭预启动
    closePre() {
      fetch(`${this.$config.VUE_APP_REQUEST_URL}/cloudServicePreStart/preloadClose?taskId=${this.taskId}`, {
        method: 'POST',
        keepalive: true
      });
    },
    // 关闭普通模型
    closeProgress() {
      fetch(`${this.$config.VUE_APP_REQUEST_URL}/cloudServiceProcess/endProgressBrow?taskId=${this.taskId}`, {
        method: 'POST',
        keepalive: true
      });
    },
    // 监听刷新浏览器
    unLoad() {
      // window.addEventListener('error', (e) => {
      //   this.sendMqtt()
      // });
      // window.addEventListener('beforeunload', (event) => {
      //   this.sendMqtt()
      // });
      // window.addEventListener('unload', (event) => {
      //   this.sendMqtt()
      // });
      // if (this.isMobile()) {
      //   window.addEventListener('pagehide', () => {
      //     this.sendMqtt()
      //   });
      // }
      window.addEventListener('error', this.handleError);
      window.addEventListener('beforeunload', this.handleBeforeUnload);
      window.addEventListener('unload', this.handleUnload);  // 修正为addEventListener
      // 移动端额外添加
      if (this.isMobile()) {
        window.addEventListener('pagehide', this.handlePageHide);
      }
    },
    // 定义各个事件处理函数
    handleError() {
      this.sendMqtt();
    },

    handleBeforeUnload(event) {
      this.sendMqtt();
    },

    handleUnload() {
      this.sendMqtt();
    },

    handlePageHide() {
      this.sendMqtt();
    },
    // 添加移除监听器的方法
    removeEventListeners() {
      window.removeEventListener('error', this.handleError);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      window.removeEventListener('unload', this.handleUnload);
      if (this.isMobile()) {
        window.removeEventListener('pagehide', this.handlePageHide);
      }
      // 添加键盘事件监听器的移除逻辑
      document.removeEventListener("keydown", this.handleKeyDown, true);
      document.removeEventListener("keyup", this.handleKeyUp, true);
    },
    handleKeyDown(e) {
      if ([37, 38, 39, 40, 229].includes(e.keyCode)) return
      this.sendToIframe(10010, {
        key: e.code,
        keyCode: e.keyCode,
        repeat: e.repeat,
      });
    },
    handleKeyUp(e) {
      if ([37, 38, 39, 40, 229].includes(e.keyCode)) return
      this.sendToIframe(10011, {
        key: e.code,
        keyCode: e.keyCode,
        repeat: e.repeat,
      });
    },
    getMonitor() {
      // document.addEventListener("keydown", (e) => {
      //   // [37, 38, 39, 40, 229]分别是上下左右箭头和回车
      //   if ([37, 38, 39, 40, 229].includes(e.keyCode)) return
      //   // 按键1--49keyCode会控制controls的显隐
      //   this.sendToIframe(10010,
      //     {
      //       key: e.code,
      //       keyCode: e.keyCode,
      //       repeat: e.repeat,
      //     }
      //   );
      // }, true);
      // document.addEventListener("keyup", (e) => {
      //   if ([37, 38, 39, 40, 229].includes(e.keyCode)) return
      //   this.sendToIframe(10011,
      //     {
      //       key: e.code,
      //       keyCode: e.keyCode,
      //       repeat: e.repeat,
      //     }
      //   );
      // }, true);
      document.addEventListener("keydown", this.handleKeyDown, true);
      document.addEventListener("keyup", this.handleKeyUp, true);
    },
    // 向子页面发送消息
    sendToIframe(type, data, message) {
      let realIframe = document.querySelector('.iframe');
      if (realIframe) {
        let param = {
          prex: "pxymessage", // 约定的消息头部
          type, // 消息类型
          data, // 具体数据
          message, // 附加信息
        }
        realIframe.contentWindow.postMessage(param, "*");
      }
    },
    // 向父页面发送消息
    sentToParentIframe(message, type, data = {}) {
      let parentMessage = {
        prex: "ourbimBaseMessage",
        type,
        data,
        message,
      };
      window.parent.postMessage(parentMessage, '*');
    },
    // 接收父页面发来的消息和子页面发来的消息
    addMessageEvent() {
      window.addEventListener("message", (e) => {
        let res = e.data
        if (res.prex === "ourbimBaseMessage") {
          console.info('🚀🚀🚀mask', res);
          if (res.type === 'error') {
            this.mask = true;
            this.baseExceptMessge = res.message
            this.sentToParentIframe(this.baseExceptMessge, res.type)
            if (!this.quitEvent && this.preType) {
              this.sendMqtt()
              this.quitEvent = true
            }
          }
          if (res.type === 200) {
            // 模型打开成功
            setTimeout(() => {
              this.mask = false;
            }, 800)
          }
        }
        if (res.prex === "pxymessage") {
          this.sendToIframe(res.type, res.data, res.message)
        }
      }, false);
    },
  }
}
</script>
<style lang="less" scoped>
@import './index.less';

.stream,
.iframe {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
