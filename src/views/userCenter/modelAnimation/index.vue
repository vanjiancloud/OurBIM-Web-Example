<!-- 序列动画 -->
<template>
  <div>
    <Drawer ref="Drawer" title="模型动画" direction="rtl" @onClose="close()" :class="{ 'changeDrawerBox': drawerShow() }">
      <Tab v-model="activeTab" :data="tabList" @onTab="onTab" />
      <!-- 自定义动画 -->
      <div class="filterTool" v-if="activeTab === 0">
        <el-tooltip class="item" effect="dark" content="新建多个自定义动画" placement="top">
          <svg-icon icon-class="animation1" class="svg" @click="customOnTool(1)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="添加动作" placement="top">
          <svg-icon icon-class="animation2" class="svg" @click="customOnTool(2)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="编辑分组名称" placement="top">
          <svg-icon icon-class="animation3" class="svg" @click="customOnTool(3)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="过滤条件" placement="top">
          <svg-icon icon-class="animation4" class="svg" @click="customOnTool(4)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
          <svg-icon icon-class="edit" class="svg" @click="customOnTool(5)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="播放" placement="top">
          <svg-icon icon-class="animation6" class="svg" @click="customOnTool(6)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <svg-icon icon-class="delete" class="svg" @click="customOnTool(6)" />
        </el-tooltip>
      </div>
      <el-empty v-if="activeTab === 0" :image="require('@/assets/noData1.png')" :image-size="30"
        description="请选择要创建自定义动画的模型对象组"></el-empty>
      <!-- <el-tree class="tree" ref="tree" empty-text="暂无数据" :data="treeData" :props="props"
            :default-expanded-keys="expandedKeys"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
            @check="onVisiable"
            :expand-on-click-node="false" :load="loadNode" :filter-node-method="filterNode" 
            highlight-current node-key="id" lazy>
                <div class="custom-tree-node" :class="{'treeSelect': data.id === activeTree.id}" slot-scope="{node,data}" @click="onTree(data)">
                    <svg-icon icon-class="filterTree" class="svg"/>
                    <span class="name">{{ node.label }}</span>
                    <div>
                        <svg-icon v-if="data.typeLabel!=='3'" icon-class="filter8" class="svg" @click.stop="deleteTree(data)"/>
                        <svg-icon v-if="data.haveGroup!=='0'" :icon-class="!node.checked?'filter7':'filter9'" class="svg"/>
                    </div>
                </div>
            </el-tree> -->
      <!-- 序列动画 -->
      <div class="filterTool" v-if="activeTab === 1">
        <el-tooltip class="item" effect="dark" content="新建序列动画" placement="top">
          <svg-icon icon-class="animation1" class="svg" @click="onTool(1)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="渲染序列动画视频" placement="top">
          <svg-icon :class="{ svgGray: !this.currentItem.id }" icon-class="animation7" class="svg" @click="onTool(2)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导出动画视频文件" placement="top">
          <svg-icon :class="{ svgGray: !this.currentItem.id }" icon-class="animation8" class="svg" @click="onTool(3)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="编辑序列动画方案名称" placement="top">
          <svg-icon :class="{ svgGray: !this.currentItem.id }" icon-class="edit" class="svg" @click="onTool(4)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除序列动画方案" placement="top">
          <svg-icon :class="{ svgGray: !this.currentItem.id }" icon-class="delete" class="svg" @click="onTool(5)" />
        </el-tooltip>
      </div>
      <el-empty v-if="activeTab === 1 && !list.length" :image="require('@/assets/noData1.png')" :image-size="30"
        description="请新建序列动画"></el-empty>
      <div class="list" v-if="activeTab === 1 && list.length">
        <div class="ListItem" :class="{ activeList: currentItem.id === item.id }" v-for="item in list" :key="item.id"
          @click="onList(item)">
          <svg-icon icon-class="animationList" class="svg" />
          {{ item.animationName }}
        </div>
      </div>

      <DialogsAddSeq ref="DialogsAddSeq" :data="data" />
      <DialogsExportSeq ref="DialogsExportSeq" />
      <DialogrEnderSeq ref="DialogrEnderSeq" />
    </Drawer>
    <!-- 动画操作面板 -->
    <AnimationAdd ref="AnimationAdd" :data="data" :currentItem="currentItem" v-if="currentItem.id" />
    <!-- 关键帧属性设置 -->
    <ModelAnimationEdit ref="ModelAnimationEdit" :data="data" @onDeleteFrame="onDeleteFrame"
      @onSubmitSuccess="onSubmitSuccess" @onCloseSuccess="onCloseSuccess" @changeDotTime="changeDotTime" />
    <!-- 构件操作图标 -->
    <OperatingTools ref="OperatingTools" v-if="currentItem.id" :data="data" style="left: 300px;right: initial;" />
  </div>
</template>

<script>
import { selectAnimationList, deleteAnim } from '@/api/userCenter/modelAnimation.js'
import { EventBus } from '@/utils/bus.js'
import Tab from "@/components/Tab/index.vue";
import Drawer from "@/components/Drawer/index.vue";
import DialogsAddSeq from "./DialogsAddSeq.vue";
import DialogsExportSeq from "./DialogsExportSeq.vue";
import DialogrEnderSeq from "./DialogrEnderSeq.vue";
import AnimationAdd from "./animationAdd";
import ModelAnimationEdit from "./animationEdit";
import OperatingTools from "./components/OperatingTools/index";
export default {
  components: { Drawer, Tab, DialogsAddSeq, DialogsExportSeq, DialogrEnderSeq, AnimationAdd, ModelAnimationEdit, OperatingTools },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      activeTab: 0,
      tabList: [
        {
          name: '自定义动画'
        },
        {
          name: '序列动画'
        },
      ],
      treeData: [],
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
      list: [],
      currentItem: {},//点击当前
    }
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    changeDotTime(dotObj, time) {
      if (this.$refs.AnimationAdd) this.$refs.AnimationAdd.changeDotTime(dotObj, time);
    },
    show() {
      this.$refs.Drawer.show()
      if (this.activeTab === 0) {

      }
      if (this.activeTab === 1) {
        this.getSeqList()
      }
    },
    close() {
      this.$refs.Drawer.hide()
      EventBus.$emit('eventTool', 'modelAnimation')
    },
    async onTab(e) {
      this.activeTab = e.index;
      // 停止当前的序列动画
      EventBus.$emit('animationClose');
      if (this.activeTab === 0) {
       
      }
      if (this.activeTab === 1) {
        this.getSeqList()
      }
    },
    drawerShow() {
      return this.$refs?.ModelAnimationEdit?.drawerShow
    },
    customOnTool(type) {
      switch (type) {
        case 1:

          break;

        default:
          break;
      }
    },
    onTool(type) {
      switch (type) {
        case 1:
          this.$refs.DialogsAddSeq.show("创建")
          break;
        case 2:
          if (!this.currentItem.id) return this.$message.warning("请选择要编辑的动画");
          this.$refs.DialogrEnderSeq.show()
          break;
        case 3:
          if (!this.currentItem.id) return this.$message.warning("请选择要编辑的动画");
          this.$refs.DialogsExportSeq.show()
          break;
        case 4:
          if (!this.currentItem.id) return this.$message.warning("请选择要编辑的动画");
          this.$refs.DialogsAddSeq.show("编辑", this.currentItem)
          break;
        case 5:
          if (!this.currentItem.id) return this.$message.warning("请选择要删除的动画");
          this.$confirm(`序列动画方案删除后，其中包含的所有动画事件都将被删除！请谨慎操作！`, '删除序列动画', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            deleteAnim({ id: this.currentItem.id }).then(() => {
              this.$message.success("删除成功！")
              this.getSeqList()
              this.currentItem = {}
            })
          })
            .catch(() => { })
          break;

        default:
          break;
      }
    },
    // 获取序列动画列表
    getSeqList() {
      selectAnimationList({ bimId: this.data.appId }).then(res => {
        this.list = res.data
      })
    },
    // 点击序列动画列表
    onList(item) {
      // console.log(item)
      if (this.$refs.AnimationAdd && this.currentItem.id) {
        EventBus.$emit('animationClose');
      }
      this.currentItem = this.currentItem.id === item.id ? {} : item
      // if (!this.currentItem.id || this.currentItem.id !== item.id) {
      //   this.$refs.ModelAnimationEdit.close()
      // }
      this.$refs.ModelAnimationEdit.close()
    },
    onDeleteFrame(e) {
      this.$refs.AnimationAdd.getList()
      this.$refs.ModelAnimationEdit.close()
    },
    onSubmitSuccess() {
      if (this.$refs.AnimationAdd && this.$refs.AnimationAdd.$refs.TimeLine) {
        this.$refs.AnimationAdd.$refs.TimeLine.frameClick()
      }
    },
    onCloseSuccess() {
      if (this.$refs.AnimationAdd && this.$refs.AnimationAdd.$refs.TimeLine) {
        this.$refs.AnimationAdd.$refs.TimeLine.currentDotId = null;
        this.$refs.AnimationAdd.$refs.TimeLine.quit();
      }
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.tab {
  margin-bottom: 0;
}

.changeDrawerBox {
  height: 50vh;
}

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
  }
}

.list {
  height: calc(100% - 132px);
  overflow: auto;
  padding: 8px 0;

  .ListItem {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin: 8px 0;
    padding: 4px 24px;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    .svg {
      margin-right: 10px;
    }
  }

  .activeList {
    background: #2B2A2A;
    color: #ffffff;
  }
}
</style>
