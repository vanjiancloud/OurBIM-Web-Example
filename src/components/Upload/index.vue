<!-- <template>
  <el-upload
    ref="upload"
    :accept="accept"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
    :on-exceed="handleExceed"
    :before-upload="beforeUpload"
    class="upload-demo"
    action="#"
    :with-credentials="true"
    :file-list="value"
    :disabled="disabled"
    :auto-upload="true"
    :show-file-list="showFileList"
    :http-request="submitUpload"
    :multiple="multiple"
    :limit="limit"
  >
    <img v-if="imageList.length" :src="item.url" class="avatar" v-for="(item,index) in imageList" :key="index">
    <slot name="uploadContent">
      <div class="uploadBox" v-if="(limit===1&&!fileList.length)||limit>1">
        <i class="el-icon-plus"></i>
      </div>
      <div slot="tip" class="el-upload__tip">
        
      </div>
    </slot>
  </el-upload>
</template>

<script>
import request from "@/utils/request";
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array,
      default: () => { return [] }
    },
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg,application/pdf'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 10
    },
    size: {
      type: Number,
      default: 500
    },
    multiple: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      fileList: [],
      imageList: []
    }
  },
  watch: {
    fileList(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    // 获取格式
    getAccept() {
      return this.accept.split(',').map(e => { return e.split('/')[1] }).join('/')
    },
    handleChange(file, fileList){
      console.log('🚀🚀🚀',fileList);
      this.fileList = fileList
    },
    beforeUpload(file) {
      const isJPG = this.accept.split(',').includes(file.type)
      const isLt2M = file.size / 1024 < this.size
      if (!isJPG || !isLt2M) {
        const idx = this.$refs.upload.uploadFiles.findIndex(e => e.uid === file.uid)
        this.$refs.upload.uploadFiles.splice(idx, 1)
        // 上传格式不正确！
        if (!isJPG) {
          this.$message.error('上传格式不正确！')
          return false
        }
        // 上传文件大小不能超过
        if (!isLt2M) {
          this.$message.error(`上传文件大小不能超过 ${this.size}KB!`)
          return false
        }
      }
      // 清除文件列表防止change事件只触发一次
      const uploadFilesArr = this.$refs.upload.uploadFiles // 上传文件列表
      console.log('🚀🚀🚀111',uploadFilesArr);
      if (uploadFilesArr.length && this.limit === 1) {
        this.$refs.upload.uploadFiles = []
      }
      return true
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 点击预览文件
    handlePreview(file) {
      // // 手动上传
      // console.log('🚀🚀🚀',file,file.url);
      // this.dialogImageUrl = file.url;
      // if (file.raw) {
      //   // 本地预览，转blob
      //   file.fileName = file.name
      //   file.fileRoute = URL.createObjectURL(file.raw)
      // }
      // const srcArr = file.fileName.split('.')
      // const type = srcArr[srcArr.length - 1]
      // if (['pdf', 'PDF'].includes(type)) {
      //   window.open(file.fileRoute)
      // } else {
      //   this.$openPreview([file.fileRoute])
      // }
    },
    // 文件限制
    handleExceed() {
      // 最多只能上传
      this.$message.warning(`最多只能上传${this.limit}个`)
    },
    // 上传文件
    submitUpload({ file }) {
      this.imageList = this.fileList.map(e=>{return {url:URL.createObjectURL(e.raw)}})
      if(!this.autoUpload){
        this.$emit('input', this.fileList)
        return
      }
      const formData = new FormData()
      if (file) formData.append('file', file)
      // formData.append('watermark', 0)
      request({
          url: '/comControl/updateUserCom',
          method: 'POST',
          data: formData
      }).then(res=>{
        this.$emit('input', this.fileList)
        this.$emit('onSuccess', this.fileList)
      })
    },
    // 手动上传
    // unAutoUpload() {
    //   this.$refs.upload.submit();
    // },
    // 清空
    clearFiles() {
      this.fileList = []
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-upload{
  background: #FCFCFC;
}
.upload-demo{
  line-height: initial;
}
.uploadBox{
  border: 1px dashed #cfd8e3;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: #fbfdff;
  i{
    font-size: 30px;
    color: #cfd8e3;
  }
}
</style> -->
