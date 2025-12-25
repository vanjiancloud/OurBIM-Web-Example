<template>
  <div class="part-material">
    <el-divider class="divider"></el-divider>
    <el-row :gutter="10" style="margin-bottom: 18px;">
      <el-col :span="8" v-for="(item, index) in materialForm.materialList" :key="index">
        <div class="material-ball" :class="{ 'hover': activeIndex === index }" @click="handleClick(index)">
          <img :src="item.imgPath" alt="" style="width: 100%;height: 100%;">
          <div class="title">{{ item.name }}</div>
        </div>
      </el-col>
    </el-row>
    <template v-if="activeMaterial">
      <!-- 颜色 -->
      <el-form-item label="" label-width="0">
        <el-checkbox v-model="activeMaterial.colorMap.isShow">颜色</el-checkbox>
      </el-form-item>
      <template v-if="activeMaterial.colorMap.isShow">
        <el-form-item class="line-break" label="初始值" label-width="68px">
          <div class="flex">
            <div class="color-line">
              <el-color-picker v-model="activeMaterial.colorMap.colorStart"></el-color-picker>
              <div>{{ activeMaterial.colorMap.colorStart }}</div>
            </div>
            <i class="el-icon-refresh-right"></i>
          </div>
        </el-form-item>
        <el-form-item class="line-break" label="结束值" label-width="68px">
          <div class="flex">
            <div class="color-line">
              <el-color-picker v-model="activeMaterial.colorMap.colorEnd"></el-color-picker>
              <div>{{ activeMaterial.colorMap.colorEnd }}</div>
            </div>
            <i class="el-icon-refresh-right"></i>
          </div>
        </el-form-item>
      </template>
      <!-- 透明度 -->
      <el-divider class="divider"></el-divider>
      <el-form-item label="" label-width="0">
        <el-checkbox v-model="activeMaterial.transparentMap.isShow">透明度</el-checkbox>
      </el-form-item>
      <template v-if="activeMaterial.transparentMap.isShow">
        <el-form-item label="初始值" label-width="68px">
          <div class="flex">
            <div>A</div>
            <el-input-number v-model="activeMaterial.transparentMap.transparentStart" controls-position="right"
              size="mini" @keydown.native.stop></el-input-number>
            <i class="el-icon-refresh-right"></i>
          </div>
        </el-form-item>
        <el-form-item label="结束值" label-width="68px">
          <div class="flex">
            <div>A</div>
            <el-input-number v-model="activeMaterial.transparentMap.transparentEnd" controls-position="right"
              size="mini" @keydown.native.stop></el-input-number>
            <i class="el-icon-refresh-right"></i>
          </div>
        </el-form-item>
      </template>
      <!-- 闪烁 -->
      <el-divider class="divider"></el-divider>
      <el-form-item label="" label-width="0">
        <el-checkbox v-model="activeMaterial.flickerMap.isShow">闪烁</el-checkbox>
      </el-form-item>
      <template v-if="activeMaterial.flickerMap.isShow">
        <el-form-item label="初始亮度">
          <el-input-number v-model="activeMaterial.flickerMap.flickerStart" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
          <i class="el-icon-refresh-right"></i>
        </el-form-item>
        <el-form-item label="结束亮度">
          <el-input-number v-model="activeMaterial.flickerMap.flickerEnd" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
          <i class="el-icon-refresh-right"></i>
        </el-form-item>
        <el-form-item label="闪烁频率">
          <el-input-number v-model="activeMaterial.flickerMap.flickerRate" controls-position="right" size="mini"
            @keydown.native.stop></el-input-number>
          <span class="unit">次/秒</span>
        </el-form-item>
      </template>
      <!-- 流动 -->
      <el-divider class="divider"></el-divider>
      <el-form-item label="" label-width="0">
        <el-checkbox v-model="activeMaterial.flowMap.isShow">流动</el-checkbox>
      </el-form-item>
      <el-row class="double-row">
        <el-col :span="12">
          <el-form-item label="初始值" label-width="58px">
            <i class="el-icon-refresh-right"></i>
          </el-form-item>
          <el-form-item label="横向偏移" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.xOffsetStart" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
          <el-form-item label="纵向偏移" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.yOffsetStart" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
          <el-form-item label="角度" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.angleStart" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
          <el-form-item label="横向比例" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.xScaleStart" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
          <el-form-item label="纵向比例" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.yScaleStart" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束值" label-width="58px">
            <i class="el-icon-refresh-right"></i>
          </el-form-item>
          <el-form-item label="横向偏移" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.xOffsetEnd" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
          <el-form-item label="纵向偏移" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.yOffsetEnd" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
          <el-form-item label="角度" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.angleEnd" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
          <el-form-item label="横向比例" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.xScaleEnd" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
          <el-form-item label="纵向比例" :label-width="labelWidth">
            <el-input-number v-model="activeMaterial.flowMap.yScaleEnd" controls-position="right" size="mini"
              @keydown.native.stop></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
  </div>
</template>
<script>

export default {
  data() {
    return {
      labelWidth: '60px',
      activeIndex: null,
      activeMaterial: null,
      materialForm: {
        materialList: [
          {
            name: '材质球1',
            imgPath: require('@/assets/caizhi.jpg'),
            colorMap: {
              isShow: true,
              colorStart: '#123456',
              colorEnd: '#565653',
            },
            transparentMap: {
              isShow: true,
              transparentStart: 0,
              transparentEnd: 1,
            },
            flickerMap: {
              isShow: true,
              flickerStart: 0,
              flickerEnd: 1,
              flickerRate: 1,
            },
            flowMap: {
              isShow: true,
              // 横向偏移
              xOffsetStart: 0,
              xOffsetEnd: 0,
              // 纵向偏移
              yOffsetStart: 0,
              yOffsetEnd: 0,
              // 角度
              angleStart: 0,
              angleEnd: 0,
              // 横向比例
              xScaleStart: 1,
              xScaleEnd: 1,
              // 纵向比例
              yScaleStart: 1,
              yScaleEnd: 1,
            },
          },
          {
            name: '材质球2',
            imgPath: require('@/assets/caizhi.jpg'),
            colorMap: {
              isShow: true,
              colorStart: '#000000',
              colorEnd: '#000000',
            },
            transparentMap: {
              isShow: true,
              transparentStart: 0,
              transparentEnd: 1,
            },
            flickerMap: {
              isShow: true,
              flickerStart: 0,
              flickerEnd: 1,
              flickerRate: 1,
            },
            flowMap: {
              isShow: true,
              // 横向偏移
              xOffsetStart: 0,
              xOffsetEnd: 0,
              // 纵向偏移
              yOffsetStart: 0,
              yOffsetEnd: 0,
              // 角度
              angleStart: 0,
              angleEnd: 0,
              // 横向比例
              xScaleStart: 1,
              xScaleEnd: 1,
              // 纵向比例
              yScaleStart: 1,
              yScaleEnd: 1,
            },
          },
          {
            name: '材质球3',
            imgPath: require('@/assets/caizhi.jpg'),
            colorMap: {
              isShow: true,
              colorStart: '#000000',
              colorEnd: '#000000',
            },
            transparentMap: {
              isShow: true,
              transparentStart: 0,
              transparentEnd: 1,
            },
            flickerMap: {
              isShow: true,
              flickerStart: 0,
              flickerEnd: 1,
              flickerRate: 1,
            },
            flowMap: {
              isShow: true,
              // 横向偏移
              xOffsetStart: 0,
              xOffsetEnd: 0,
              // 纵向偏移
              yOffsetStart: 0,
              yOffsetEnd: 0,
              // 角度
              angleStart: 0,
              angleEnd: 0,
              // 横向比例
              xScaleStart: 1,
              xScaleEnd: 1,
              // 纵向比例
              yScaleStart: 1,
              yScaleEnd: 1,
            },
          }
        ]
      }
    }
  },
  watch: {

  },
  computed: {},
  created() { },
  mounted() {
  },
  methods: {
    handleClick(index) {
      this.activeIndex = index;
      this.activeMaterial = this.materialForm.materialList[index];
    }
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}

.part-material {
  color: rgba(255, 255, 255, 0.7);

  i {
    font-size: 20px;
    color: #9FAFC2;
    cursor: pointer;
    vertical-align: middle;
    margin-left: 6px;
  }

  .unit {
    margin-left: 6px;
    font-size: 12px;
  }

  .divider {
    background-color: rgba(255, 255, 255, 0.22);
  }

  .material-ball {
    text-align: center;
    cursor: pointer;

    // &:hover {
    //   border: 1px solid #00C9FD;
    // }
    &.hover {
      .title {
        color: #00c9fd;
      }
    }

    img {
      border-radius: 4px;
    }

    .title {
      font-weight: 400;
      font-size: 12px;
    }
  }

  .color-line {
    display: flex;
    background: #24262B;
    border: 1px solid #727272;
    border-radius: 2px;
    padding: 2px 4px;

    /deep/.el-color-picker__trigger {
      width: 50px;
      padding: 0;
      border: 0;
      margin-right: 10px;

    }

    /deep/.el-color-picker__color {
      border: 0;
    }

    /deep/.el-color-picker__color-inner {
      border-radius: 4px;
    }
  }

  .double-row {
    /deep/.el-form-item__label {
      padding: 0;
    }
  }
}
</style>