<!--
 * @Author: zk
 * @Date: 2021-03-08 09:27:06
 * @LastEditors: zk
 * @LastEditTime: 2021-03-13 17:59:10
 * @description: 
-->
<template>
    <div class="box-main">
      <div id="box" :style="{transform:`perspective(800px) rotateX(${downInfo.x}deg) rotateY(${downInfo.y}deg) rotateZ(${downInfo.z}deg)`}">
        <div v-for="(item, index) in faceList" :key="index" @click="handleBody(item.value)" :class="[item.className, activeFace === item.value ? 'active-face' : '']" v-text="item.label"></div>
      </div>
      <img class="go-front" @click="goFront" src="../../assets/images/todo/home.png" mode=""></img>
      <div class="drop-down">
        <img class="handle-down" @click="changeView" src="../../assets/images/todo/drop_down.png" alt="">
        <transition name="el-zoom-in-top">
          <div class="cube-type" v-if="isCubeType">
            <div v-for="(item, index) in handleList" :key="index">
              <div v-text="item.label" class="select-type" @click="changeType(item)"></div>
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
          label: this.$t('webClient.cubeBox.direction[0]'),
          value: 0,
          className: 'front'
        },
        {
          label: this.$t('webClient.cubeBox.direction[1]'),
          value: 1,
          className: 'back'
        },
        {
          label: this.$t('webClient.cubeBox.direction[2]'),
          value: 2,
          className: 'top'
        },
        {
          label: this.$t('webClient.cubeBox.direction[3]'),
          value: 3,
          className: 'bottom'
        },
        {
          label: this.$t('webClient.cubeBox.direction[4]'),
          value: 4,
          className: 'left'
        },
        {
          label: this.$t('webClient.cubeBox.direction[5]'),
          value: 5,
          className: 'right'
        },
      ],
      activeFace: 0,
      downInfo: {
        x: -25,
        y: -25,
        z: 0,
      },
      disX: 90,
      disY: 0,
      isMonitor: false,
      isCubeType: false,
      handleList:[
        {
          label: this.$t('webClient.cubeBox.handle[0]'),
          value: 2
        },
        {
          label: this.$t('webClient.cubeBox.handle[1]'),
          value: 1
        },
        {
          label: this.$t('webClient.cubeBox.handle[2]'),
          value: 0
        }
      ]
    };
  },
  created() {
    this.$i18n.locale = this.$route.query.locale
    if (this.$i18n.locale) {
      this.faceList[0].label = this.$t('webClient.cubeBox.direction[0]')
      this.faceList[1].label = this.$t('webClient.cubeBox.direction[1]')
      this.faceList[2].label = this.$t('webClient.cubeBox.direction[2]')
      this.faceList[3].label = this.$t('webClient.cubeBox.direction[3]')
      this.faceList[4].label = this.$t('webClient.cubeBox.direction[4]')
      this.faceList[5].label = this.$t('webClient.cubeBox.direction[5]')
      this.handleList[0].label = this.$t('webClient.cubeBox.handle[0]')
      this.handleList[1].label = this.$t('webClient.cubeBox.handle[1]')
      this.handleList[2].label = this.$t('webClient.cubeBox.handle[2]')
    }  
  },
  methods: {
    changeType(e){
    /**
     * @Author: zk
     * @Date: 2021-03-12 11:16:33
     * @description: 切换状态
     */
      this.activeType = e.value
      this.$emit("handleType", e.value)
      this.isCubeType = false
    },
    goFront() {
      this.$emit("handleOrder", 6);
    },
    handleBody(e) {
      /**
       * @Author: zk
       * @Date: 2020-09-21 09:44:35
       * @description: 旋转确认 前 0 后 1 上 2 下 3 左 4 右 5
       */
      this.activeFace = e
      switch (e) {
        case 0:
          this.downInfo = {
            x: -25,
            y: -25,
            z: 0,
          };
          break;
        case 1:
          this.downInfo = {
            x: -25,
            y: 155,
            z: 180,
          };
          break;
        case 2:
          this.downInfo = {
            x: -115,
            y: 0,
            z: -25,
          };
          break;
        case 3:
          this.downInfo = {
            x: 65,
            y: 180,
            z: -25,
          };
          break;
        case 4:
          this.downInfo = {
            x: -25,
            y: 65,
            z: 0,
          };
          break;
        case 5:
          this.downInfo = {
            x: -25,
            y: -115,
            z: 0,
          };
          break;
        default:
          break;
      }
      this.$emit("handleOrder", e);
    },
    changeView() {
      /**
       * @Author: zk
       * @Date: 2021-03-10 16:19:34
       * @description: 视图切换
       */
      this.isCubeType = !this.isCubeType
    },
  },
};
</script>

<style lang="less" scoped>
.box-main {
  position: fixed;
  top: 26px;
  right: 60px;
  .go-front {
    width: 16px;
    height: 16px;
    position: absolute;
    top: -10px;
    left: -20px;
  }
  .drop-down {
    position: absolute;
    background: rgb(131, 236, 187);
    width: 100%;
    right: -30px;
    top: 50px;
    .handle-down{
      width: 16px;
      height: 16px;
      position: absolute;
      right: 0;
    }
    .cube-type{
      position: absolute;
      top: 20px;
      right: 0;
      width: 160px;
      line-height: 200%;
      background: #F3F3F3;
      color: #a5a5a4;
      text-align: center;
      .select-type{
        cursor: pointer;
      }
      .active-type{
        color: #EA640D;
      }
    }
  }
}

#box {
  width: 34px;
  height: 34px;
  position: relative;
  top: 0px;
  left: 30%;
  transform-style: preserve-3d;
  transition: all 2s;
}

#box div {
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
.active-face{
  color: #EA640D !important;
}
.front {
  transform: translateZ(17px);
  background: url("../../assets/images/todo/front.png");
}

.back {
  transform: translateZ(-17px) rotateX(180deg);
  background: url("../../assets/images/todo/front.png");
}

.left {
  transform: translateX(-17px) rotateY(270deg);
  background: url("../../assets/images/todo/front.png");
}

.right {
  transform: translateX(17px) rotateY(90deg);
  background: url("../../assets/images/todo/front.png");
}

.top {
  transform: translateY(-17px) rotateX(90deg);
  background: url("../../assets/images/todo/front.png");
}

.bottom {
  transform: translateY(17px) rotateX(90deg) rotateY(180deg);
  background: url("../../assets/images/todo/front.png");
}
</style>