<template>
  <div>
    <div v-if="isLoading" class="image-viewer-loading-mask">
      <div class="loading-content">
        <i class="el-icon-loading"></i>
        <span class="loading-text">加载中...</span>
      </div>
    </div>
    <el-image-viewer v-if="showViewer && !isLoading" class="share-img-viewer" :url-list="listViewer"
      @wheel.native.prevent :on-close="handleClose"></el-image-viewer>
  </div>
</template>

<script>
// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
const libtga = require('libtga').default; // 仅当模块导出为ES6 default时需要

export default {
  name: "ImageViewer",
  components: {
    ElImageViewer
  },
  data() {
    return {
      showViewer: false,
      listViewer: [],
      isLoading: false, // 新增：加载状态（true=加载中）
    }
  },
  created() {

  },
  computed: {

  },
  methods: {
    async show(url) { // 标记为 async 函数，以便使用 await
      this.listViewer = []; // 清空预览列表
      this.isLoading = true; // 开始加载，显示提示
      let processedUrls;
      if (Array.isArray(url)) {
        processedUrls = url.map(a => {
          if (a.toLowerCase().endsWith('.tga')) {
            return this.parseTgaFile(a); // 返回 Promise
          } else {
            return a; // 非 TGA 直接返回原始值（字符串）
          }
        });
      } else {
        processedUrls = url.split(',').map(a => {
          if (a.toLowerCase().endsWith('.tga')) {
            return this.parseTgaFile(a); // 返回 Promise
          } else {
            return a; // 非 TGA 直接返回原始值（字符串）
          }
        });
      }
      try {
        // 等待所有 TGA 解析完成
        this.listViewer = await Promise.all(processedUrls);
      } catch (error) {
        console.error('加载图片失败:', error);
        this.listViewer = []; // 清空失败的列表
      } finally {
        this.isLoading = false; // 加载完成/失败，隐藏提示
        this.showViewer = true; // 显示预览（若成功）
      }
    },
    async parseTgaFile(source) {
      try {
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
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('解析TGA文件失败:', error);
      } finally {
      }
    },
    handleClose() {
      this.showViewer = false;
    }
  },
}
</script>
<style lang="less" scoped>
/* 模仿 el-image-viewer__mask 的遮罩层样式 */
.image-viewer-loading-mask {
  position: fixed;
  /* 全屏覆盖 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* 半透明背景（与 el-image-viewer 一致） */
  z-index: 2000;
  /* 与 el-image-viewer 的 z-index 一致 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  align-items: center;
  color: #ffffff;
  /* 白色文字（与遮罩背景对比） */
  font-size: 16px;

  .el-icon-loading {
    margin-right: 8px;
    font-size: 20px;
    animation: rotating 2s linear infinite;
    /* 旋转动画 */
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>