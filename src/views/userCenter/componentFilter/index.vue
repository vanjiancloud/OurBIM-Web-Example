<template>
  <Drawer ref="Drawer" title="对象过滤器" direction="ltr" @onClose="close()"
    :class="{ 'changeDrawerBox': $parent.checkShow('browser') }">
    <template v-slot="{ drawer }">
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
          <svg-icon icon-class="filter2" class="svg" :class="{ 'svgGray': !activeTree.id }" @click="onTool(2)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="编辑分组名称" placement="top">
          <svg-icon icon-class="filter3" class="svg" :class="{ 'svgGray': !activeTree.id }" @click="onTool(3)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="过滤条件" placement="top">
          <svg-icon icon-class="filter4" class="svg"
            :class="{ 'svgGray': !activeTree.id || activeTree.childGroup != '0' }" @click="onTool(4)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="加入" placement="top">
          <svg-icon icon-class="filter5" class="svg" :class="{ 'svgGray': canMoveIn }" @click="onTool(5)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="移出" placement="top">
          <svg-icon icon-class="filter6" class="svg" :class="{ 'svgGray': canRemove }" @click="onTool(6)" />
        </el-tooltip>
      </div>
      <el-tree class="tree" ref="tree" empty-text="暂无数据" :data="treeData" :props="props"
        :default-expanded-keys="expandedKeys" @node-expand="nodeExpand" @node-collapse="nodeCollapse"
        @check="onVisiable" :expand-on-click-node="false" :filter-node-method="filterNode" :show-checkbox="true"
        highlight-current node-key="id" :load="loadNode" :lazy="true">
        <div class="custom-tree-node" :class="{ 'treeSelect': data.id === activeTree.id }" slot-scope="{node,data}"
          @click="onTree(data)">
          <svg-icon icon-class="filterTree" class="svg" v-if="data.typeLabel == '2'" />
          <span class="name">{{ node.label }}</span>
          <div>
            <svg-icon v-if="data.typeLabel !== '3'" icon-class="filter8" class="svg" @click.stop="deleteTree(data)" />
            <svg-icon :icon-class="!node.checked ? 'filter7' : 'filter9'" class="svg" />
          </div>
        </div>
      </el-tree>

      <DialogsAddFile ref="DialogsAddFile" :data="{ ...data }" />
      <DialogsGroup ref="DialogsGroup" :data="{ ...data }" />
      <!-- 过滤条件 -->
      <FilterConditions ref="FilterConditionsRef" :data="{ ...data, groupId: activeTree.id }" @getList="getList" />
    </template>
  </Drawer>
</template>

<script>
import { getGroupListNew, getGroupList, deleteDirByid, deleteGroupById, addActorToGroup, deleteActorByid, setIsVisiable, setSelect, deleteActorByGroup, selectGroupActorJudge, delectGroupActorBatch, comFocusAll } from '@/api/userCenter/componentFilter.js'
import { EventBus } from '@/utils/bus.js'
import Drawer from "@/components/Drawer/index.vue";
import DialogsAddFile from "./DialogsAddFile.vue";
import DialogsGroup from "./DialogsGroup.vue";
import FilterConditions from './filterConditions.vue'
import { debounce } from 'lodash';
export default {
  components: { Drawer, DialogsAddFile, DialogsGroup, FilterConditions },
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
      props: {
        label: "groupName",
        isLeaf: (e) => {//指定是否为叶子结点,叶子结点即为最后一个结点
          if (e.haveGroup == "1") {
            return false;
          } else {
            return true;
          }
        },
      },
      expandedKeys: [],
      searchNodes: [],//场景点击构件时 当前树中匹配的节点信息
      canRemove: true,
      debouncedCheckRemove: null,
      canMoveIn: true,
    };
  },
  watch: {
    treeData: {
      handler(val, oldval) {
        this.debouncedCheckRemove()
        this.intoGroupGray()
      }
    },
    activeTree: {
      handler(val, oldval) {
        this.debouncedCheckRemove()
        this.intoGroupGray()
      }
    },
    "data.selectPark": {
      handler(val, oldval) {
        this.debouncedCheckRemove()
        this.intoGroupGray()
      }
    },
    "data.multiComponents": {
      handler(val, oldval) {
        this.debouncedCheckRemove()
        this.intoGroupGray()
      }
    }
  },
  computed: {},
  created() {
    this.debouncedCheckRemove = debounce(this.removeGroupGray, 300);
  },
  mounted() { },
  methods: {
    // 获得当前树已加载的节点数据
    getLoadedNodesData() {
      const root = this.$refs.tree.store.root;
      const traverse = (node) => {
        const data = { ...node.data };
        if (node.childNodes.length > 0) {
          data.children = node.childNodes.map(traverse);
        }
        return data;
      };
      return root.childNodes.map(traverse);
    },
    // 根据节点actorId 获得当前已加载节点中存在的节点信息
    findNodeByPakId(actorId, nodes) {
      const search = (nodes) => {
        const result = [];
        for (const node of nodes) {
          if (node.actorId === actorId) {
            result.push(node);
          }
          if (node.children) {
            result.push(...search(node.children));
          }
        }
        return result;
      };
      return search(nodes);
    },
    intoGroupGray() {
      if (this.activeTree.id && this.activeTree.typeLabel == '2' && (this.data.selectPark || this.data.multiComponents.length > 0)) {
        this.canMoveIn = false;
      } else {
        this.canMoveIn = true;
      }
    },
    removeGroupGray() {
      if (!this.activeTree.id) {
        this.canRemove = true;
        return;
      }
      // 分组 需要分组下有构件 并且 在模型上单选或多选了构件 并且 这些构件在分组内存在 才可移出
      if (this.activeTree.typeLabel == '2' && (this.data.selectPark || this.data.multiComponents && this.data.multiComponents.length > 0)) {
        let params = {
          taskId: this.data.taskId,
          groupId: this.activeTree.id,
        }
        let data = this.getSelectActors()
        selectGroupActorJudge(params, data).then(res => {
          this.canRemove = !res.data
        })
          .catch(error => {
            console.log(error)
            this.canRemove = true
          })
      }
      // 构件
      else if (this.activeTree.typeLabel == '3') {
        this.canRemove = false;
      }
      else {
        this.canRemove = true;
      }
    },
    // 获取模型中选中的构件信息
    getSelectActors() {
      if (this.data.selectPark) {
        return [{ actorId: this.data.selectPark.mN, pakId: this.data.selectPark.pakId }];
      }
      if (this.data.multiComponents && this.data.multiComponents.length > 0) {
        return this.data.multiComponents.map(a => ({ actorId: a.actorId, pakId: a.pakId }));
      }
      return [];
    },
    show() {
      this.$refs.Drawer.show()
      this.activeTree = {}
      this.getList()
    },
    close() {
      this.$refs.Drawer.hide()
      EventBus.$emit('eventTool', 'componentFilter')
      this.$store.commit('customAnimation/changeActiveTreeNode', null)
    },
    // 搜索
    searchContent() {
      this.$refs.tree.filter(this.search);
    },
    // 搜索过滤
    filterNode(value, data) {
      if (!value) return true;
      const reamVal = data.groupName.indexOf(value) !== -1;
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
    getList(parentId = '0') {
      getGroupListNew({ taskId: this.data.taskId, parentId }).then(res => {
        // this.treeData = this.convertToTree(res.data.map(a => {
        //   a.typeLabel = '2'
        //   return a
        // }))
        // this.treeData = this.findDataWithChildren(res.data)
        this.treeData = res.data.map(a => {
          a.typeLabel = '2';
          return a;
        })
      })
    },
    // findDataWithChildren(data) {
    //   const parentIds = new Set();
    //   const allIds = new Set();
    //   // 收集所有的 id 和父 id
    //   data.forEach(item => {
    //     allIds.add(item.id);
    //     if (item.parentId) {
    //       parentIds.add(item.parentId);
    //     }
    //   });
    //   // 找出那些 id 存在于 parentIds 中的项
    //   return data.map(item => {
    //     // console.log(parentIds,item.id,parentIds.has(String(item.id)))
    //     item.typeLabel = '2';
    //     if (parentIds.has(String(item.id))) {
    //       item.haveGroup = '1'
    //     }
    //     return item
    //   }).filter(a => {
    //     return parentIds.has(String(a.id)) || a.parentId == '0'
    //   })
    // },
    // convertToTree(data) {
    //   // 创建一个空对象用于存储每个节点，键为节点的 id
    //   const nodeMap = {};
    //   // 存储最终的树形结构
    //   const tree = [];
    //   // 第一步：遍历数据，将每个节点存储到 nodeMap 中
    //   data.forEach(item => {
    //     // 复制一份节点数据，避免修改原始数据
    //     nodeMap[item.id] = { ...item, children: [] };
    //   });
    //   // 第二步：再次遍历数据，构建树形结构
    //   data.forEach(item => {
    //     const node = nodeMap[item.id];
    //     const parentId = item.parentId;
    //     if (parentId === null || parentId === undefined || parentId == 0) {
    //       // 如果没有父节点，将该节点添加到树的根节点
    //       tree.push(node);
    //     } else {
    //       // 如果有父节点，将该节点添加到其父节点的 children 数组中
    //       const parentNode = nodeMap[parentId];
    //       if (parentNode) {
    //         parentNode.children.push(node);
    //       }
    //     }
    //   });
    //   return tree;
    // },
    async getGroupList(data) {
      let groupList = await getGroupListNew({
        taskId: this.data.taskId,
        parentId: data.id
      }).then(res => {
        // console.log('查分组', res.data)
        return res.data.map(a => {
          a.typeLabel = '2';
          return a;
        });
      })
      let list = await getGroupList({
        id: data.id,
        type: '2'
      }).then((res) => {
        // console.log('查构件',res.data)
        return res.data.map(e => {
          return {
            ...e,
            typeLabel: '3',
            groupName: e.actorName,
            haveGroup: e.haveGroup ?? '0'
          }
        })
      });
      // console.log(groupList,list)
      return [...groupList, ...list]
    },
    loadNode(node, resolve) {
      // console.log('loadNode', node)
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
          // this.$refs.DialogsAddFile.show('添加', { taskId: this.data.taskId })
          this.$refs.DialogsGroup.show('添加', { taskId: this.data.taskId, parentId: this.activeTree.parentId || 0 })
          break;
        case 2:
          // if (!this.activeTree.id || this.activeTree.typeLabel !== '1') return this.$message.warning("请先选择文件夹！");
          this.$refs.DialogsGroup.show('添加', { taskId: this.data.taskId, parentId: this.activeTree.id || 0 })
          break;
        case 3:
          if (!this.activeTree.id) return this.$message.warning("请先选择要编辑的内容！");
          if (this.activeTree.typeLabel === '1') {
            this.$refs.DialogsAddFile.show('编辑', { taskId: this.data.taskId, ...this.activeTree })
          }
          else if (this.activeTree.typeLabel === '2') {
            this.$refs.DialogsGroup.show('编辑', { taskId: this.data.taskId, parentId: this.activeTree.id, ...this.activeTree })
          }
          break;
        case 4:
          this.$refs.FilterConditionsRef.show('添加', { taskId: this.data.taskId })
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
          addActorToGroup({
            groupId: this.activeTree.id,
            taskId: this.data.taskId,
          }, actorEntityList).then(() => {
            this.$message.success('添加构件成功！')
            this.onActor()
            this.getList();
            // 查分组 查构件
            this.getGroupList({ id: this.activeTree.id }).then((res) => {
              this.$refs.tree.updateKeyChildren(this.activeTree.id, res);
            })
          })
          break;
        case 6:
          // typeLabel 2分组 3构件
          if (this.activeTree.id && this.activeTree.typeLabel == '3') {
            let data = {
              actorId: this.activeTree.actorId,
              groupId: this.activeTree.groupId,
              pakId: this.activeTree.pakId,
              taskId: this.data.taskId,
            }
            deleteActorByid(data).then(() => {
              this.$message.success('移出成功！')
              this.onActor()
              this.updateTree(this.activeTree.id);
              this.activeTree = {}
            })
          }
          // 分组内全部移出
          // else if (this.activeTree.id && this.activeTree.typeLabel == '2') {
          //   let params = {
          //     taskId: this.data.taskId,
          //     groupId: this.activeTree.id
          //   }
          //   deleteActorByGroup(params).then(() => {
          //     this.$message.success('移出成功！')
          //     this.onActor();
          //     this.getList();
          //     this.activeTree = {}
          //   })
          // }
          //  分组内根据构件信息移出
          else if (this.activeTree.id && this.activeTree.typeLabel == '2' && (this.data.selectPark || this.data.multiComponents && this.data.multiComponents.length > 0)) {
            let params = {
              taskId: this.data.taskId,
              groupId: this.activeTree.id
            }
            let data = this.getSelectActors();
            delectGroupActorBatch(params, data).then(() => {
              this.$message.success('移出成功！')
              this.getList();
              this.onActor();
              this.activeTree = {}
            })
          }
          else {
            return this.$message.warning("请先选择要移出的构件！");
          }
          // if (!this.activeTree.id || this.activeTree.typeLabel !== '3') {
          //   return this.$message.warning("请先选择要移出的构件！");
          // }
          break;

        default:
          break;
      }
    },
    onActor() {
      this.$emit('onActor')
      console.log(this.activeTree)
      const params = {
        type: this.activeTree.typeLabel,
        isSelect: '0',
        id: this.activeTree.typeLabel === '3' ? this.activeTree.actorId : this.activeTree.id,
        taskId: this.data.taskId,
        pakId: this.activeTree.typeLabel === '3' ? this.activeTree.pakId : ''
      }
      setSelect(params)
    },
    // 取消选中所有构件
    async initComFocusAll() {
      const params = {
        taskId: this.data.taskId,
        action: 'cancelSelectComponent', //cancelSelectComponent-取消选中构件 selectComponent-选中
        projectId: this.data.appId,
        uuid: 'vanjian'
      }
      return comFocusAll(params)
    },
    // 点击tree
    async onTree(data) {
      // typeLabel 2-分组 3-构件
      // console.log('点击tree', JSON.parse(JSON.stringify(data)))
      // // && this.activeTree.typeLabel == '2'
      // console.log(this.activeTree,)
      // if (this.activeTree && this.activeTree.id != data.id) {
      //   // console.log('前一个', this.activeTree)
      //   setSelect({
      //     type: this.activeTree.typeLabel,
      //     isSelect: '0',
      //     id: this.activeTree.typeLabel === '3' ? this.activeTree.actorId : this.activeTree.id,
      //     taskId: this.data.taskId,
      //     pakId: this.activeTree.typeLabel === '3' ? this.activeTree.pakId : ''
      //   }).then(() => {
      //     // this.$message.success('指令下发成功！')
      //     this.$emit('onActor')
      //     this.onTree2(data)
      //   })
      // } else {
      //   this.onTree2(data)
      // }
      this.initComFocusAll().then(() => {
        this.onTree2(data);
      })
    },
    onTree2(data) {
      if (data.id !== this.activeTree.id) {
        data.check = true
      } else {
        data.check = !data.check
      }
      if (data.check) {
        this.activeTree = data;
        this.$store.commit('customAnimation/changeActiveTreeNode', data)
        let params = {
          taskId: this.data.taskId,
          type: data.typeLabel,
          isSelect: data.check ? '1' : '0',
          id: data.typeLabel === '3' ? data.actorId : data.id,
          pakId: data.typeLabel === '3' ? data.pakId : ''
        }
        setSelect(params).then(() => {
          this.$message.success('指令下发成功！')
        })
      } else {
        this.activeTree = {};
        this.$store.commit('customAnimation/changeActiveTreeNode', null)
        this.$emit('onActor')
      }
    },
    // 删除构件后更新tree数据
    updateTree(id) {
      if (!this.$refs.tree) return
      this.$refs.tree.remove(id);
    },
    //删除
    deleteTree(item) {
      this.$confirm(`此操作删除此【${item.groupName}】, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteGroupById({
          groupId: item.id,
          taskId: this.data.taskId,
        }).then((res) => {
          this.$message.success('删除成功！')
          // this.updateTree(item.id);
          this.getList();
          if (item.id === this.activeTree.id) {
            this.activeTree = {}
          }
        });
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

  /deep/ .el-tree-node__checkbox {
    transition: none;
  }
}
</style>