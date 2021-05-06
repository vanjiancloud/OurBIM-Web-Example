<!--
 * @Author: zk
 * @Date: 2021-04-27 13:47:02
 * @LastEditors: zk
 * @LastEditTime: 2021-05-06 14:00:59
 * @description: 标签树
-->
<template>
  <div class="tag-tree" v-show="isTag">
    <div class="tree-title">
      <!-- 关闭 -->
      <div class="close-part">
        <i class="el-icon-close" @click="closeTag(false)"></i>
      </div>
    </div>
    <!-- 操作 -->
    <div class="handle-part">
      <el-input
        class="search-tag"
        placeholder="请输入你要搜索的内容"
        @click.native.stop
        @change="changeTag"
        @keyup.enter.native="changeTag"
        v-model="modelTag"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <img src="../../assets/images/tag/1.png" alt="" />
      <img src="../../assets/images/tag/2.png" alt="" />
    </div>
    <!-- 标签树 -->
    <div class="tree-content">
      <el-tree :props="propsTag" :load="loadTag" lazy>
        <div class="tag-slot" slot-scope="{ node }">
          <div class="upload-tag">
            <img src="../../assets/images/tag/4.png" alt="" />
          </div>
          <div class="label-tag">{{ node.label }}</div>
          <div class="handle-tag">
            <img src="../../assets/images/tag/5.png" alt="" />
            <img src="../../assets/images/tag/7.png" alt="" />
            <img src="../../assets/images/tag/6.png" alt="" />
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTag: false,
      modelTag: null,
      propsTag: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
      },
    };
  },
  methods: {
    loadTag(node, resolve) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 13:12:53
       * @description: 加载数据
       */
      if (node.level === 0) {
        return resolve([{ name: "region" }]);
      }
      if (node.level > 1) return resolve([]);
      setTimeout(() => {
        const data = [
          {
            name: "leaf",
            leaf: true,
          },
          {
            name: "zone",
          },
        ];

        resolve(data);
      }, 500);
    },
    changeTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-06 11:40:59
       * @description: 搜索
       */
      console.log(this.modelTag);
    },
    closePart(e) {
      /**
       * @Author: zk
       * @Date: 2021-04-27 13:59:02
       * @description: 全局控制显示隐藏
       */
      this.isTag = e;
    },
    closeTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 10:12:15
       * @description: 控制显示隐藏
       */
      this.closePart(e);
      this.$emit("closeTag", e);
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
  // 操作
  .handle-part {
    display: flex;
    align-items: center;
    padding: 10px 15px;

    img {
      margin-left: 10px;
      width: 20px;
      height: 20px;
    }
  }
  .tree-content {
    margin: 0 auto;
    height: ~"calc(100% - 110px)";
    width: ~"calc(100% - 30px)";
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
    .tag-slot {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      .upload-tag {
        margin-right: 10px;
        display: flex;
        align-items: center;
      }
      .label-tag {
        width: ~"calc(100% - 120px)";
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .handle-tag {
        width: 90px;
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        img {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
<style lang="less">
.search-tag {
  .el-input__inner {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
}
</style>