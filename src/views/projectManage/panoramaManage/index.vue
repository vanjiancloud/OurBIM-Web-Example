<template>
  <el-tabs v-model="activeName" class="tabs">
    <el-tab-pane :label="item" :name="key" v-for="(item, key) in tabList" :key="key"></el-tab-pane>
    <div class="bread" v-if="groupName"><span @click="back()">{{ tabList[activeName] }}</span> / {{ groupName }}</div>
    <!-- 全景图 -->
    <Panorama ref="Components" v-if="activeName === '0'" :total.sync="total" :groupName.sync="groupName" />
    <!-- 全景视频 -->
    <PanoramaVideo ref="MeterialRef" v-if="activeName === '1'" :total.sync="total" :groupName.sync="groupName" />
  </el-tabs>
</template>

<script>
import Panorama from './panorama/index.vue'
import PanoramaVideo from './panoramaVideo/index.vue'
export default {
  components: { Panorama, PanoramaVideo },
  props: {},
  data() {
    return {
      activeName: '0',
      tabList: {
        '0': '全景图',
        '1': '全景视频',
      },
      total: 0,//数据条数
      groupName: ''//分组名称
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    // 返回一级
    back() {
      this.groupName = ''
      switch (this.activeName) {
        case '0':
          this.$refs.Components.back()
          break;
        case '1':
          this.$refs.MeterialRef.back()
          break;
        case '2':
          this.$refs.Chartlet.back()
          break;
        case '3':
          this.$refs.Tag.back()
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.tabs {
  padding-top: 15px;

  /deep/.el-tabs__item {
    padding: 0 30px !important;
    text-align: center;
  }

  /deep/.el-tabs__active-bar {
    display: none;
  }

  /deep/.is-active {
    border-bottom: 3px solid #00AAF0;
  }

  /deep/.el-tabs__nav-scroll {
    margin-left: 10px;
  }

  .bread {
    font-size: 16px;
    font-weight: 500;
    color: #6A7C87;
    padding-left: 24px;

    span {
      color: #999999;
      cursor: pointer;

      &:hover {
        color: #00aaf0;
      }
    }
  }
}
</style>