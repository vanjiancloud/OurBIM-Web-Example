<!-- 单个图片上传，没有统一的上传文件接口,自动上传的传url手动的emit  file文件回去， -->
<template>
  <el-upload action="#" :show-file-list="false" :accept="accept" :on-change="onChange"
    :before-upload="beforeAvatarUpload" :auto-upload="autoUpload" :http-request="httpRequest" :disabled="disabled">
    <template v-if="value">
      <el-image v-if="!isTgaLoading" :src="!!tgaPreviewUrl ? tgaPreviewUrl : autoUpload ? value : changeImg(value)"
        class="avatar" :error="transparentPlaceholder"> <!-- 设置error时显示透明占位图 -->
      </el-image>
      <div v-else class="tga-loading"
        style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
        加载中...
      </div>
      <span v-if="deleteIcon" class="delete" @click.stop="deleteImg"><i class="el-icon-close"></i></span>
    </template>
    <slot name="icon" v-else>
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </slot>
  </el-upload>
</template>

<script>
import { Getuserid } from '@/store/index.js'
import request from "@/utils/newRequest.js";
const libtga = require('libtga').default; // 仅当模块导出为ES6 default时需要

export default {
  components: {},
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: {
      type: [String, File],
      default: ''
    },
    accept: {
      type: String,
      default: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
    },
    url: {
      type: String,
      default: "",
      required: false,
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 当其他上传接口用的参数不是默认的参数时，可以用该字段自定义
    params: {
      type: Object,
      default: () => { },
    },
    // 是否显示删除图标
    deleteIcon: {
      type: Boolean,
      default: true,
    },
    // 没上传完成是否显示图片
    showImg: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      imageUrl: "",
      tgaPreviewUrl: "", // 新增：缓存.tga文件解析后的Data URL
      isTgaLoading: false, // 标记TGA是否在加载中
      transparentPlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' // 1x1透明PNG占位图
    };
  },
  watch: {
    value(newVal) {
      if (typeof newVal === 'string' && newVal.toLowerCase().endsWith('.tga')) {
        this.parseTgaFile(newVal); // 自动解析在线TGA地址
      }
    },
    imageUrl(val) {
      this.$emit('input', val)
    }
  },
  computed: {},
  created() { },
  mounted() { },
  methods: {
    changeImg(file) {
      if (typeof file === 'string') {
        // 新增：处理在线TGA地址
        if (file.toLowerCase().endsWith('.tga')) {
          this.parseTgaFile(file); // 触发在线TGA解析
          return this.tgaPreviewUrl || this.transparentPlaceholder; // 返回缓存或占位图
        }
        return file; // 非TGA地址直接返回
      }
      // 处理tga类型文件
      if (file.name.toLowerCase().endsWith('.tga')) {
        // 异步解析.tga文件并更新缓存
        this.parseTgaFile(file);
        return this.tgaPreviewUrl; // 初始返回空（或加载中的占位图）
      }
      return URL.createObjectURL(file)
    },
    async parseTgaFile(source) {
      try {
        this.isTgaLoading = true;
        this.tgaPreviewUrl = this.transparentPlaceholder;

        let arrayBuffer;
        if (typeof source === 'string') {
          // 新增：处理在线URL的情况
          const response = await fetch(source);
          if (!response.ok) throw new Error(`HTTP错误：${response.status}`);
          arrayBuffer = await response.arrayBuffer();
        } else {
          // 原有逻辑：处理本地File对象
          arrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(source);
          });
        }

        // 原有解析逻辑（不变）
        const tgaInstance = libtga.readFile(arrayBuffer);
        const canvas = document.createElement('canvas');
        canvas.width = tgaInstance.width;
        canvas.height = tgaInstance.height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(tgaInstance.width, tgaInstance.height);
        imageData.data.set(tgaInstance.imageData);
        ctx.putImageData(imageData, 0, 0);
        this.tgaPreviewUrl = canvas.toDataURL('image/png');
      } catch (error) {
        console.error('解析TGA文件失败:', error);
        this.tgaPreviewUrl = '';
      } finally {
        this.isTgaLoading = false;
      }
    },
    onChange(file) {
      this.$emit("onChangeFile", file);
      this.tgaPreviewUrl = '';
      if (!this.autoUpload && this.showImg) {
        this.imageUrl = file.raw;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = this.accept.split(",").includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error(`上传头像图片只能是 ${this.accept} 格式!`);
        return false
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false
      }
      return isJPG && isLt2M;
    },
    deleteImg() {
      this.$emit("input", '');
      this.$emit("success", '');
    },
    httpRequest(param) {
      // 接口不是统一的
      const formData = new FormData();
      if (this.params && Object.keys(this.params).length) {
        for (const key in this.params) {
          formData.append([key], ["fileUpload"].includes(key) ? param.file : this.params[key] || param.file);
        }
      } else {
        formData.append("fileUpload", param.file);
        formData.append("userId", Getuserid() || this.$route.query.userId);
      }
      request({
        method: "post",
        url: this.url,
        data: formData,
      }).then((res) => {
        this.imageUrl = res.data;
        this.$emit("input", res.data);
        setTimeout(() => {
          this.$emit("success", res.data);
        }, 20)
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  background: #fcfcfc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    .delete {
      display: flex !important;
    }
  }
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
}

.delete {
  background: rgba(0, 0, 0, 0.7);
  font-size: 16px;
  border-radius: 100%;
  color: #ffffff;
  position: absolute;
  right: 0;
  top: 0;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
}
</style>