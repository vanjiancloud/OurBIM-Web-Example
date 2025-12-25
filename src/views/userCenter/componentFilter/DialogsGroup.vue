<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="460px"
    :before-close="hide">
    <el-form ref="form" :style="{ 'width': '90%' }" :model="form" :rules="rules" label-width="100px" @submit.native.prevent>
      <el-form-item label="名称:" prop="groupName">
        <el-input v-model="form.groupName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createGroupBatchNew, updateName } from '@/api/userCenter/componentFilter.js'
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
      title: '添加分组',
      dialogVisible: false,
      form: {},
      rules: {
        groupName: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    show(title, row) {
      this.title = title + '分组'
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
            type: 2,
            newName: this.form.groupName,
            id: this.form.id,
            taskId: this.data.taskId,
          }
          updateName(data).then(() => {
            this.$message.success('操作成功！')
            this.hide();
            this.$parent.$parent.getList()
          });
        } else {
          // console.log('新建分组',this.form)
          createGroupBatchNew(this.form).then(() => {
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