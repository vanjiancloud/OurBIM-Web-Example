<template>
  <div>
    <div class="dragMask" v-show="isDragging"></div>
    <div class="animationAdd">
      <div class="down" @click="down">
        <svg-icon icon-class="downDouble" class="downSvg" :class="{ 'rotate-180': !show }" />
      </div>
      <div :class="{
        'dragger': show,
        'hideDragger': !show,
      }" @mousedown="startDrag"></div>
      <div class="box" :class="{ 'hide': !show }"
        :style="{ height: divHeight ? divHeight + 'px' : 'auto', maxHeight: divHeight > 290 ? divHeight : 290 }">
        <div class="tool">
          <div class="flexCenter">
            <div class="flexCenter">
              <el-dropdown trigger="click">
                <el-button type="primary" plain class="bluePlainBtn addBtn" icon="el-icon-plus" size="small">添
                  加</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, key) in types" :key="key" @click.native="addType({ item, key })">{{
                    item
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <svg-icon icon-class="forward" class="play rotate-180" @click="onLeft" />
              <svg-icon icon-class="play" class="play" v-if="!isPause" @click="play" />
              <svg-icon icon-class="panse" class="play" v-if="isPause" @click="pause" />
              <svg-icon icon-class="forward" class="play" @click="onRight" />
              <svg-icon icon-class="stop" class="play" @click="stop" />
            </div>
            <div class="inTime flexCenter">
              <!-- <svg-icon icon-class="time" class="timeSvg"/>
              <span>插入时间</span> -->
              <!-- 顶部操作区域 -->
              <!-- 缩小时间轴 -->
              <div class="top-button-right" @click="clickZoomOut">
                <i class="el-icon-minus"></i>
              </div>
              <!-- 放大时间轴 -->
              <div class="top-button-right" @click="clickZoomIn">
                <i class="el-icon-plus"></i>
              </div>
              <!-- 合适的时间轴 -->
              <div class="top-button-right" @click="clickZoomFit">
                <svg xmlns="http://www.w3.org/2000/svg" width="10.583" height="10.524" viewBox="0 0 10.583 10.524">
                  <path id="路径_1560" data-name="路径 1560"
                    d="M5.217,6.019c0-.288-.229-.4-.506-.4H.756a.409.409,0,1,0,0,.817H3.83L.443,9.814A.391.391,0,0,0,1,10.367l3.412-3.4v3.111a.41.41,0,1,0,.82,0V6.019m5.256-2.005H7.41L10.8.639a.391.391,0,1,0-.555-.553l-3.4,3.4V.375a.41.41,0,1,0-.82,0V4.41c0,.012.012.012.012.024a.429.429,0,0,0,.109.288.364.364,0,0,0,.374.1h3.954a.406.406,0,0,0,.41-.408.4.4,0,0,0-.4-.4Z"
                    transform="translate(-0.329 0.035)" fill="#fff" />
                </svg>
              </div>
            </div>
          </div>
          <div class="list" ref="leftScroll" @scroll="syncScroll">
            <div class="item" :class="{ activeLine: currentLine.id === item.id }" @click="onLine({ ...item, index })"
              v-for="(item, index) in list" :key="index">
              <div class="item-type">
                <img v-if="item.animationType === '0'" src="@/assets/images/animation/list1.png" />
                <img v-if="item.animationType === '1'" src="@/assets/images/animation/list2.png" />
                <img v-if="item.animationType === '2'" src="@/assets/images/animation/list7.png" />
                {{ types[item.animationType] }}
              </div>
              <div class="item-name">
                <el-input class="eventName" ref="eventName" :value="item.eventName" placeholder="" size="mini"
                  @blur="editEventId = null" v-if="editEventId == item.id"></el-input>
                <div class="name" @click.stop="editEventName(item)" v-else>{{ item.eventName }}</div>
                <div class="icon_group">
                  <svg-icon icon-class="filter7" class="eyeSvg svg_icon" @click.stop="switchShow(item)"
                    v-if="item.animationType == '0'" />
                  <span class="line"></span>
                  <svg-icon icon-class="delete" class="deleteSvg svg_icon" @click.stop="deleteEvent(item)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="timeText">
          <TimeLine ref="TimeLine" v-if="timeLineContainer_width" :rightScrollTop="rightScrollTop"
            :timeLineContainer_width="timeLineContainer_width" :currentLine="currentLine" :data="data" :list="list"
            @onSuccess="addSuccess" @onCloseEdit="closeEdit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createAnimEvent, selectAnimationEventFrameList, deleteAnimEvent, playAnimation, quitAnimation } from '@/api/userCenter/modelAnimation.js'
import TimeLine from "./components/TimeLine.vue"
import { EventBus } from '@/utils/bus.js'
export default {
  components: { TimeLine },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    currentItem: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      show: true,
      timeLineContainer_width: 0,//时间轴容器的宽度
      list: [],
      currentLine: {},
      types: {
        0: "位置动画",
        1: "材质动画",
        2: "视点动画",
        // 1111:"音频动画",
        // 1111:"文字动画",
        // 1111:"天气动画",
        // 1111:"自定义动画",
        // 1111:"内置骨骼动画",
        // 1111:"剖切动画",
        // 1111:"分解动画",
        // 1111:"路径动画",
        // 1111:"跟随动画",
        // 1111:"批量交替动画",
      },
      isPause: false,
      rightScrollTop: 0, // 右边 div 的滚动位置
      isDragging: false,
      startY: 0,
      divHeight: 100,
      minHeight: 100,
      maxHeight: 290,
      dragStartY: 0, // 新增：拖动开始时的容器高度
      dragMask: false,
      editEventId: null,//当前编辑名称的事件id
    }
  },
  watch: {
    currentItem: {
      handler(newVal) {
        this.getList()
        this.currentLine = {}
      },
      immediate: true
    }
  },
  computed: {},
  created() { },
  mounted() {
    this.getTimeLineContainer_width()
    window.onresize = () => (() => {
      this.getTimeLineContainer_width()
    })();
    this.setEventBus();
  },
  destroyed() {
    EventBus.$off('animationRefresh');
    EventBus.$off('animationClose');
  },
  methods: {
    setEventBus() {
      EventBus.$on('animationRefresh', this.getList);
      EventBus.$on('animationClose', this.stop);
    },
    // 展开/收缩编辑器面板
    down() {
      this.show = !this.show
      this.$nextTick(() => {
        // 强制更新 DOM 后，重新应用动画
        this.$forceUpdate();
      });
    },
    // 设置timeline宽度 自适应宽度
    getTimeLineContainer_width() {
      this.$nextTick(() => {
        const div_box = document.querySelector('.box');
        const div_tool = document.querySelector('.tool');
        const div_timeText = document.querySelector('.timeText');
        if (div_box && div_tool) {
          let flexWidth = div_box.offsetWidth - div_tool.offsetWidth;
          div_timeText.style.width = flexWidth;
          // const offsetWidth = div.offsetWidth;
          // const clientWidth = div.clientWidth;
          // const rectWidth = div.getBoundingClientRect().width;
          // console.log(offsetWidth,div2.offsetWidth,div3.offsetWidth)
          this.timeLineContainer_width = flexWidth;
        } else {
          // this.timeLineContainer_width = window.innerWidth - 918
          this.timeLineContainer_width = 765;
        }
      })
    },
    // 修改关键帧时间点联动事件
    changeDotTime(dotObj, time) {
      if (this.$refs.TimeLine) this.$refs.TimeLine.changeDotTime(dotObj, time)
    },
    // 动画点击事件
    onLine(item) {
      this.currentLine = item
    },
    // 查询动画列表下的动画事件列表
    getList() {
      selectAnimationEventFrameList({ animationId: this.currentItem.id }).then(res => {
        this.list = res.data
      })
    },
    // 添加动画
    addType(item) {
      console.log('添加动画', item, this.data)
      let params = {
        animationId: this.currentItem.id,
        eventName: item.item + (this.list.length + 1),
        animationType: item.key,
        taskId: this.data.taskId
      }
      let data = {
        operation: "createSeqAnim",
        // animationName: item.key == '0' ? "transform" : 'viewpoint',
        stateSelection: "current",
      }
      // 0 位置 
      if (item.key == '0') {
        data.animationName = "transform";
        if (this.data.selectPark?.mN) {
          data.actorsParams = [{
            actorID: this.data.selectPark.mN,
            pakID: this.data.selectPark.pakId
          }]
        }
        else if (this.data.multiComponents && this.data.multiComponents.length > 0) {
          data.actorsParams = this.data.multiComponents.map(a => {
            return {
              actorID: a.actorId,
              pakID: a.pakId,
            }
          })
        } else {
          this.$message.warning("请先选择构件！")
          return;
        }
      }
      // 1 材质
      if (item.key == '1') {
        data.animationName = "material";
        if (this.data.selectPark?.mN) {
          data.actorsParams = [{
            actorID: this.data.selectPark.mN,
            pakID: this.data.selectPark.pakId
          }]
        } else {
          this.$message.warning("请先选择构件！")
          return;
        }
      }
      // 2 视点
      if (item.key == '2') {
        data.animationName = "viewpoint"
      }
      // 添加动画事件
      createAnimEvent(params, data).then(res => {
        this.$message.success("添加成功！")
        this.getList()
      })
    },
    // 添加帧成功
    addSuccess(res) {
      this.$parent.$refs.ModelAnimationEdit.show(res)
    },
    closeEdit() {
      this.$parent.$refs.ModelAnimationEdit.close()
    },
    switchShow(item) {
      // console.log('eye',item)
    },
    // 删除事件
    deleteEvent(item) {
      this.$confirm(`请确认是否删除？`, '删除事件', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        deleteAnimEvent({ id: item.id }).then(() => {
          this.$message.success("删除成功！")
          this.getList()
          if (this.currentLine.id === item.id) this.currentLine = {}
        })
      }).catch(() => { })
    },
    //播放前的状态(current)、播放开始的状态(startPlay)、播放结束的状态(endPlay)
    playApi(playAction, callback) {
      let params = {
        taskId: this.data.taskId
      }
      let data = {
        mode: "SequenceAnimationGroup",
        animationID: this.currentItem.id,
        playAction,//play,stop,continue,pause
        startTime: this.$refs.TimeLine.moveLine.currentTime,
        stausWhenPlayOver: "current"
      }
      quitAnimation({ taskId: this.data.taskId }, { operation: "quitEdit" }).then(() => {
        playAnimation(params, data).then(() => {
          callback()
        })
      })
    },
    play() {
      this.playApi("play", () => {
        this.isPause = true
        this.$parent.onSubmitSuccess()
        this.$refs.TimeLine.moveDrag()
      })
    },
    pause() {
      this.playApi("pause", () => {
        this.isPause = false
        this.$refs.TimeLine.getCurrentTime()
      })
    },
    stop() {
      this.playApi("stop", () => {
        this.isPause = false
        if (this.$refs.TimeLine) {
          this.$refs.TimeLine.destoryTimer();
          this.$refs.TimeLine.moveLine.currentTime = 0;
          this.$refs.TimeLine.moveLine.x = 0;
        }
      })
    },
    // 
    onLeft() {
      if (this.$refs.TimeLine.moveLine.x > 0) {
        this.$refs.TimeLine.moveLine.x = this.$refs.TimeLine.moveLine.x - 1
        this.$refs.TimeLine.getCurrentTime()
      }
    },
    onRight() {
      if (this.$refs.TimeLine.moveLine.x <= this.$refs.TimeLine.moveLine.maxWidth) {
        this.$refs.TimeLine.moveLine.x = this.$refs.TimeLine.moveLine.x + 1
        this.$refs.TimeLine.getCurrentTime()
      }
    },
    // 获取左边 div 的滚动位置
    syncScroll() {
      this.rightScrollTop = this.$refs.leftScroll.scrollTop;
    },
    clickZoomOut() {
      this.$refs.TimeLine?.clickZoomOut()
    },
    clickZoomIn() {
      this.$refs.TimeLine?.clickZoomIn()
    },
    clickZoomFit() {
      this.$refs.TimeLine?.clickZoomFit()
    },
    startDrag(event) {
      // 初始化拖动状态
      this.isDragging = true;
      this.startY = event.clientY;
      this.dragStartY = this.divHeight; // 记录初始高度

      // 绑定鼠标移动和松开事件（不使用 passive，允许 preventDefault）
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.stopDrag);

      // 阻止事件冒泡和默认行为（避免穿透到下层元素）
      event.stopPropagation();
      event.preventDefault();
    },
    handleDrag(event) {
      if (!this.isDragging) return; // 非拖动状态直接返回

      // 计算拖动距离（基于初始高度，避免累计误差）
      const deltaY = event.clientY - this.startY;
      this.divHeight = this.dragStartY - deltaY;
      // 限制高度范围
      this.divHeight = Math.max(this.minHeight, Math.min(this.divHeight, this.maxHeight));
    },
    stopDrag() {
      // 重置状态
      this.isDragging = false;
      // 移除事件监听（确保彻底移除，避免内存泄漏）
      document.removeEventListener('mousemove', this.handleDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },
    // 编辑动画事件名称
    editEventName(item) {
      // console.log(item)
      this.editEventId = item.id;
      this.$nextTick(() => {
        this.$refs.eventName[0].focus();
      })
    }
  }
}
</script>
<style lang="less" scoped>
.rotate-180 {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}

.flexCenter {
  display: flex;
  align-items: center;
  padding: 5px 0;
}

.hide {
  max-height: 0 !important;
  min-height: 0 !important;
}

.dragMask {
  // height: 100vh;
  // width: 100vw;
  z-index: 1001;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
}

.animationAdd {
  width: calc(100% - 600px);
  background: rgba(16, 16, 16, 0.7);
  position: absolute;
  bottom: 56px;
  left: 0;
  right: 0;
  margin: 0 auto;

  .dragger {
    height: 4px;
    cursor: ns-resize;
  }

  .hideDragger {
    height: 0;
    transition: height 0.5s ease-out;
  }

  .box {
    max-height: 290px;
    min-height: 0;
    width: 100%;
    transition: max-height 0.5s ease-out;
    // overflow: hidden;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
  }

  .down {
    position: absolute;
    top: -23px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: rgba(16, 16, 16, 0.7);
    border-radius: 8px 8px 0px 0px;
    width: 60px;
    height: 23px;
    color: #FFFFFF;
    cursor: pointer;
    text-align: center;

    .downSvg {
      font-size: 28px;
    }
  }

  .tool {
    // border-bottom: 1px solid #303134;

    .addBtn {
      background: transparent !important;
      margin-right: 8px;
      margin-left: 16px;

      &:hover {
        background: #00aaf0 !important;
      }
    }

    .play {
      color: #ffffff;
      margin: 0 6px;
      cursor: pointer;
    }

    .inTime {
      font-size: 12px;
      color: #FFFFFF;
      border-left: 1px solid #303134;
      margin-left: 8px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .timeSvg {
        font-size: 16px;
        margin-right: 5px;
      }

      .top-button-right {
        width: 26px;
        height: 20px;
        display: flex;
        justify-self: flex-end;
        align-items: center;
        justify-content: center;
        margin: 0 8px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background: #1b1b1b;
        }
      }
    }

    .timeText {
      // width: 100%;
      border-left: 1px solid #303134;
      margin-left: 6px;
      color: #6D7278;
      flex: 1;
    }
  }

  .list {
    overflow: auto;
    // max-height: 238px;

    .item {
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 36px;

      .item-type {
        color: #ffffff;
        font-size: 14px;
        width: 130px;
        text-align: center;

        img {
          margin-right: 6px;
          width: 15px;
          height: 15px;
          vertical-align: middle;
        }
      }

      .item-name {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        border-left: 1px solid #303134;
        border-right: 1px solid #303134;
        height: 100%;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;

        /deep/.eventName {
          width: 100px;

          .el-input__inner {
            background-color: #505561;
            color: #fff;
            border: 0;
          }
        }

        .name {
          overflow: hidden;
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100px;
        }

        .icon_group {
          margin-right: 12px;

          // .svg_icon {
          //   &:hover {
          //     background: #1b1b1b;
          //   }
          // }
        }

        .line {
          width: 1px;
          height: 13px;
          background: rgba(36, 52, 86, 0.7);
          display: inline-block;
          margin: 0 8px;
        }

        .eyeSvg {
          font-size: 17px;
          margin-left: 20px;
          cursor: pointer;
        }

        .deleteSvg {
          cursor: pointer;
          font-size: 16px;
        }
      }
    }

    .activeLine {
      background: rgba(109, 151, 255, 0.31);
    }
  }
}
</style>
