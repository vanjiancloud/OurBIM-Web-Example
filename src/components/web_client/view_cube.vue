<!--
 * @Author: zk
 * @Date: 2021-03-08 09:27:06
 * @LastEditors: zk
 * @LastEditTime: 2021-04-26 13:14:16
 * @description: 
-->
<template>
  <div :class="userType == 1 ? 'box-main userType' : 'box-main'">
    <div
      id="box"
      :class="isAnimation ? 'box-transition' : ''"
      :style="{
        transform: `perspective(800px) rotateX(${realDownInfo.x}deg) rotateY(${realDownInfo.y}deg) rotateZ(${realDownInfo.z}deg)`,
      }"
    >
      <div
        v-for="(item, index) in faceList"
        :key="index"
        @click.stop="handleBody(item.value)"
        :class="[
          item.className,
          activeFace === item.value ? 'active-face' : '',
          'face-' + index,
        ]"
      >
        <span v-text="item.label"></span>
        <!-- 边 -->
        <div
          class="edge-0"
          @click.stop="handleEdge(index, 0)"
          @mouseenter="setEdge(index, 0, true)"
          @mouseleave="setEdge(index, 0, false)"
        ></div>
        <div
          class="edge-1"
          @click.stop="handleEdge(index, 1)"
          @mouseenter="setEdge(index, 1, true)"
          @mouseleave="setEdge(index, 1, false)"
        ></div>
        <div
          class="edge-2"
          @click.stop="handleEdge(index, 2)"
          @mouseenter="setEdge(index, 2, true)"
          @mouseleave="setEdge(index, 2, false)"
        ></div>
        <div
          class="edge-3"
          @click.stop="handleEdge(index, 3)"
          @mouseenter="setEdge(index, 3, true)"
          @mouseleave="setEdge(index, 3, false)"
        ></div>
        <!-- 点 -->
        <div
          class="spot-0"
          @click.stop="handleSpot(index, 0)"
          @mouseenter="setSpot(index, 0, true)"
          @mouseleave="setSpot(index, 0, false)"
        ></div>
        <div
          class="spot-1"
          @click.stop="handleSpot(index, 1)"
          @mouseenter="setSpot(index, 1, true)"
          @mouseleave="setSpot(index, 1, false)"
        ></div>
        <div
          class="spot-2"
          @click.stop="handleSpot(index, 2)"
          @mouseenter="setSpot(index, 2, true)"
          @mouseleave="setSpot(index, 2, false)"
        ></div>
        <div
          class="spot-3"
          @click.stop="handleSpot(index, 3)"
          @mouseenter="setSpot(index, 3, true)"
          @mouseleave="setSpot(index, 3, false)"
        ></div>
      </div>
    </div>
    <img
      class="go-front"
      @click.stop="goFront"
      src="@/assets/images/todo/home.png"
      mode=""
    />
    <div class="drop-down">
      <img
        class="handle-down"
        @click.stop="changeView"
        src="@/assets/images/todo/drop_down.png"
        alt=""
      />
      <transition name="el-zoom-in-top">
        <div class="cube-type" v-if="isCubeType">
          <div v-for="(item, index) in handleList" :key="index">
            <div
              :class="activeType === item.value ? 'active-type' : ''"
              v-text="item.label"
              class="select-type"
              @click.stop="changeType(item)"
            ></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { doAction } from "@/api/userCenter/index";
export default {
  props: {
    userType: {},
    taskId: {
        type: String,
        default: ''
    },
  },
  data() {
    return {
      faceList: [
        {
          label: "前",
          value: 0,
          className: "front",
        },
        {
          label: "后",
          value: 1,
          className: "back",
        },
        {
          label: "上",
          value: 2,
          className: "top",
        },
        {
          label: "下",
          value: 3,
          className: "bottom",
        },
        {
          label: "左",
          value: 4,
          className: "left",
        },
        {
          label: "右",
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
      realDownInfo: {
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
          label: "正交投影",
          value: 2,
        },
        {
          label: "透视投影",
          value: 1,
        },
        {
          label: "自定义主视图",
          value: 3,
        },
        {
          label: "重置主视图",
          value: 0,
        },
      ],
      activeOrder: 6,
    };
  },
  created() {},
  mounted() {
    window.addEventListener("click", this.clickOther);
  },
  beforeDestroy() {
    // 实例销毁之前对点击事件进行解绑
    window.removeEventListener("click", this.clickOther);
  },
  methods: {
    clickOther() {
      /**
       * @Author: zk
       * @Date: 2021-03-17 09:51:33
       * @description: 关闭tool
       */
      this.closeView();
    },
    setActiveEdge(node, e, isActive, isArea) {
      /**
       * @Author: zk
       * @Date: 2021-04-14 13:50:23
       * @description: 设置选中边
       */
      if (isActive) {
        let faceNode = document.querySelectorAll(".face-" + node)[0];
        let edgeNode = faceNode.querySelectorAll("." + isArea + "-" + e)[0];
        edgeNode.classList.add("active-bgi");
      } else {
        let faceNode = document.querySelectorAll(".face-" + node)[0];
        let edgeNode = faceNode.querySelectorAll("." + isArea + "-" + e)[0];
        edgeNode.classList.remove("active-bgi");
      }
    },
    setEdge(node, e, isShow) {
      /**
       * @Author: zk
       * @Date: 2021-04-14 13:28:00
       * @description: 边 鼠标移入移出
       */
      // 上
      if ((node === 0 && e === 0) || (node === 2 && e === 2)) {
        this.setActiveEdge(0, 0, isShow, "edge");
        this.setActiveEdge(2, 2, isShow, "edge");
      }
      if ((node === 2 && e === 3) || (node === 4 && e === 0)) {
        this.setActiveEdge(2, 3, isShow, "edge");
        this.setActiveEdge(4, 0, isShow, "edge");
      }
      if ((node === 1 && e === 0) || (node === 2 && e === 0)) {
        this.setActiveEdge(1, 0, isShow, "edge");
        this.setActiveEdge(2, 0, isShow, "edge");
      }
      if ((node === 2 && e === 1) || (node === 5 && e === 0)) {
        this.setActiveEdge(2, 1, isShow, "edge");
        this.setActiveEdge(5, 0, isShow, "edge");
      }
      // 中
      if ((node === 5 && e === 3) || (node === 0 && e === 1)) {
        this.setActiveEdge(5, 3, isShow, "edge");
        this.setActiveEdge(0, 1, isShow, "edge");
      }
      if ((node === 0 && e === 3) || (node === 4 && e === 1)) {
        this.setActiveEdge(0, 3, isShow, "edge");
        this.setActiveEdge(4, 1, isShow, "edge");
      }
      if ((node === 4 && e === 3) || (node === 1 && e === 1)) {
        this.setActiveEdge(4, 3, isShow, "edge");
        this.setActiveEdge(1, 1, isShow, "edge");
      }
      if ((node === 1 && e === 3) || (node === 5 && e === 1)) {
        this.setActiveEdge(1, 3, isShow, "edge");
        this.setActiveEdge(5, 1, isShow, "edge");
      }
      // 下
      if ((node === 3 && e === 0) || (node === 0 && e === 2)) {
        this.setActiveEdge(3, 0, isShow, "edge");
        this.setActiveEdge(0, 2, isShow, "edge");
      }
      if ((node === 3 && e === 3) || (node === 4 && e === 2)) {
        this.setActiveEdge(3, 3, isShow, "edge");
        this.setActiveEdge(4, 2, isShow, "edge");
      }
      if ((node === 3 && e === 2) || (node === 1 && e === 2)) {
        this.setActiveEdge(3, 2, isShow, "edge");
        this.setActiveEdge(1, 2, isShow, "edge");
      }
      if ((node === 3 && e === 1) || (node === 5 && e === 2)) {
        this.setActiveEdge(3, 1, isShow, "edge");
        this.setActiveEdge(5, 2, isShow, "edge");
      }
    },
    setSpot(node, e, isShow) {
      /**
       * @Author: zk
       * @Date: 2021-04-14 10:42:30
       * @description: 点 鼠标移入
       */
      // 上
      if (
        (node === 0 && e === 0) ||
        (node === 2 && e === 1) ||
        (node === 4 && e === 2)
      ) {
        this.setActiveEdge(0, 0, isShow, "spot");
        this.setActiveEdge(2, 1, isShow, "spot");
        this.setActiveEdge(4, 2, isShow, "spot");
      }
      if (
        (node === 4 && e === 0) ||
        (node === 1 && e === 2) ||
        (node === 2 && e === 0)
      ) {
        this.setActiveEdge(2, 0, isShow, "spot");
        this.setActiveEdge(1, 2, isShow, "spot");
        this.setActiveEdge(4, 0, isShow, "spot");
      }
      if (
        (node === 1 && e === 0) ||
        (node === 5 && e === 2) ||
        (node === 2 && e === 2)
      ) {
        this.setActiveEdge(1, 0, isShow, "spot");
        this.setActiveEdge(5, 2, isShow, "spot");
        this.setActiveEdge(2, 2, isShow, "spot");
      }
      if (
        (node === 5 && e === 0) ||
        (node === 0 && e === 2) ||
        (node === 2 && e === 3)
      ) {
        this.setActiveEdge(5, 0, isShow, "spot");
        this.setActiveEdge(0, 2, isShow, "spot");
        this.setActiveEdge(2, 3, isShow, "spot");
      }
      // 下
      if (
        (node === 3 && e === 0) ||
        (node === 4 && e === 3) ||
        (node === 0 && e === 1)
      ) {
        this.setActiveEdge(3, 0, isShow, "spot");
        this.setActiveEdge(4, 3, isShow, "spot");
        this.setActiveEdge(0, 1, isShow, "spot");
      }
      if (
        (node === 1 && e === 3) ||
        (node === 4 && e === 1) ||
        (node === 3 && e === 1)
      ) {
        this.setActiveEdge(1, 3, isShow, "spot");
        this.setActiveEdge(3, 1, isShow, "spot");
        this.setActiveEdge(4, 1, isShow, "spot");
      }
      if (
        (node === 1 && e === 1) ||
        (node === 5 && e === 3) ||
        (node === 3 && e === 3)
      ) {
        this.setActiveEdge(1, 1, isShow, "spot");
        this.setActiveEdge(5, 3, isShow, "spot");
        this.setActiveEdge(3, 3, isShow, "spot");
      }
      if (
        (node === 5 && e === 1) ||
        (node === 3 && e === 2) ||
        (node === 0 && e === 3)
      ) {
        this.setActiveEdge(5, 1, isShow, "spot");
        this.setActiveEdge(3, 2, isShow, "spot");
        this.setActiveEdge(0, 3, isShow, "spot");
      }
    },
    handleEdge(node, e) {
      /**
       * @Author: zk
       * @Date: 2021-03-30 16:54:49
       * @description: 边 点 node 0 前 1 后 2 上 3 下 4 左 5 右
       * e 0 上 1 右 2 下 3 左
       */
      // let oldDownInfo = JSON.parse(JSON.stringify(this.downInfo))
      if (!this.isAnimation) {
        return;
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
              x: -45,
              y: -180,
              z: 0,
            };
            this.activeOrder = 13;       
          } else if (e === 1) {
            // 右
            this.downInfo = {
              x: -45,
              y: -90,
              z: 0,
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
              x: -45,
              y: 90,
              z: 0,
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
              x: 45,
              y: -90,
              z: 0,
            };
            this.activeOrder = 18;
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
              x: 45,
              y: 90,
              z: 0,
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
      if (!this.isAnimation) {
        return;
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
              y: 135,
              z: 0,
            };
            this.activeOrder = 25;
          } else if (e === 3) {
            // 右下
            this.downInfo = {
              x: 45,
              y: 135,
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
              x: -45,
              y: 135,
              z: 0,
            };
            this.activeOrder = 25;
          } else if (e === 1) {
            // 左下
            this.downInfo = {
              x: -45,
              y: 45,
              z: 0,
            };
            this.activeOrder = 23;
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
              x: -45,
              y: -45,
              z: 0,
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
              x: 45,
              y: 135,
              z: 0,
            };
            this.activeOrder = 26;
          } else if (e === 2) {
            // 右上
            this.downInfo = {
              x: 45,
              y: -45,
              z: 0,
            };
            this.activeOrder = 20;
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
        return;
      }
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
      this.closeView();
      if (this.realDownInfo.y < 0 && this.downInfo.y > 0) {
        if (this.realDownInfo.y === -45 && this.downInfo.y === 45) {
          let { x, y, z } = JSON.parse(JSON.stringify(this.downInfo));
          this.realDownInfo = {
            x: x,
            y: 45,
            z: z,
          };
        } else {
          let { x, y, z } = JSON.parse(JSON.stringify(this.downInfo));
          this.realDownInfo = {
            x: x,
            y: -360 + y,
            z: z,
          };
        }
      } else if (this.realDownInfo.y > 0 && this.downInfo.y < 0) {
        if (this.realDownInfo.y === 45 && this.downInfo.y === -45) {
          let { x, y, z } = JSON.parse(JSON.stringify(this.downInfo));
          this.realDownInfo = {
            x: x,
            y: -45,
            z: z,
          };
        } else {
          let { x, y, z } = JSON.parse(JSON.stringify(this.downInfo));
          this.realDownInfo = {
            x: x,
            y: 360 + y,
            z: z,
          };
        }
      } else if (this.realDownInfo.y === -315) {
        if (this.downInfo.y === 0) {
          let { x, y, z } = JSON.parse(JSON.stringify(this.downInfo));
          this.realDownInfo = {
            x: x,
            y: -360,
            z: z,
          };
        } else if (this.downInfo.y === -45) {
          let { x, y, z } = JSON.parse(JSON.stringify(this.downInfo));
          this.realDownInfo = {
            x: x,
            y: -405,
            z: z,
          };
        }
      } else if (this.realDownInfo.y === 315) {
        if (this.downInfo.y === 0) {
          let { x, y, z } = JSON.parse(JSON.stringify(this.downInfo));
          this.realDownInfo = {
            x: x,
            y: 360,
            z: z,
          };
        } else if (this.downInfo.y === 45) {
          let { x, y, z } = JSON.parse(JSON.stringify(this.downInfo));
          this.realDownInfo = {
            x: x,
            y: 405,
            z: z,
          };
        }
      } else {
        this.realDownInfo = JSON.parse(JSON.stringify(this.downInfo));
      }
      if (
        this.realDownInfo.y === 360 ||
        this.realDownInfo.y === -360 ||
        this.realDownInfo.y === 405 ||
        this.realDownInfo.y === -405
      ) {
        let realTimer = setTimeout(() => {
          this.isAnimation = false;
          if (this.realDownInfo.y === 360 || this.realDownInfo.y === -360) {
            this.realDownInfo.y = 0;
            this.downInfo.y = 0;
          } else if (this.realDownInfo.y === 405) {
            this.realDownInfo.y = 45;
            this.downInfo.y = 45;
          } else if (this.realDownInfo.y === -405) {
            this.realDownInfo.y = -45;
            this.downInfo.y = -45;
          }

          clearTimeout(realTimer);
          let realAnimation = setTimeout(() => {
            this.isAnimation = true;
            clearTimeout(realAnimation);
          }, 100);
        }, 1010);
      }
      this.updateOrder(2);
    },
    changeType(e) {
      /**
       * @Author: zk
       * @Date: 2021-03-12 11:16:33
       * @description: 切换状态
       */
      this.isCubeType = false;
      if (e.value === 0) {
        this.updateOrder(3)
        return;
      }
      if (e.value === 3) {
        this.updateOrder(1)
        return;
      }
      this.activeType = e.value;
        this.updateOrder(0)
    },
    resetActive(e) {
      this.activeType = e;
    },
    goFront() {
        // 定位主视图
        this.updateOrder(4)
    },
    changeView() {
      /**
       * @Author: zk
       * @Date: 2021-03-10 16:19:34
       * @description: 视图切换
       */
      this.isCubeType = !this.isCubeType;
    },
    closeView() {
      /**
       * @Author: zk
       * @Date: 2021-04-24 09:24:21
       * @description: 关闭视图
       */
      if (this.isCubeType) {
        this.isCubeType = false;
      }
    },
    updateOrder(type) {
        if (!this.taskId) {
            return this.$message.warning("场景未加载，请刷新");
        }
        switch (type) {
            case 0:
                // 模式切换
                let data = {
                    action: "switchViewMode",
                    projectionMode: this.activeType,
                    viewMode: 2
                }
                this.doAction(data)
                break;
            case 1:
                // 自定义主视图
                this.doAction({ action: "setGodPos" })
                break;
            case 2:
                // 六面体
                this.doAction({ action: "cameraPosSpecial", sjid: this.activeOrder })
                break;
            case 3:
                // 重置主视图
                this.doAction({ action: "clearGodCamerashot" })
                break;
            case 4:
                // 定位主视图
                this.doAction({ action: "cameraPosAll" })
                break;
            default:
                break;
        }
    },
    doAction(data){
        let params = {
            taskid: this.taskId,
            ...data
        };
        doAction(params).then((res) => {
            if (params.action === "cameraPosAll" && res?.data) {
                let realProject = res.data.projectionMode === "1" ? 1 : 2;
                this.resetActive(realProject);
            }
            this.$message.success("指令下发成功")
        })
    }
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
.userType {
  right: 300px;
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

#box div{
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
// 解决 #box div 加上 overflow: hidden;后  viewcube某些角度无法点击问题
#box>div{
  overflow: inherit;
}


.active-face {
  color: #ff6600 !important;
}
.front {
  transform: translateZ(34px);
  background: url("~@/assets/images/todo/front.png");
}

.back {
  transform: translateZ(-34px) rotateY(180deg);
  background: url("~@/assets/images/todo/front.png");
}

.left {
  transform: translateX(-34px) rotateY(270deg);
  background: url("~@/assets/images/todo/front.png");
}

.right {
  transform: translateX(34px) rotateY(90deg);
  background: url("~@/assets/images/todo/front.png");
}

.top {
  transform: translateY(-34px) rotateX(90deg);
  background: url("~@/assets/images/todo/front.png");
}

.bottom {
  transform: translateY(34px) rotateX(-90deg) rotateY(0deg);
  background: url("~@/assets/images/todo/front.png");
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
  // background-color: #ff6600;

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
.active-bgi {
  background-color: #ff6600;
}
</style>