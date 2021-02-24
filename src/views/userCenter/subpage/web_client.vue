<template>
  <div class="bim-main">
   <iframe class="bim-web" :class="runTimeCode === 0 ? '' : 'phone-bim'" v-if="webUrl && hiddenState === 0"
           :src="webUrl" frameborder="0" id="show-bim"></iframe>
    <div class="time-log" v-if="moreCount < 10">
      <div class="log-main" :class="runTimeCode === 0 ? '' : 'phone-log-main'">
        <div>
          <img class="show-logo" src="@/assets/img/ourbim-logo.png" alt="">
        </div>
        <span v-text="moreCount"></span>
        秒后将超过免费体验时长，可刷新重新进入。
      </div>
    </div>
    <div class="hidden-bim" :class="runTimeCode === 0 ? '' : 'phone-hidden-bim'" v-if="isFade">
      <img src="@/assets/img/ourbim-logo.png" class="show-loading" alt="">
      <div class="hidden-text load-text" v-if="hiddenState === 0">
        Model loading
        <span v-if="runTimeCode === 0" class="loading"></span>
      </div>
      <div class="hidden-text learn-text" v-if="hiddenState === 1">
        超过免费体验时长，可刷新重新进入。
      </div>
      <div class="hidden-text learn-text" v-if="hiddenState === 2">
        模型长时间未响应，请刷新重试。
      </div>
    </div>
  </div>
</template>

<script>
import { getModelInfo } from '@/api/my.js'

export default {
  name: "look_app",
  layout: 'reset',
  data() {
    return {
      webUrl: null,
      isFade: true,
      viewHeight: 0,
      runTimeCode: 0,
      timerInfo: null,
      loadTimer: null,
      timerCount: 0,
      moreCount: 10,
      hiddenState: 0
    }
  },
  watch: {
    viewHeight(val, oldVal) { //普通的watch监听
      if (this.isFade) {
        this.$message({
          type: "success",
          message: "免费体验3分钟"
        })
      }
      this.isFade = false;
      this.setTimePass()
    },
  },
  mounted() {
    this.setTimeLoad()
    if (this.isMobile()) {
      this.runTimeCode = 1
    } else {
      this.runTimeCode = 0
    }
    this.getSceneUrl()

    window.addEventListener("message", (e) => {
      if (e.data.data && e.data.data.frameHeight > 0 && e.data.type !== 500) {
        this.viewHeight = e.data.data.frameHeight
      }
    }, false);
  },
  destroyed() {
    this.clearTimePass()
  },
  methods: {
    getSceneUrl() {
      let appId = this.$route.query.appid
      getModelInfo({
        appliId: appId
      })
        .then((res) => {
          if (res.data.code === 0 && res.data.data) {
            this.webUrl = res.data.data.url
            this.getMonitor();
            let timer = setTimeout(() => {
              window.clearTimeout(timer);
            }, 1000 * 10);
          }
        })
        .catch((err) => {
          this.$message.error("请求失败");
        });
    },
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    // 设置加载时间超时提醒
    setTimeLoad() {
      this.loadTimer = setTimeout(() => {
        if (this.isFade === true) {
          this.hiddenState = 2
        }
        clearTimeout(this.loadTimer)
      }, 1000 * 60)
    },
    // 清除定时器
    clearTimePass() {
      if (this.timerInfo) {
        clearInterval(this.timerInfo)
      }
      if (this.loadTimer) {
        clearTimeout(this.loadTimer)
      }
    },
    // 设置超时时间
    setTimePass() {
      this.clearTimePass()
      this.timerInfo = setInterval(() => {
        this.timerCount++
        if (this.timerCount >= 170) {
          this.moreCount = 180 - this.timerCount
        }
        if (this.moreCount === 0) {
          this.isFade = true
          this.hiddenState = 1
          this.clearTimePass()
        }
      }, 1000)
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
            10002, {
              button: "left",
              x: 500,
              y: 500,
            },
            ""
          );
        };
        // 关闭tool
        this.sendToIframe(10200, "false", "");

        window.clearTimeout(realTimer);
      }, 1000 * 2);
    },
    sendToIframe(type, data, message) {
      /**
       * @Author: zk
       * @Date: 2020-09-29 10:18:33
       * @description: postmessage通信
       */
      let realIframe = document.getElementById("show-bim").contentWindow;
      if (realIframe) {
        realIframe.postMessage({
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
  }
}
</script>

<style lang="less" scoped>
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
      color: #FFFFFF;

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
    z-index: 99;
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
      //left: 42vw;
      max-width: 350px;
      min-width: 260px;
      left: calc(50% - 140px);
      letter-spacing: 5px;
      font-size: 30px;
    }

    .learn-text {
      letter-spacing: 1px;
      font-size: 30px;
    }

    .hidden-text {
      margin-top: 130px;
      position: absolute;
      background-image: linear-gradient(to right, #B9FFFC, #A2D8F4, #9AB3F5, #7579E7, #9AB3F5, #A2D8F4, #B9FFFC);
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
      left: 0vw;
      width: 100%;
      text-align: center;
      letter-spacing: 5px;
      font-size: 1.2rem;
    }
  }

  #show-bim {
    height: 110vh;
    width: 100vw;
    overflow: hidden;
  }

  .phone-bim {
    height: 120vh !important;
    width: 900px !important;
  }
}
</style>
