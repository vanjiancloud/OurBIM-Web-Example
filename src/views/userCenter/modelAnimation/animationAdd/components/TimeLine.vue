<template>
  <!-- :style="{ width: timeLineContainer_width + 'px' }" -->
  <div class="timeline-container">
    <!-- <section style="width: 100%;height: 100%;display: flex;position: relative;"> -->
    <!-- 时间轴 -->
    <div class="timeline" :style="{ width: timeLine_width + 'px' }" ref="timeLine">
      <!-- <div class="timeline" :style="{ width: '100%' }" ref="timeLine"> -->
      <VueDraggableResizable v-if="timeLine_width" class="line" :x="moveLine.x" :w="12" :h="290" axis="x"
        :parent="false" :handles="[]" @dragging="lineOnDrag" @dragstop="dragstop" :style="{ left: moveLine.x + 'px' }">
        <img src="@/assets/images/animation/line.png" />
      </VueDraggableResizable>
      <!-- 时间轴刻度 -->
      <div class="timescale" @click="ruler_click($event)" :style="{ width: timescale_width + 'px' }">
        <!-- 宽度占位 -->
        <div style="flex-shrink: 0" :style="{ width: timescale_placeholder_width + 'px' }"></div>

        <!-- 时间轴的格子 -->
        <Grid v-for="grid in gridBufferList" :key="grid.frame" :frame="grid.frame" :width="grid.width"
          :showNumber="grid.showNumber"></Grid>
      </div>

      <!-- 时间轴的视频容器 -->
      <div class="lineBox" :style="{ width: timescale_width + 'px' }" @click.stop="frameClick">
        <div class="keyframe" :style="{ top: -rightScrollTop + 'px' }"
          :class="{ activeLine: currentLine.id === item.id }" v-for="(item, index) in list" :key="index">
          <!-- line -->
          <div class="clickBox" @dblclick.stop="addLineDot($event, item, index)">
            <div class="keyframe-line" />
            <!-- dot 关键帧 -->
            <div @click.stop="onDot({ ...dot, animationType: item.animationType })"
              v-for="(dot, index) in item.framelist" :key="index" class="dot"
              :style="{ top: dot.top + 'px', left: changeLeft(dot.frameTime) + 'px', 'background-color': dot.id === currentDotId ? 'red' : '#6D7278' }">
              <!-- 可以在这里添加删除按钮或其他交互 -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </section> -->
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import { updateAnimFrame, quitAnimation, saveAnimFrame } from '@/api/userCenter/modelAnimation.js'
import Grid from './Grid.vue'
import Mapping from './map'
export default {
  components: { Grid, VueDraggableResizable },
  props: {
    //时间轴容器的宽度
    timeLineContainer_width: {
      type: Number,
      default: 0
    },
    currentLine: {
      type: Object,
      default: null
    },
    data: {
      type: Object,
      default: () => { }
    },
    list: {
      type: Array,
      default: () => []
    },
    rightScrollTop: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      currentDotIndex: null,//当前新添加的关键帧
      zoomValue: 1,//缩放值
      gridBufferList: [], //timescale's grid
      frameWidth: 0.5, //帧宽度：决定了时间轴的比例
      timeLineOffsetLeft: 0, //时间轴滚动轴左偏移量
      timeLine_width: 0, // 时间轴宽度：用户能看见的宽度
      timescale_width: 0, // 时间刻度总宽度：包含用户看不见的宽度
      maxFrameOfMaterial: 0, //当前素材最大帧数
      currentSectionIndex: 1,// 段落级焦点
      gridWidth: 0,// 当前格子宽度
      gridFrame: 0,// 格子内帧数
      groupGridFrame: 0,// 每组格子内的帧数
      timescale_placeholder_width: 0,// 时间刻度左侧占位的宽度
      maxFrameWidth: 0, // 最大帧宽度 
      dotSize: 10, // 圆点大小，与CSS中设置的值一致  
      padding: 10, // 圆点到线两侧的额外空间
      moveLine: {
        x: 0,
        currentTime: 0,//(s)
        maxTime: 0,//最长帧时间(ms)
        maxWidth: 0,//最长宽度
        moveTimer: null
      },
      currentDotId: null,
      // lastClickTime: 0,
      // clickThreshold: 300,
      linkageInfoBak: {},
      animationKeyframe: {},
    }
  },
  watch: {
    timeLineContainer_width() {
      this.getTime()
    },
    list(val) {
      // console.log('动画项切换');
      // 时间浮标重置到开始位置
      this.moveLine = this.$options.data().moveLine;
      this.getTime();
    },
    currentLine(val) {
      if (val) {
        this.destoryTimer()
      }
    },
    "data.animationKeyframe"(val) {
      // 联动事件逻辑 每次触发联动事件都把linkageInfo坐标信息备份 当创建新关键帧时将备份坐标赋给它
      if (val.id == '102') {
        this.linkageInfoBak = val.linkageInfo;
      }
      if (val.id == '101') {
        this.animationKeyframe = val;
        this.linkageInfoBak = val.linkageInfo;
      }
      // 位置动画
      if (!val.linkageInfo) {
        let dotList = this.list[this.currentDotIndex]?.framelist
        if (dotList && !dotList[dotList.length - 1].id) {
          dotList.pop()
          this.$message.error("添加关键帧失败！")
        }
      }
    }
  },
  computed: {},
  created() { },
  mounted() {
  },
  beforeDestroy() {
    this.destoryTimer()
  },
  methods: {
    getTime() {
      this.getMaxTime()
      this.getMaxFrameOfMaterial()
      // 设置每个格子的宽度
      this.getGridWidth()
      this.getGridFrame()
      this.getGroupGridFrame()
      this.getTimeLineWidth()
      this.getTimeScaleWidth()
      this.getTimeScalePlaceHolderWidth()
      // 渲染 grid BufferList
      this.renderGridBufferList()
    },
    getMaxTime() {
      let timeArr = []
      this.list.forEach(e => {
        let time = e.framelist.map(e1 => { return e1.frameTime })
        timeArr = timeArr.concat(time)
      })
      this.moveLine.maxTime = timeArr.length ? Math.max(...timeArr) : 0
      this.moveLine.maxWidth = this.changeLeft(this.moveLine.maxTime)
    },
    getMaxFrameOfMaterial() {
      this.maxFrameOfMaterial = Mapping.getMaxFrameOfMaterial(this.moveLine.maxTime)
    },
    getGridWidth() {
      this.gridWidth = Mapping.frameWidth2Grid(this.frameWidth).gridWidth
    },
    getGridFrame() {
      this.gridFrame = Mapping.frameWidth2Grid(this.frameWidth).gridFrame
    },
    getGroupGridFrame() {
      this.groupGridFrame = Mapping.frameWidth2Grid(this.frameWidth).groupGridFrame
    },
    getTimeLineWidth() {
      this.timeLine_width = this.timeLineContainer_width - 0
    },
    getTimeScaleWidth() {
      this.timescale_width = Mapping.getTimeScaleWidth(this.frameWidth, this.timeLine_width, this.maxFrameOfMaterial)
    },
    getTimeScalePlaceHolderWidth() {
      this.timescale_placeholder_width = Mapping.getTimeScalePlaceHolderWidth(this.timeLineOffsetLeft, this.gridWidth)
    },
    // 渲染 gridBufferList
    renderGridBufferList() {
      Mapping.renderGridBufferList(
        this.gridBufferList,
        this.gridWidth,
        this.groupGridFrame,
        this.gridFrame,
        this.timeLineOffsetLeft,
        this.timescale_width
      )
    },
    // 点击放大时间轴
    clickZoomIn() {
      if (this.zoomValue === 9) return
      ++this.zoomValue
      this.frameWidth = this.$options.data().frameWidth / this.zoomValue
      this.getTime()
      this.getCurrentLinePosition()
    },

    // 点击缩小时间轴
    clickZoomOut() {
      if (this.zoomValue === 1) return
      --this.zoomValue
      this.frameWidth = this.$options.data().frameWidth / this.zoomValue
      this.getTime()
      this.getCurrentLinePosition()
    },
    // 点击缩放到合适的时间轴
    clickZoomFit() {
      this.zoomValue = this.$options.data().zoomValue
      this.frameWidth = this.$options.data().frameWidth
      this.getTime()
      this.getCurrentLinePosition()
    },
    frameClick(event) {
      // console.log(event.target.classList)
      // 在触发新增关键帧的范围内 不触发取消选择当前关键帧的事件
      if (!event || !['clickBox', 'keyframe-line'].includes(event.target.classList[0])) {
        this.currentDotId = null;
        this.quit();
        this.$emit('onCloseEdit')
      }
    },
    addLineDot(event, item, i) {
      // this.lastClickTime = Date.now();
      //点击相同的位置不执行
      if (event.target.classList[0] === "dot") {
        return;
      }
      // 计算点击位置相对于容器的偏移量  
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // 验证点击位置是否在线上  
      if (Math.abs(y - rect.height / 2) <= this.dotSize / 2 + this.padding) {
        // 计算圆点的top和left值
        const top = 0;
        const left = x - this.dotSize / 2;
        const frame = (left + this.dotSize / 2)
        const frameTime = parseInt(Number((frame / 30 / this.frameWidth).toFixed(2)) * 1000)
        // 添加新的圆点到dots数组中
        // this.currentDotIndex = i
        item.framelist.push({ top, left, frameTime });
        this.addFrame(item, frameTime)
      }
    },
    // 根据时间转帧的位置
    changeLeft(val) {
      // console.log(val,this.frameWidth,this.dotSize)
      let left = val / 1000 * this.frameWidth * 30 - this.dotSize / 2
      // console.log(left)
      return left
    },
    // 添加关键帧接口
    addFrame(item, frameTime) {
      // console.log('addFrame',item,frameTime)
      let params = {
        taskId: this.data.taskId,
        animationEventId: item.id,
        frameTime,
      }
      let data = {
        operation: "editkeyframe",
        animationName: item.animationType == '0' ? "transform" : "viewpoint",
        animationID: item.id,
      }
      quitAnimation({ taskId: this.data.taskId }, { operation: "quitEdit" }).then(() => {
        updateAnimFrame(params, data).then(res => {
          this.$message.success("添加关键帧成功！")
          let newDotIndex = item.framelist.findIndex(a => a.frameTime == frameTime);
          // 补充新建的关键帧信息
          let comboItem = { id: res.data, frameTime, animationType: item.animationType, animationEventId: item.id };
          this.$set(item.framelist, newDotIndex, {
            ...item.framelist[newDotIndex],
            ...comboItem,
          })
          this.getTime()
          if (this.list.find(a => a.framelist.some(b => b.id == this.currentDotId))?.id == comboItem.animationEventId) {
            // 新建关键帧和当前高亮帧处于同一动画事件 直接保存关键帧
            this.immediateSaveAnimFrame(item.framelist[newDotIndex])
          } else {
            this.onDot(item.framelist[newDotIndex])
          }
          // this.$emit("onSuccess", item.framelist[newDotIndex])
        })
      })
    },
    // 创建后立即保存关键帧信息
    immediateSaveAnimFrame(obj) {
      let value1 = this.linkageInfoBak.location.split(' ');
      let value2 = this.linkageInfoBak.rotation.split(' ');
      let params = {
        animationEventId: obj.animationEventId,
        location: `X=${value1[0].split('=')[1]} Y=${value1[1].split('=')[1]} Z=${value1[2].split('=')[1]}`,
        rotation: `P=${value2[0].split('=')[1]} Y=${value2[1].split('=')[1]} R=${value2[2].split('=')[1]}`,
        componentId: this.data.animationKeyframe.componentId,
        id: obj.id,
        frameTime: obj.frameTime,
      }
      if (obj.animationType == '0') {
        let value3 = this.linkageInfoBak.scale.split(' ');
        params.scale = `X=${value3[0].split('=')[1]} Y=${value3[1].split('=')[1]} Z=${value3[2].split('=')[1]}`
      }
      saveAnimFrame(params).then(() => {
        this.$message.success("保存成功！")
        // this.onDot(this.list.find(a => a.framelist.some(b => b.id == obj.id)).framelist.find(c=>c.id == obj.id))
      })
    },
    // 点击关键帧
    onDot(item) {
      // const currentTime = Date.now();
      // if (currentTime - this.lastClickTime < this.clickThreshold) {
      //   console.log('小于双击阈值');
      //   // 如果距离上次双击时间小于阈值，不处理单击事件
      //   return;
      // }
      console.log('click-dot', item);
      this.currentDotId = item.id;
      let params = {
        taskId: this.data.taskId,
        animationEventId: item.animationEventId,
        frameTime: item.frameTime,
        id: item.id
      }
      let data = {
        operation: "editkeyframe",
        animationName: item.animationType == '0' ? "transform" : "viewpoint",
        animationID: item.animationEventId,
        keyframeID: item.id
      }
      quitAnimation({ taskId: this.data.taskId }, { operation: "quitEdit" }).then(() => {
        updateAnimFrame(params, data).then(res => {
          this.$emit("onSuccess", item)
        })
      })
    },
    quit() {
      // console.log('timeline-quit')
      quitAnimation({ taskId: this.data.taskId }, { operation: "quitEdit" })
    },
    // 修改关键帧时间点 判断是否存在当前时间点位数据 并且调整点位位置
    changeDotTime(dotObj, time) {
      // console.log(dotObj, time, this.list)
      let dotAnimationEvent = this.list.find(a => a.id == dotObj.animationEventId);
      let eventDotList = dotAnimationEvent.framelist;
      if (eventDotList.some(a => Mapping.second2hms(a.frameTime / 1000) == time)) {
        this.$message.warning("当前时间关帧键已存在")
      } else {
        // 调整当前关键帧时间点
        eventDotList.find(a => a.id == dotObj.id).frameTime = Mapping.hms2second(time)
      }
    },
    // 标线拖拽事件
    lineOnDrag(x) {
      // 限制在关键帧最大时间内（作废）
      // let timeArr = [];
      // this.list.forEach(e => {
      //   let time = e.framelist.map(e1 => { return e1.frameTime })
      //   timeArr = timeArr.concat(time)
      // })
      // // console.log(x, this.moveLine.maxWidth, timeArr)
      // if (timeArr.length == 0) {
      //   this.moveLine.x = x - 0;
      // }
      // else if (x < 0 || x >= this.moveLine.maxWidth) {
      //   // return;
      //   this.moveLine.x = x - 0; //因为左侧会超出10px   故此处减去10 确保currentTime的值正确
      // } else {
      //   this.moveLine.x = x - 0; //因为左侧会超出10px   故此处减去10 确保currentTime的值正确
      // }
      // 不限制范围
      const lineBox = document.querySelector(".lineBox")
      this.moveLine.x = x <= lineBox.offsetWidth ? x <= 0 ? 0 : x - 12 : lineBox.offsetWidth - 12;
    },
    // 拖拽结束
    dragstop(e) {
      this.moveLine.currentTime = parseInt((e / 30 / this.frameWidth).toFixed(2))
    },
    getCurrentTime() {
      this.destoryTimer();
      this.dragstop(this.moveLine.x);
    },
    // 获取刻度线当前位置
    getCurrentLinePosition() {
      let left = this.changeLeft(this.moveLine.currentTime * 1000)
      if (left < 0 || left > this.moveLine.maxWidth) {
        return
      }
      this.moveLine.x = left
    },
    // 拖拽线移动
    moveDrag() {
      let stepTime = this.moveLine.maxTime / this.moveLine.maxWidth
      this.moveLine.moveTimer = setInterval(() => {
        this.moveLine.x = this.moveLine.x + 1
        if (this.moveLine.x >= this.moveLine.maxWidth) {
          this.moveLine.x = 0;
          this.moveLine.currentTime = 0;
          this.$parent.isPause = false;
          this.destoryTimer();
        }
      }, stepTime)
    },
    destoryTimer() {
      if (this.moveLine.moveTimer) {
        clearInterval(this.moveLine.moveTimer);
        this.moveLine.moveTimer = null;
      }
    },
    // 点击刻度尺
    ruler_click(e) {
      const timelineContainer = document.querySelector(".timeline-container")
      const timeline = document.querySelector(".timeline"); // 时间轴容器（包含滚动条）
      const animationAdd = document.querySelector(".animationAdd")
      const scrollLeft = timeline.scrollLeft;
      // console.log('timeLineContainer_width', this.timeLineContainer_width)
      // 不允许点击刻度尺到最后 致使浮标宽度超出父元素(作废)
      // const position = Math.min(e.x - timelineContainer.offsetLeft - animationAdd.offsetLeft, this.timeLineContainer_width - 12);
      // 加入时间轴容器滚动条偏移量
      const position = e.x - timelineContainer.offsetLeft - animationAdd.offsetLeft + scrollLeft;
      // 限制在关键帧最大时间内（作废）
      // console.log(position, e.x, timelineContainer.offsetLeft, animationAdd.offsetLeft)
      // let timeArr = [];
      // this.list.forEach(e => {
      //   let time = e.framelist.map(e1 => { return e1.frameTime })
      //   timeArr = timeArr.concat(time)
      // })
      // if (timeArr.length == 0 || (position >= 0 && position < this.moveLine.maxWidth)) {
      //   // 浮标宽度12px -6偏移到点击中心位置
      //   this.moveLine.x = position - 6;
      //   this.dragstop(this.moveLine.x)
      // }
      // 
      // 浮标宽度12px -6偏移到点击中心位置
      this.moveLine.x = position - 6;
      this.dragstop(this.moveLine.x)
    }
  }
}
</script>
<style lang="less" scoped>
.timeline-container {
  width: 100%;
  // height: 100%;
  // border-top: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;
  // overflow: hidden;

  .timeline {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    // overflow-x: hidden;
    box-shadow: inset 3px -3px 3px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 0 !important;
    box-sizing: border-box;

    &::-webkit-scrollbar {
      height: 6px;
      // height: 0px;
    }

    .timescale {
      display: flex;
      flex-direction: row;
      z-index: 98;
    }
  }

  .line {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99 !important;
    cursor: move;
    overflow: hidden;
    height: 100%;

    img {
      width: 12px;
      min-height: 100%;
      object-fit: cover;
    }
  }

  .line.vdr {
    border: none;
  }

  .lineBox {
    width: 100%;
    max-height: 260px;
    position: relative;
    overflow-y: hidden;
    padding-top: 22.5px;

    .keyframe {
      position: relative;
      width: 100%;
      height: 36px;
      padding: 12.5px 0;

      .clickBox {
        height: 10px;
        position: relative;
      }

      .keyframe-line {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #9FAFC2;
      }

      .dot {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #6D7278;
        cursor: pointer;
        top: 0;
      }
    }

    .activeLine {
      background: rgba(109, 151, 255, 0.31);
    }
  }
}
</style>
