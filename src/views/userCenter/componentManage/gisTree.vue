<template>
  <div class="">
    <el-tree class="set-tree" ref="refTree" empty-text="暂无数据" :data="treeParentData" :props="props"
      :expand-on-click-node="false" @check="isShowCom" :show-checkbox="true" default-expand-all highlight-current
      node-key="uuid" :filter-node-method="filterNode">
      <span class="custom-tree-node"
        :class="{ 'tree-select': node.data.uuid && activeTree && node.data.uuid === activeTree.uuid }"
        slot-scope="{node,data}" @click="handleTree(node)">
        <span class="label-span">{{ data.gisServerName }}</span>
        <!-- 删除按钮 -->
        <img v-if="data.levelType !== '0'" src="@/assets/images/tag/6.png" @click.stop="deleteCom(node)"
          class="delect-com-icon" />
        <!-- 显示状态 -->
        <span>
          <!-- <svg-icon class="icon" icon-class="freeze1" @click.stop="freezeCom(node)"/> -->
          <i class="iconfont" :class="node.checked ? 'icon-yincang1' : 'icon-xianshi2'"></i>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { getGisList } from "@/api/userCenter/componentManage.js";
import { updateEleState, focusEle, delEle } from "@/api/projectManage/element.js";
import { EventBus } from '@/utils/bus.js'

export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    search: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      props: {
        label: "gisServerName",
        children: 'glist',
        isLeaf: (e) => {//指定是否为叶子结点,叶子结点即为最后一个结点
          if (e.glist) {
            return false;
          }
          return true;
        },
      },
      treeParentData: [],//tree一级数据
      activeTree: null,//选中状态
    }
  },
  watch: {
    // search: {
    //   handler(val) {
    //     console.log(val)
    //     if (val) {
    //       this.onSearch(val)
    //     }
    //   },
    // }
  },
  computed: {},
  created() {
    this.getList()
  },
  mounted() {
    this.setBus()
  },
  destroyed() {
    EventBus.$off('onBimMessage', this.handleBus)
    EventBus.$off('onGisLayer')
  },
  // beforeDestroy(){
  //   EventBus.$off('onBimMessage')
  //   EventBus.$off('onGisLayer')
  // },
  methods: {
    setBus() {
      EventBus.$on('onBimMessage', this.handleBus)
      EventBus.$on('onGisLayer', () => {
        this.getList()
      })
    },
    handleBus(data) {
      const { id } = data
      if (id === '110') {
        this.getList()
      }
    },
    onSearch(e) {
      this.$refs.refTree.filter(e);
    },
    // 搜索过滤
    filterNode(value, data) {
      if (!value) return true;
      const reamVal = data.gisServerName.indexOf(value) !== -1;
      return reamVal;
    },
    getList() {
      getGisList({ appId: this.data.appId }).then((res) => {
        let realData = []
        res.data.forEach(ele => {
          realData.push({
            ...ele,
            uuid: ele.type == '1' ? ele.uuid : ele.id
          })
        });
        // console.log(realData)
        this.treeParentData = realData || [];
        // const realObj = this.treeParentData.find(item => item.gisServerName === '自定义GIS图元')
        // if (realObj) {
        //     this.listKey = [uuid]
        // }
        this.$nextTick(() => {
          if (this.search) {
            this.onSearch(this.search)
          }
        })
      });
    },
    isShowCom(data, e) {
      if (!data.uuid) {
        return
      }
      const params = {
        taskId: this.data.taskId,
        uuid: data.uuid,
        visible: !e.checkedKeys.includes(data.uuid)
      }
      updateEleState(params).then(() => {
        this.$message.success('指令下发成功');
      })
    },
    // 删除构件
    deleteCom(node) {
      const { gisServerName, uuid } = node.data;
      this.$confirm(`此操作删除此【${gisServerName}】图元, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delEle({
          taskId: this.data.taskId,
          uuid: uuid,
        }).then((res) => {
          this.$message.success('删除成功')
          EventBus.$emit('onGisLayer')
        });
      }).catch(() => { });
    },
    handleTree(e) {
      e.data.check = !e.data.check
      // 切换不同构件
      if (this.activeTree && (e.data.uuid !== this.activeTree.uuid)) {
        e.data.check = true
      }
      this.activeTree = e.data.check ? e.data : null
      // 选中构件或者取消选中
      this.updateEdit(e.data.uuid);
    },
    updateEdit(uuid) {
      let params = {
        taskId: this.data.taskId,
        uuid
      }
      focusEle(params).then(() => {
        this.$message.success('指令下发成功')
      })
    },
  }
}
</script>
<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  width: calc(100% - 50px);

  .label-span {
    padding-left: 5px;
    width: calc(100% - 30px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .icon,
  i,
  img {
    color: #ffffff;
    font-size: 15px;
    margin: 0 2px;
  }
}

/deep/ .el-tree {
  height: calc(100vh - 240px) !important;
  overflow: auto;

  .tree-select {
    padding: 2.5px 8px 2.5px 0;
  }

  .delect-com-icon {
    width: 15px;
    height: 15px;
  }

  .el-checkbox {
    position: absolute;
    right: 0;
  }

  .el-checkbox__inner {
    background-color: transparent !important;
    border-color: transparent !important;
  }
}
</style>
