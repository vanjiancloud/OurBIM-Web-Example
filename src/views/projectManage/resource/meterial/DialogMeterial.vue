<!-- 上传\编辑材质 -->
<template>
  <el-dialog :title="title + '材质'" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body
    width="580px" :before-close="hide">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="98px" size="small">
      <el-row>
        <el-form-item label="材质名称:" prop="textureName">
          <el-input v-model="form.textureName" @keydown.native.stop></el-input>
        </el-form-item>
        <el-form-item label="选择分组:" prop="parentId" v-if="form.parentId">
          <el-select v-model="form.parentId" placeholder="请选择分组" style="width:100%">
            <el-option v-for="(item, index) in parentData" :key="index" :label="item.groupName"
              :value="item.groupId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材质缩略图:" prop="fileUpload">
          <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label-width="0">
            <el-checkbox v-model="form.check1">基础色</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="颜色" prop="color1">
            <el-color-picker v-model="form.color1" class="color_picker"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基础颜色贴图">
            <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="透明度">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="0">
            <el-checkbox v-model="form.check2">金属度</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="金属度">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="金属度贴图">
            <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="0">
            <el-checkbox v-model="form.check2">粗糙度</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="粗糙度">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="粗糙度贴图">
            <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="0">
            <el-checkbox v-model="form.check1">自发光</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="自发光强度">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自发光颜色" prop="color1">
            <el-color-picker v-model="form.color1" class="color_picker"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自发光贴图">
            <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="0">
            <el-checkbox v-model="form.check2">法线</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="法线强度">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="法线贴图">
            <SingleUpload v-model="form.fileUpload" :autoUpload="false" accept="image/png"></SingleUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="0">
            <el-checkbox v-model="form.check2">贴图位置</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="等比缩放">
            <el-switch v-model="form.switch1" active-color="#13ce66">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="横向缩放">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="纵向缩放">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="横向偏移">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="纵向偏移">
            <el-slider v-model="form.slider1" :min="0" :max="1" :step="0.01" show-input>
            </el-slider>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Getuserid } from "@/store/index.js";
import SingleUpload from '@/components/Upload/singleUpload.vue'
import { addChartlet, updateMaterialTexture } from '@/api/resource/chartlet.js'
export default {
  components: { SingleUpload },
  props: {
    parentData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '',
      dialogVisible: false,
      form: {
        check1: true,
        color1: '#409EFF',
        slider1: 0,
        check2: true,
        switch1: false,
      },
      rules: {
        textureName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        fileUpload: [{ required: true, message: '请上传材质文件', trigger: 'blur' }],
        parentId: [
          { required: true, message: '请选择分组', trigger: 'blur' }
        ]
      },

    }
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    show(row) {
      this.form = this.$options.data().form
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        this.form = { ...this.form, ...row };
        if (row.parentId) {
          this.title = '编辑'
          this.$set(this.form, 'fileUpload', row.imgPath)
        } else {
          this.title = '新增'
        }
      })
    },
    hide() {
      this.dialogVisible = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false
        if (this.form.textureId) {
          let formData = new FormData()
          for (const key in this.form) {
            formData.append([key], this.form[key])
          }
          updateMaterialTexture(formData).then((res) => {
            this.$message.success(res.message)
            this.hide()
            // this.$parent.getTextureList(this.form.groupId)
            this.$emit('reloadTable', this.form.groupId)
          })
        } else {
          let data = {
            userId: Getuserid(),
            ...this.form
          }
          let formData = new FormData()
          for (const key in data) {
            formData.append([key], data[key])
          }
          addChartlet(formData).then((res) => {
            this.$message.success(res.message)
            this.hide()
            // this.$parent.getTextureList(this.form.groupId)
            this.$emit('reloadTable', this.form.groupId)
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/.form{
//   &.el-input{
//     width: 100%;
//   }
// }
.color_picker {
  height: 100px;
  width: 100px;
  /deep/.el-color-picker__trigger{
    height: 100%;
    width: 100%;
  }
}
</style>