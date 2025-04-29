<!--
 * @Autor: zk
 * @Date: 2024-09-11 23:13:00
 * @LastEditors: zk
 * @LastEditTime: 2024-10-10 21:36:41
 * @Description: 
-->
<template>
  <div>
    <el-form-item label-width="0">
      <el-checkbox v-model="form.bspecifyZoomLevels">指定缩放级别</el-checkbox>
    </el-form-item>
    <el-form-item label-width="0">
      <el-col class="GISMark" :span="1">Min</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input :disabled="!form.bspecifyZoomLevels" v-model="form.minLevel" placeholder="Min"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="GISMark" :span="1">Max</el-col>
      <el-col :span="11">
        <el-form-item>
          <el-input :disabled="!form.bspecifyZoomLevels" v-model="form.maxLevel" placeholder="Max"></el-input>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="图层顺序">
      <el-input v-model.number="form.materialLayerKey"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    receiveData: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      form: {
        bspecifyZoomLevels: false,
        minLevel: 0,
        maxLevel: 14,
        materialLayerKey: 0
      }
    }
  },
  created() {
    // 过滤掉子组件未定义的属性
    this.$nextTick(() => {
      const validKeys = Object.keys(this.$data.form);
      validKeys.forEach(key => {
        if (this.receiveData.hasOwnProperty(key)) {
          if (['bspecifyZoomLevels'].includes(key)) {
            this.form[key] = this.receiveData[key] === 'false' ? false : true
          } else {
            this.form[key] = this.receiveData[key];
          }
        }
      });
    })
  }
}
</script>
<style lang="less" scoped>

</style>