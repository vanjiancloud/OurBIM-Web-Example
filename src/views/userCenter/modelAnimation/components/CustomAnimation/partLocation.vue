<template>
  <div class="part-location">
    <el-divider class="divider"></el-divider>
    <el-form-item label="" label-width="0">
      <el-checkbox v-model="locationForm.isLocation">坐标</el-checkbox>
    </el-form-item>
    <template v-if="locationForm.isLocation">
      <el-form-item class="line-break" label="初始值">
        <div class="flex">
          <div class="sub-title">X</div><el-input-number v-model="locationForm.locationStart[0]"
            controls-position="right" size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Y</div><el-input-number v-model="locationForm.locationStart[1]"
            controls-position="right" size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Z</div><el-input-number v-model="locationForm.locationStart[2]"
            controls-position="right" size="mini" @keydown.native.stop></el-input-number>
          <i class="el-icon-refresh-right"></i>
        </div>
      </el-form-item>
      <el-form-item class="line-break" label="结束值">
        <div class="flex">
          <div class="sub-title">X</div><el-input-number v-model="locationForm.locationEnd[0]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Y</div><el-input-number v-model="locationForm.locationEnd[1]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Z</div><el-input-number v-model="locationForm.locationEnd[2]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <i class="el-icon-refresh-right"></i>
        </div>
      </el-form-item>
    </template>
    <el-divider class="divider"></el-divider>
    <el-form-item label="" label-width="0">
      <el-checkbox v-model="locationForm.isAngle">角度</el-checkbox>
    </el-form-item>
    <template v-if="locationForm.isAngle">
      <el-form-item class="line-break" label="初始值">
        <div class="flex">
          <div class="sub-title">X</div><el-input-number v-model="locationForm.angleStart[0]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Y</div><el-input-number v-model="locationForm.angleStart[1]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Z</div><el-input-number v-model="locationForm.angleStart[2]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <i class="el-icon-refresh-right"></i>
        </div>
      </el-form-item>
      <el-form-item class="line-break" label="结束值">
        <div class="flex">
          <div class="sub-title">X</div><el-input-number v-model="locationForm.angleEnd[0]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Y</div><el-input-number v-model="locationForm.angleEnd[1]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Z</div><el-input-number v-model="locationForm.angleEnd[2]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <i class="el-icon-refresh-right"></i>
        </div>
      </el-form-item>
    </template>
    <el-divider class="divider"></el-divider>
    <el-form-item label="" label-width="0">
      <el-checkbox v-model="locationForm.isScale">比例</el-checkbox>
    </el-form-item>
    <template v-if="locationForm.isScale">
      <el-form-item class="line-break" label="初始值">
        <div class="flex">
          <div class="sub-title">X</div><el-input-number v-model="locationForm.scaleStart[0]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Y</div><el-input-number v-model="locationForm.scaleStart[1]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Z</div><el-input-number v-model="locationForm.scaleStart[2]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <i class="el-icon-refresh-right"></i>
        </div>
      </el-form-item>
      <el-form-item class="line-break" label="结束值">
        <div class="flex">
          <div class="sub-title">X</div><el-input-number v-model="locationForm.scaleEnd[0]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Y</div><el-input-number v-model="locationForm.scaleEnd[1]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <div class="sub-title">Z</div><el-input-number v-model="locationForm.scaleEnd[2]" controls-position="right"
            size="mini" @keydown.native.stop></el-input-number>
          <i class="el-icon-refresh-right"></i>
        </div>
      </el-form-item>
    </template>
    <el-divider class="divider"></el-divider>
    <el-form-item label="" label-width="0">
      <el-checkbox v-model="locationForm.isShow">显隐</el-checkbox>
    </el-form-item>
    <el-form-item label="初始值">
      <el-select v-model="locationForm.isShowStart" placeholder="初始值">
        <el-option v-for="item in isShowList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="结束值">
      <el-select v-model="locationForm.isShowEnd" placeholder="结束值">
        <el-option v-for="item in isShowList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
import { isShowList } from "./data.js";

export default {
  data() {
    return {
      isShowList,
      locationForm: {
        isLocation: true,
        locationStart: [0, 0, 0],
        locationEnd: [0, 0, 0],
        isAngle: true,
        angleStart: [0, 0, 0],
        angleEnd: [0, 0, 0],
        isScale: true,
        scaleStart: [1, 1, 1],
        scaleEnd: [1, 1, 1],
        isShow: true,
        isShowStart: '1',
        isShowEnd: '1',
      },
    }
  },
  watch: {

  },
  computed: {},
  created() { },
  mounted() {
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.part-location {
  color: rgba(255, 255, 255, 0.7);

  i {
    font-size: 20px;
    color: #9FAFC2;
    cursor: pointer;
    vertical-align: middle;
  }
  .divider {
    background-color: rgba(255, 255, 255, 0.22);
  }

  .line-break {
    margin-bottom: 18px;

    .flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /deep/ .el-form-item__label {
      display: block;
    }

    /deep/ .el-form-item__content {
      margin-left: 0 !important;
      clear: both;
    }

    .sub-title {
      margin: 0 4px;
    }
  }
}
</style>
