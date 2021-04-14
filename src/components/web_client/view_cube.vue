<!--
 * @Author: zk
 * @Date: 2021-03-08 09:27:06
 * @LastEditors: zk
 * @LastEditTime: 2021-04-14 10:29:24
 * @description: 
-->
<template>
  <div class="box-main">
    <div
      id="box"
      :class="isAnimation ? 'box-transition' : ''"
      :style="{
        transform: `perspective(800px) rotateX(${downInfo.x}deg) rotateY(${downInfo.y}deg) rotateZ(${downInfo.z}deg)`,
      }"
    >
      <div
        v-for="(item, index) in faceList"
        :key="index"
        @click="handleBody(item.value)"
        :class="[
          item.className,
          activeFace === item.value ? 'active-face' : '',
        ]"
      >
        <span v-text="item.label"></span>
        <div class="edge-0" @click.stop="handleEdge(index, 0)"></div>
        <div class="edge-1" @click.stop="handleEdge(index, 1)"></div>
        <div class="edge-2" @click.stop="handleEdge(index, 2)"></div>
        <div class="edge-3" @click.stop="handleEdge(index, 3)"></div>
        <div class="spot-0" @click.stop="handleSpot(index, 0)"></div>
        <div class="spot-1" @click.stop="handleSpot(index, 1)"></div>
        <div class="spot-2" @click.stop="handleSpot(index, 2)"></div>
        <div class="spot-3" @click.stop="handleSpot(index, 3)"></div>
      </div>
    </div>
    <img class="go-front" @click="goFront" src="../../assets/images/todo/home.png" mode=""></img>
      <div class="drop-down">
        <img class="handle-down" @click="changeView" src="../../assets/images/todo/drop_down.png" alt="">
        <transition name="el-zoom-in-top">
          <div class="cube-type" v-if="isCubeType">
            <div v-for="(item, index) in handleList" :key="index">
              <div :class="activeType === item.value ? 'active-type' : ''" v-text="item.label" class="select-type" @click="changeType(item)"></div>
            </div>
          </div>
        </transition>        
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      faceList: [
        {
          label: this.$t("webClient.cubeBox.direction[0]"),
          value: 0,
          className: "front",
        },
        {
          label: this.$t("webClient.cubeBox.direction[1]"),
          value: 1,
          className: "back",
        },
        {
          label: this.$t("webClient.cubeBox.direction[2]"),
          value: 2,
          className: "top",
        },
        {
          label: this.$t("webClient.cubeBox.direction[3]"),
          value: 3,
          className: "bottom",
        },
        {
          label: this.$t("webClient.cubeBox.direction[4]"),
          value: 4,
          className: "left",
        },
        {
          label: this.$t("webClient.cubeBox.direction[5]"),
          value: 5,
          className: "right",
        },
      ],
      activeFace: null,
      activeType: 1,
      downInfo: {
        x: -45,
        y: 45,
        z: 0,
      },
      disX: 90,
      disY: 0,
      isMonitor: false,
      isCubeType: false,
      isAnimation: true,
      handleList: [
        {
          label: this.$t("webClient.cubeBox.handle[0]"),
          value: 2,
        },
        {
          label: this.$t("webClient.cubeBox.handle[1]"),
          value: 1,
        },
        {
          label: this.$t("webClient.cubeBox.handle[2]"),
          value: 3,
        },
        {
          label: this.$t("webClient.cubeBox.handle[3]"),
          value: 0,
        },
      ],
      activeOrder: null,
    };
  },
  created() {
    if (this.$route.query.locale) {
      this.$i18n.locale = this.$route.query.locale;
    }else{
      this.$i18n.locale = "zh";
    }
    if (this.$i18n.locale) {
      this.faceList[0].label = this.$t("webClient.cubeBox.direction[0]");
      this.faceList[1].label = this.$t("webClient.cubeBox.direction[1]");
      this.faceList[2].label = this.$t("webClient.cubeBox.direction[2]");
      this.faceList[3].label = this.$t("webClient.cubeBox.direction[3]");
      this.faceList[4].label = this.$t("webClient.cubeBox.direction[4]");
      this.faceList[5].label = this.$t("webClient.cubeBox.direction[5]");
      this.handleList[0].label = this.$t("webClient.cubeBox.handle[0]");
      this.handleList[1].label = this.$t("webClient.cubeBox.handle[1]");
      this.handleList[2].label = this.$t("webClient.cubeBox.handle[2]");
      this.handleList[3].label = this.$t("webClient.cubeBox.handle[3]");
    }
  },
  methods: {
    handleEdge(node, e) {
      /**
       * @Author: zk
       * @Date: 2021-03-30 16:54:49
       * @description: 边 点 node 0 前 1 后 2 上 3 下 4 左 5 右
       * e 0 上 1 右 2 下 3 左
       */
      // console.log("old x:", JSON.parse(JSON.stringify(this.downInfo)).x, "y:", JSON.parse(JSON.stringify(this.downInfo)).y, "z:", JSON.parse(JSON.stringify(this.downInfo)).z);
      // let oldDownInfo = JSON.parse(JSON.stringify(this.downInfo))
      if (!this.isAnimation) {
        return
      }
      switch (node) {
        case 0:
          // 前
          if (e === 0) {
            // 上
            this.downInfo = {
              x: -45,
              y: 0,
              z: 0,
            };
            this.activeOrder = 9;
          } else if (e === 1) {
            // 右
            this.downInfo = {
              x: 0,
              y: -45,
              z: 0,
            };
            this.activeOrder = 8;
          } else if (e === 2) {
            // 下
            this.downInfo = {
              x: 45,
              y: 0,
              z: 0,
            };
            this.activeOrder = 10;
          } else if (e === 3) {
            // 左
            this.downInfo = {
              x: 0,
              y: 45,
              z: 0,
            };
            this.activeOrder = 7;
          }
          break;
        case 1:
          // 后
          if (e === 0) {
            // 上
            this.downInfo = {
              x: -45,
              y: -180,
              z: 0,
            };
            this.activeOrder = 13;
          } else if (e === 1) {
            // 右
            this.downInfo = {
              x: 0,
              y: -225,
              z: 0,
            };
            this.activeOrder = 11;
          } else if (e === 2) {
            // 下
            this.downInfo = {
              x: 45,
              y: -180,
              z: 0,
            };
            this.activeOrder = 14;
          } else if (e === 3) {
            // 左
            this.downInfo = {
              x: 0,
              y: -135,
              z: 0,
            };
            this.activeOrder = 12;
          }
          break;
        case 2:
          // 上
          if (e === 0) {
            // 上
            this.downInfo = {
              x: -135,
              y: 0,
              z: 0,
            };
            this.activeOrder = 13;
          } else if (e === 1) {
            // 右
            this.downInfo = {
              x: -90,
              y: 0,
              z: -45,
            };
            this.activeOrder = 17;
          } else if (e === 2) {
            // 下
            this.downInfo = {
              x: -45,
              y: 0,
              z: 0,
            };
            this.activeOrder = 9;
          } else if (e === 3) {
            // 左
            this.downInfo = {
              x: -90,
              y: 0,
              z: 45,
            };
            this.activeOrder = 15;
          }
          break;
        case 3:
          // 下
          if (e === 0) {
            // 上
            this.downInfo = {
              x: 45,
              y: 0,
              z: 0,
            };
            this.activeOrder = 10;
          } else if (e === 1) {
            // 右
            this.downInfo = {
              x: 90,
              y: 0,
              z: 45,
            };
            this.activeOrder = 18;
          } else if (e === 2) {
            // 下
            this.downInfo = {
              x: 135,
              y: 0,
              z: 0,
            };
            this.activeOrder = 14;
          } else if (e === 3) {
            // 左
            this.downInfo = {
              x: 90,
              y: 0,
              z: -45,
            };
            this.activeOrder = 16;
          }
          break;
        case 4:
          // 左
          if (e === 0) {
            // 上
            this.downInfo = {
              x: -45,
              y: 90,
              z: 0,
            };
            this.activeOrder = 15;
          } else if (e === 1) {
            // 右
            this.downInfo = {
              x: 0,
              y: 45,
              z: 0,
            };
            this.activeOrder = 7;
          } else if (e === 2) {
            // 下
            this.downInfo = {
              x: 45,
              y: 90,
              z: 0,
            };
            this.activeOrder = 16;
          } else if (e === 3) {
            // 左
            this.downInfo = {
              x: 0,
              y: 135,
              z: 0,
            };
            this.activeOrder = 11;
          }
          break;
        case 5:
          // 右
          if (e === 0) {
            // 上
            this.downInfo = {
              x: -45,
              y: -90,
              z: 0,
            };
            this.activeOrder = 17;
          } else if (e === 1) {
            // 右
            this.downInfo = {
              x: 0,
              y: -135,
              z: 0,
            };
            this.activeOrder = 12;
          } else if (e === 2) {
            // 下
            this.downInfo = {
              x: 45,
              y: -90,
              z: 0,
            };
            this.activeOrder = 18;
          } else if (e === 3) {
            // 左
            this.downInfo = {
              x: 0,
              y: -45,
              z: 0,
            };
            this.activeOrder = 8;
          }
          break;
        default:
          break;
      }
      this.resetAngle();
    },
    handleSpot(node, e) {
      /**
       * @Author: zk
       * @Date: 2021-03-30 16:55:11
       * @description: 点 node 0 前 1 后 2 上 3 下 4 左 5 右
       * e 0 左上 1 左下 2 右上 3 右下
       */
      // console.log("old x:", JSON.parse(JSON.stringify(this.downInfo)).x, "y:", JSON.parse(JSON.stringify(this.downInfo)).y, "z:", JSON.parse(JSON.stringify(this.downInfo)).z);
      if (!this.isAnimation) {
        return
      }
      switch (node) {
        case 0:
          // 前
          if (e === 0) {
            // 左上
            this.downInfo = {
              x: -45,
              y: 45,
              z: 0,
            };
            this.activeOrder = 23;
          } else if (e === 1) {
            // 左下
            this.downInfo = {
              x: 45,
              y: 45,
              z: 0,
            };
            this.activeOrder = 24;
          } else if (e === 2) {
            // 右上
            this.downInfo = {
              x: -45,
              y: -45,
              z: 0,
            };
            this.activeOrder = 19;
          } else if (e === 3) {
            // 右下
            this.downInfo = {
              x: 45,
              y: -45,
              z: 0,
            };
            this.activeOrder = 20;
          }
          break;
        case 1:
          // 后
          if (e === 0) {
            // 左上
            this.downInfo = {
              x: -45,
              y: -135,
              z: 0,
            };
            this.activeOrder = 21;
          } else if (e === 1) {
            // 左下
            this.downInfo = {
              x: 45,
              y: -135,
              z: 0,
            };
            this.activeOrder = 22;
          } else if (e === 2) {
            // 右上
            this.downInfo = {
              x: -45,
              y: -225,
              z: 0,
            };
            this.activeOrder = 25;
          } else if (e === 3) {
            // 右下
            this.downInfo = {
              x: 45,
              y: -225,
              z: 0,
            };
            this.activeOrder = 26;
          }
          break;
        case 2:
          // 上
          if (e === 0) {
            // 左上
            this.downInfo = {
              x: -135,
              y: -45,
              z: 0,
            };
            this.activeOrder = 25;
          } else if (e === 1) {
            // 左下
            this.downInfo = {
              x: -45,
              y: 0,
              z: 45,
            };
            this.activeOrder = 23;
          } else if (e === 2) {
            // 右上
            this.downInfo = {
              x: -135,
              y: 0,
              z: -45,
            };
            this.activeOrder = 21;
          } else if (e === 3) {
            // 右下
            this.downInfo = {
              x: -45,
              y: 0,
              z: -45,
            };
            this.activeOrder = 19;
          }
          break;
        case 3:
          // 下
          if (e === 0) {
            // 左上
            this.downInfo = {
              x: 45,
              y: 45,
              z: 0,
            };
            this.activeOrder = 24;
          } else if (e === 1) {
            // 左下
            this.downInfo = {
              x: 135,
              y: 0,
              z: -45,
            };
            this.activeOrder = 26;
          } else if (e === 2) {
            // 右上
            this.downInfo = {
              x: 45,
              y: 0,
              z: 45,
            };
            this.activeOrder = 20;
          } else if (e === 3) {
            // 右下
            this.downInfo = {
              x: 135,
              y: 0,
              z: 45,
            };
            this.activeOrder = 22;
          }
          break;
        case 4:
          // 左
          if (e === 0) {
            // 左上
            this.downInfo = {
              x: -45,
              y: 135,
              z: 0,
            };
            this.activeOrder = 25;
          } else if (e === 1) {
            // 左下
            this.downInfo = {
              x: 45,
              y: 135,
              z: 0,
            };
            this.activeOrder = 26;
          } else if (e === 2) {
            // 右上
            this.downInfo = {
              x: -45,
              y: 45,
              z: 0,
            };
            this.activeOrder = 23;
          } else if (e === 3) {
            // 右下
            this.downInfo = {
              x: 45,
              y: 45,
              z: 0,
            };
            this.activeOrder = 24;
          }
          break;
        case 5:
          // 右
          if (e === 0) {
            // 左上
            this.downInfo = {
              x: -45,
              y: -45,
              z: 0,
            };
            this.activeOrder = 19;
          } else if (e === 1) {
            // 左下
            this.downInfo = {
              x: 45,
              y: -45,
              z: 0,
            };
            this.activeOrder = 20;
          } else if (e === 2) {
            // 右上
            this.downInfo = {
              x: -45,
              y: -135,
              z: 0,
            };
            this.activeOrder = 21;
          } else if (e === 3) {
            // 右下
            this.downInfo = {
              x: 45,
              y: -135,
              z: 0,
            };
            this.activeOrder = 22;
          }
          break;
        default:
          break;
      }
      this.resetAngle();
    },
    handleBody(e) {
      /**
       * @Author: zk
       * @Date: 2020-09-21 09:44:35
       * @description: 旋转确认 前 0 后 1 上 2 下 3 左 4 右 5
       */
      if (!this.isAnimation) {
        return
      }
      // console.log("old x:", JSON.parse(JSON.stringify(this.downInfo)).x, "y:", JSON.parse(JSON.stringify(this.downInfo)).y, "z:", JSON.parse(JSON.stringify(this.downInfo)).z);
      const oldDownInfo = JSON.parse(JSON.stringify(this.downInfo));
      this.activeFace = e;
      switch (e) {
        case 0:
          this.downInfo = {
            x: 0,
            y: 0,
            z: 0,
          };
          this.activeOrder = 5;
          break;
        case 1:
          this.downInfo = {
            x: 0,
            y: oldDownInfo.y === 135 ? 180 : -180,
            z: 0,
          };
          this.activeOrder = 6;
          break;
        case 2:
          this.downInfo = {
            x: -90,
            y: 0,
            z: 0,
          };
          this.activeOrder = 1;
          break;
        case 3:
          this.downInfo = {
            x: 90,
            y: 0,
            z: 0,
          };
          this.activeOrder = 2;
          break;
        case 4:
          this.downInfo = {
            x: 0,
            y: 90,
            z: 0,
          };
          this.activeOrder = 3;
          break;
        case 5:
          this.downInfo = {
            x: 0,
            y: -90,
            z: 0,
          };
          this.activeOrder = 4;
          break;
        default:
          break;
      }
      this.resetAngle();
    },
    resetAngle() {
      /**
       * @Author: zk
       * @Date: 2021-04-01 17:56:46
       * @description: 重置角度
       */
      // console.log("x:", this.downInfo.x, "y:", this.downInfo.y, "z:", this.downInfo.z);
      this.$emit("handleOrder", this.activeOrder);
      if (
        this.downInfo.x > 180 ||
        this.downInfo.x < -180 ||
        this.downInfo.y >= 180 ||
        this.downInfo.y < -180 ||
        this.downInfo.z > 180 ||
        this.downInfo.z < -180
      ) {
        let realTimer = setTimeout(() => {
          this.isAnimation = false;
          this.downInfo.x > 180
            ? (this.downInfo.x = 360 - this.downInfo.x)
            : "";
          this.downInfo.x < -180
            ? (this.downInfo.x = 360 + this.downInfo.x)
            : "";
          this.downInfo.y >= 180 ? (this.downInfo.y = -180) : "";
          this.downInfo.y < -180
            ? (this.downInfo.y = 360 + this.downInfo.y)
            : "";
          this.downInfo.z > 180
            ? (this.downInfo.z = 360 - this.downInfo.z)
            : "";
          this.downInfo.z < -180
            ? (this.downInfo.z = 360 + this.downInfo.z)
            : "";
          clearTimeout(realTimer);
          let realAnimation = setTimeout(() => {
            this.isAnimation = true;
            clearTimeout(realAnimation);
          }, 100);
        }, 1010);
      }else{
        let realTimer = setTimeout(() => {
          this.isAnimation = false;
          clearTimeout(realTimer);
          let realAnimation = setTimeout(() => {
            this.isAnimation = true;
            clearTimeout(realAnimation);
          }, 10);
        }, 1001);
      }
    },
    changeType(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-12 11:16:33
       * @description: 切换状态
       */
      this.isCubeType = false;
      if (e.value === 0 || e.value === 3) {
        this.$emit("handleType", e.value);
        return;
      }
      this.activeType = e.value;
      this.$emit("handleType", e.value);
    },
    resetActive(e) {
      this.activeType = e;
    },
    goFront() {
      this.$emit("goFront");
    },
    changeView() {
      /**
       * @Author: zk
       * @Date: 2021-03-10 16:19:34
       * @description: 视图切换
       */
      this.isCubeType = !this.isCubeType;
    },
  },
};
</script>

<style lang="less" scoped>
.box-main {
  position: fixed;
  top: 26px;
  right: 80px;
  .go-front {
    width: 24px;
    height: 24px;
    position: absolute;
    top: -12px;
    left: -30px;
  }
  .drop-down {
    position: absolute;
    background: rgb(131, 236, 187);
    width: 100%;
    right: -65px;
    top: 52px;
    .handle-down {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 0;
    }
    .cube-type {
      position: absolute;
      top: 20px;
      right: 0;
      width: 160px;
      line-height: 200%;
      background: #f3f3f3;
      color: #a5a5a4;
      text-align: center;
      .select-type {
        cursor: pointer;
      }
      .active-type {
        color: #ff6600;
      }
    }
  }
}

#box {
  width: 68px;
  height: 68px;
  position: relative;
  top: 0px;
  left: 30%;
  transform-style: preserve-3d;
}
.box-transition {
  transition: all 1s;
}

#box div {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  background-size: cover;
  color: #a5a5a4;
}
.active-face {
  color: #ff6600 !important;
}
.front {
  transform: translateZ(34px);
  background: url("../../assets/images/todo/front.png");
}

.back {
  transform: translateZ(-34px) rotateY(180deg);
  background: url("../../assets/images/todo/front.png");
}

.left {
  transform: translateX(-34px) rotateY(270deg);
  background: url("../../assets/images/todo/front.png");
}

.right {
  transform: translateX(34px) rotateY(90deg);
  background: url("../../assets/images/todo/front.png");
}

.top {
  transform: translateY(-34px) rotateX(90deg);
  background: url("../../assets/images/todo/front.png");
}

.bottom {
  transform: translateY(34px) rotateX(-90deg) rotateY(0deg);
  background: url("../../assets/images/todo/front.png");
}
.edgeLine(@left, @top, @height, @width) {
  height: @height !important;
  width: @width !important;
  top: @top !important;
  left: @left !important;
  background-color: none;

  &:hover {
    background: #ff6600;
  }
}

.edge-0 {
  .edgeLine(0, 0px, 3px, 100%);
}

.edge-1 {
  .edgeLine(65px, 0, 100%, 3px);
}

.edge-2 {
  .edgeLine(0, 65px, 3px, 100%);
}

.edge-3 {
  .edgeLine(0, 0, 100%, 3px);
}
.spotAll(@left, @top) {
  width: 16px !important;
  height: 16px !important;
  transform: rotate(45deg);
  z-index: 2;
  left: @left !important;
  top: @top !important;

  &:hover {
    background-color: #ff6600;
  }
}

.spot-0 {
  .spotAll(-8px, -8px);
}

.spot-1 {
  .spotAll(-8px, 60px);
}

.spot-2 {
  .spotAll(60px, -8px);
}

.spot-3 {
  .spotAll(60px, 60px);
}
</style>