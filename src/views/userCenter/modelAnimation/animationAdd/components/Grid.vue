<template>
  <div style="position: relative; flex-shrink: 0" :style="{ width: width + 'px', height: '30px' }">
    <!-- 小格 -->
    <div class="grid-container" :style="{ width: width + 'px', height: height + 'px' }"></div>
    <!-- 数字 -->
    <div class="grid-number" :style="{ marginTop: height + 2 + 'px' }" v-if="showNumber">
      {{ time }}
    </div>
  </div>
</template>

<script>
import Mapping from './map'
export default {
  components: {},
  props: {
    width: Number,
    frame: Number,
    showNumber: Boolean
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    // 小格的高度
    height() {
      return this.showNumber ? 16 : 3
    },
    // 小格的显示时间
    time() {
      return Mapping.frame2Time(this.frame ? this.frame : 0, 30)
    }
  },
  created() { },
  mounted() { },
  methods: {}
}
</script>
<style lang="less" scoped>
.grid-container {
  position: absolute;
  bottom: 0;
  left: 0;
  border-left: 1.5px solid #707070;
}

.grid-number {
  position: absolute;
  left: 4px;
  bottom: 2px;
  color: #979797;
  font-weight: bold;
  font-size: 12px;
  transform: scale(0.83333333);
  transform-origin: left center;
  line-height: 18px;
}
</style>
