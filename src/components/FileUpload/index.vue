<template>
  <div class="upload-file">
    <el-upload multiple action="#" :before-upload="handleBeforeUpload" :file-list="fileList" :limit="limit"
      :on-error="handleUploadError" :auto-upload="autoUpload" :on-exceed="handleExceed" :on-change="handleChange"
      :on-remove="handleRemove" :show-file-list="true" :headers="headers" class="upload-file-uploader" ref="upload"
      :accept="getFileTypeAccept()" :http-request="httpRequest">
      <!-- 上传按钮 -->
      <el-button size="mini" type="primary">选取文件</el-button>
      <!-- 上传提示 -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
        的文件
      </div>
    </el-upload>
  </div>
</template>

<script>
// import { getToken } from "@/utils/auth";
import config from '../../../server.config';
import request from "@/utils/newRequest.js";

export default {
  name: "FileUpload",
  props: {
    // 值
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 50,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "xlsx", "ppt", "txt", "pdf"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadList: [],
      headers: {
        // Authorization: "Bearer " + getToken(),
      },
      fileList: [],
    };
  },
  watch: {
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // 获取正确格式的accept字符串
    getFileTypeAccept() {
      return this.fileType.map(type => `.${type}`).join(',');
    },
    // 清除文件
    clearFiles() {
      // 安全地清空文件列表
      if (this.$refs.upload && this.$refs.upload.clearFiles) {
        this.$refs.upload.clearFiles();
      } else {
        // 如果 el-upload 的 clearFiles 不可用，直接清空数据
        this.fileList = [];
        this.uploadList = [];
        this.$emit("input", []);
      }
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }

      // 校检文件类型
      if (this.fileType && this.fileType.length > 0) {
        const extension = file.name.split('.').pop().toLowerCase();
        const isTypeOk = this.fileType.some(type => type.toLowerCase() === extension);
        if (!isTypeOk) {
          this.$message.error(`上传文件格式必须是 ${this.fileType.join('/')}!`);
          return false;
        }
      }
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error("上传图片失败，请重试");
    },
    // 删除文件
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.$emit("input", fileList);
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      this.$emit("input", fileList);
    },
    // 删除文件
    handleDelete(index) {
      this.fileList.splice(index, 1);
      this.$emit("input", this.fileList);
    },
    // 获取文件名称
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return "";
      }
    },
    httpRequest(param) {
      this.$notify({
        title: "提示",
        message: "正在上传，上传过程请勿刷新页面!",
        type: "warning",
      });
      // 接口不是统一的，emit回去调用
      this.$emit("getFile", param.file, (data) => {
        const formData = new FormData();
        for (const key in data) {
          if (key !== "url") {
            formData.append([key], data[key]);
          }
        }
        request({
          method: "post",
          url: data.url,
          data: formData,
          onUploadProgress: (progressEvent) => {
            if (!progressEvent) return
            let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            param.onProgress({ percent });
          },
        }).then((res) => {
          // 成功状态
          param.onSuccess(res);
          this.$emit("onSuccess", res.data)
        }).catch(() => {
          // 失败状态
          param.onError();
        });
      });
    },
  }
};
</script>

<style scoped lang="less">
.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
