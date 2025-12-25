<template>
  <div class="draw-menu" v-if="designStore.drawType !== null">
    <!-- 绘制墙 -->
    <div class="menu-main" v-if="designStore.drawType === 0">
      <el-radio-group v-model="line" class="draw-group" disabled>
        <el-radio class="border-radio" label="1">墙中线绘制</el-radio>
        <el-radio label="2">墙内线绘制</el-radio>
      </el-radio-group>
      <el-divider direction="vertical" />
      <div class="wall-land">
        <div>墙厚</div>
        <el-input class="land-main" size="small" v-model="wallThick" @change="onChangeThick" />
        <div>mm</div>
        <div>墙高</div>
        <el-input class="land-main" size="small" v-model="globalHeight" @change="onChangeThick" />
        <div>cm</div>
      </div>
      <el-divider direction="vertical" />
      <el-checkbox class="check-right" disabled v-model="checked1" label="吸附" />
      <el-checkbox v-model="isOrthogonal" label="正交" @change="changeOrthogonal" />
    </div>
    <!-- 装饰样条线 -->
    <div class="menu-main" v-if="designStore.drawType === 1">
      <el-radio-group v-model="lineType" class="draw-group">
        <el-radio v-for="(item, index) in lineData" :key="index" @change="onChangeLine"
          :class="lineData.length > (index + 1) ? 'border-radio' : ''" :label="item.value">{{ item.note }}</el-radio>
      </el-radio-group>
    </div>
    <!-- 面层放样 -->
    <div class="menu-main" v-if="designStore.drawType === 2">
      <el-radio-group v-model="topStore.paveType" class="draw-group">
        <el-radio v-for="(item, index) in topStore.faceTypeData" :key="index" @change="onChangeType"
          :label="item.type">{{ item.name }}</el-radio>
      </el-radio-group>
      <el-divider direction="vertical" />
      <div class="loft-container">
        <div class="loft-main" :class="{ 'm-l-0': item.id === 0, 'activeIcon': item.id === topStore.lineType }"
          v-for="item in loftData" :key="item.id" @click="onChangeLoft(item)" tabindex="1">
          <svg-icon class="svg-icon" :icon-class="item.icon" />
        </div>
      </div>
      <el-divider direction="vertical" />
      <el-checkbox class="check-right" disabled v-model="checked1" label="吸附" />
      <el-checkbox v-model="isOrthogonal" label="正交" @change="changeOrthogonal" />
    </div>
    <!-- 机电管线 -->
    <div class="menu-main" v-if="designStore.drawType === 4">
      <div class="wall-land">
        <template v-if="designStore.pipelineType === 'circle'">
          <div>直径</div>
          <el-input class="land-main" size="small" v-model="pipelineForm.diameter" @change="onChangePipeline" />
          <div>cm</div>
        </template>
        <template v-else>
          <div>宽度</div>
          <el-input class="land-main" size="small" v-model="pipelineForm.width" @change="onChangePipeline" />
          <div>cm</div>
          <el-divider direction="vertical" />
          <div>高度</div>
          <el-input class="land-main" size="small" v-model="pipelineForm.height" @change="onChangePipeline" />
          <div>cm</div>
        </template>
        <el-divider direction="vertical" />
        <div>厚度</div>
        <el-input class="land-main" size="small" v-model="pipelineForm.thickness" @change="onChangePipeline" />
        <div>cm</div>
        <el-divider direction="vertical" />
        <div>偏移高度</div>
        <el-input class="land-main" size="small" v-model="pipelineForm.planeHeight" @change="onChangePipeline" />
        <div>cm</div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateWallInfo, addObject, listKey, addComponent, parametricComponentDraw } from '@/api/userCenter/drawMenu.js'

export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      lineData: null,
      wallThick: 240,
      globalHeight: 280,
      line: '1',
      lineType: null,
      isOrthogonal: false,
      checked1: false,
      loftData: [
        { id: 0, type: 'extrusion_line', name: '线段', icon: 'zhixian' },
        { id: 1, name: '矩形', type: 'extrusion_rectangle', icon: 'zhengfangxing' },
        { id: 2, name: '圆', type: 'extrusion_circle', icon: 'tuoyuanxing' }
      ],
    }
  },
  watch: {
    'designStore.drawType': {
      async handler(val) {
        // 1--绘制套线结构(门套线等)
        if (val === 1) {
          // console.log('libNode',this.designStore.libNode)
          await this.getKeyList()
          const { pid, comName } = this.designStore.libNode
          if (comName == '灯槽线') {
            this.$store.dispatch('top/changeStyleLine', 'lampGrooveLine')
            this.lineType = 'lampGrooveLine'
          } else {
            this.$store.dispatch('top/changeStyleLine', this.designStore.libNode.defaultType)
            this.lineType = this.designStore.libNode.defaultType
          }
        }
      }
    }
  },
  computed: {
    designStore() {
      return this.$store.state.design
    },
    bimStore() {
      return this.$store.state.bim
    },
    topStore() {
      return this.$store.state.top
    },
    memberStore() {
      return this.$store.state.member
    },
    pipelineForm() {
      return this.$store.state.design.pipelineForm
    }
  },
  created() {
    // 原 computed 初始化逻辑移到 created
    const count = this.memberStore?.systemInfo?.globalWallthickness || 240;
    this.wallThick = count;
    // this.globalHeight = this.memberStore?.systemInfo?.globalHeight || '';
  },
  methods: {
    onChangeType(e) {
      this.$store.commit('top/changePave', e)
    },
    onChangeLoft(e) {
      this.$store.commit('top/changeLineType', e.id)
      if (!e.type) return
      const params = { taskId: this.data.taskId, type: e.type }
      addObject(params)
    },
    async getKeyList() {
      const params = { dictKey: 'skirtingLineType' }
      listKey(params).then(res => {
        this.lineData = res.data
      })
    },
    onChangeThick() {
      const params = {
        taskId: this.data.taskId,
        globalWallthickness: this.wallThick,
        globalHeight: this.globalHeight,
      }
      updateWallInfo(params).then(() => {
        this.memberStore.systemInfo.globalWallthickness = this.wallThick;
        // this.memberStore.systemInfo.globalHeight = this.globalHeight;
        this.$store.dispatch('member/changeSystem', this.memberStore.systemInfo);
      })
    },
    changeOrthogonal() {
      this.$store.dispatch('bim/changeOrthogonal', this.isOrthogonal)
    },
    onChangeLine(item) {
      this.$store.dispatch('top/changeStyleLine', item)
      const params = {
        taskId: this.data.taskId,
        comName: this.designStore.libNode.comName,
        comId: this.designStore.libNode.comIdCustom,
        userId: this.designStore.bimUserId,
        skirtingLineType: item,
        // lineGroupType: this.designStore.libNode.comName,
      }
      addComponent(params)
    },
    onChangePipeline() {
      parametricComponentDraw({
        taskId: this.data.taskId,
      }, {
        function: "draw",
        bActivate: true, //绘制模式是否激活
        type: this.designStore.pipelineType,
        width: this.pipelineForm.width,
        height: this.pipelineForm.height,
        thickness: this.pipelineForm.thickness,
        diameter: this.pipelineForm.diameter,
        planeHeight: this.pipelineForm.planeHeight
      })
    }
  },
}
</script>

<style lang="less" scoped>
.draw-menu {
  width: 100%;
  position: absolute;
  top: 0px;
  display: flex;
  justify-content: center;
  pointer-events: none;

  .menu-main {
    height: 40px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    background: rgba(13, 22, 40, 0.7);
    border-radius: 6px;
    pointer-events: auto;
    font-size: 12px;
    font-weight: 400;
    color: #4A4A4A;

    .wall-land {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.7);

      .land-main {
        width: 50px;
        margin: 0 4px;
      }
    }

    .m-l-0 {
      margin-left: 0 !important;
    }

    .loft-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loft-main {
      cursor: pointer;
      // margin-right: 15px;

      .svg-icon {
        width: 18px;
        height: 18px;
        color: #9DADBD;
      }

      &:focus .svg-icon {
        color: #00b3f3;
      }
    }

    .loft-container .loft-main:not(:last-of-type) {
      /* 限定在容器内匹配 */
      margin-right: 15px;
    }

    .activeIcon .svg-icon {
      color: #00b3f3;
    }

    /deep/.el-checkbox__label,
    .el-radio__label {
      font-size: 12px !important;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7) !important;
    }

    /deep/.border-radio {
      margin-right: 15px;

      .el-radio__label {
        padding-right: 8px;
        border-right: 1px var(--el-border-color) var(--el-border-style);
      }
    }

    /deep/ .check-right {
      margin: 0 15px;
    }
  }
}


.draw-group {
  /deep/.el-radio {
    .el-radio__label {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>