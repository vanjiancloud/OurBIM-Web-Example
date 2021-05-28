<!--
 * @Author: zk
 * @Date: 2021-05-25 14:55:54
 * @LastEditors: zk
 * @LastEditTime: 2021-05-28 17:02:27
 * @description: 
-->
<template>
  <div class="el-bg-inner-running">
    <el-progress
      type="line"
      :percentage="getProgress.data ? getProgress.data : 0"
      :stroke-width="16"
      :text-inside="true"
    >
    </el-progress>
    <div class="load-tip">
      BIM模型加载中…
    </div>
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
  },
};
</script>
<style lang="less">
/* 渐变进度条 */
.el-bg-inner-running {
  position: absolute;
  bottom: 80px;
  width: 20%;
  left: 40%;
  .el-progress__text {
    color: #fff;
    font-size: 8px;
  }
  .el-progress-bar__outer {
      // height: 6px!important;
      background-color: rgba(0, 0, 0, 0.6);
    }
    .el-progress-bar__inner {
      line-height: 0;
      background-color: #00AAF0;
    }
  .load-tip{
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    margin: 10px 0;
    padding: 5px;
    font-size: 0.75rem;
    letter-spacing: 2px;
    text-align: center;
  }
}
</style>