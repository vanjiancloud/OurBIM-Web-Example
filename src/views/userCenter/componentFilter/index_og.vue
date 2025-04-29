<template>
  <Drawer ref="Drawer" title="对象过滤器" direction="ltr" @onClose="close()"
    :class="{ 'changeDrawerBox': $parent.checkShow('browser') }">
    <div class="search">
      <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search"
        @change="searchContent()" @keydown.native.stop>
      </el-input>
    </div>
    <div class="filterTool">
      <el-tooltip class="item" effect="dark" content="添加同级分组" placement="top">
        <svg-icon icon-class="filter1" class="svg" @click="onTool(1)" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加子级分组" placement="top">
        <svg-icon icon-class="filter2" class="svg" :class="{ 'svgGray': activeTree.typeLabel !== '1' }"
          @click="onTool(2)" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="编辑分组名称" placement="top">
        <svg-icon icon-class="filter3" class="svg" :class="{ 'svgGray': !activeTree.id }" @click="onTool(3)" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="过滤条件" placement="top">
        <svg-icon icon-class="filter4" class="svg" :class="{ 'svgGray': !activeTree.id }" @click="onTool(4)" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="加入" placement="top">
        <svg-icon icon-class="filter5" class="svg" :class="{ 'svgGray': activeTree.typeLabel !== '2' }"
          @click="onTool(5)" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="移出" placement="top">
        <svg-icon icon-class="filter6" class="svg" :class="{ 'svgGray': activeTree.typeLabel !== '3' }"
          @click="onTool(6)" />
      </el-tooltip>
    </div>
    <el-tree class="tree" ref="tree" empty-text="暂无数据" :data="treeData" :props="props"
      :default-expanded-keys="expandedKeys" @node-expand="nodeExpand" @node-collapse="nodeCollapse" @check="onVisiable"
      :expand-on-click-node="false" :load="loadNode" :filter-node-method="filterNode" :show-checkbox="true"
      highlight-current node-key="id" :lazy="true">
      <div class="custom-tree-node" :class="{ 'treeSelect': data.id === activeTree.id }" slot-scope="{node,data}"
        @click="onTree(data)">
        <svg-icon icon-class="filterTree" class="svg" />
        <span class="name">{{ node.label }}</span>
        <div>
          <svg-icon v-if="data.typeLabel !== '3'" icon-class="filter8" class="svg" @click.stop="deleteTree(data)" />
          <svg-icon v-if="data.haveGroup !== '0'" :icon-class="!node.checked ? 'filter7' : 'filter9'" class="svg" />
        </div>
      </div>
    </el-tree>


    <DialogsAddFile ref="DialogsAddFile" />
    <DialogsGroup ref="DialogsGroup" />
  </Drawer>
</template>

<script>
import { getDirList, getGroupList, deleteDirByid, deleteGroupById, addActorToGroup, deleteActorByid, setIsVisiable, setSelect } from '@/api/userCenter/componentFilter.js'
import { EventBus } from '@/utils/bus.js'
import Drawer from "@/components/Drawer/index.vue";
import DialogsAddFile from "./DialogsAddFile.vue";
import DialogsGroup from "./DialogsGroup.vue";
export default {
  components: { Drawer, DialogsAddFile, DialogsGroup },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      search: '',
      treeData: [],
      activeTree: {},
      activeNode: null,
      props: {
        label: "dirName",
        isLeaf: (e) => {//指定是否为叶子结点,叶子结点即为最后一个结点
          if (e.haveGroup === "1") {
            return false;
          } else {
            return true;
          }
        },
      },
      expandedKeys: [],
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    show() {
      this.$refs.Drawer.show()
      this.activeTree = {}
      this.getList()
    },
    close() {
      this.$refs.Drawer.hide()
      EventBus.$emit('eventTool', 'componentFilter')
    },
    // 搜索
    searchContent() {
      this.$refs.tree.filter(this.search);
    },
    // 搜索过滤
    filterNode(value, data) {
      if (!value) return true;
      const reamVal = data.dirName.indexOf(value) !== -1;
      return reamVal;
    },
    // 节点被展开时触发
    nodeExpand(data) {
      this.expandedKeys.push(data.id)
    },
    // 节点被关闭时触发
    nodeCollapse(data) {
      let index = this.expandedKeys.indexOf(data.id)
      this.expandedKeys.splice(index, 1)
    },
    getList() {
      getDirList({ taskId: this.data.taskId }).then(res => {
        this.treeData = res.data
      })
    },
    getGroupList(data) {
      let params = {
        id: data.id,
        type: data.typeLabel
      }
      let list = getGroupList(params).then((res) => {
        if (data.typeLabel === '1') {
          let result = JSON.parse(res.data.groupList) || [];
          return result.map(e => { return { ...e, typeLabel: '2', dirName: e.groupName, haveGroup: '1', } })
        }
        if (data.typeLabel === '2') {
          return res.data.map(e => { return { ...e, typeLabel: '3', dirName: e.actorName, } })
        }
      });
      return list
    },
    loadNode(node, resolve) {
      if (node.level !== 0) {
        this.getGroupList(node.data).then((res) => {
          return resolve(res);
        }).catch(() => {
          return resolve([]);
        });
      }
    },
    onTool(type) {
      switch (type) {
        case 1:
          this.$refs.DialogsAddFile.show('添加', { taskId: this.data.taskId })
          break;
        case 2:
          if (!this.activeTree.id || this.activeTree.typeLabel !== '1') return this.$message.warning("请先选择文件夹！");
          this.$refs.DialogsGroup.show('添加', { taskId: this.data.taskId, parentId: this.activeTree.id })
          break;
        case 3:
          if (!this.activeTree.id) return this.$message.warning("请先选择要编辑的内容！");
          if (this.activeTree.typeLabel === '1') {
            this.$refs.DialogsAddFile.show('编辑', { taskId: this.data.taskId, ...this.activeTree })
          } if (this.activeTree.typeLabel === '2') {
            this.$refs.DialogsGroup.show('编辑', { taskId: this.data.taskId, parentId: this.activeTree.id, ...this.activeTree })
          }
          break;
        case 4:
          console.log('过滤条件')
          break
        case 5:
          if (!this.activeTree.id || this.activeTree.typeLabel !== '2') {
            return this.$message.warning("请先选择要移入的分组！");
          }
          if (!this.data.selectPark && !this.data.multiComponents.length) {
            return this.$message.warning("请点击选择构件！");
          }
          let actorEntityList = []
          if (this.data.multiComponents.length) {
            actorEntityList = this.data.multiComponents.map(e => { return { ...e, groupId: this.activeTree.id, actorName: e.name || '自定义构件', initTransform: 0, animId: 0 } })
          } else {
            actorEntityList = [{
              actorId: this.data.selectPark.mN,
              groupId: this.activeTree.id,
              actorName: this.data.memberInfo?.[0]?.value,
              pakId: this.data.selectPark.pakId,
              initTransform: 0,
              animId: 0
            }]
          }
          addActorToGroup({ groupId: this.activeTree.id }, actorEntityList).then(() => {
            this.$message.success('添加构件成功！')
            this.onActor()
            // this.getGroupList({ typeLabel: '2', id: this.activeTree.id }).then((res) => {
            //   this.$refs.tree && this.$refs.tree.updateKeyChildren(this.activeTree.id, res);
            // })
          })
          break;
        case 6:
          if (!this.activeTree.id || this.activeTree.typeLabel !== '3') {
            return this.$message.warning("请先选择要移出的构件！");
          }
          let data = {
            actorId: this.activeTree.actorId,
            groupId: this.activeTree.groupId,
            pakId: this.activeTree.pakId
          }
          deleteActorByid(data).then(() => {
            this.$message.success('移出成功！')
            this.onActor()
            this.updateTree(this.activeTree.id);
            this.activeTree = {}
          })
          break;

        default:
          break;
      }
    },
    onActor() {
      this.$emit('onActor')
      const params = {
        type: 3,
        isSelect: '0',
        id: this.activeNode?.actorId || this.data.selectPark.mN,
        taskId: this.data.taskId,
        pakId: this.activeNode?.pakId || this.data.selectPark.pakId
      }
      setSelect(params)
    },
    // 点击tree
    onTree(data) {
      this.activeNode = data
      data.check = !data.check
      if (data.id !== this.activeTree.id) {
        data.check = true
      }
      this.activeTree = data.check ? data : {}

      let params = {
        type: data.typeLabel,
        isSelect: data.check ? '1' : '0',
        id: data.typeLabel === '3' ? data.actorId : data.id,
        taskId: this.data.taskId,
        pakId: data.typeLabel === '3' ? data.pakId : ''
      }
      setSelect(params).then(() => {
        this.$message.success('指令下发成功！')
      })
    },
    // 删除构件后更新tree数据
    updateTree(id) {
      if (!this.$refs.tree) return
      this.$refs.tree.remove(id);
    },
    //删除
    deleteTree(item) {
      this.$confirm(`此操作删除此【${item.dirName}】, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (item.typeLabel === '1') {
          deleteDirByid({ dirId: item.id }).then((res) => {
            this.$message.success(res.message)
            this.updateTree(item.id);
            if (item.id === this.activeTree.id) {
              this.activeTree = {}
            }
          });
        }
        if (item.typeLabel === '2') {
          deleteGroupById({ groupId: item.id }).then((res) => {
            this.$message.success(res.message)
            this.updateTree(item.id);
            if (item.id === this.activeTree.id) {
              this.activeTree = {}
            }
          });
        }
      }).catch(() => { });
    },
    // 设置分组文件夹、分组下构件的可见性
    onVisiable(data, e) {
      let params = {
        type: data.typeLabel,
        isVisiable: !e.checkedKeys.includes(data.id) ? 1 : 0,
        id: data.typeLabel === '3' ? data.actorId : data.id,
        pakId: data.pakId,
        taskId: this.data.taskId
      }
      setIsVisiable(params).then(() => {
        this.$message.success('指令下发成功！')
      })
    }
  }
};
</script>
<style lang="less" scoped>
.changeDrawerBox {
  height: 50vh;
  top: initial;
  bottom: 0;
  border-top: 1px solid #747374;
}

.search {
  margin: 8px 10px !important;
}

.filterTool {
  width: 100%;
  height: 44px;
  background: #1F1F21;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

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

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      flex: 1;
    }
  }

  /deep/ .el-checkbox {
    position: absolute;
    right: 2px;
  }

  /deep/ .el-checkbox__inner {
    background-color: transparent !important;
    border-color: transparent !important;
  }

  /deep/ .el-checkbox__inner::after {
    display: none;
  }
}
</style>