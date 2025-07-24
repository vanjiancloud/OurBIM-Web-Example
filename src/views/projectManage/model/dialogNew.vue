<!-- 新建方案 -->
<template>
  <el-dialog title="新建方案" :visible.sync="dialogVisible" width="400px" :before-close="hide"
    :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="98px">
      <el-form-item label="方案名称" prop="appName">
        <el-input v-model="form.appName" maxlength="100" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button class="blueBtn" type="primary" @click="submit" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addCase } from "@/api/projectManage/model.js";

export default {
  components: {},
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        appName: '',
        // city: "[\"440000\",\"440300\",\"440306\"]"
      },
      btnLoading: false,
      rules: {
        appName: [{ required: true, message: "请输入方案名称", trigger: "blur" }],
      },
    }
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    show(row = {}) {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    submit() {
      this.$refs.form.validate((valid, fields) => {
        if (valid) {
          addCase({
            ...this.form,
            userId: this.$store.state.user.userId,
            needWeather: 'true',
            weatherId: '17',
            isShowGridLine: 'true',
          }).then(() => {
            this.$message.success('新建成功')
            this.$refs.form.resetFields()
            this.hide();
            this.$emit('onSearch');
          })
        } else {
          console.log('error submit!', fields)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped></style>