<!--
 * @Author: zk
 * @Date: 2021-04-27 13:47:02
 * @LastEditors: zk
 * @LastEditTime: 2021-04-27 15:11:18
 * @description: 标签树
-->
<template>
  <div class="tag-tree" v-show="isTag">
    <div class="tree-title">
      <!-- <div class="" v-text="$t('webClient.tag.title')"></div> -->
      <div class="close-part">
        <i class="el-icon-close" @click="closePart(false)"></i>
      </div>
    </div>
    <!-- <div class="tree-content">1</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTag: false,
    };
  },
  methods: {
    closePart(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-27 13:59:02
       * @description: 控制显示隐藏
       */
      this.isTag = e;
    },
  },
};
</script>

<style lang="less" scoped>
.tag-tree {
  position: absolute;
  z-index: 9;
  height: 50vh;
  top: 0;
  width: 400px;
  margin: 2vh 0 0 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  .tree-title {
    display: flex;
    padding: 20px 15px 0 15px;
    color: #ffffff;
    .close-part {
      margin-left: auto;
      cursor: pointer;
    }
  }
  .tree-content {
    margin-top: 1vh;
    height: 40vh;
    width: 99.5%;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.3);
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.295);
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
      .label-span {
        padding-left: 5px;
      }
    }
  }
}
</style>