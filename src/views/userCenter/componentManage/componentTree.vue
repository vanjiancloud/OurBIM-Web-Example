<!-- 构件树 -->
<template>
  <Drawer ref="Drawer" title="模型浏览器" direction="ltr" @onClose="close()"
    :class="{ 'changeDrawerBox': $parent.checkShow('componentFilter') }">
    <template v-slot="{ drawer }">
      <Tab v-model="tabValue" :data="tabList" @onTab="onTab" />
      <el-row v-if="data.isGis && tabValue == 1">
        <el-col :span="10" class="t-c">
          <el-button type="text" icon="el-icon-paperclip" @click="onLink">管理链接</el-button>
        </el-col>
        <el-col :span="14" class="t-c">
          <el-button type="text" icon="el-icon-circle-plus-outline" @click="onDialog">创建GIS遮罩图元</el-button>
          <el-button type="text" icon="el-icon-s-tools" @click="onSet"></el-button>
        </el-col>
      </el-row>
      <div class="search">
        <el-input v-model="search" size="mini" placeholder="请输入您要搜索的内容" prefix-icon="el-icon-search"
          @change="searchContent()" @keydown.native.stop>
        </el-input>
      </div>
      <!-- 树 -->
      <el-tree v-if="drawer && tabValue === 0" class="set-tree" ref="tree" empty-text="暂无数据" :props="props"
        :expand-on-click-node="false" :load="loadNode" @check="isShowCom" :filter-node-method="filterNode"
        :show-checkbox="true" highlight-current node-key="uuid" lazy>
        <span class="custom-tree-node" :class="{ 'tree-select': activeTree && node.data.uuid === activeTree.uuid }"
          slot-scope="{node,data}" @click="handleTree(node)">
          <span class="label-span">{{ node.label }}</span>
          <!-- 删除按钮 -->
          <img src="@/assets/images/tag/6.png" @click.stop="deleteCom(node)" class="delect-com-icon"
            v-if="data.typeId === 'comp'" />
          <!-- 开锁和闭锁 -->
          <span v-if="node.level === 1 && (appType === '3' || appType === '0') && !node.data.typeId">
            <i class="iconfont" :class="data.lockCheck ? 'icon-24gl-unlock4' : 'icon-24gl-lock2'"
              @click.stop="toggleLock(data)"></i>
          </span>
          <!-- 显示状态 -->
          <span>
            <!-- <svg-icon class="icon" icon-class="freeze1" @click.stop="freezeCom(node)"/> -->
            <i class="iconfont" :class="node.checked ? 'icon-yincang1' : 'icon-xianshi2'"></i>
          </span>
        </span>
      </el-tree>

      <!-- 构件操作图标 -->
      <OperatingTools ref="OperatingTools" v-if="drawer && hasLock()" :data="data" />

      <GisTree ref="refGis" v-if="drawer && tabValue === 1" :data="data" :search="search" />
      <dialog-link ref="refLink" :GISModel="ListLinkGISModel" :data="data" />
      <dialog-set ref="refSet" :data="data" />
    </template>
  </Drawer>
</template>

<script>
import Tab from "@/components/Tab/index.vue";
import { getList as getGISProjectList } from "@/api/projectManage/GISList.js";
import { getProjectList } from "@/api/projectManage/model.js";
import { addEle } from "@/api/projectManage/element.js";
import { doAction, setGizmoMode } from "@/api/userCenter/index";
import { getComponents, lockAfterInfo, lockControl, freezeCom, deleteCustomCom, focusComponent, controlComShowOrHide, getModelLocation } from "@/api/userCenter/componentManage.js";
import Drawer from "@/components/Drawer/index.vue";
import OperatingTools from "@/components/OperatingTools";
import { EventBus } from '@/utils/bus.js'
import GisTree from './gisTree.vue'
import dialogLink from '@/views/projectManage/model/dialogLink.vue'
import DialogSet from './DialogSet'
export default {
  components: {
    Drawer, OperatingTools, Tab, GisTree, dialogLink,
    DialogSet
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    // 构件数据
    memberInfo: {
      type: Array,
      require: false,
      default: () => []
    }
  },
  data() {
    return {
      tabValue: 0,
      ListLinkGISModel: [],
      listApp: [],
      tabList: [
        {
          name: "BIM模型",
        },
        {
          hidden: !this.data.isGis,
          name: "GIS数据服务",
        },
      ],
      appType: null,
      search: '',
      treeParentData: [],//tree一级数据
      props: {
        label: "name",
        isLeaf: (e) => {//指定是否为叶子结点,叶子结点即为最后一个结点
          if (e.haveChild === "1") {
            return false;
          }
          if (e.haveChild === "0") {
            return true;
          }
        },
      },
      activeTree: null,//选中状态
      componentVisibility: JSON.parse(sessionStorage.getItem(`componentVisibility_${this.data.taskId}`)) || {},
    };
  },
  watch: {},
  computed: {
    userId() {
      return this.$route.query.userId || JSON.parse(sessionStorage.getItem("userid")) || 'travels'
    },
  },
  created() {
    this.appType = this.$route.query.appType
    this.getGISProject()
    this.getModelList()
  },
  mounted() {
    // if(this.data.isGis){
    //     this.tabList[1].hidden = true
    // }
  },
  beforeDestroy() {
    // 组件卸载前将状态保存到sessionStorage
    sessionStorage.setItem(`componentVisibility_${this.data.taskId}`, JSON.stringify(this.componentVisibility));
  },
  methods: {
    onSet() {
      this.$refs.refSet.show()
    },
    onDialog() {
      const params = {
        taskId: this.data.taskId
      }
      addEle(params)
    },
    // 获取模型列表
    getModelList() {
      getProjectList({
        userid: this.userId,
        isHandle: 1,
        appIdList: this.data.appId
      }).then(res => {
        this.listApp = res.data.list[0]
      })
    },
    getGISProject() {
      getGISProjectList({ userId: this.userId }).then(res => {
        // 只显示status为2的数据
        this.ListLinkGISModel = res.data?.list && res.data.list.filter(item => item.status === '2') || []
      })
    },
    show() {
      this.$refs.Drawer.show()
    },
    close() {
      this.$refs.Drawer.hide()
      EventBus.$emit('eventTool', 'browser')
    },
    onLink() {
      this.$refs.refLink.show(this.listApp)
    },
    onTab(e) {
      this.tabValue = e.index
    },
    // 搜索
    searchContent() {
      if (this.tabValue === 0) {
        this.$refs.tree.filter(this.search);
      } else {
        this.$refs.refGis.onSearch(this.search);
      }
    },
    // 搜索过滤
    filterNode(value, data) {
      if (!value) return true;
      const reamVal = data.name.indexOf(value) !== -1;
      return reamVal;
    },
    //遍历是否有锁打开了
    hasLock() {
      let index = this.treeParentData.findIndex(e => { return e.lockCheck })
      return index > -1
    },
    // 获取树列表
    async getList(node) {
      let params = {
        appliId: node?.data?.projectId || this.data.appId,
        uuid: node && node.key,
        pageNo: 1,
        pageSize: 20,
      };
      let list = await getComponents(params).then((res) => {
        return res.data || [];
      });

      return list;
    },
    // 加载子树数据的方法，仅当 lazy 属性为true 时生效
    loadNode(node, resolve) {
      this.getList(node).then((res) => {
        // if (node.level === 0) {
        //   this.treeParentData = res
        // }
        // res.length && res.forEach((item) => {
        //   // // 点击锁🔒
        //   // this.$set(item, 'lockCheck', false)
        //   // //选中聚焦
        //   // this.$set(item, 'check', false)
        // });
        // return resolve(res);
        if (node.level === 0) {
          this.treeParentData = res;
        }
        res.length && res.forEach((item) => {
          // 点击锁🔒
          this.$set(item, 'lockCheck', false)
          //选中聚焦
          this.$set(item, 'check', false)
        });
        resolve(res); // 先将数据传递给树组件渲染

        // 节点渲染完成后设置选中状态（关键修改）
        this.$nextTick(() => {
          // 生成需要选中的uuid列表（根据缓存）
          const checkedKeys = Object.keys(this.componentVisibility)
            .filter(uuid => this.componentVisibility[uuid]);
          // 调用setCheckedKeys设置选中状态
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedKeys(checkedKeys);
          }
        });
      }).catch(() => {
        return resolve([]);
      });
    },
    // 点击聚焦操作
    handleTree(e) {
      e.data.check = !e.data.check
      // 切换不同构件
      if (this.activeTree && (e.data.uuid !== this.activeTree.uuid)) {
        e.data.check = true
      }
      this.activeTree = e.data.check ? e.data : null
      // 新增俩个属性放在最前面
      if (e.data?.dynamicData?.length) {
        e.data.dynamicData = [{ name: '构件ID', value: e.data.revitCode }, { name: '构件名称', value: e.data.name }].concat(e.data.dynamicData)
      }
      let memberInfo = e.data.dynamicData || []
      this.$emit('update:memberInfo', memberInfo)
      if (e.data.typeId === 'comp') {
        // 自定义构件
        this.focusCustomComponent({ comId: e.data.uuid, flag: e.data.check })
      } else {
        // 选中构件或者取消选中
        let data = {
          projectId: e.data.projectId || e.data.compData?.projectId,
          mn: e.data.uuid,
          action: e.data.check ? 'selectComponent' : 'cancelSelectComponent'
        }
        this.updateEdit(data);
      }
    },
    // 自定义构件聚焦
    focusCustomComponent({ comId, flag }) {
      let params = {
        taskId: this.data.taskId,
        comId,
        flag
      }
      focusComponent(params).then((res) => {
        this.$message.success(res.message)
      })
    },
    // 删除构件
    deleteCom(node) {
      const { name, uuid } = node.data;
      this.$confirm(`此操作删除此【${name}】构件, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteCustomCom({
          taskId: this.data.taskId,
          comId: uuid,
        }).then((res) => {
          this.$message.success(res.message)
          this.updateTree(node.data.uuid);
          // 清理已删除构件的缓存状态
          delete this.componentVisibility[uuid];
        });
      }).catch(() => { });
    },
    // 删除构件后更新tree数据
    updateTree(uuid) {
      if (!this.$refs.tree) return
      // 获取自定义构件父级node
      const nodeParent = this.$refs.tree.getNode(uuid).parent;
      this.$refs.tree.remove(uuid);
      if (!nodeParent.childNodes.length) {
        this.$refs.tree.remove(nodeParent.data.uuid);
      }
    },
    // 点击锁
    toggleLock(data = { lockCheck: false }) {
      if (data.uuid) {
        data.lockCheck = !data.lockCheck
      }
      this.$refs.tree && this.$refs.tree.root.childNodes.forEach(e => {
        if (e.data.uuid !== data.uuid) {
          e.data.lockCheck = false
        }
      })
      const params = {
        taskId: this.data.taskId,
        flag: data.lockCheck ? "on" : "off"
      }
      lockControl(params).then((res) => {
        if (params.flag === 'on') {
          this.setGizmoMode('translate')
          const infoParam = {
            taskId: this.data.taskId,
            actorOrAppId: data.projectId
          }
          lockAfterInfo(infoParam).then((res) => {
            this.$refs.OperatingTools.checkOprate({ gizmoMode: 'translate' })
          });
          // 在几何信息显示整体模型坐标信息
          getModelLocation({ appId: data.projectId }).then(res => {
            let resData = res.data[0]
            this.$parent.selectPark = {
              id: '1',
              mN: resData.appId,
              model: true,
              object: {},
              rsInfo: [
                { key: 'name', name: '名称', value: data.name },
                { key: 'location', name: '位置', value: resData.location },
                { key: 'rotation', name: '旋转', value: resData.rotation },
                { key: 'scale', name: '缩放', value: resData.scale },
              ]
            }
            this.$parent.memberInfo = []
          })
        } else {
          this.$parent.selectPark = { id: '1' }
        }
        setTimeout(() => {
          this.hasLock()
        }, 200)
      });
    },
    // 打开缩放，旋转，移动
    setGizmoMode(mode) {
      let params = {
        taskId: this.data.taskId,
        mode
      }
      setGizmoMode(params).then(() => {
        this.$message.success('切换编辑模式')
      })
    },
    // 点击显示或隐藏构件
    isShowCom(data, e) {
      const isHidden = !e.checkedKeys.includes(data.uuid);
      // 缓存当前构件的隐藏状态
      this.componentVisibility[data.uuid] = !isHidden;
      // 
      if (data.typeId === "comp") {
        // 自定义构件
        let params = {
          comId: data.uuid,
          taskId: this.data.taskId,
          lableVisibility: !e.checkedKeys.includes(data.uuid),
        }
        controlComShowOrHide(params)
      } else {
        // 模型构件
        let params = {
          mn: data.uuid,
          projectId: data.projectId || data.compData?.projectId,
          action: !e.checkedKeys.includes(data.uuid) ? 'showComponents' : 'hideComponents'
        }
        this.updateEdit(params)
      }
    },
    // 添加构件后更新列表
    updateComTreeAfterAddComs() {
      if (this.appType === "3") {
        // 合模
        this.handleMultModle();
      } else {
        this.getList({ key: "vanjian" }).then((res) => {
          this.$refs.tree && this.$refs.tree.updateKeyChildren("vanjian", res);
        })
      }
    },
    // 查看有没有合模的自定义构件
    // 合模必然有 uuid vanjian1
    handleMultModle() {
      if (!this.$refs.tree) return
      const godNodeList = this.$refs.tree.getNode("vanjian1").parent.childNodes;
      const mult = godNodeList.find((item) => {
        return item.data.typeId === "comp";
      });

      let uuid = mult ? mult.data.uuid : null;
      // 如果没有自定义构件，保存最后一个节点，用来insertAfter节点
      if (!uuid) {
        this.getList().then((res) => {
          let customMess = res[res.length - 1];
          this.$refs.tree.insertAfter(customMess, godNodeList[godNodeList.length - 1].data.uuid);
        })
      } else {
        // 如果有了自定义构件列表
        this.getList({ key: uuid }).then((res) => {
          this.$refs.tree && this.$refs.tree.updateKeyChildren(uuid, res);
        })
      }
    },
    // 冻结与解冻
    freezeCom(node) {
      let params = {
        taskId: this.data.taskId,
        isFreeze: '',
        isAll: node.level === 1 ? true : false, //是否冻结所有
        freezePakId: ''
      }
      let data = []
      console.log('🚀🚀🚀', node);
      // freezeCom(params,data).then((res)=>{
      //     this.$message.success(res.message)
      // })
    },
    // action事件
    updateEdit(obj) {
      let params = {
        taskid: this.data.taskId,
        ...obj
      }
      doAction(params).then((res) => {
        this.$message.success(res.message)
      })
    },
  }
};
</script>
<style lang="less" scoped>
.changeDrawerBox {
  height: 50vh;
}

.search {
  margin: 10px !important;
}

/deep/ .el-tree {
  height: calc(100% - 141px);
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

.t-c {
  text-align: center;
}
</style>