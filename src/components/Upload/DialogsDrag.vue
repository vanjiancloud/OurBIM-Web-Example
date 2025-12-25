<!--
    使用例子：
    @getFile="getFileDrag"
    getFileDrag(file, callback) {
        callback({
            参数，
            url: "/appli/uploadGISLayerFile",
        });
    },
-->
<template>
  <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="hide" :close-on-click-modal="false">
    <div class="dragUpLoad">
      <div class="dragUpLoadTitle">
        <img src="@/assets/images/common/icon.png" alt="" />
        <div class="dragUpLoadText">{{ title }}</div>
      </div>
      <el-upload ref="upload" drag action="#" :auto-upload="false" :limit="limit" :on-change="onChange"
        :on-exceed="handleExceed" :http-request="httpRequest" multiple :accept="processedAccept">
        <img src="@/assets/images/common/file.png" />
        <div class="el-upload__text">
          <em>点击</em>或将文件拖拽到这里上传
        </div>
      </el-upload>
      <div class="el-upload__tip">
        <slot name="append"></slot>
        <slot name="tip">
          <!-- <span class="tipRed">* </span>
                    文件默认打开初始的三维视图，请将文件在对应视图打开状态下保存，再上传。上传的BIM文件需要与中心文件分离，否则可能无法转换。 -->
        </slot>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" class="blueBtn" type="primary" @click="submit">开始上传</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/newRequest.js";
export default {
  components: {},
  props: {
    limit: {
      type: Number,
      default: 5
    },
    accept: {
      type: String,
      default: '.zip'
    },
    // vuex中缓存的上传类型key
    numType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: "上传模型",
      dialogVisible: false,
      loading: false,
    };
  },
  watch: {},
  computed: {
    // 处理accept属性的大小写问题 生成所有大小写组合
    processedAcceptAll() {
      if (!this.accept) return '';

      // 将accept字符串分割为扩展名数组
      const extensions = this.accept.split(',').map(ext => ext.trim());

      // 为每个扩展名生成所有可能的大小写组合
      const processedExtensions = extensions.flatMap(ext => {
        // 移除可能的点号
        const extWithoutDot = ext.startsWith('.') ? ext.slice(1) : ext;

        // 如果是通配符或没有扩展名，直接返回
        if (extWithoutDot === '*' || !extWithoutDot) return [ext];

        // 生成所有可能的大小写组合
        const generateAllCaseCombinations = (str) => {
          const result = [];

          const generate = (current, index) => {
            if (index === str.length) {
              result.push(current);
              return;
            }

            // 添加小写版本
            generate(current + str[index].toLowerCase(), index + 1);

            // 添加大写版本
            generate(current + str[index].toUpperCase(), index + 1);
          };

          generate('', 0);
          return result;
        };

        // 生成所有组合并添加点号
        return generateAllCaseCombinations(extWithoutDot).map(combination => `.${combination}`);
      });
      // 去重并合并为字符串
      return [...new Set(processedExtensions)].join(',');
    },
    // 只生成全大写和全小写格式
    processedAccept() {
      if (!this.accept) return '';

      // 将accept字符串分割为扩展名数组
      const extensions = this.accept.split(',').map(ext => ext.trim());

      // 为每个扩展名生成全小写和全大写两种形式
      const processedExtensions = extensions.flatMap(ext => {
        // 移除可能的点号
        const extWithoutDot = ext.startsWith('.') ? ext.slice(1) : ext;

        // 如果是通配符或没有扩展名，直接返回
        if (extWithoutDot === '*' || !extWithoutDot) return [ext];

        // 只生成全小写和全大写两种形式
        const lowercase = extWithoutDot.toLowerCase();
        const uppercase = extWithoutDot.toUpperCase();

        // 避免重复（如果原扩展名本身就是全小写或全大写）
        if (lowercase === uppercase) {
          return [`.${lowercase}`];
        }

        return [`.${lowercase}`, `.${uppercase}`];
      });
      // 去重并合并为字符串
      return [...new Set(processedExtensions)].join(',');
    }
  },
  created() { },
  mounted() { },
  methods: {
    show(title) {
      this.$emit("open")
      this.title = title;
      this.loading = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.upload.clearFiles();
      });
    },
    hide() {
      this.dialogVisible = false;
    },
    onChange(file, fileList) {
      // let splitName = file.name.split('.')
      // const isJPG = this.accept.split(",").includes(`.${splitName[splitName.length - 1].toLowerCase()}`);
      // // const isJPG = this.accept.split(",").includes(file.raw.type);
      // console.log(isJPG)
      // if (!isJPG) {
      //   const idx = this.$refs.upload.uploadFiles.findIndex(
      //     (e) => e.uid === file.uid
      //   );
      //   this.$refs.upload.uploadFiles.splice(idx, 1);
      //   // 上传格式不正确！
      //   this.$message.error("上传格式不正确！");
      //   return false;
      // }
      // 获取文件扩展名（大小写不敏感）
      let fileExtension = '';

      if (file.name) {
        const splitName = file.name.split('.');
        if (splitName.length > 1) {
          fileExtension = splitName[splitName.length - 1].toLowerCase();
        }
      }

      // 验证文件类型 - 大小写不敏感
      const acceptExtensions = this.accept.split(",").map(ext =>
        ext.trim().toLowerCase().replace('.', '')
      );

      const isValidFile = fileExtension && acceptExtensions.includes(fileExtension);

      if (!isValidFile) {
        const idx = this.$refs.upload.uploadFiles.findIndex(
          (e) => e.uid === file.uid
        );
        this.$refs.upload.uploadFiles.splice(idx, 1);
        this.$message.warning("上传格式不正确！支持格式：" + this.accept);
        return false;
      }
    },
    handleExceed() {
      // 最多只能上传
      this.$message.warning(`最多只能上传${this.limit}个文件`)
    },
    httpRequest(param) {
      this.$notify({
        title: "提示",
        message: "正在上传，上传过程请勿刷新页面!",
        type: "warning",
      });
      if (this.numType) {
        this.$store.commit("changeState", {
          key: this.numType,
          value: ++this.$store.state[this.numType],
        });
      }
      // 接口不是统一的，emit回去调用
      this.loading = true;
      this.$emit("getFile", param.file, (data) => {
        // console.log(data)
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
          if (this.numType) {
            this.$store.commit("changeState", {
              key: this.numType,
              value: --this.$store.state[this.numType],
            });
          }
          this.loading = false;
          param.onSuccess(res);
          this.$emit("onSuccess", res.data, {
            fileName: param.file.name,
            file: param.file
          })
          this.hide();
        }).catch(() => {
          // 失败状态
          if (this.numType) {
            this.$store.commit("changeState", {
              key: this.numType,
              value: --this.$store.state[this.numType],
            });
          }
          this.loading = false;
          param.onError();
        });
      });
    },
    submit() {
      // beforeUpload：上传文件前验证
      let isCheck = false
      this.$emit("beforeUpload", (data) => {
        isCheck = !!data
        if (data) return
      })
      if (isCheck) {
        return this.$message.warning("数据未填写完整！");
      }
      if (!this.$refs.upload.uploadFiles.length) {
        return this.$message.warning("请上传文件");
      }
      this.$refs.upload.submit();
    },
  },
};
</script>
<style lang="less" scoped>
.dragUpLoad {
  box-shadow: 0 0.0625rem 0.8125rem 0 rgb(4 0 0 / 10%);
  border-radius: 8px;
  padding: 30px 40px;
  margin: 10px 0;

  .dragUpLoadTitle {
    text-align: center;

    .dragUpLoadText {
      font-weight: bold;
      font-size: 22px;
      margin: 20px 0;
    }
  }

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

  .dialog-footer {
    margin-top: 40px;

    .blueBtn {
      width: 150px;
    }
  }

  .append {
    border-bottom: 1px solid #f5f5f5;
    border-top: 1px solid #f5f5f5;
    margin: 20px 0;
  }

  /deep/.tipRed {
    color: red
  }
}
</style>