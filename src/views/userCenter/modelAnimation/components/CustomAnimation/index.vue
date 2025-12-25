<!-- 自定义动画 
  面板层级结构 构件组模型名称-自定义动画-动作分组-动作
  构件组模型名称 1.从构件过滤器或场景中点选了构件组，构件组的名称自动添加到自定义动画的列表中（只能选择一个构件组，不支持多选和框选）
  自定义动画 2.点击新建自定义动画，弹窗输入自定义动画名称完成创建 可通过customOnTool(5)编辑名称 可创建多个动画
  动作分组 3.选择某个自定义动画后，可通过customOnTool(2)添加动作
  动作设置 4.选中某个动作 显示关键帧设置窗口 对所选动作进行设置
-->
<template>
  <div>
    <div class="filterTool">
      <el-tooltip class="item" effect="dark" content="新建自定义动画" placement="top">
        <svg-icon icon-class="animation1" class="svg" @click="customOnTool(1)"
          :class="{ 'svgGray': !activeNode.id || activeNode.data.bindGroupType !== '0' }" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加动作" placement="top">
        <svg-icon icon-class="animation2" class="svg" @click="customOnTool(2)"
          :class="{ 'svgGray': !activeNode.id || activeNode.data.bindGroupType !== '1' }" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="动作打组" placement="top">
        <svg-icon icon-class="animation3" class="svg" @click="customOnTool(3)"
          :class="{ 'svgGray': !activeNode.id || true }" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="动作解组" placement="top">
        <svg-icon icon-class="animation4" class="svg" @click="customOnTool(4)"
          :class="{ 'svgGray': !activeNode.id || true }" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="编辑" placement="top">
        <svg-icon icon-class="edit" class="svg" @click="customOnTool(5)"
          :class="{ 'svgGray': !activeNode.id || true }" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="播放预览" placement="top">
        <svg-icon icon-class="animation6" class="svg" @click="customOnTool(6)"
          :class="{ 'svgGray': !activeNode.id || true }" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="删除" placement="top">
        <svg-icon icon-class="delete" class="svg" @click="customOnTool(6)"
          :class="{ 'svgGray': !activeNode.id || true }" />
      </el-tooltip>
    </div>
    <div v-if="dataList.length">
      <el-tree class="tree" :data="dataList" :props="defaultProps" :show-checkbox="false" node-key="id"
        :expand-on-click-node="false" @node-click="handleNodeClick" ref="treeRef" :default-expanded-keys="expandedKeys"
        @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse">
        <span class="custom-tree-node" :class="{ 'treeSelect': node.id === activeNode.id }" slot-scope="{ node, data }">
          <img class="icon" :src="require('@/assets/images/animation/custom-icon1.png')" height="20px" width="20px"
            alt="" v-if="data.bindGroupType === '0'"></img>
          <img class="icon" :src="require('@/assets/images/animation/custom-icon2.png')" height="20px" width="20px"
            alt="" v-if="data.bindGroupType === '1'"></img>
          <img class="icon" :src="require('@/assets/images/animation/custom-icon3.png')" height="20px" width="20px"
            alt="" v-if="data.bindGroupType === '2'"></img>
          <span class="name">
            {{ node.label }}
          </span>

        </span>
      </el-tree>
    </div>
    <el-empty v-else :image="require('@/assets/noData1.png')" :image-size="30"
      description="请选择要创建自定义动画的模型对象组"></el-empty>

    <KeyFrameEdit ref="KeyFrameEditRef" />
  </div>
</template>

<script>
import KeyFrameEdit from './keyFrameEdit.vue';
import { getAnimationGroupList, createActorAnimationGroupBatch } from '@/api/userCenter/modelAnimation';

export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  components: { KeyFrameEdit },
  data() {
    return {
      dataList: [],
      defaultProps: {
        label: 'groupName',
        children: 'child',
      },
      activeNode: {},
      expandedKeys: [], // 保存当前展开的节点ID
    }
  },
  computed: {
    activeTreeNode() {
      return this.$store.state.customAnimation.activeTreeNode
    }
  },
  // watch: {
  //   'data.multiComponents': {
  //     async handler(newVal, oldVal) {
  //       await this.getData()
  //       if (this.activeTreeNode) {
  //         if (newVal && newVal.length > 0) {
  //           this.dataList.unshift({
  //             id: new Date().getTime(),
  //             groupName: `[临时模型组]-${new Date().getTime()}`,
  //             dataSource: '1',
  //             bindGroupType: '0',
  //             child: []
  //           })
  //         }
  //       } else {
  //         if (newVal !== oldVal && newVal.length > 0) {
  //           this.dataList.unshift({
  //             id: new Date().getTime(),
  //             groupName: `[临时模型组]-${new Date().getTime()}`,
  //             dataSource: '2',
  //             bindGroupType: '0',
  //             child: []
  //           })
  //         }
  //       }
  //     },
  //     // deep: true,
  //     // immediate: true
  //   }
  // },

  created() { },
  mounted() {
    // this.getData()
  },
  methods: {
    async getData() {
      this.activeNode = {};

      // 修改：使用 await 等待异步请求完成，并返回结果
      const res = await getAnimationGroupList({
        taskId: this.data.taskId,
        parentId: '0',
      });

      if (res.code === 0) {
        // 保存当前展开的节点ID
        const currentExpandedKeys = [...this.expandedKeys];

        this.dataList = res.data.map(item => {
          return item
        });

        // 数据更新后，恢复之前展开的节点
        // 直接更新expandedKeys，element-ui的el-tree会自动响应
        this.$nextTick(() => {
          this.expandedKeys = [...currentExpandedKeys];
        });
      }
      return res; // 返回结果，确保外部可以使用 .then()
    },
    addAnimationGroupByFilter(groupName) {
      const params = {
        taskId: this.data.taskId,
        groupName,
        parentId: '0',
        bindGroupId: this.activeTreeNode.id,
        bindGroupType: '0'
      }
      createActorAnimationGroupBatch(params).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.getData()
        }
      })
    },
    addAnimationGroupByMultiComponents(multiComponents, groupName) {
      const params = {
        taskId: this.data.taskId,
        groupName,
        parentId: '0',
      }
      const data = multiComponents.map(item => {
        return {
          actorId: item.actorId,
          actorName: item.name,
          pakId: item.pakId,
          initTransform: '0',
          animId: '0'
        }
      })
      createActorAnimationGroupBatch(params, data).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.getData()
        }
      })
    },
    addAnimationGroupByTree(groupName) {
      try {
        const params = {
          taskId: this.data.taskId,
          groupName,
          parentId: this.activeNode.data.id,
          bindGroupType: '1'
        }
        createActorAnimationGroupBatch(params).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.getData()
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    handleNodeClick(data, node, root) {
      this.activeNode = node.id === this.activeNode.id ? {} : node
      if (this.activeNode.id && data.bindGroupType === '2') {
        this.$store.commit('customAnimation/changeKeyFrameEditData', data)
        this.$refs.KeyFrameEditRef.show()
      } else {
        this.$store.commit('customAnimation/changeKeyFrameEditData', {})
        this.$refs.KeyFrameEditRef.close()
      }
    },
    // 添加自定义动画分组 1-过滤器来源 2-构件多选来源 3-自定义动画树节点来源
    addModalAnimationGroup(dataSource) {
      console.log('dataSource', dataSource)
      this.$prompt('请输入自定义动画名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (dataSource === '1') {
          this.addAnimationGroupByFilter(value)
          this.$store.commit('customAnimation/changeActiveTreeNode', null)
        }
        if (dataSource === '2') {
          this.addAnimationGroupByMultiComponents(this.data.multiComponents, value)
        }
        if (dataSource === '3') {
          this.addAnimationGroupByTree(value)
        }
      }).catch(() => {

      });
    },
    // 添加动作
    addAnimationAction() {
      this.$prompt('请输入动作名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        const params = {
          taskId: this.data.taskId,
          groupName: value,
          parentId: this.activeNode.data.id,
          bindGroupType: '2'
        }
        createActorAnimationGroupBatch(params).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.getData()
          }
        })
      }).catch(() => {

      });

    },
    customOnTool(type) {
      switch (type) {
        case 1:
          if (this.activeNode.data.dataSource === '1' || this.activeNode.data.dataSource === '2') {
            this.addModalAnimationGroup(this.activeNode.data.dataSource)
          } else if (this.activeNode.id) {
            this.addModalAnimationGroup('3')
          } else {
            this.$message({
              message: '请先选择模型对象组',
              type: 'warning'
            })
          }
          break;
        case 2:
          this.addAnimationAction()
          break;
        default:
          break;
      }
    },
    // 处理节点展开事件
    handleNodeExpand(data) {
      if (!this.expandedKeys.includes(data.id)) {
        this.expandedKeys.push(data.id);
      }
    },
    // 处理节点折叠事件
    handleNodeCollapse(data) {
      const index = this.expandedKeys.indexOf(data.id);
      if (index > -1) {
        this.expandedKeys.splice(index, 1);
      }
    },
  }
}
</script>
<style lang="less" scoped>
.filterTool {
  width: 100%;
  height: 44px;
  background: #1F1F21;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .svg {
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;
  }

  .svgGray {
    color: #747374;
    pointer-events: none;
  }
}

.tree {
  margin-top: 10px;
  height: calc(100% - 156px);
  overflow: auto;

  .svg {
    font-size: 20px;
    margin-right: 6px;
  }

  .treeSelect {
    background: rgba(255, 255, 255, 0.2);
  }

  .custom-tree-node {
    width: 100%;
    display: flex;
    overflow: hidden;
    align-items: center;

    .icon {
      margin-right: 6px;
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      flex: 1;
    }
  }

  // /deep/ .el-checkbox {
  //   position: absolute;
  //   right: 2px;
  // }

  // /deep/ .el-checkbox__inner {
  //   background-color: transparent !important;
  //   border-color: transparent !important;
  // }

  // /deep/ .el-checkbox__inner::after {
  //   display: none;
  // }

  // /deep/ .el-tree-node__checkbox {
  //   transition: none;
  // }
}
</style>