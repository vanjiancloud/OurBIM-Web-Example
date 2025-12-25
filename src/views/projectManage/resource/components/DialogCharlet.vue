<!-- 上传\编辑贴图 -->
<template>
  <el-dialog :title="title + '贴图'" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body
    width="460px" :before-close="hide">
    <el-form ref="form" :style="{ 'width': '90%' }" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="贴图名称:" prop="textureName" v-if="form.parentId">
        <el-input v-model="form.textureName" @keydown.native.stop></el-input>
      </el-form-item>
      <el-form-item label="选择分组:" prop="parentId" v-if="form.parentId">
        <el-select v-model="form.parentId" placeholder="请选择分组" style="width:100%">
          <el-option v-for="(item, index) in parentData" :key="index" :label="item.groupName"
            :value="item.groupId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="贴图文件:" prop="fileUpload">
        <SingleUpload v-if="form.parentId" v-model="form.fileUpload" :autoUpload="false" accept=".png,.bmp,.jpeg">
        </SingleUpload>
        <MultipleUpload v-else ref="MultipleUploadRef" url="/material/uploadMaterialTexturesBatch"
          v-model="form.fileUpload" :autoUpload="false" accept=".png,.bmp,.jpeg" @uploadFinish="uploadFinish">
        </MultipleUpload>
      </el-form-item>
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
import MultipleUpload from "@/components/Upload/multipleUpload.vue";
import { list, addChartlet, updateMaterialTexture, uploadMaterialTexturesBatch } from '@/api/resource/chartlet.js'
export default {
  components: { SingleUpload, MultipleUpload },
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      title: '',
      dialogVisible: false,
      form: {},
      parentData: [],
      rules: {
        textureName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        fileUpload: [{ required: true, message: '请上传贴图文件', trigger: 'blur' }],
        parentId: [
          { required: true, message: '请选择分组', trigger: 'blur' }
        ]
      },
    }
  },
  watch: {},
  computed: {},
  created() { },
  mounted() {
    this.getGroupList()
  },
  methods: {
    getGroupList() {
      let params = {
        userId: this.data?.userId || Getuserid(),
      }
      list(params).then(res => {
        this.parentData = res.data || []
      })
    },
    show(row) {
      this.form = this.$options.data().form
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        this.form = row
        if (row.parentId) {
          this.title = '编辑'
          this.$set(this.form, 'fileUpload', row.imgPath)
        } else {
          this.title = '新增'
          this.$refs.MultipleUploadRef.resetProgress();
          // this.$set(this.form, 'fileUpload', [])
        }
      })
    },
    hide() {
      this.dialogVisible = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false
        // console.log(this.form.fileUpload);
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
            userId: this.data?.userId || Getuserid(),
            ...this.form
          }
          // let formData = new FormData()
          // for (const key in data) {
          //   if (key == 'fileUpload') {
          //     data[key].forEach((item, index) => {
          //       formData.append('fileUpload', item)
          //     })
          //   } else {
          //     formData.append([key], data[key])
          //   }
          // }
          this.$refs.MultipleUploadRef.httpRequest(data);
          // uploadMaterialTexturesBatch(formData).then((res) => {
          //   this.$message.success(res.message)
          //   this.hide()
          //   // this.$parent.getTextureList(this.form.groupId)
          //   this.$emit('reloadTable', this.form.groupId)
          // })
        }
      })
    },
    uploadFinish() {
      this.hide()
      this.$emit('reloadTable', this.form.groupId)
    }
  }
}
</script>
<style lang="less" scoped></style>