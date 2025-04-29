<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px"
    :before-close="hide">
    <el-form ref="form" :style="{ 'width': '90%' }" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="名称:" prop="dirName">
        <el-input v-model="form.dirName" @keydown.native.stop></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
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
      title: '添加文件夹',
      dialogVisible: false,
      form: {},
      rules: {
        dirName: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    show(title, row) {
      this.title = title + '文件夹'
      this.form = this.$options.data().form
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.form = row
      })
    },
    hide() {
      this.dialogVisible = false;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false;
        if (this.form.id) {
          let data = {
            type: 1,
            newName: this.form.dirName,
            id: this.form.id
          }
          updateName(data).then(() => {
            this.$message.success('操作成功！')
            this.hide();
            this.$parent.$parent.getList()
          });
        } else {
          createDir(this.form).then(() => {
            this.$message.success('操作成功！')
            this.hide();
            this.$parent.$parent.getList()
          });
        }
      })
    },
  }
};
</script>
<style lang="less" scoped></style>