<!--
 * @Author: zk
 * @Date: 2022-09-28 13:52:03
 * @LastEditors: zk
 * @LastEditTime: 2022-11-08 13:12:26
 * @description: 
-->
<template>
  <div class="label-type">
    <div class="label-title" v-text="options.title"></div>
    <slot name="main" />
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      // Vue2 中对象/数组类型的 default 必须用工厂函数返回，避免引用共享
      default: function () {
        return {
          title: '属性'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.label-type {
  .label-title {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: bold;
    color: #4A4A4A;
    line-height: 20px;
  }
}
</style>