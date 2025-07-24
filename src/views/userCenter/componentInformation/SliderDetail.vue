<!--
 * @Author: zk
 * @Date: 2022-09-28 14:04:49
 * @LastEditors: zk
 * @LastEditTime: 2023-05-18 11:10:57
 * @LastEditTime: 2023-01-17 11:26:03
 * @description: 拖动滑块（Vue2 版本）
-->
<template>
  <div class="slider-box">
    <div class="slider-label" v-text="options.label"></div>
    <div class="slider-main">
      <!-- 滑块 -->
      <el-slider v-model="sliderVal" :min="setNum(options.min)" :max="setNum(options.max)"
        :step="(setNum(options.max) < 10 ? 0.1 : 1)" @change="onChange" />
      <!-- 输入框 -->
      <el-input v-model="inputVal" @change="onChangeNum" size="small" />
      <!-- 单位 -->
      <div class="slider-unit" v-text="options.unit"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function () { // Vue2 中对象默认值需用函数返回
        return {
          label: '',
          min: '',
          max: '',
          paramName: '',
          paramValue: '',
          unit: ''
        }
      }
    }
  },
  data() { // 响应式数据定义在 data 函数中
    return {
      timer: null,
      sliderVal: Number(this.options.paramValue), // 初始化值从 props 中获取
      inputVal: Number(this.options.paramValue)
    }
  },
  methods: { // 方法统一放在 methods 中
    onChangeNum() {
      this.options.paramValue = this.inputVal // 注意：直接修改 props 可能触发 Vue2 警告，需确保父组件同步更新
      this.$emit('onChange', this.options) // Vue2 中通过 $emit 触发事件
    },
    onChange() {
      this.inputVal = this.options.paramValue
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        const options = JSON.parse(JSON.stringify(this.options)) // 深拷贝避免影响原始 props
        this.inputVal = this.sliderVal
        this.options.paramValue = this.sliderVal
        this.$emit('onChange', options)
      }, 600)
    },
    setNum(e) {
      return Number(e) || 0
    }
  },
  watch: { // 监听 props 变化
    'options.paramValue'(newVal) { // Vue2 中监听对象属性需用字符串路径
      this.sliderVal = Number(newVal)
      this.inputVal = Number(newVal)
    }
  }
}
</script>

<style lang="less" scoped>
// 样式部分与 Vue3 完全兼容，无需修改
.slider-box {
  margin-bottom: 20px;
  color: #C2C2C4;

  .slider-label {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  .slider-main {
    display: flex;
    align-items: center;


    /deep/ .el-slider {
      width: 70%;

      .el-slider__runway.show-input {
        margin-right: 80px;
      }

      .el-slider__runway,
      .el-slider__bar {
        height: 3px;
      }

      .el-slider__runway {
        margin: 12px 0;
      }

      .el-slider__button {
        width: 10px;
        height: 10px;
      }

      .el-slider__button-wrapper {
        top: -11px;
      }

      .el-slider__bar {
        background: #18ACFB;
      }
    }

    .el-input {
      flex: 1;
    }

    .slider-unit {
      flex: 0 0 30px;
      text-align: center;
      font-size: 12px;
      font-weight: 400;
    }
  }
}
</style>
<style lang="less">
// 全局样式部分保持不变
.slider-box {
  .el-input-number {
    width: 66px;

    .el-input__wrapper {
      box-shadow: 0 0 0 1px #DDDFE6 inset;
      border-radius: 1px;
    }
  }

  .el-slider__runway {
    margin-right: 10px;
    height: 2px;
  }

  .el-slider__bar {
    height: 2px;
  }

  .el-slider__button-wrapper {
    height: 8px;
    width: 8px;
    top: -9px;

    .el-slider__button {
      width: 100%;
      height: 100%;
      border: 1px solid #0089D1;
    }
  }
}
</style>