<!-- 渲染动画视频 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px"
    :before-close="hide">
    <el-form ref="form" :style="{ 'width': '90%' }" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="视频名称:" prop="dirName">
        <el-input v-model="form.dirName" placeholder="请输入名称" @keydown.native.stop></el-input>
      </el-form-item>
      <el-form-item label="选择分辨率:" prop="dirName">
        <el-select v-model="form.value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide()">取消渲染</el-button>
      <el-button type="primary" @click="submit()">开始渲染</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createDir, updateName } from '@/api/userCenter/componentFilter.js'
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      title: '渲染动画视频',
      dialogVisible: false,
      options: [],
      form: {},
      rules: {
        dirName: [{ required: true, message: "请选择动画视频文件", trigger: "blur" }],
      },
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    show(row) {
      this.form = this.$options.data().form
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        // this.form = row
      })
    },
    hide() {
      this.dialogVisible = false;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false;

      })
    },
  }
};
</script>
<style lang="less" scoped></style>