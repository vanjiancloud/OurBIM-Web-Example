<!-- 序列动画 -->
<template>
  <div>
    <div class="filterTool">
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
    <el-empty v-if="!list.length" :image="require('@/assets/noData1.png')" :image-size="30"
      description="请新建序列动画"></el-empty>
    <div class="list" v-if="list.length">
      <div class="ListItem" :class="{ activeList: currentItem.id === item.id }" v-for="item in list" :key="item.id"
        @click="onList(item)">
        <svg-icon icon-class="animationList" class="svg" />
        {{ item.animationName }}
      </div>
    </div>

    <!-- 新建序列动画 -->
    <DialogsAddSeq ref="DialogsAddSeq" :data="data" @getSeqList="getSeqList" />
    <!-- 导出序列动画 -->
    <DialogsExportSeq ref="DialogsExportSeq" />
    <!-- 渲染动画视频 -->
    <DialogrEnderSeq ref="DialogrEnderSeq" />

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
export default {
  components: { Drawer, Tab, DialogsAddSeq, DialogsExportSeq, DialogrEnderSeq },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      list: [],
    }
  },
  watch: {},
  computed: {
    currentItem() {
      return this.$store.state.animation.currentItem
    }
  },
  created() {
  },
  mounted() {
    this.getSeqList();
  },
  methods: {
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
              this.$store.commit('animation/changeCurrentItem', {});
            })
          }).catch(() => {

          })
          break;

        default:
          break;
      }
    },
    changeDotTime(dotObj, time) {
      if (this.$refs.AnimationAdd) this.$refs.AnimationAdd.changeDotTime(dotObj, time);
    },
    // 获取序列动画列表
    getSeqList() {
      selectAnimationList({ bimId: this.data.appId }).then(res => {
        this.list = res.data
      })
    },
    // 点击序列动画列表
    onList(item) {
      this.$emit('onSeqAnimeItem', item)
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
