<!-- 构件操作图标 -->
<template>
  <div class="toolList">
    <el-tooltip v-for="(item, index) in toolIcons" :key="index" effect="dark" :content="item.name" placement="bottom">
      <img :src="item.check ? item.checkUrl : item.url" @click="onOprate(item)" :style="{
        'pointer-events':
          item.name === '轴心' &&
            !toolIcons[0].check &&
            !toolIcons[1].check &&
            !toolIcons[2].check
            ? 'none'
            : 'auto',
      }" />
    </el-tooltip>
    <el-divider direction="vertical"></el-divider>
    <topBar ref="topBarRef" :data="data" />
    <el-tooltip effect="dark" content="保存" placement="bottom">
      <div class="addBtn"> <svg-icon icon-class="save" class="draw-icon" @click="changeCase('commit')" /></div>
    </el-tooltip>
    <el-tooltip effect="dark" content="退出" placement="bottom">
      <div class="addBtn" v-if="topStore.topType === 1"><svg-icon class="svg-icon draw-icon" icon-class="tuichu"
          @click="onChangeOut" style="color: #fff;width: 24px;height: 20px;" /></div>
    </el-tooltip>
  </div>
</template>

<script>
import { setGizmoMode, setGizmoModeType, closeComEdit } from "@/api/userCenter/index";
import topBar from "./topBar.vue";

export default {
  components: { topBar },
  props: {
    // taskId必传
    data: {
      type: Object,
      default: () => { },
      required: true
    }
  },
  computed: {
    topStore() {
      return this.$store.state.top
    },
    // designStore() {
    //   return this.$store.state.design
    // }
  },
  data() {
    return {
      toolIcons: [
        {
          url: require('@/assets/images/todo/unchecked/com/move1.png'),
          checkUrl: require('@/assets/images/todo/check/com/move1.png'),
          name: '移动',
          key: 'translate',
          check: false
        },
        {
          url: require('@/assets/images/todo/unchecked/com/move2.png'),
          checkUrl: require('@/assets/images/todo/check/com/move2.png'),
          name: '旋转',
          key: 'rotate',
          check: false
        },
        {
          url: require('@/assets/images/todo/unchecked/com/move3.png'),
          checkUrl: require('@/assets/images/todo/check/com/move3.png'),
          name: '缩放',
          key: 'scale',
          check: false
        },
        {
          url: require('@/assets/images/todo/unchecked/com/move4.png'),
          checkUrl: require('@/assets/images/todo/check/com/move4.png'),
          name: '轴心',
          check: false
        },
        // {
        //     url:require('@/assets/images/todo/unchecked/com/move5.png'),
        //     checkUrl:require('@/assets/images/todo/check/com/move5.png'),
        //     name:'笔刷',
        //     check:false
        // },
      ],
    };
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {
    // 保存方案
    changeCase(e) {
      this.$store.dispatch('bim/changeCase', 'commit').then(() => {
        this.$message.success('保存成功')
      })
    },
    // 那五个操作------------缩放,旋转,移动,轴心,笔刷
    onOprate(item) {
      if (item.check) {
        this.$set(item, 'check', false)
      } else {
        if (item.name === '轴心') {
          this.$set(item, 'check', true)
        } else {
          let isEnd = new Promise((resolve, reject) => {
            let total = null
            this.toolIcons.forEach((e, i) => {
              if (e.name !== '轴心') {
                e.check = false
              }
              total = i + 1
            })
            if (total === this.toolIcons.length) {
              resolve(true)
            }
          })
          isEnd.then(() => {
            this.$set(item, 'check', true)
          })
        }
      }
      this.$forceUpdate()
      setTimeout(() => {
        switch (item.name) {
          case '缩放':
          case '旋转':
          case '移动':
            if (item.check) {
              this.setGizmoMode(item.key)
            } else {
              this.closeGizmoMode()
            }
            break;
          case '轴心':
            if (item.check) {
              this.setGizmoModeType(true)
            } else {
              this.setGizmoModeType(false)
            }
            break;
          case '笔刷':

            break;

          default:
            break;
        }
      }, 500)
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
    // 打开坐标轴心
    setGizmoModeType(flag) {
      let params = {
        taskId: this.data.taskId,
        flag
      }
      setGizmoModeType(params).then(() => {
        this.$message.success(`坐标模式切换${flag ? '开启' : '关闭'}`)
      })
    },
    // 关闭缩放，旋转，移动
    closeGizmoMode() {
      let params = {
        taskId: this.data.taskId
      }
      closeComEdit(params).then(() => {
        this.$message.success('暂时关闭自定义构件编辑')
      })
    },
    // 图标显示--------缩放,旋转,移动,轴心,笔刷
    checkOprate(data) {
      this.toolIcons.forEach((e, i) => {
        if (['scale', 'rotate', 'translate'].includes(e.key)) {
          if (e.key === data.gizmoMode) {
            e.check = true
          } else {
            e.check = false
          }
        }
      })
    },
    onChangeOut() {
      const _this = this;
      this.$confirm(`您将要退出面层编辑，是否继续！`, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        _this.$store.dispatch('design/changeDrawType', null);
        _this.$store.dispatch('top/changeTopDesign', 0);
        _this.$store.commit('design/changeType', 1);
        _this.$store.commit('bim/setPlaneViewStatus', 1);
        _this.$store.dispatch('bim/changeMode', { e: '3D', mode: true });
        _this.$refs.topBarRef.changeThree();
        // router.push('/design/model')
      })
    },
  },
};
</script>
<style lang="less" scoped>
.toolList {
  position: absolute;
  // right: -250px;
  left: 300px;
  width: max-content;
  top: 0;
  height: 40px;
  background: rgba(13, 22, 40, 0.7);
  border-radius: 4px;
  line-height: 40px;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    cursor: pointer;
    vertical-align: middle;
    margin: 0 10px;
  }

  .draw-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    vertical-align: middle;
    margin: 0 10px;

    /deep/ svg {
      height: 100%;
      width: 100%;
    }
  }
}

.addBtn {
  height: 40px;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
