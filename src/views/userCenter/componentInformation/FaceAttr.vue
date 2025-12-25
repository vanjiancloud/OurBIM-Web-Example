<!--
 * @description: 面层铺排（Vue 2 版本）
-->
<template>
  <div class="face-box">
    <div v-for="item in typeList" :key="item.id">
      <label-type
        v-if="item.type.findIndex(e => e === topStore.paveType) !== -1 && (item.id === 0 || item.id === 1 || (faceInfo && (item.id !== 0 || item.id === 1)))"
        :options="item">
        <template #main>
          <div v-if="faceInfo">
            <!-- 铺法 -->
            <el-select v-if="item.id === 2" v-model="faceInfo.tileType" size="small" @change="onChange">
              <el-option v-for="opt in tileData" :key="opt.value" :label="opt.note" :value="opt.value" />
            </el-select>
            <!-- 阵列 -->
            <div v-if="item.id === 3">
              <el-select v-model="faceInfo.arrayType" size="small" @change="onChange" multiple collapse-tags>
                <el-option v-for="opt in arrayData" :key="opt.value" :label="opt.note" :value="opt.value" />
              </el-select>
              <slider-detail :options="gapOptions" @onChange="onChange" />
            </div>
            <!-- 位置 -->
            <div v-if="item.id === 4">
              <el-select v-model="faceInfo.alignmentType" size="small" @change="onChange">
                <el-option v-for="opt in alignData" :key="opt.value" :label="opt.note" :value="opt.value" />
              </el-select>
              <div class="slider-main">
                <slider-detail :options="alignXOptions" @onChange="onChange" />
              </div>
              <slider-detail :options="alignYOptions" @onChange="onChange" />
              <slider-detail :options="angleOptions" @onChange="onChange" />
            </div>
            <!-- 缝隙 -->
            <div v-if="item.id === 5">
              <el-select v-model="faceInfo.tileGapType" size="small" @change="onChange">
                <el-option v-for="opt in gapData" :key="opt.value" :label="opt.note" :value="opt.value" />
              </el-select>
              <slider-detail :options="gapOptions" @onChange="onChange" />
            </div>
            <!-- 单元尺寸 -->
            <div v-if="item.id === 6">
              <slider-detail :options="heightOptions" @onChange="onChange" />
              <slider-detail :options="widthOptions" @onChange="onChange" />
            </div>
          </div>
          <!-- 分割线 -->
          <el-divider v-if="item.id !== 6" class="divider-color" />
        </template>
      </label-type>
    </div>
  </div>
</template>

<script>
import LabelType from './LabelType.vue'
import SliderDetail from './SliderDetail.vue'
import { listKey, updatePave, updateObj } from '@/api/userCenter/drawMenu.js'

export default {
  components: {
    LabelType,
    SliderDetail
  },
  data() {
    return {
      typeList: [
        { id: 2, title: '铺法', type: ['tile'] },
        { id: 3, title: '阵列方法', type: ['array'] },
        { id: 4, title: '位置', type: ['tile', 'array'] },
        { id: 5, title: '缝隙', type: ['tile'] },
        { id: 6, title: '单元尺寸', type: ['tile', 'array'] },
      ],
      tileData: [],
      arrayData: [],
      alignData: [],
      alignXOptions: { label: '横向偏移', min: 0, max: 10, paramName: '', paramValue: 0, unit: 'mm' },
      alignYOptions: { label: '纵向偏移', min: 0, max: 10, paramName: '', paramValue: 0, unit: 'mm' },
      angleOptions: { label: '角度', min: -180, max: 180, paramName: '', paramValue: 0, unit: '°' },
      gapData: [],
      gapOptions: { label: '缝宽', min: 0, max: 100, paramName: '', paramValue: 0, unit: 'mm' },
      heightOptions: { label: '长度', min: 0, max: 1000, paramName: '', paramValue: 0, unit: 'mm' },
      widthOptions: { label: '宽度', min: 0, max: 1000, paramName: '', paramValue: 0, unit: 'mm' },
      faceInfo: null
    }
  },
  computed: {
    topStore() {
      return this.$store.state.top
    },
    designStore() {
      return this.$store.state.design
    }
  },
  created() {
    this.getTile()
  },
  watch: {
    'topStore.faceInfo'(val) {
      if (val) {
        this.getPave()
      } else {
        this.faceInfo = null
      }
    },
    'topStore.paveType'(val) {
      if (val) {
        this.getPave()
      }
    },
  },
  methods: {
    onChange() {
      if (!this.faceInfo) return
      const params = JSON.parse(JSON.stringify(this.faceInfo))
      params.arrayType = params.arrayType ? params.arrayType.toString() : ''
      const obj = {
        horizontalOffset: this.alignXOptions.paramValue,
        verticalOffset: this.alignYOptions.paramValue,
        angle: this.angleOptions.paramValue,
        offsetOfGap: this.gapOptions.paramValue,
        lengthOfUnit: this.heightOptions.paramValue,
        widthOfUnit: this.widthOptions.paramValue,
      }
      const finalParams = { ...params, ...obj }
      const taskInfo = { taskId: this.designStore.taskId }
      const { paveType } = this.topStore

      if (paveType === 'tile') {
        updatePave(taskInfo, finalParams).then(() => {
          this.$message.success("修改成功")
        })
      } else {
        updateObj(taskInfo, finalParams).then(() => {
          this.$message.success("修改成功")
        })
      }
    },
    getTileList() {
      const params = { dictKey: 'tileType' }
      listKey(params).then(res => {
        this.tileData = res.data
      })
    },
    getArrayList() {
      const params = { dictKey: 'arrayType' }
      listKey(params).then(res => {
        this.arrayData = res.data
      })
    },
    getAlignList() {
      const params = { dictKey: 'alignmentType' }
      listKey(params).then(res => {
        this.alignData = res.data
      })
    },
    getGapList() {
      const params = { dictKey: 'tileGapType' }
      listKey(params).then(res => {
        this.gapData = res.data
      })
    },
    getKey(e) {
      const { faceInfo } = this.topStore
      const obj = faceInfo ? faceInfo.find(item => item.key === e) : null
      return obj ? obj.value : null
    },
    getPave() {
      // const { memberInfo } = this.designStore
      const { paveType } = this.topStore
      // const typeObj = memberInfo ? memberInfo.find(item => item.key === 'rootTypeInfo') : {}
      const params = {
        meshID: this.getKey('meshID'),
        alignmentType: this.getKey('alignmentType'),
        id: this.getKey('id'),
        // type: typeObj ? typeObj.type : ''
      }

      if (paveType === 'tile') {
        params.tileType = this.getKey('tileType')
        params.tileGapType = this.getKey('tileGapType')
        this.gapOptions.label = '缝宽';
      } else {
        params.arrayType = this.getKey('arrayType') ? this.getKey('arrayType').split(',') : [];
        this.gapOptions.label = '间隔宽度';
      }

      this.alignXOptions.paramValue = this.getKey('horizontalOffset') || 0
      this.alignYOptions.paramValue = this.getKey('verticalOffset') || 0
      this.angleOptions.paramValue = this.getKey('angle') || 0
      this.gapOptions.paramValue = this.getKey('offsetOfGap') || 0

      const length = this.getKey('lengthOfUnit') || 0
      const width = this.getKey('widthOfUnit') || 0

      this.heightOptions = {
        label: '长度',
        min: 0,
        max: length * 2,
        paramName: '',
        paramValue: length,
        unit: 'mm'
      }
      this.widthOptions = {
        label: '宽度',
        min: 0,
        max: width * 2,
        paramName: '',
        paramValue: width,
        unit: 'mm'
      }

      this.faceInfo = params
    },
    getTile() {
      this.getTileList()
      this.getArrayList()
      this.getAlignList()
      this.getGapList()
    }
  }
}
</script>

<style lang="less" scoped>
.face-box {
  padding: 0 10px;

  /deep/.label-type .label-title,
  /deep/.slider-box .slider-label,
  /deep/.slider-box .slider-main .slider-unit {
    color: #C2C2C4;
  }
  /deep/.el-select{
    margin-bottom: 18px;
  }
}
</style>