<template>
  <div>
    <a-button type="link" class="a_blue" @click="handleOk(row)"
      >一键复制</a-button
    >
    <iframe
      class="hidden"
      id="copyFrame"
      ref="copyFrame"
      name="copyFrame"
      frameborder="0"
      scrolling="no"
      src="/public/copy/copy.html"
    ></iframe>
  </div>
</template>

<script>
export default {
  handleOk (row) {
    // console.log(row) //接收需要传递的参数
    const obj1 = window.frames['copyFrame'] // 获得对应iframe的window对象
    obj1.makeimg = row.url //传入图片地址
    obj1.domakeimg() //执行复制函数
    this.$message.success('复制成功!') //进行反馈
  }
}
</script>

<style lang="less" scoped>
.hidden {
  width: 0;
  height: 0;
  opacity: 0;
  position: absolute;
  top: -1000%;
  left: -1000%;
  z-index: -9999999;
}
</style>
