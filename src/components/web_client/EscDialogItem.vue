<template>
  <div class="box-wrap" v-show="visible">
    <div>按</div>
    <div class="btn">ESC</div>
    <div>{{title||'结束添加构件'}}</div>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:'结束添加构件'
    }
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    changeVisible(visible) {
      this.visible = visible;
    },
  },
};
</script>

<style lang="less" scoped>
.box-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  z-index: 999;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 2px;
  .btn {
    margin: 0 5px;
    padding: 6px;
    border: 1px solid #fff;
  }
}
</style>