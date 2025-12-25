<template>
  <el-dialog class="image-select-dialog" :title="title" :visible.sync="dialogVisible" width="40%" :before-close="hide"
    :close-on-click-modal="false" append-to-body>
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-form-item label="名称" prop="weatherName">
        <el-input v-model="form.weatherName"></el-input>
      </el-form-item>
      <el-form-item label="文件" prop="fileStorge">
        <UploadFile v-model="form.fileStorge" :limit="1" ref="uploadFileRef" :isShowTip="true" :autoUpload="true"
          @getFile="getFile" :fileType="['hdr']" @onSuccess="fileUploadSuccess" />
      </el-form-item>
      <el-form-item label="缩略图" prop="img">
        <SingleUpload ref="uploadImageRef" v-model="form.img" url="/appli/uploadThumbnail">
        </SingleUpload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide()">取 消</el-button>
      <el-button type="primary" @click="submit()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFile from '@/components/FileUpload/index.vue';
// import Uploadimage from '@/components/ImageUpload/index.vue';
import SingleUpload from "@/components/Upload/singleUpload.vue"
import { Getuserid } from '@/store/index.js'
import { updateWeatherImageInfo } from '@/api/userCenter/weather.js';

export default {
  components: { UploadFile, SingleUpload },
  data() {
    return {
      title: "",
      dialogVisible: false,
      loading: false,
      form: {
        weatherName: "",
        fileStorge: "",
        img: ""
      }
    };
  },
  watch: {},
  computed: {},
  created() { },
  mounted() { },
  methods: {
    show(title) {
      this.title = title;
      this.loading = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.form = this.$options.data().form;
        this.$refs.uploadFileRef.clearFiles();
      });
    },
    hide() {
      this.dialogVisible = false;
    },
    submit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          const { weatherName, fileStorge, img } = this.form;
          const data = {
            userId: Getuserid(),
            weatherName,
            fileStorge,
            img,
          }
          updateWeatherImageInfo(data).then(res => {
            if (res.code === 0) {
              this.loading = false;
              this.$message.success(res.message)
              this.hide()
              this.$emit('refresh')
            } else {
              this.loading = false;
              this.$message.error(res.message)
            }
          })
        } else {
          // this.$message.error('校验失败')
        }
      });
    },
    getFile(file, callback) {
      this.loading = true;
      callback({
        url: 'weather/uploadWeatherImage',
        file
      });
    },
    fileUploadSuccess(data) {
      this.loading = false;
      this.form.fileStorge = data;
    },
  }
};
</script>
<style lang="less" scoped></style>