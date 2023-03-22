<template>
  <el-dialog
    :title="title+'GIS图层'"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="hide"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="图层名称：" prop="gisServerName">
        <el-input v-model="form.gisServerName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="图层类型：" prop="layerType">
        <el-select v-model="form.layerType " placeholder="请选择" style="width:100%">
          <el-option :value="item.value" v-for="(item,index) in layerTypeList" :key="index">{{ item.note }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图层地址：" prop="fileUrl">
        <el-input v-model="form.fileUrl" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button class="blueBtn" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDict } from "@/api/dict.js"
export default {
  components: {},
  props: {},
  data() {
    return {
      title: "添加",
      dialogVisible: false,
      form: {},
      rules: {
        gisServerName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        layerType: [{ required: true, message: "请选择图层类型", trigger: "blur" }],
        fileUrl: [{ required: true, message: "请输入图层地址", trigger: "blur" }],
      },
      layerTypeList: [] //图层类型
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getType()
  },
  methods: {
    show(title,row) {
      this.title = title
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.$refs.form.clearValidate();
        this.form = row
      })
    },
    hide() {
      this.dialogVisible = false;
    },
    async getType(){
      this.layerTypeList = (await getDict('layerType')).data
    },
    submit(){
      this.$refs.form.validate((valid) => {
        if (!valid) return false;
        this.$emit('onLayerSuccess',{...this.form,type:this.title})
        this.hide()
      });
    }
  },
};
</script>
<style lang="less" scoped>
</style>