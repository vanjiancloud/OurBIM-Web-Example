<template>
  <div>
    <div :span="12" v-for="item in barList" :key="item.id">
      <el-dropdown @command="onCommand">
        <div class="svg-main" @click="onCommand(item)">
          <el-image class="draw-icon" :src="item.pid === activeType.pid ? item.activeIcon : item.icon" />
          <!-- <i v-if="topStore.topType === 0" class="el-icon-caret-bottom"></i> -->
        </div>
        <template #dropdown v-if="topStore.topType === 0">
          <el-dropdown-menu>
            <el-dropdown-item v-for="child in item.children" :key="child.id" v-text="child.label" :command="child"
              :class="child.id === activeType.id ? 'active-type' : ''">
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { updateMode, updateAction } from "@/api/projectManage/model.js";

export default {
  components: {
  },
  props: {
    data: {
      type: Object,
      default: () => { },
    }
  },
  data() {
    return {
      activeType: {
        id: 21,
        pid: 2,
      },
      activeMode: null,
      barList: [
        {
          id: 1,
          pid: 1,
          icon: require('@/assets/images/house/todo-0.png'),
          activeIcon: require('@/assets/images/house/todo-active-0.png'),
          children: [
            { id: 10, pid: 1, label: '平面' },
            { id: 11, pid: 1, label: '立面' },
            { id: 12, pid: 1, label: '顶面' }
          ]
        },
        // {
        //   id: 21,
        //   pid: 2,
        //   icon: require('@/assets/images/house/todo-1.png'),
        //   activeIcon: require('@/assets/images/house/todo-active-1.png'),
        //   children: [
        //     { id: 20, pid: 2, label: '第一人称' },
        //     { id: 21, pid: 2, label: '第三人称' },
        //     { id: 22, pid: 2, label: '自定义主视图' },
        //     { id: 23, pid: 2, label: '重置主视图' }
        //   ]
        // }
      ]
    }
  },
  watch: {
    activeMode(val) {
      if (this.activeType.pid === 2 && val === '2D') {
        this.activeType = {
          id: 10,
          pid: 1,
        }
      }
    },
    'topStore.topType'(val) {
      // 全部
      if (val === 0) {
        this.activeType = {
          id: 21,
          pid: 2,
        }
      }
      // 面层设计
      if (val === 1) {
        this.activeType = {
          id: 10,
          pid: 1,
        }
      }
    },
    'bimStore.planeViewStatus'(val) {
      if (val == 1) {
        this.activeType = {
          id: 21,
          pid: 2,
        }
      }
    },
  },
  computed: {
    topStore() {
      return this.$store.state.top
    },
    bimStore() {
      return this.$store.state.bim
    },
  },
  created() {
    // console.log(this.$store.state.top)
  },
  methods: {
    onCommand(e) {
      const { topType } = this.topStore
      const { id } = e
      if (id !== 22 && id !== 23) {
        this.activeType = e
      }
      if (topType === 1) {
        switch (id) {
          case 1:
            this.$store.dispatch('top/changeTopDesign', 1)
            break
          case 21:
            this.changeThree()
            break
        }
        return
      }
      switch (id) {
        case 1:
          this.$store.commit('bim/setPlaneViewStatus', 2)
          this.setView(1)
          break
        case 10:
          this.$store.commit('bim/setPlaneViewStatus', 2)
          this.setView(1)
          break
        case 11:
          this.$store.commit('bim/setPlaneViewStatus', 2)
          this.setView(5)
          break
        case 12:
          this.$store.commit('bim/setPlaneViewStatus', 2)
          this.setView(2)
          break
        default:
          break
      }
      if (id === 1 || id === 2) {
        this.activeType = e.children[0]
      }
    },
    changeThree() {
      const params = {
        action: 'switchViewMode',
        viewMode: 2,
        projectionMode: 1
      }
      this.$store.dispatch('bim/changeAction', params)
    },
    setHomeView() {
      const params = {
        action: 'cameraPosAll'
      }
      this.$store.dispatch('bim/changeAction', params)
    },
    setView(e) {
      const params = {
        sjid: e,
        action: 'cameraPosSpecial'
      }
      this.$store.dispatch('bim/changeMode', { e: '2D' }).then(() => {
        this.$store.dispatch('bim/changeAction', params)
      })
    },
  },
}
</script>

<style lang="less" scoped>
.draw-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  vertical-align: middle;
  margin: 0 10px;
}

/deep/.active-type {
  color: #00B3F3;
  background-color: #E0F7FF !important;
}
</style>