<!-- 模型动画 -->
<template>
  <div>
    <Drawer ref="Drawer" title="模型动画" direction="rtl" @onClose="close()" :class="{ 'changeDrawerBox': drawerShow }">
      <template v-slot="{ drawer }">
        <div v-if="drawer">
          <Tab v-model="activeTab" :data="tabList" @onTab="onTab" />
          <!-- 自定义动画 -->
          <CustomAnimation ref="customAnimationRef" v-if="activeTab === 0" :data="data" />
          <!-- 序列动画 -->
          <SequenceAnimation v-if="activeTab === 1" :data="data" @onSeqAnimeItem="onList" />
        </div>
      </template>
    </Drawer>

    <template v-if="activeTab === 1">
      <!-- 动画操作面板 -->
      <AnimationAdd ref="AnimationAdd" :data="data" :currentItem="currentItem" v-if="currentItem.id" />
      <!-- 关键帧属性设置 -->
      <ModelAnimationEdit ref="ModelAnimationEdit" :data="data" @onDeleteFrame="onDeleteFrame"
        @onSubmitSuccess="onSubmitSuccess" @onCloseSuccess="onCloseSuccess" @changeDotTime="changeDotTime" />
      <!-- 构件操作图标 -->
      <OperatingTools ref="OperatingTools" v-if="currentItem.id" :data="data" style="left: 300px;right: initial;" />
    </template>

  </div>
</template>

<script>
import { selectAnimationList, deleteAnim } from '@/api/userCenter/modelAnimation.js'
import { EventBus } from '@/utils/bus.js'
// 
import Tab from "@/components/Tab/index.vue";
import Drawer from "@/components/Drawer/index.vue";
// 
import AnimationAdd from "./animationAdd/index.vue";
import ModelAnimationEdit from "./animationEdit/index.vue";
import OperatingTools from "./components/OperatingTools/index";
// 
import CustomAnimation from "./components/CustomAnimation/index.vue";
import SequenceAnimation from "./components/SequenceAnimation/index.vue";

export default {
  components: { Drawer, Tab, AnimationAdd, ModelAnimationEdit, OperatingTools, CustomAnimation, SequenceAnimation },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      activeTab: 0,
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
    }
  },
  watch: {},
  computed: {
    currentItem() {
      return this.$store.state.animation.currentItem
    },
    drawerShow() {
      return this.$refs?.ModelAnimationEdit?.drawerShow || this.$store.state.customAnimation.drawerShow
    },
    tabList() {
      const tabs = [
        { name: '自定义动画' },
        { name: '序列动画' },
      ]
      tabs.forEach(item => {
        if (this.data.modelType == 'com' && item.name == '序列动画') {
          this.activeTab = 0;
          item.hidden = true
        } else if (this.data.modelType != 'com' && item.name == '自定义动画') {
          this.activeTab = 1;
          item.hidden = true;
        } else {
          item.hidden = false
        }
      })
      return tabs
    }
  },
  created() { },
  mounted() { },
  methods: {
    show() {
      this.$refs.Drawer.show()
    },
    close() {
      EventBus.$emit('eventTool', 'modelAnimation')
      this.$store.commit('customAnimation/changeDrawerShow', false)
    },
    async onTab(e) {
      this.activeTab = e.index;
      this.$store.commit('animation/changeCurrentItem', {});
      // 停止当前的序列动画
      EventBus.$emit('animationClose');
    },
    // 点击序列动画列表
    onList(item) {
      this.$store.commit('animation/changeCurrentItem', this.currentItem.id === item.id ? {} : item);
      if (this.$refs.AnimationAdd && this.currentItem.id) {
        EventBus.$emit('animationClose');
      }
      this.$refs.ModelAnimationEdit.close()
    },
    // 
    changeDotTime(dotObj, time) {
      if (this.$refs.AnimationAdd) this.$refs.AnimationAdd.changeDotTime(dotObj, time);
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
