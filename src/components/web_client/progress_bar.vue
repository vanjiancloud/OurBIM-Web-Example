<!--
 * @Author: zk
 * @Date: 2021-05-25 14:55:54
 * @LastEditors: zk
 * @LastEditTime: 2021-05-25 15:48:17
 * @description: 
-->
<template>
  <div>
    <el-progress
      type="line"
      :percentage="getProgress.data"
      :stroke-width="16"
      class="el-bg-inner-running"
      :text-inside="true"
    >
    </el-progress>
  </div>
</template>

<script>
export default {
  props: {
    propsProgress: {
      type: Object,
      default: () => {}
    },
  },
  watch: {
    propsProgress(newValue, oldValue) {
      console.log(newValue);
    }
  },
  data() {
    return {
      getProgress: null
    }
  },
  created () {
    this.getProgress = this.propsProgress
    console.log(this.getProgress);
  },
};
</script>
<style lang="less">
/* 渐变进度条 */
.el-bg-inner-running {
  position: absolute;
  bottom: 110px;
  width: 20%;
  left: 40%;
  .el-progress__text {
    color: #fff;
    font-size: 8px;
  }
  .el-progress-bar__outer {
    // height: 6px!important;
    background-color: #002c3d;
  }
  .el-progress-bar__inner {
    line-height: 0;
    background-color: unset;
    background-image: linear-gradient(to right, #84f3ff, #0ce6fab2);
  }
}
</style>