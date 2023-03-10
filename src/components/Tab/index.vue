<template>
  <div class="tab">
    <div
      v-for="(item, index) in data"
      :key="index"
      class="tab_item"
      :class="{ acticleTab: acticleTab === index }"
      @click="onTab(item, index)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      acticleTab: 0,
    };
  },
  watch: {},
  created() {},
  methods: {
    onTab(item, index) {
      this.acticleTab = index;
      this.$emit("onTab", { index, ...item });
    },
  },
};
</script>

<style lang="less" scoped>
.tab {
  display: flex;
  margin-bottom: 15px;
  border-top: 1px solid #464646;
  border-bottom: 1px solid #464646;
  .tab_item {
    flex: 1;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    cursor: pointer;
  }
  .acticleTab {
    background: rgba(255, 255, 255, 0.2);
    color: #00c9fd;
  }
}
.roundTab{
  margin: 16px;
  border:none;
  .tab_item{
    border-radius: 15px;
    font-size: 14px;
  }
}
</style>
