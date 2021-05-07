<!--
 * @Author: zk
 * @Date: 2021-04-27 13:47:02
 * @LastEditors: zk
 * @LastEditTime: 2021-05-07 18:26:27
 * @description: 标签树
-->
<template>
  <div class="tag-tree" v-if="isTag">
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
      <img src="../../assets/images/tag/1.png" @click="saveTag(0)" alt="" />
      <img src="../../assets/images/tag/2.png" @click="saveTag(1)" alt="" />
    </div>
    <!-- 标签树 -->
    <div class="tree-content" v-if="getProps">
      <el-tree
        ref="refTag"
        :props="propsTag"
        :expand-on-click-node="false"
        :highlight-current="true"
        :empty-text="treeEmpty"
        :filter-node-method="filterNode"
        node-key="id"
        :load="loadTag"
        lazy
      >
        <div
          class="tag-slot"
          :class="
            activeTree && node.data.id === activeTree.id && activeLeaf
              ? 'tree-select'
              : ''
          "
          slot-scope="{ node }"
        >
          <div class="upload-tag">
            <img src="../../assets/images/tag/4.png" alt="" />
          </div>
          <div class="label-tag" @click="handleTag(node)">{{ node.label }}</div>
          <div class="handle-tag">
            <img
              src="../../assets/images/tag/5.png"
              @click="editTag(node)"
              alt=""
            />
            <img
              v-if="node.data.isFolder === '0'"
              @click="locationTag(node)"
              src="../../assets/images/tag/7.png"
              alt=""
            />
            <img
              src="../../assets/images/tag/6.png"
              @click="removeTag(node)"
              alt=""
            />
          </div>
        </div>
      </el-tree>
    </div>
    <!-- 修改标签 -->
    <el-dialog
      :title="dialogPointData.title"
      :visible.sync="dialogEdit"
      :close-on-click-modal="false"
      append-to-body
      width="20%"
    >
      <el-form v-if="tagInfo" :model="tagInfo" :rules="rulesTag" ref="rulesTag">
        <el-form-item
          :label="dialogPointData.label"
          label-width="60px"
          prop="fileName"
        >
          <el-input @click.native.stop v-model="tagInfo.fileName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogEdit = false"
          v-text="dialogPointData.cancel"
        ></el-button>
        <el-button
          type="primary"
          @click="updateTag"
          v-text="dialogPointData.confirm"
        ></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TAGTREE from "../../api/tag_tree";

export default {
  props: {
    setProps: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    setProps: {
      handler() {
        if (this.setProps.taskId) {
          this.getProps = this.setProps;
          this.listTag().then((res) => {
            this.defaultTag = res[0];
          });
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep: true,
    },
  },
  data() {
    return {
      defaultTag: null,
      activeLeaf: false,
      activeTree: null,
      rulesTag: {
        fileName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
      dialogPointData: {
        title: "提示",
        label: "名称",
        confirm: "确认",
        cancel: "取消",
        successMessage: "修改成功！",
        saveMessage: "添加成功！",
      },
      dialogEdit: false,
      tagInfo: null,
      tagNode: null,
      isTag: false,
      modelTag: null,
      getProps: null,
      propsTag: {
        label: "fileName",
        isLeaf: (e) => {
          if (e.isFolder === "1") {
            return false;
          }
          if (e.isFolder === "0") {
            return true;
          }
        },
      },
      treeEmpty: this.$t("webClient.browser.tips[0]"),
    };
  },
  methods: {
    handleTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 17:05:24
       * @description: 操作标签栏
       */
      if (this.activeTree) {
        if (this.activeTree.id === e.data.id) {
          this.activeLeaf = this.activeLeaf ? false : true;
        } else {
          this.activeLeaf = true;
        }
      } else {
        this.activeLeaf = true;
      }
      this.activeTree = e.data;
    },
    editTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 10:18:25
       * @description: 修改标签弹窗
       */
      this.$emit("setListenClick", false);
      this.tagInfo = JSON.parse(JSON.stringify(e.data));
      this.tagNode = e;
      this.dialogEdit = true;
    },
    updateTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-07 10:18:25
       * @description: 更新标签
       */
      let params = {
        taskid: this.getProps.taskId,
        tagId: this.tagInfo.id,
        tagName: this.tagInfo.fileName,
      };
      TAGTREE.UPDATETAG(params)
        .then((res) => {
          this.dialogEdit = false;
          this.tagNode.data.fileName = this.tagInfo.fileName;
          this.$refs.refTag.updateKeyChildren(this.tagNode.key, this.tagNode);
          this.$emit("setListenClick", true);
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    locationTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 10:18:09
       * @description: 定位标签
       */
    },
    removeTag(node) {
      /**
       * @Author: zk
       * @Date: 2021-05-07 09:22:44
       * @description: 删除标签
       */
      this.$emit("setListenClick", false);
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("setListenClick", true);
          let params = {
            taskid: this.getProps.taskId,
            tagId: node.key,
          };
          TAGTREE.REMOVERTAG(params)
            .then((res) => {
              this.listTag().then((listRes) => {
                this.defaultTag = listRes[0];
              });
              this.$refs.refTag.remove(node);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$emit("setListenClick", true);
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    saveTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 18:07:38
       * @description: 新增 0 标签 1 标签集
       */
      // 判断是否可以新增
      if (this.activeLeaf && this.activeTree.isFolder === "0") {
        this.$message({
          type: "warning",
          message: "请先选择标签组",
        });
        return;
      }

      let params = {
        taskid: this.getProps.taskId,
      };
      this.activeLeaf ? (params.tagId = this.activeTree.id) : "";

      if (e === 0) {
        TAGTREE.SAVETAG(params)
          .then(() => {
            this.listTag().then(() => {
              this.$refs.refTag.getNode(
                this.activeLeaf ? this.activeTree.id : this.defaultTag.id
              ).parent.loaded = false;
              this.$refs.refTag.getNode(this.activeLeaf ? this.activeTree.id : this.defaultTag.id).parent.expand();
            });
          })
          .catch((err) => {
          });
      } else {
        TAGTREE.SAVETAGGATHER(params)
          .then(() => {
            this.listTag().then(() => {
              this.$refs.refTag.getNode(
                this.activeLeaf ? this.activeTree.id : this.defaultTag.id
              ).parent.loaded = false;
              this.$refs.refTag
                .getNode(
                  this.activeLeaf ? this.activeTree.id : this.defaultTag.id
                )
                .parent.expand();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    async listTag(e) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 16:33:20
       * @description: 获取标签树
       */
      let params = {
        taskid: this.getProps.taskId,
      };
      e ? (params.tagId = e) : "";
      let realTag = await TAGTREE.LISTTAG(params)
        .then((res) => {
          if (res.data.code === 0) {
            return res.data.data;
          } else {
            return [];
          }
        })
        .catch((err) => {
          return [];
        });
      return realTag;
    },
    loadTag(node, resolve) {
      /**
       * @Author: zk
       * @Date: 2021-05-06 13:12:53
       * @description: 加载数据
       */
      if (node.level === 0) {
        this.listTag(node.key).then((res) => {
          if (res.length > 0) {
            this.defaultTag = res[0];
            return resolve(res);
          } else {
            this.treeEmpty = this.$t("webClient.browser.tips[1]");
          }
        });
      }
      if (node.level >= 1) {
        this.listTag(node.key).then((res) => {
          if (res.length > 0) {
            return resolve(res);
          } else {
            this.treeEmpty = this.$t("webClient.browser.tips[1]");
            return resolve([]);
          }
        });
      }
    },
    changeTag() {
      /**
       * @Author: zk
       * @Date: 2021-05-06 11:40:59
       * @description: 搜索
       */
      this.$refs.refTag.filter(this.modelTag);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fileName.indexOf(value) !== -1;
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
    padding: 10px;

    img {
      margin-left: 10px;
      width: 20px;
      height: 20px;
    }
  }
  .tree-content {
    margin: 0 auto;
    height: ~"calc(100% - 110px)";
    width: ~"calc(100% - 20px)";
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
        justify-content: flex-end;
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
.tree-select {
  background: rgba(255, 255, 255, 0.2);
}
</style>