<!-- 单个图片上传，没有统一的上传文件接口,自动上传的传url手动的emit  file文件回去， -->
<template>
  <el-upload ref="upload" drag :file-list="fileList" action="#" :auto-upload="false" :accept="accept" :limit="limit"
    :on-change="onChange" :on-exceed="handleExceed" :http-request="httpRequest" multiple list-type="picture">
    <img src="@/assets/images/common/file.png" />
    <div class="el-upload__text">
      <em>点击</em>或将文件拖拽到这里上传
    </div>
    <div slot="tip" class="el-upload__tip">
      <el-progress v-if="totalProgress > 0" style="margin-top: 10px;" :percentage="totalProgress" :stroke-width="6"
        :format="(percent) => percent === 100 ? '处理中...' : `${percent}%`">
      </el-progress>
    </div>
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
      type: [String, File, Array],
      default: () => []
    },
    limit: {
      type: Number,
      default: 20
    },
    accept: {
      type: String,
      default: ".gif,.jpeg,.jpg,.png,.svg",
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
      tgaPreviews: {}, // 新增：缓存TGA文件解析结果 { [fileUid]: { url: string, isLoading: boolean } }
      // 1x1透明PNG占位图
      transparentPlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      totalProgress: 0, // 总上传进度（0-100，-1表示失败）
    };
  },
  computed: {
    fileList() {
      // return this.$refs.upload?.uploadFiles?.map(file => {
      //   const rawFile = file.raw; // 原始File对象
      //   if (!rawFile) return file; // 兼容无raw的情况

      //   // 处理TGA文件预览逻辑（保留uid）
      //   if (rawFile.name.toLowerCase().endsWith('.tga')) {
      //     const fileKey = `${rawFile.name}_${rawFile.lastModified}`;
      //     return {
      //       ...file, // 继承el-upload文件对象的属性（包括uid）
      //       url: this.tgaPreviews[fileKey]?.url || this.transparentPlaceholder,
      //       isLoading: this.tgaPreviews[fileKey]?.isLoading || false
      //     };
      //   } else {
      //     return {
      //       ...file, // 继承el-upload文件对象的属性（包括uid）
      //       url: URL.createObjectURL(rawFile)
      //     };
      //   }
      // }) || [];
      if (typeof this.value === 'string') {
        return this.value ? this.value.split(',').map(a => {
          return {
            name: a.split('/')[a.split('/').length - 1].split('.')[0],
            url: a
          }
        }) : []
      }
      if (Array.isArray(this.value)) {
        return this.value.map(a => {
          if (typeof a === 'string') {
            return {
              name: a.split('/')[a.split('/').length - 1].split('.')[0],
              url: a
            }
          }
          else if (a instanceof File) {
            // 生成唯一文件标识（使用name + lastModified保证唯一性）
            const fileKey = `${a.name}_${a.lastModified}`;

            if (a.name.toLowerCase().endsWith('.tga')) {
              // 使用this.$set保证响应式更新
              if (!this.tgaPreviews[fileKey]) {
                this.$set(this.tgaPreviews, fileKey, {
                  url: this.transparentPlaceholder,
                  isLoading: true
                });
                this.parseTgaFile(a, fileKey); // 触发解析
              }

              return {
                name: a.name,
                url: this.tgaPreviews[fileKey].url,
                isLoading: this.tgaPreviews[fileKey].isLoading,
                raw: a // 保留原始File对象
              }
            } else {
              return {
                name: a.name,
                url: URL.createObjectURL(a),
                raw: a // 保留原始File对象
              }
            }
          }
          else {
            return a
          }
        })
      }
    }
  },
  watch: {
    imageUrl(val) {
      this.$emit('input', val)
    }
  },
  created() { },
  mounted() { },
  methods: {
    async parseTgaFile(file, fileKey) {
      try {
        // 更新时使用this.$set保证响应式
        this.$set(this.tgaPreviews, fileKey, {
          ...this.tgaPreviews[fileKey],
          isLoading: true
        });

        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });

        const tgaInstance = libtga.readFile(arrayBuffer);
        const canvas = document.createElement('canvas');
        canvas.width = tgaInstance.width;
        canvas.height = tgaInstance.height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(tgaInstance.width, tgaInstance.height);
        imageData.data.set(tgaInstance.imageData);
        ctx.putImageData(imageData, 0, 0);

        // 解析成功后使用this.$set更新缓存
        this.$set(this.tgaPreviews, fileKey, {
          url: canvas.toDataURL('image/png'),
          isLoading: false
        });
      } catch (error) {
        console.error('解析.tga文件失败:', error);
        // 失败时同样使用this.$set保证响应式
        this.$set(this.tgaPreviews, fileKey, {
          url: this.transparentPlaceholder,
          isLoading: false
        });
      }
    },
    onChange(file, fileList) {
      let splitName = file.name.split('.')
      const isJPG = this.accept.split(",").includes(`.${splitName[splitName.length - 1].toLowerCase()}`);
      // const isJPG = this.accept.split(",").includes(file.raw.type);
      if (!isJPG) {
        const idx = this.$refs.upload.uploadFiles.findIndex(
          (e) => e.uid === file.uid
        );
        this.$refs.upload.uploadFiles.splice(idx, 1);
        // 上传格式不正确！
        this.$message.error("上传格式不正确！");
        return false;
      }
      this.$emit('input', fileList.map(f => f.raw || f))
    },
    handleExceed() {
      // 最多只能上传
      this.$message.warning(`最多只能上传${this.limit}个`)
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
    resetProgress() {
      this.totalProgress = 0;
    },
    httpRequest(data) {
      let formData = new FormData()
      for (const key in data) {
        if (key == 'fileUpload') {
          data[key].forEach((item, index) => {
            if (Object.prototype.toString.call(item) === '[object File]') {
              formData.append('fileUpload', item)
            } else {
              formData.append('fileUpload', item.raw)
            }
          })
        } else {
          formData.append([key], data[key])
        }
      }
      request({
        method: "post",
        url: this.url,
        data: formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total > 0) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            this.totalProgress = percent;
          }
        }
      }).then((res) => {
        this.totalProgress = 100;
        this.$message.success(res.message);
        this.$emit("uploadFinish");
      }).catch((error) => {
        this.totalProgress = -1; // 失败状态
        this.$message.error('上传失败');
      });
    }
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-upload {
  width: 100%;

  .el-upload-dragger {
    background-color: #f5f5f5;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}

/deep/ .el-progress-bar {
  width: 90%;
}
</style>